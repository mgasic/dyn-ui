import { BaseComponentProps, AccessibilityProps } from '../../types';
import { ReactNode, ButtonHTMLAttributes } from 'react';

export interface DynListViewItemRenderContext {
  /** Whether the current item supports expansion */
  isExpandable: boolean;
  /** Whether the current item is expanded */
  isExpanded: boolean;
  /** Programmatically toggle expansion state */
  toggleExpansion: () => void;
  /**
   * Returns props for a button element that toggles the item expansion.
   * Calling this function registers the custom renderer as providing its own expansion trigger.
   */
  getTitleTriggerProps: (
    props?: ButtonHTMLAttributes<HTMLButtonElement>
  ) => ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-expanded': boolean };
  /**
   * Convenience component for rendering an accessible button that toggles expansion.
   * Rendering the component registers the custom renderer as providing its own expansion trigger.
   */
  TitleButton: (
    props: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }
  ) => ReactNode;
  /** Register that the custom renderer is handling expansion triggers */
  registerExpansionTrigger: () => void;
  /**
   * Update the aria-labelledby attribute on the option wrapper to reference
   * custom labelled elements rendered by the custom renderer.
   */
  setOptionLabelledBy: (value: string | undefined) => void;
  /**
   * Update the aria-describedby attribute on the option wrapper to reference
   * descriptive elements rendered by the custom renderer.
   */
  setOptionDescribedBy: (value: string | undefined) => void;
  /** Default title resolved from the item */
  title: string;
  /** Default description resolved from the item */
  description?: string;
  /** Generated id for the default label */
  labelId: string;
  /** Generated id for the default description */
  descriptionId?: string;
}

export interface ListViewItem {
  id: string | number;
  label?: string;
  value?: any;
  description?: string;
  icon?: string | ReactNode;
  disabled?: boolean;
  selected?: boolean;
  [key: string]: any;
}

export interface ListViewTemplate {
  primary?: string;
  secondary?: string;
  icon?: string;
  image?: string;
  actions?: string[];
}

export interface ListAction {
  key: string;
  title: string;
  icon?: string;
  type?: 'default' | 'primary' | 'danger';
  onClick: (item: any, index: number) => void;
  visible?: (item: any) => boolean;
  disabled?: (item: any) => boolean;
}

export type ListViewSize = 'small' | 'medium' | 'large';

export interface DynListViewProps extends BaseComponentProps, AccessibilityProps {
  /** Items to display in list */
  items?: ListViewItem[];
  
  /** Data array to display (legacy alias for items) */
  data?: ListViewItem[];
  
  /** Currently selected value(s) */
  value?: string | string[];
  
  /** Default selected value(s) */
  defaultValue?: string | string[];
  
  /** Allow multiple selections */
  multiSelect?: boolean;
  
  /** Disable entire list */
  disabled?: boolean;
  
  /** Selection change handler */
  onChange?: (value: string | string[], items: ListViewItem | ListViewItem[]) => void;
  
  /** Available actions for each item */
  actions?: ListAction[];
  
  /** Loading state */
  loading?: boolean;
  
  /** List item size */
  size?: ListViewSize;
  
  /** Show borders around items */
  bordered?: boolean;
  
  /** Enable item selection */
  selectable?: boolean;
  
  /** Currently selected item keys */
  selectedKeys?: string[];
  
  /** Function to get unique key for each item */
  itemKey?: string | ((item: ListViewItem) => string);
  
  /** Custom item renderer */
  renderItem?: (
    item: ListViewItem,
    index: number,
    context?: DynListViewItemRenderContext
  ) => ReactNode;
  
  /** Selection change callback */
  onSelectionChange?: (keys: string[], items: ListViewItem[]) => void;
  
  /** Text to show when no data */
  emptyText?: string;
  
  /** Fixed height for scrollable list */
  height?: number | string;
  
  /** ARIA label for list */
  'aria-label'?: string;
  
  /** ARIA labelledby for list */
  'aria-labelledby'?: string;
}

export interface DynListViewRef {
  focus: () => void;
  selectAll: () => void;
  clearSelection: () => void;
}