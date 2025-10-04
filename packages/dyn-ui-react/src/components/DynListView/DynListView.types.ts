import { BaseComponentProps } from '../types';
import { ReactNode } from 'react';

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

export interface DynListViewProps extends BaseComponentProps {
  /** Data array to display */
  data: any[];
  
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
  itemKey?: string | ((item: any) => string);
  
  /** Custom item renderer */
  renderItem?: (item: any, index: number) => ReactNode;
  
  /** Selection change callback */
  onSelectionChange?: (keys: string[], items: any[]) => void;
  
  /** Text to show when no data */
  emptyText?: string;
  
  /** Fixed height for scrollable list */
  height?: number | string;
  
  /** Additional CSS class name */
  className?: string;
}

export type DynListViewType = DynListViewProps;