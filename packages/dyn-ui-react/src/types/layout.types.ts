/**
 * Layout Components Type Definitions
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import type { CSSProperties, ReactNode } from 'react';

import type { BaseComponentProps } from './theme';

// Common layout types
export type LayoutSize = 'small' | 'medium' | 'large';
export type LayoutSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LayoutDirection = 'horizontal' | 'vertical';
export type LayoutAlignment = 'start' | 'center' | 'end' | 'stretch';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export type DynContainerLayout = 'fluid' | 'fixed' | 'responsive';

// DynContainer Props
export interface DynContainerProps extends BaseComponentProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  size?: LayoutSize | DynContainerLayout;
  spacing?: LayoutSpacing;
  bordered?: boolean;
  noBorder?: boolean;
  shadow?: boolean;
  background?: 'none' | 'surface' | 'card';
  direction?: LayoutDirection;
  align?: LayoutAlignment;
  justify?: LayoutJustify;
  maxWidth?: string | number;
  height?: string | number;
  layout?: DynContainerLayout;
  noPadding?: boolean;
  style?: CSSProperties;
}

// DynDivider Props
export interface DynDividerProps {
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
  direction?: LayoutDirection;
  thickness?: 'thin' | 'medium' | 'thick';
  style?: 'solid' | 'dashed' | 'dotted';
  color?: 'default' | 'primary' | 'secondary' | 'muted';
  spacing?: LayoutSpacing;
  className?: string;
  id?: string;
  'data-testid'?: string;
}

// DynGrid Props
export interface DynGridColumn {
  key: string;
  title: string;
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  render?: (value: any, record: any, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  hidden?: boolean;
}

export interface DynGridProps {
  columns: DynGridColumn[];
  data: any[];
  loading?: boolean;
  size?: LayoutSize;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean | 'single' | 'multiple';
  selectedKeys?: string[];
  onSelectionChange?: (selectedKeys: string[], selectedRows: any[]) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => ReactNode;
    onChange?: (page: number, pageSize: number) => void;
  };
  emptyText?: ReactNode;
  className?: string;
  id?: string;
  'data-testid'?: string;
}

// DynPage Props
export interface DynPageBreadcrumb {
  title: string;
  href?: string;
  onClick?: () => void;
}

export interface DynPageAction {
  key: string;
  title: string;
  icon?: string;
  type?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface DynPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: DynPageBreadcrumb[];
  actions?: DynPageAction[];
  children: ReactNode;
  loading?: boolean;
  error?: string | ReactNode;
  size?: LayoutSize;
  padding?: LayoutSpacing;
  background?: 'none' | 'surface' | 'page';
  className?: string;
  id?: string;
  'data-testid'?: string;
}