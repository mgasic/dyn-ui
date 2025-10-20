import { BaseComponentProps, AccessibilityProps } from '../../types';
import { ReactNode } from 'react';

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
  renderItem?: (item: ListViewItem, index: number) => ReactNode;
  
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

export interface DynListViewImperativeActions {
  selectAll: () => void;
  clearSelection: () => void;
}

export type DynListViewRef = HTMLDivElement & DynListViewImperativeActions;

