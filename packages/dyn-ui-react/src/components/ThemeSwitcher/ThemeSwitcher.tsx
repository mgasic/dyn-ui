import * as React from 'react';
import { useTheme, type Theme } from '../../theme/ThemeProvider';

export type ThemeSwitcherProps = {
  themes?: Theme[];
  size?: 'sm' | 'md';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  onChange?: (theme: Theme) => void;
  labels?: Record<Theme, string>;
  className?: string;
};

const getSpacing = (size: 'sm' | 'md') => {
  return size === 'sm' ? '6px' : '8px';
};

const getBorderRadius = (rounded: string) => {
  const radiusMap = {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px'
  };
  return radiusMap[rounded as keyof typeof radiusMap] || '6px';
};

export function ThemeSwitcher({
  themes,
  size = 'md',
  rounded = 'md',
  onChange,
  labels,
  className,
}: ThemeSwitcherProps) {
  const { theme, setTheme, availableThemes } = useTheme();
  const themeList = themes && themes.length ? themes : availableThemes;

  const handleThemeChange = (newTheme: Theme) => {
    console.log(`Switching theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
    onChange?.(newTheme);
  };

  const spacing = getSpacing(size);
  const borderRadius = getBorderRadius(rounded);

  return (
    <div
      role="tablist"
      aria-label="Theme switcher"
      className={className}
      style={{
        display: 'inline-flex',
        border: '1px solid var(--dyn-color-border, #e5e7eb)',
        borderRadius,
        overflow: 'hidden',
        background: 'var(--dyn-color-muted, #f9fafb)',
        transition: 'all 0.2s ease',
      }}
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
            style={{
              appearance: 'none',
              cursor: 'pointer',
              padding: `${spacing} ${parseInt(spacing) * 2}px`,
              border: 'none',
              background: isActive ? 'var(--dyn-color-primary, #3b82f6)' : 'transparent',
              color: isActive ? 'white' : 'var(--dyn-color-foreground, #374151)',
              fontWeight: isActive ? 600 : 500,
              lineHeight: 1.2,
              fontSize: size === 'sm' ? '0.875rem' : '1rem',
              transition: 'all 0.2s ease',
              minWidth: '60px',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--dyn-color-border, #f3f4f6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
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