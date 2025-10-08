import { BaseComponentProps } from '../../types';
import { ReactNode } from 'react';

export type TableSortDirection = 'asc' | 'desc';
export type TableCellType = 'text' | 'number' | 'boolean' | 'date' | 'time' | 'datetime' | 'currency' | 'link' | 'icon';
export type TableCellAlign = 'left' | 'center' | 'right';
export type TableSelectionType = boolean | 'single' | 'multiple';
export type TableSize = 'small' | 'medium' | 'large';

export interface DynTableColumn {
  key: string;
  title: string;
  type?: TableCellType;
  align?: TableCellAlign;
  width?: number | string;
  sortable?: boolean;
  tooltip?: string;
  render?: (value: any, record: any, index: number) => ReactNode;
}

export interface TableAction {
  key: string;
  title: string;
  icon?: string;
  type?: 'default' | 'primary' | 'danger';
  onClick: (record: any, index: number) => void;
  visible?: (record: any) => boolean;
  disabled?: (record: any) => boolean;
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
}

export interface DynTableProps extends BaseComponentProps {
  /** Data array to display */
  data: any[];
  
  /** Column definitions */
  columns: DynTableColumn[];
  
  /** Available actions for each row */
  actions?: TableAction[];
  
  /** Loading state */
  loading?: boolean;
  
  /** Table size */
  size?: TableSize;
  
  /** Show table borders */
  bordered?: boolean;
  
  /** Striped rows */
  striped?: boolean;
  
  /** Hoverable rows */
  hoverable?: boolean;
  
  /** Row selection type */
  selectable?: TableSelectionType;
  
  /** Currently selected row keys */
  selectedKeys?: string[];
  
  /** Function to get unique key for each row */
  rowKey?: string | ((row: any) => string);
  
  /** Pagination configuration */
  pagination?: TablePagination;
  
  /** Initial sort configuration */
  sortBy?: {
    column: string;
    direction: TableSortDirection;
  };
  
  /** Sort change callback */
  onSort?: (column: string, direction: TableSortDirection) => void;
  
  /** Selection change callback */
  onSelectionChange?: (keys: string[], rows: any[]) => void;
  
  /** Text to show when no data */
  emptyText?: string;
  
  /** Fixed height for scrollable table */
  height?: number | string;
}

export type DynTableType = DynTableProps;
