/**
 * Type exports for DYN UI React
 * Updated to include Layout Components types - SCOPE 7
 * Updated to include standardized BaseComponentProps - TYPE SYSTEM IMPROVEMENT
 */

// Base component props - standardized across all components
export type {
  BaseComponentProps,
  VariantProps,
  SizeProps
} from './theme';

// Theme types
export type { ThemeName, ThemeConfig, ThemeContextValue, ColorVariant, Size } from './theme';

// Display Components types - SCOPE 5
export type { DynBadgeProps, BadgeStatus, BadgeSize, BadgeIcon } from './badge.types';
export type { DynAvatarProps, AvatarSize, AvatarLoading } from './avatar.types';
export type { DynIconProps, IconDictionary, ProcessedIcon } from './icon.types';
export type { DynLabelProps } from './label.types';

// Form Components types - SCOPE 6
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
} from './field.types';

// Layout Components types - SCOPE 7
export type {
  DynContainerProps,
  DynContainerLayout,
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
} from './layout.types';

// Constants
export { DYN_COLOR_PALETTE } from './badge.types';
export { AVATAR_SIZES } from './avatar.types';