import type { AriaAttributes, HTMLAttributes, ReactNode } from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types';
import type { LayoutSize } from '../../types/layout.types';

export type DynGridSortDirection = 'asc' | 'desc';

export interface DynGridColumn {
  key: string;
  title: ReactNode;
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  render?: (value: unknown, record: Record<string, unknown>, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  hidden?: boolean;
}

export interface DynGridPagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
}

export type DynGridSelectable = boolean | 'single' | 'multiple';

export interface DynGridProps
  extends BaseComponentProps,
    AccessibilityProps,
    AriaAttributes,
    Omit<
      HTMLAttributes<HTMLDivElement>,
      | keyof BaseComponentProps
      | keyof AccessibilityProps
      | keyof AriaAttributes
      | 'children'
    > {
  columns: DynGridColumn[];
  data: Record<string, unknown>[];
  loading?: boolean;
  size?: LayoutSize;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: DynGridSelectable;
  selectedKeys?: string[];
  onSelectionChange?: (selectedKeys: string[], selectedRows: Record<string, unknown>[]) => void;
  onSort?: (column: string, direction: DynGridSortDirection) => void;
  onFilter?: (filters: Record<string, unknown>) => void;
  pagination?: DynGridPagination;
  emptyText?: ReactNode;
}

export interface DynGridDefaultProps
  extends Required<
      Pick<
        DynGridProps,
        | 'loading'
        | 'size'
        | 'bordered'
        | 'striped'
        | 'hoverable'
        | 'sortable'
        | 'filterable'
        | 'selectable'
        | 'selectedKeys'
        | 'emptyText'
      >
    > {
  'data-testid': string;
}

export const DYN_GRID_DEFAULT_PROPS: DynGridDefaultProps = {
  loading: false,
  size: 'medium',
  bordered: true,
  striped: false,
  hoverable: true,
  sortable: true,
  filterable: false,
  selectable: false,
  selectedKeys: [],
  emptyText: 'No data available',
  'data-testid': 'dyn-grid',
};
