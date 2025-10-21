// Public entry point for dyn-ui-react
// Re-export the full component surface along with supporting utilities

// Components and related types/constants
export * from './components';
export {
  AVATAR_SIZES,
  DYN_AVATAR_VARIANTS,
  DYN_AVATAR_COLORS,
  AVATAR_COLOR_TOKENS,
} from './components/DynAvatar';

// Theme system
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export type { ThemeProviderProps, ThemeContextValue, Theme } from './theme/ThemeProvider';

// Providers
export { IconDictionaryProvider } from './providers';

// Hooks
export { useThemeVars } from './hooks/useTheme';
export { useIconDictionary } from './hooks/useIconDictionary';

// Root types
export type { ThemeName, ThemeConfig, ColorVariant, Size, IconDictionary } from './types';

// Utilities
export { classNames, createClassNameGenerator, combineClasses } from './utils/classNames';
export {
  generateInitials,
  formatBadgeValue,
  isThemeColor,
  processIconString,
} from './utils/dynFormatters';

// Design tokens
export * from './tokens';

// Testing utilities
export { axe, testA11y } from './testing';
export type { AccessibilityTestOptions, AccessibilityTestResult } from './testing';
