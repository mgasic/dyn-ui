/**
 * Type exports for DYN UI React
 * Updated to include Layout Components types - SCOPE 7
 * Updated to include standardized BaseComponentProps - TYPE SYSTEM IMPROVEMENT
 */

// Base component props - standardized across all components
export type {
  BaseComponentProps,
  VariantProps,
  SizeProps,
  ComponentSize,
  AccessibilityProps
} from './theme';

// Theme types
export type { ThemeName, ThemeConfig, ThemeContextValue, ColorVariant, Size } from './theme';

// Display Components types - SCOPE 5

export type {
  DynAvatarProps,
  DynAvatarRef,
  DynAvatarSize,
  DynAvatarShape,
  DynAvatarStatus,
} from '../components/DynAvatar/DynAvatar.types';
export {
  DYN_AVATAR_STATUS_LABELS,
} from '../components/DynAvatar/DynAvatar.types';
export type { DynIconProps, IconDictionary, ProcessedIcon } from './icon.types';
export type { DynLabelProps } from './label.types';

// Form Components types - SCOPE 6
// Form Components types - SCOPE 6
export type {
  DynInputProps,
  DynTextAreaProps,
  DynTextAreaRef,
  DynTextAreaResize,
  DynSelectProps,
  DynDatePickerProps,
  DynFieldContainerProps,
  ValidationRule,
  DynFieldRef,
  DynFieldBase,
  SelectOption
} from './field.types';

export type {
  DynCheckboxProps,
  DynCheckboxRef,
  DynCheckboxSize,
} from '../components/DynCheckbox/DynCheckbox.types';
export {
  DYN_CHECKBOX_DEFAULT_PROPS,
} from '../components/DynCheckbox/DynCheckbox.types';
export {
  DYN_TEXT_AREA_DEFAULT_PROPS,
} from '../components/DynTextArea/DynTextArea.types';

// Layout Components types - SCOPE 7
export type {
  DynContainerProps,
  DynContainerOwnProps,
  DynContainerBackground,
  DynPageProps,
  DynPageBreadcrumb,
  DynPageAction,
  LayoutSize,
  LayoutSpacing,
  LayoutDirection,
  LayoutAlignment,
  LayoutJustify
} from './layout.types';

export type {
  DynGridProps,
  DynGridColumn,
  DynGridPagination,
  DynGridSelectable,
  DynGridSortDirection,
} from '../components/DynGrid/DynGrid.types';
export { DYN_GRID_DEFAULT_PROPS } from '../components/DynGrid/DynGrid.types';

// Constants

