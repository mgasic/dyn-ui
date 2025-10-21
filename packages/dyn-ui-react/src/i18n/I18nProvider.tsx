import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  I18nContextValue,
  I18nProviderProps,
  LocaleMessages,
  MessageDescriptor,
  PluralForms,
  TranslateOptions,
} from './types';

const DEFAULT_LOCALE = 'en-US';
const RTL_LOCALES = new Set([
  'ar',
  'fa',
  'he',
  'ku',
  'ps',
  'ur',
]);

const normalizeLocale = (locale?: string): string => {
  if (!locale) return DEFAULT_LOCALE;
  return locale.toLowerCase() === 'default' ? DEFAULT_LOCALE : locale;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const getDirection = (locale: string): 'ltr' | 'rtl' => {
  const lang = locale.split('-')[0];
  return RTL_LOCALES.has(lang) ? 'rtl' : 'ltr';
};

const hasIntlApi = typeof Intl !== 'undefined';

const formatNumberSafe = (
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string => {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (!hasIntlApi || typeof Intl.NumberFormat !== 'function') {
    if (options?.maximumFractionDigits != null) {
      return value.toFixed(options.maximumFractionDigits);
    }
    return String(value);
  }

  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[dyn-ui] Intl.NumberFormat failed, falling back to basic formatting.', error);
    }
    if (options?.maximumFractionDigits != null) {
      return value.toFixed(options.maximumFractionDigits);
    }
    return String(value);
  }
};

const normalizeDate = (value: Date | number | string): Date =>
  value instanceof Date ? value : new Date(value);

const formatDateSafe = (
  value: Date | number | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions & { timeZone?: string },
): string => {
  const date = normalizeDate(value);
  if (Number.isNaN(date.getTime())) return '';

  if (!hasIntlApi || typeof Intl.DateTimeFormat !== 'function') {
    return date.toISOString();
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[dyn-ui] Intl.DateTimeFormat failed, falling back to ISO formatting.', error);
    }
    return date.toISOString();
  }
};

const selectPluralRule = (locale: string, count: number): keyof PluralForms => {
  if (!hasIntlApi || typeof Intl.PluralRules !== 'function') {
    return count === 1 ? 'one' : 'other';
  }

  try {
    return new Intl.PluralRules(locale).select(count) as keyof PluralForms;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[dyn-ui] Intl.PluralRules failed, falling back to basic plural selection.', error);
    }
    return count === 1 ? 'one' : 'other';
  }
};

const mergeDictionaries = (target: LocaleMessages, source: LocaleMessages) => {
  for (const [key, value] of Object.entries(source)) {
    if (isRecord(value) && !Array.isArray(value)) {
      const existing = target[key];
      if (isRecord(existing)) {
        mergeDictionaries(existing as LocaleMessages, value as LocaleMessages);
      } else {
        target[key] = JSON.parse(JSON.stringify(value));
      }
    } else {
      target[key] = value as string;
    }
  }
};

const cloneDictionary = (dictionary: LocaleMessages): LocaleMessages => {
  const clone: LocaleMessages = {};
  for (const [key, value] of Object.entries(dictionary)) {
    if (isRecord(value)) {
      clone[key] = cloneDictionary(value as LocaleMessages);
    } else {
      clone[key] = value;
    }
  }
  return clone;
};

const extractMessage = (
  dictionary: LocaleMessages | undefined,
  id: string,
): string | LocaleMessages | PluralForms | undefined => {
  if (!dictionary) return undefined;
  const segments = id.split('.');
  let current: any = dictionary;
  for (const segment of segments) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
    if (current == null) return undefined;
  }
  return current as any;
};

const formatTemplate = (
  template: string,
  values: Record<string, unknown> | undefined,
  count: number | undefined,
  locale: string,
): string => {
  if (!values && count == null) return template;
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    if (token === 'count' && typeof count === 'number') {
      return formatNumberSafe(count, locale);
    }

    const value = values?.[token];
    if (value == null) {
      return `{${token}}`;
    }

    if (value instanceof Date) {
      return formatDateSafe(value, locale, { dateStyle: 'medium' });
    }

    if (typeof value === 'number') {
      return formatNumberSafe(value, locale);
    }

    if (typeof value === 'function') {
      try {
        const result = (value as () => unknown)();
        return result == null ? '' : String(result);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[dyn-ui] Error evaluating translation value function', error);
        }
        return '';
      }
    }

    return String(value);
  });
};

const resolveDescriptor = (
  descriptor: MessageDescriptor | null | undefined,
  options?: TranslateOptions,
): {
  id: string | undefined;
  defaultMessage?: string;
  values?: Record<string, unknown>;
  count?: number;
  locale?: string;
} => {
  if (descriptor == null) {
    return {
      id: undefined,
      defaultMessage: options?.defaultMessage,
      values: options?.values,
      count: options?.count,
      locale: options?.locale,
    };
  }

  if (typeof descriptor === 'string') {
    const trimmed = descriptor.trim();
    return {
      id: trimmed,
      defaultMessage: options?.defaultMessage ?? trimmed,
      values: options?.values,
      count: options?.count,
      locale: options?.locale,
    };
  }

  return {
    id: descriptor.id,
    defaultMessage: descriptor.defaultMessage ?? options?.defaultMessage ?? descriptor.id,
    values: { ...descriptor.values, ...options?.values },
    count: options?.count ?? descriptor.count,
    locale: options?.locale ?? descriptor.locale,
  };
};

const fallbackContext: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  direction: 'ltr',
  isRtl: false,
  availableLocales: [DEFAULT_LOCALE],
  messages: {},
  t: (descriptor, options) => {
    const { id, defaultMessage } = resolveDescriptor(descriptor, options);
    return defaultMessage ?? id ?? '';
  },
  formatNumber: (value, options) => formatNumberSafe(value, DEFAULT_LOCALE, options),
  formatDate: (value, options) => formatDateSafe(value, DEFAULT_LOCALE, options),
  setLocale: () => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useI18n: attempted to change locale without an I18nProvider.');
    }
  },
  registerMessages: () => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useI18n: attempted to register messages without an I18nProvider.');
    }
  },
};

export const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({
  initialLocale = DEFAULT_LOCALE,
  locale: controlledLocale,
  fallbackLocale = DEFAULT_LOCALE,
  messages,
  detectDirection = true,
  onLocaleChange,
  children,
}: I18nProviderProps) => {
  const isControlled = controlledLocale != null;
  const [internalLocale, setInternalLocale] = useState(() => normalizeLocale(initialLocale));
  const [, forceUpdate] = useState(0);
  const activeLocale = normalizeLocale(isControlled ? controlledLocale : internalLocale);
  const fallbackLocaleRef = useRef(normalizeLocale(fallbackLocale));
  const dictionariesRef = useRef<Record<string, LocaleMessages>>({});

  const registerMessages = useCallback((localeKey: string, dictionary: LocaleMessages) => {
    const normalizedLocale = normalizeLocale(localeKey);
    if (!dictionariesRef.current[normalizedLocale]) {
      dictionariesRef.current[normalizedLocale] = {};
    }
    mergeDictionaries(dictionariesRef.current[normalizedLocale], dictionary);
    forceUpdate((value) => value + 1);
  }, [forceUpdate]);

  useEffect(() => {
    if (!messages) return;
    for (const [localeKey, dictionary] of Object.entries(messages)) {
      registerMessages(localeKey, dictionary);
    }
  }, [messages, registerMessages]);

  useEffect(() => {
    fallbackLocaleRef.current = normalizeLocale(fallbackLocale);
  }, [fallbackLocale]);

  useEffect(() => {
    if (isControlled) return;
    setInternalLocale(normalizeLocale(initialLocale));
  }, [initialLocale, isControlled]);

  useEffect(() => {
    if (!detectDirection || typeof document === 'undefined') return;
    const direction = getDirection(activeLocale);
    const root = document.documentElement;
    root.setAttribute('dir', direction);
    root.setAttribute('lang', activeLocale);
    root.setAttribute('data-locale', activeLocale);
    root.setAttribute('data-direction', direction);
    root.classList.toggle('dyn-rtl', direction === 'rtl');
    root.style.setProperty('--dyn-direction', direction);

    if (typeof document.body !== 'undefined') {
      document.body.dir = direction;
    }
  }, [activeLocale, detectDirection]);

  const setLocale = useCallback(
    (nextLocale: string) => {
      const normalized = normalizeLocale(nextLocale);
      if (!isControlled) {
        setInternalLocale(normalized);
      }
      onLocaleChange?.(normalized);
    },
    [isControlled, onLocaleChange],
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumberSafe(value, activeLocale, options),
    [activeLocale],
  );

  const formatDate = useCallback(
    (value: Date | number | string, options?: Intl.DateTimeFormatOptions & { timeZone?: string }) => {
      return formatDateSafe(value, activeLocale, options);
    },
    [activeLocale],
  );

  const translate = useCallback<
    I18nContextValue['t']
  >(
    (descriptor, options) => {
      const { id, defaultMessage, values, count, locale } = resolveDescriptor(descriptor, options);
      if (!id) return defaultMessage ?? '';

      const localesToCheck = [normalizeLocale(locale ?? activeLocale), fallbackLocaleRef.current];
      let template: string | LocaleMessages | PluralForms | undefined;

      for (const candidateLocale of localesToCheck) {
        template = extractMessage(dictionariesRef.current[candidateLocale], id);
        if (template != null) break;
      }

      let resolvedTemplate: string | undefined;

      if (typeof template === 'string') {
        resolvedTemplate = template;
      } else if (isRecord(template) && count != null) {
        const pluralRule = selectPluralRule(localesToCheck[0], count);
        resolvedTemplate = (template as PluralForms)[pluralRule] ?? (template as PluralForms).other;
      } else if (template && isRecord(template) && 'other' in (template as PluralForms)) {
        resolvedTemplate = (template as PluralForms).other;
      }

      const base = resolvedTemplate ?? defaultMessage ?? id;
      return formatTemplate(base, values, count, localesToCheck[0]);
    },
    [activeLocale],
  );

  const availableLocales = useMemo(() => {
    const locales = new Set<string>([
      fallbackLocaleRef.current,
      activeLocale,
    ]);
    Object.keys(dictionariesRef.current).forEach((key) => locales.add(key));
    return Array.from(locales);
  }, [activeLocale]);

  const messagesForLocale = useMemo(
    () => cloneDictionary(dictionariesRef.current[activeLocale] ?? {}),
    [activeLocale],
  );

  const contextValue = useMemo<I18nContextValue>(
    () => ({
      locale: activeLocale,
      direction: getDirection(activeLocale),
      isRtl: getDirection(activeLocale) === 'rtl',
      availableLocales,
      messages: messagesForLocale,
      t: translate,
      formatNumber,
      formatDate,
      setLocale,
      registerMessages,
    }),
    [activeLocale, availableLocales, formatDate, formatNumber, messagesForLocale, registerMessages, translate, setLocale],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = React.useContext(I18nContext);
  return context ?? fallbackContext;
};
