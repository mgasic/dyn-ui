import * as React from 'react';
import { useTheme, type Theme } from '../../theme/ThemeProvider';
import { cn } from '../../utils/classNames';
import type { ThemeSwitcherProps } from './ThemeSwitcher.types';
export type { ThemeSwitcherProps } from './ThemeSwitcher.types';
import styles from './ThemeSwitcher.module.css';

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
  const themeList = themes && themes.length ? themes : availableThemes;

  const handleThemeChange = (newTheme: Theme) => {
    console.log(`Switching theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
    onChange?.(newTheme);
  };

  return (
    <div
      role="tablist"
      aria-label="Theme switcher"
      className={cn(styles.toggleGroup, sizeClassMap[size], roundedClassMap[rounded], className)}
    >
      {themeList.map((t) => {
        const isActive = theme === t;
        const label = labels?.[t] ?? t.charAt(0).toUpperCase() + t.slice(1);

        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleThemeChange(t)}
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