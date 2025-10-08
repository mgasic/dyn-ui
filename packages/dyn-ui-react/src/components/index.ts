/**
 * Main component exports for DYN UI React
 * Standardized exports with consistent patterns across all components
 * Following DYN UI Standards and Naming Conventions
 */

// Import global theme styles
import '../styles/themes.css';
// Import component styles
import '../styles/dyn-field-container.css';
import '../styles/dyn-input.css';
import '../styles/dyn-select.css';
import '../styles/dyn-checkbox.css';
import '../styles/dyn-datepicker.css';
import '../styles/dyn-layout.css';

// ===== COMPONENT EXPORTS (Grouped by Category) =====

// Basic Components
export { DynButton } from './DynButton';
export { DynIcon } from './DynIcon';
export { DynBox } from './DynBox';

// Display Components - SCOPE 5
export { DynBadge } from './DynBadge';
export { DynAvatar } from './DynAvatar';
export { DynLabel } from './DynLabel';

// Form Components - SCOPE 6
export { DynInput } from './DynInput';
export { DynSelect } from './DynSelect';
export { DynCheckbox } from './DynCheckbox';
export { DynDatePicker } from './DynDatePicker';
export { DynFieldContainer } from './DynFieldContainer';

// Layout Components - SCOPE 7
export { DynContainer } from './DynContainer';
export { DynDivider } from './DynDivider';
export { DynGrid } from './DynGrid';
export { DynPage } from './DynPage';

// Data Display Components
export { DynChart } from './DynChart';
export { DynGauge } from './DynGauge';
export { DynListView } from './DynListView';
export { DynTable } from './DynTable';
export { DynTreeView } from './DynTreeView';

// Navigation Components
export { DynMenu } from './DynMenu';
export { DynBreadcrumb } from './DynBreadcrumb';
export { DynTabs } from './DynTabs';
export { DynStepper } from './DynStepper';
export { DynToolbar } from './DynToolbar';

// Utility Components
export { ThemeSwitcher } from './ThemeSwitcher';

// ===== TYPE EXPORTS (Grouped by Category) =====

// Basic Component Types
export type { DynButtonProps } from './DynButton/DynButton.types';
export type { DynIconProps } from '../types/icon.types';

// Display Component Types - SCOPE 5
export type { 
  DynBadgeProps, 
  BadgeStatus, 
  BadgeSize, 
  BadgeIcon 
} from '../types/badge.types';
export type { 
  DynAvatarProps, 
  AvatarSize, 
  AvatarLoading 
} from '../types/avatar.types';
export type { DynLabelProps } from '../types/label.types';

// Form Component Types - SCOPE 6
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
} from '../types/field.types';

// Layout Component Types - SCOPE 7
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
} from '../types/layout.types';

// Data Display Component Types
export type {
  DynChartProps,
  ChartType,
  ChartDataPoint,
  ChartSeries,
  ChartAxis
} from './DynChart/DynChart.types';
export type {
  DynGaugeProps,
  GaugeSize,
  GaugeRange,
  GaugeType
} from './DynGauge/DynGauge.types';
export type {
  DynListViewProps,
  ListViewItem,
  ListViewTemplate,
  ListAction,
  ListViewSize
} from './DynListView/DynListView.types';
export type {
  DynTableProps,
  DynTableColumn,
  TableAction,
  TablePagination,
  TableSortDirection,
  TableCellType,
  TableCellAlign,
  TableSelectionType,
  TableSize
} from './DynTable/DynTable.types';
export type {
  DynTreeViewProps,
  TreeNode,
  TreeViewActions,
  TreeSelectInfo,
  TreeCheckInfo
} from './DynTreeView/DynTreeView.types';

// Navigation Component Types
export type {
  DynMenuProps,
  MenuItem,
  MenuBadge,
  MenuLiterals,
  DynMenuRef
} from './DynMenu/DynMenu.types';
export type {
  DynBreadcrumbProps,
  BreadcrumbItem,
  DynBreadcrumbRef
} from './DynBreadcrumb/DynBreadcrumb.types';
export type {
  DynTabsProps,
  DynTabsHandle,
  TabItem
} from './DynTabs/DynTabs.types';
export type {
  DynStepperProps,
  DynStepperHandle,
  StepItem
} from './DynStepper/DynStepper.types';
export type {
  DynToolbarProps,
  DynToolbarRef,
  ToolbarItem
} from './DynToolbar/DynToolbar.types';

// Utility Component Types
export type { ThemeSwitcherProps } from './ThemeSwitcher/ThemeSwitcher';

// ===== THEME SYSTEM EXPORTS =====
export { ThemeProvider, useTheme } from '../theme/ThemeProvider';
export type { ThemeProviderProps, ThemeContextValue } from '../theme/ThemeProvider';

// ===== PROVIDER EXPORTS =====
export { IconDictionaryProvider } from '../providers';

// ===== HOOKS EXPORTS =====
export { useDynFieldValidation, validators } from '../hooks/useDynFieldValidation';
export { useDynMask, MASK_PATTERNS, getMaskPattern } from '../hooks/useDynMask';
export { useDynDateParser, DATE_FORMATS, getDateFormat } from '../hooks/useDynDateParser';

// ===== CONSTANTS EXPORTS =====
export { DYN_COLOR_PALETTE } from '../types/badge.types';
export { AVATAR_SIZES } from '../types/avatar.types';
export { DEFAULT_MENU_LITERALS } from './DynMenu/DynMenu.types';
export { DEFAULT_SEPARATOR, BREADCRUMB_LITERALS } from './DynBreadcrumb/DynBreadcrumb.types';
export { TOOLBAR_DEFAULTS, TOOLBAR_ITEM_TYPES } from './DynToolbar/DynToolbar.types';

// ===== UTILITY EXPORTS =====
export { classNames, createClassNameGenerator, combineClasses } from '../utils/classNames';
export { generateInitials, formatBadgeValue, isThemeColor, processIconString } from '../utils/dynFormatters';
