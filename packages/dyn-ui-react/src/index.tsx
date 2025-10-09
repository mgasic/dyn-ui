// Core Components
export { DynButton } from './components/DynButton';
export type { DynButtonProps } from './components/DynButton';

// Display Components - SCOPE 5
export { DynBadge, DynAvatar, DynLabel, DynIcon } from './components';
export type {
  DynBadgeProps,
  BadgeStatus,
  BadgeSize,
  DynAvatarProps,
  AvatarSize,
  DynLabelProps,
  DynIconProps
} from './components';
export { DYN_COLOR_PALETTE, AVATAR_SIZES } from './components';

// Form Components - SCOPE 6
export {
  DynInput,
  DynSelect,
  DynCheckbox,
  DynDatePicker,
  DynFieldContainer
} from './components';
export type {
  DynInputProps,
  DynSelectProps,
  DynCheckboxProps,
  DynDatePickerProps,
  DynFieldContainerProps,
  ValidationRule,
  DynFieldRef,
  DynFieldBase,
  SelectOption
} from './components';
export { useDynFieldValidation, validators, useDynMask, MASK_PATTERNS, getMaskPattern, useDynDateParser, DATE_FORMATS, getDateFormat } from './components';

// Layout Components - SCOPE 7
export {
  DynContainer,
  DynDivider,
  DynGrid,
  DynPage
} from './components';
export type {
  DynContainerProps,
  DynDividerProps,
  DynGridProps,
  DynGridColumn,
  DynPageProps,
  DynPageBreadcrumb,
  DynPageAction,
  LayoutSize,
  LayoutSpacing,
  LayoutDirection,
  LayoutAlignment,
  LayoutJustify
} from './components';

// Theme System
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export type { ThemeProviderProps, ThemeContextValue, Theme } from './theme/ThemeProvider';

// Providers
export { IconDictionaryProvider } from './providers';

// Hooks
export { useThemeVars } from './hooks/useTheme';
export { useIconDictionary } from './hooks/useIconDictionary';

// Types
export type { 
  ThemeName, 
  ThemeConfig, 
  ColorVariant, 
  Size,
  IconDictionary
} from './types';

// Utils
export { classNames, createClassNameGenerator, combineClasses } from './utils/classNames';
export { generateInitials, formatBadgeValue, isThemeColor, processIconString } from './utils/dynFormatters';

// Note: SCSS imports removed from production build to avoid Rollup issues
// Styles should be imported by consuming applications