/**
 * Theme type definitions for Dyn UI React library
 * Includes BaseComponentProps for component standardization
 */

import type { AriaRole, ReactNode } from 'react';
import type { DynThemeTokens } from '../theme/tokens';

export type ThemeName = 'light' | 'dark' | 'high-contrast';

export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeColors {
  primary: string;
  'primary-contrast': string;
  secondary: string;
  'secondary-contrast': string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  surface: string;
  'text-primary': string;
  'text-secondary': string;
  border: string;
}

export interface ThemeConfig {
  name: ThemeName;
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface ThemeContextValue {
  theme: ThemeName | (string & Record<never, never>);
  tokens: DynThemeTokens;
  cssText: string;
  availableThemes: Array<ThemeName | (string & Record<never, never>)>;
  isLoading: boolean;
  setTheme: (theme: ThemeName | (string & Record<never, never>)) => void;
}

// ===== STANDARDIZED COMPONENT PROP TYPES =====

/**
 * Base properties that ALL DYN UI components should inherit
 * Provides consistent interface across the entire component library
 */
export interface BaseComponentProps {
  /** Unique identifier for the component */
  id?: string;

  /** Additional CSS class names to apply */
  className?: string;

  /** Test identifier for automated testing */
  'data-testid'?: string;

  /** Child elements to render */
  children?: ReactNode;
}

export type ComponentSize = 'small' | 'medium' | 'large';

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  role?: AriaRole;
}

/**
 * Props for components that support color variants
 */
export interface VariantProps {
  /** Color variant for themed styling */
  variant?: ColorVariant;
}

/**
 * Props for components that support different sizes
 */
export interface SizeProps {
  /** Size variant for the component */
  size?: Size;
}
