import { BaseComponentProps, AccessibilityProps } from '../../types';
import { ReactNode } from 'react';

/**
 * Direction for table column sorting
 */
export type TableSortDirection = 'asc' | 'desc';

/**
 * Supported cell data types for automatic formatting
 */
export type TableCellType = 'text' | 'number' | 'boolean' | 'date' | 'time' | 'datetime' | 'currency' | 'link' | 'icon';

/**
 * Text alignment options for table cells
 */
export type TableCellAlign = 'left' | 'center' | 'right';

/**
 * Row selection mode configuration
 * - `false`: No selection allowed
 * - `true`: Multiple selection enabled 
 * - `'single'`: Single row selection only
 * - `'multiple'`: Multiple row selection (explicit)
 */
export type TableSelectionType = boolean | 'single' | 'multiple';

/**
 * Visual size variants for the table
 */
export type TableSize = 'small' | 'medium' | 'large';

/**
 * Column definition interface with comprehensive configuration options
 * 
 * @template T - Type of the row data object
 */
export interface DynTableColumn<T = any> {
  /** Unique identifier for the column (must be unique across all columns) */
  key: string;
  
  /** Display title for the column header */
  title: string;
  
  /** @deprecated Use `title` instead. Legacy compatibility for header text */
  header?: string;
  
  /** 
   * Data type for automatic formatting and validation
   * @default 'text'
   */
  type?: TableCellType;
  
  /** 
   * Text alignment for cells in this column
   * @default 'left'
   */
  align?: TableCellAlign;
  
  /** 
   * Fixed width for the column (CSS units or pixels)
   * @example '150px', '20%', 150
   */
  width?: number | string;
  
  /** 
   * Enable sorting for this specific column
   * Overrides global sortable setting when explicitly set to false
   * @default true (when global sortable is enabled)
   */
  sortable?: boolean;
  
  /** Tooltip text displayed on column header hover */
  tooltip?: string;
  
  /**
   * Custom render function for cell content
   * Provides full control over cell rendering
   * 
   * @param value - The cell value (row[column.key])
   * @param record - Complete row data object
   * @param index - Zero-based row index
   * @returns ReactNode to render in the cell
   */
  render?: (value: any, record: T, index: number) => ReactNode;
}

/**
 * Action button configuration for row-level operations
 * 
 * @template T - Type of the row data object
 */
export interface TableAction<T = any> {
  /** Unique identifier for the action (must be unique within row actions) */
  key: string;
  
  /** Display text for the action button */
  title: string;
  
  /** Icon identifier for visual representation */
  icon?: string;
  
  /** 
   * Visual style variant for the action button
   * @default 'default'
   */
  type?: 'default' | 'primary' | 'danger';
  
  /**
   * Action handler function
   * 
   * @param record - Complete row data object
   * @param index - Zero-based row index
   */
  onClick: (record: T, index: number) => void;
  
  /**
   * Conditional visibility function
   * 
   * @param record - Row data to evaluate
   * @returns true if action should be visible
   * @default () => true
   */
  visible?: (record: T) => boolean;
  
  /**
   * Conditional disabled state function
   * 
   * @param record - Row data to evaluate  
   * @returns true if action should be disabled
   * @default () => false
   */
  disabled?: (record: T) => boolean;
}

/**
 * Pagination configuration interface
 */
export interface TablePagination {
  /** Current page number (1-based) */
  current: number;
  
  /** Number of rows per page */
  pageSize: number;
  
  /** Total number of items across all pages */
  total: number;
  
  /**
   * Page change handler
   * 
   * @param page - New page number (1-based)
   * @param pageSize - Rows per page (may change if user modifies page size)
   */
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * Sort configuration interface
 */
export interface TableSortConfig {
  /** Column key to sort by */
  column: string;
  
  /** Sort direction */
  direction: TableSortDirection;
}

/**
 * Comprehensive DynTable component props interface
 * Extends BaseComponentProps and AccessibilityProps for full design system compliance
 * 
 * @template T - Type of the row data objects in the data array
 */
export interface DynTableProps<T = any> extends BaseComponentProps, AccessibilityProps {
  /** 
   * Array of data objects to display in the table
   * Each object represents one table row
   */
  data: T[];
  
  /** 
   * Column definitions defining structure and behavior
   * Order determines visual column order
   */
  columns: DynTableColumn<T>[];
  
  /** 
   * Available actions for each row
   * Actions appear in the rightmost column when provided
   * @default []
   */
  actions?: TableAction<T>[];
  
  /** 
   * Loading state indicator
   * Shows loading overlay when true
   * @default false
   */
  loading?: boolean;
  
  /** 
   * Visual size variant affecting padding and typography
   * @default 'medium'
   */
  size?: TableSize;
  
  /** 
   * Show table borders around cells
   * @default true
   */
  bordered?: boolean;
  
  /** 
   * Alternate row background colors for better readability
   * @default false
   */
  striped?: boolean;
  
  /** 
   * Enable hover effects on rows
   * @default false
   */
  hoverable?: boolean;
  
  /** 
   * Row selection configuration
   * @default false
   */
  selectable?: TableSelectionType;
  
  /** 
   * Enable column sorting globally
   * Individual columns can override with column.sortable
   * @default true
   */
  sortable?: boolean;
  
  /** 
   * Array of currently selected row keys
   * Used for controlled selection state
   */
  selectedKeys?: string[];
  
  /** 
   * Function to extract unique key from each row
   * Essential for performance and avoiding React key warnings
   * 
   * @param row - Row data object
   * @returns Unique string identifier for the row
   * @default Uses row.id, row.key, or index as fallback
   */
  rowKey?: string | ((row: T) => string);
  
  /** 
   * Pagination configuration
   * When provided, enables pagination controls
   */
  pagination?: TablePagination;
  
  /** 
   * Initial/controlled sort configuration
   * When provided, table shows sorted state
   */
  sortBy?: TableSortConfig;
  
  /**
   * Sort change event handler
   * 
   * @param column - Column key being sorted
   * @param direction - New sort direction
   */
  onSort?: (column: string, direction: TableSortDirection) => void;
  
  /**
   * Selection change event handler
   * 
   * @param keys - Array of selected row keys
   * @param rows - Array of selected row data objects
   */
  onSelectionChange?: (keys: string[], rows: T[]) => void;
  
  /** 
   * Text to display when data array is empty
   * @default 'No data available'
   */
  emptyText?: string;
  
  /** 
   * Fixed height for scrollable table
   * Creates vertical scroll when content exceeds height
   */
  height?: number | string;
  
  /** 
   * ARIA label for the table element
   * Provides accessible name when aria-labelledby is not used
   */
  'aria-label'?: string;
  
  /** 
   * ARIA labelledby reference
   * Points to element(s) that label the table
   */
  'aria-labelledby'?: string;
}

/**
 * @deprecated Use DynTableProps instead
 * Legacy type alias for backward compatibility
 */
export type DynTableType = DynTableProps;

/**
 * Utility type for extracting row type from DynTableProps
 * 
 * @example
 * type UserTableProps = DynTableProps<User>;
 * type UserRowType = ExtractRowType<UserTableProps>; // User
 */
export type ExtractRowType<T extends DynTableProps<any>> = T extends DynTableProps<infer R> ? R : never;

/**
 * Utility type for column with specific row type
 * 
 * @example
 * type UserColumn = TypedTableColumn<User>;
 */
export type TypedTableColumn<T> = DynTableColumn<T>;

/**
 * Utility type for action with specific row type
 * 
 * @example
 * type UserAction = TypedTableAction<User>;
 */
export type TypedTableAction<T> = TableAction<T>;