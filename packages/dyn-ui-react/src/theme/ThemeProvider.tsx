import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { applyCssVars } from './applyCssVars';
import { GLOBAL_TOKENS } from './globalTokens';
import type { DynThemeTokens, TokenGroup } from './tokens';
import {
  CSS_VAR_PREFIX,
  getAvailableThemes as getThemesFromBridge,
  loadThemeTokens as loadTokensFromBridge,
} from './bridge/themeLoader.design-tokens';

export type ThemeName = 'light' | 'dark' | 'high-contrast';
export type Theme = ThemeName | (string & Record<never, never>);

export interface ThemeProviderProps {
  /** Theme applied on first render */
  initialTheme?: Theme;
  /** Optional custom tokens keyed by theme name */
  themes?: Partial<Record<Theme, DynThemeTokens>>;
  /**
   * Persist theme selection under this storage key. Pass `null` to disable persistence.
   * Defaults to `dyn-ui-theme`.
   */
  storageKey?: string | null;
  /** Optional callback invoked whenever a theme is applied */
  onThemeChange?: (theme: Theme) => void;
  /** Element or selector that should receive CSS custom properties */
  applyTo?: HTMLElement | string;
  children: React.ReactNode;
}

export interface ThemeContextValue {
  theme: Theme;
  tokens: DynThemeTokens;
  cssText: string;
  availableThemes: Theme[];
  isLoading: boolean;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const DEFAULT_THEME: Theme = 'light';
const FALLBACK_THEMES: Theme[] = ['light', 'dark', 'high-contrast'];
const DEFAULT_STORAGE_KEY = 'dyn-ui-theme';

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function cloneTokenGroup(group?: TokenGroup): TokenGroup | undefined {
  if (!group) return undefined;
  const cloned: TokenGroup = {};
  for (const [key, value] of Object.entries(group)) {
    if (isRecord(value)) {
      cloned[key] = cloneTokenGroup(value as TokenGroup) ?? {};
    } else {
      cloned[key] = value as string;
    }
  }
  return cloned;
}

function mergeTokenGroup(base?: TokenGroup, override?: TokenGroup): TokenGroup | undefined {
  if (!base && !override) return undefined;
  const merged: TokenGroup = {};

  if (base) {
    for (const [key, value] of Object.entries(base)) {
      merged[key] = isRecord(value) ? cloneTokenGroup(value as TokenGroup) ?? {} : (value as string);
    }
  }

  if (override) {
    for (const [key, value] of Object.entries(override)) {
      if (isRecord(value)) {
        merged[key] = mergeTokenGroup(
          isRecord(merged[key]) ? (merged[key] as TokenGroup) : undefined,
          value as TokenGroup,
        ) as TokenGroup;
      } else {
        merged[key] = value as string;
      }
    }
  }

  return merged;
}

function mergeTokens(base: DynThemeTokens, override?: DynThemeTokens): DynThemeTokens {
  return {
    size: mergeTokenGroup(base.size, override?.size),
    spacing: mergeTokenGroup(base.spacing, override?.spacing),
    radius: mergeTokenGroup(base.radius, override?.radius),
    fontSize: mergeTokenGroup(base.fontSize, override?.fontSize),
    fontWeight: mergeTokenGroup(base.fontWeight, override?.fontWeight),
    colors: mergeTokenGroup(base.colors, override?.colors),
    shadow: mergeTokenGroup(base.shadow, override?.shadow),
    variants: override?.variants ?? base.variants,
    tones: override?.tones ?? base.tones,
  };
}

function resolveScope(scope: ThemeProviderProps['applyTo']): HTMLElement | null {
  if (!isBrowser()) return null;
  if (!scope) return document.documentElement;
  if (scope instanceof HTMLElement) return scope;
  return document.querySelector(scope);
}

function uniqueThemes(...lists: Array<Theme[] | undefined>): Theme[] {
  const seen = new Set<Theme>();
  for (const list of lists) {
    if (!list) continue;
    for (const value of list) {
      if (!value) continue;
      seen.add(value);
    }
  }
  return Array.from(seen);
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
  themes,
  storageKey = DEFAULT_STORAGE_KEY,
  onThemeChange,
  applyTo,
}: ThemeProviderProps) {
  const bridgeThemes = useMemo<Theme[]>(() => {
    try {
      return getThemesFromBridge() as Theme[];
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[dyn-ui] Unable to read themes from bridge loader.', error);
      }
      return [];
    }
  }, []);

  const availableThemes = useMemo<Theme[]>(() => {
    const propThemes = themes ? (Object.keys(themes) as Theme[]) : [];
    return uniqueThemes(FALLBACK_THEMES, bridgeThemes, propThemes);
  }, [bridgeThemes, themes]);

  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [tokens, setTokens] = useState<DynThemeTokens>(() => mergeTokens(GLOBAL_TOKENS));
  const [cssText, setCssText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const pendingThemeRef = useRef<Theme | null>(null);
  const isMountedRef = useRef(false);

  const scopeRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    scopeRef.current = resolveScope(applyTo);
  }, [applyTo]);

  const applyTheme = useCallback(
    (nextTheme: Theme, themeTokens: DynThemeTokens) => {
      const scopeEl = scopeRef.current ?? resolveScope(applyTo);
      const mergedTokens = mergeTokens(GLOBAL_TOKENS, themeTokens);
      setTokens(mergedTokens);

      if (isBrowser()) {
        const target = scopeEl ?? document.documentElement;
        const css = applyCssVars(mergedTokens, {
          scope: target,
          prefix: CSS_VAR_PREFIX,
          id: `dyn-theme-${CSS_VAR_PREFIX}`,
        });
        setCssText(css);

        target.setAttribute('data-theme', String(nextTheme));
        target.setAttribute('data-color-mode', nextTheme === 'dark' ? 'dark' : 'light');
        target.classList.add(`theme-${nextTheme}`);
        target.style.colorScheme = nextTheme === 'dark' ? 'dark' : 'light';

        if (availableThemes.length) {
          for (const value of availableThemes) {
            if (value !== nextTheme) {
              target.classList.remove(`theme-${value}`);
            }
          }
        }
      }

      setIsLoading(false);
    },
    [applyTo, availableThemes],
  );

  const loadTheme = useCallback(
    async (nextTheme: Theme, allowFallback = true) => {
      pendingThemeRef.current = nextTheme;
      setIsLoading(true);

      const fromProp = themes?.[nextTheme];
      if (fromProp) {
        applyTheme(nextTheme, fromProp);
        return;
      }

      try {
        const loaded = await loadTokensFromBridge(nextTheme);
        if (pendingThemeRef.current === nextTheme) {
          applyTheme(nextTheme, loaded);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[dyn-ui] Failed to load theme "${nextTheme}".`, error);
        }
        if (allowFallback && nextTheme !== DEFAULT_THEME) {
          await loadTheme(DEFAULT_THEME, false);
        } else {
          applyTheme(nextTheme, GLOBAL_TOKENS);
        }
      }
    },
    [applyTheme, themes],
  );

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      if (storageKey && isBrowser()) {
        try {
          window.localStorage.setItem(storageKey, String(nextTheme));
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[dyn-ui] Unable to persist theme to localStorage.', error);
          }
        }
      }
      void loadTheme(nextTheme);
      onThemeChange?.(nextTheme);
    },
    [loadTheme, onThemeChange, storageKey],
  );

  useEffect(() => {
    if (!isBrowser()) {
      void loadTheme(initialTheme);
      return;
    }

    if (storageKey) {
      const stored = window.localStorage.getItem(storageKey) as Theme | null;
      if (stored && availableThemes.includes(stored)) {
        setThemeState(stored);
        void loadTheme(stored);
      } else {
        setThemeState(initialTheme);
        void loadTheme(initialTheme);
      }
    } else {
      setThemeState(initialTheme);
      void loadTheme(initialTheme);
    }

    isMountedRef.current = true;
  }, [availableThemes, initialTheme, loadTheme, storageKey]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (initialTheme && initialTheme !== theme) {
      setTheme(initialTheme);
    }
  }, [initialTheme, setTheme, theme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      tokens,
      cssText,
      availableThemes,
      isLoading,
      setTheme,
    }),
    [availableThemes, cssText, isLoading, setTheme, theme, tokens],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
