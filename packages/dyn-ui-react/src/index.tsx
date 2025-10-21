// Core Components
export { DynButton } from './components/DynButton';
export type { DynButtonProps } from './components/DynButton';

// Display Components - SCOPE 5
export { DynBadge, DynAvatar, DynLabel, DynIcon } from './components';
export type {
  DynBadgeProps,
  DynBadgeRef,
  DynBadgeVariant,
  DynBadgeColor,
  DynBadgePosition,
  DynBadgeSize,
  DynBadgeState,
  DynBadgeAccessibilityProps,
  DynAvatarProps,
  DynAvatarRef,
  DynAvatarSize,
  DynAvatarShape,
  DynAvatarStatus,
  DynLabelProps,
  DynIconProps
} from './components/DynBadge';
export {
  DYN_BADGE_SIZES,
  DYN_BADGE_VARIANTS,
  DYN_BADGE_COLORS,
  DYN_BADGE_STATES
} from './components/DynBadge';
export { AVATAR_SIZES } from './components/DynAvatar/DynAvatar.types';

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
  DynFieldContainerProps
} from './components';
export type { ValidationRule, DynFieldRef, DynFieldBase, SelectOption } from './types';
export {
  useDynFieldValidation,
  validators
} from './hooks/useDynFieldValidation';
export { useDynMask, MASK_PATTERNS, getMaskPattern } from './hooks/useDynMask';
export { useDynDateParser, DATE_FORMATS, getDateFormat } from './hooks/useDynDateParser';

// Layout Components - SCOPE 7
export {
  DynContainer,
  DynDivider,
  DynGrid,
  DynPage
} from './components';
export type {
  DynContainerProps,
  DynPageProps,
  DynPageBreadcrumb,
  DynPageAction,
  LayoutSize,
  LayoutSpacing,
  LayoutDirection,
  LayoutAlignment,
  LayoutJustify
} from './components';
export type {
  DynGridProps,
  DynGridColumn,
  DynGridPagination,
  DynGridSelectable,
  DynGridSortDirection,
} from './components/DynGrid/DynGrid.types';
export { DYN_GRID_DEFAULT_PROPS } from './components/DynGrid/DynGrid.types';

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
