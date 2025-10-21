import * as React from 'react';
import { useTheme, type Theme } from '../../theme/ThemeProvider';
import { cn } from '../../utils/classNames';
import type { ThemeSwitcherProps } from './ThemeSwitcher.types';
export type { ThemeSwitcherProps } from './ThemeSwitcher.types';
import styles from './ThemeSwitcher.module.css';
import { useI18n } from '../../i18n';

const sizeClassMap: Record<NonNullable<ThemeSwitcherProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
};

const roundedClassMap: Record<NonNullable<ThemeSwitcherProps['rounded']>, string> = {
  sm: styles.roundedSm,
  md: styles.roundedMd,
  lg: styles.roundedLg,
  full: styles.roundedFull,
};

const toHumanReadable = (value: string) =>
  value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ') || value;

export function ThemeSwitcher({
  themes,
  size = 'md',
  rounded = 'md',
  onChange,
  labels,
  className,
  buttonClassName,
  activeButtonClassName,
}: ThemeSwitcherProps) {
  const { theme, setTheme, availableThemes } = useTheme();
  const { t } = useI18n();
  const themeList = themes && themes.length ? themes : availableThemes;

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onChange?.(newTheme);
  };

  const switcherLabel = React.useMemo(
    () => t({ id: 'theme.switcher', defaultMessage: 'Theme switcher' }),
    [t]
  );

  const resolveLabel = React.useCallback(
    (value: Theme) => {
      const provided = labels?.[value];
      if (typeof provided === 'string') {
        const trimmed = provided.trim();
        if (trimmed) {
          return t({ id: trimmed, defaultMessage: trimmed });
        }
      }
      const fallback = toHumanReadable(String(value));
      return t({ id: `theme.${String(value)}`, defaultMessage: fallback });
    },
    [labels, t]
  );

  return (
    <div
      role="tablist"
      aria-label={switcherLabel}
      className={cn(styles.toggleGroup, sizeClassMap[size], roundedClassMap[rounded], className)}
    >
      {themeList.map((themeName) => {
        const isActive = theme === themeName;
        const label = resolveLabel(themeName);

        return (
          <button
            key={themeName}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleThemeChange(themeName)}
            className={cn(
              styles.toggleGroupButton,
              buttonClassName,
              isActive && activeButtonClassName,
            )}
            data-active={isActive ? 'true' : undefined}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';

export default ThemeSwitcher;