import { type FC, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DynTable from './DynTable';
import {
  DynTableProps,
  DynTableColumn,
  TableAction,
  TablePagination,
  TableSortDirection
} from './DynTable.types';

type PaginationState = Pick<TablePagination, 'current' | 'pageSize' | 'total'>;

const DynTableStoryWrapper: FC<DynTableProps> = (props) => {
  const { sortBy, onSort, pagination, ...rest } = props;
  const [sortState, setSortState] = useState<DynTableProps['sortBy'] | null>(sortBy ?? null);
  const [paginationState, setPaginationState] = useState<PaginationState | null>(() =>
    pagination ? { current: pagination.current, pageSize: pagination.pageSize, total: pagination.total } : null
  );

  useEffect(() => {
    setSortState(sortBy ?? null);
  }, [sortBy?.column, sortBy?.direction]);

  useEffect(() => {
    if (!pagination) {
      setPaginationState(null);
      return;
    }

    setPaginationState({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  }, [pagination?.current, pagination?.pageSize, pagination?.total, pagination ? 1 : 0]);

  const handleSort = (column: string, direction: TableSortDirection) => {
    setSortState({ column, direction });
    onSort?.(column, direction);
  };

  const paginationProps = paginationState
    ? {
        ...paginationState,
        onChange: (page: number, pageSize: number) => {
          setPaginationState(prev => (prev ? { ...prev, current: page, pageSize } : prev));
          pagination?.onChange?.(page, pageSize);
        },
      }
    : undefined;

  return (
    <DynTable
      {...rest}
      sortBy={sortState ?? undefined}
      onSort={handleSort}
      pagination={paginationProps}
    />
  );
};

const meta: Meta<typeof DynTable> = {
  title: 'Data Display/DynTable',
  component: DynTable,
  render: (args) => <DynTableStoryWrapper {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive data table component with sorting, selection, pagination, and action support for displaying structured data.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Table size variant'
    },
    selectable: {
      control: { type: 'select' },
      options: [false, true, 'single', 'multiple'],
      description: 'Row selection type'
    },
    bordered: {
      control: 'boolean',
      description: 'Show table borders'
    },
    striped: {
      control: 'boolean',
      description: 'Striped rows'
    },
    hoverable: {
      control: 'boolean',
      description: 'Hoverable rows'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state'
    },
    height: {
      control: { type: 'number' },
      description: 'Fixed height for scrollable table'
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynTable>;

// Sample data
const sampleData = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', department: 'Engineering', salary: 75000, active: true, joinDate: '2022-01-15' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', department: 'Design', salary: 65000, active: true, joinDate: '2022-03-20' },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', department: 'Marketing', salary: 60000, active: false, joinDate: '2021-11-10' },
  { id: 4, name: 'Alice Brown', age: 28, email: 'alice@example.com', department: 'Engineering', salary: 80000, active: true, joinDate: '2022-02-28' },
  { id: 5, name: 'Charlie Wilson', age: 42, email: 'charlie@example.com', department: 'Sales', salary: 70000, active: true, joinDate: '2021-08-15' },
];

const basicColumns: DynTableColumn[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'age', title: 'Age', type: 'number', sortable: true, align: 'right' },
  { key: 'email', title: 'Email', type: 'link' },
  { key: 'department', title: 'Department', sortable: true },
  { key: 'active', title: 'Active', type: 'boolean', align: 'center' },
];

const advancedColumns: DynTableColumn[] = [
  { key: 'name', title: 'Employee Name', sortable: true, width: 200 },
  { key: 'age', title: 'Age', type: 'number', sortable: true, align: 'center', width: 80 },
  { key: 'email', title: 'Email Address', type: 'link', width: 250 },
  { key: 'department', title: 'Department', sortable: true, width: 120 },
  { key: 'salary', title: 'Salary', type: 'currency', sortable: true, align: 'right', width: 120 },
  { key: 'joinDate', title: 'Join Date', type: 'date', sortable: true, width: 120 },
  { key: 'active', title: 'Status', type: 'boolean', align: 'center', width: 80 },
];

const customRenderColumns: DynTableColumn[] = [
  {
    key: 'name',
    title: 'Employee',
    render: (value, record) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: record.active ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          {value.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: '600' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.department}</div>
        </div>
      </div>
    )
  },
  { key: 'age', title: 'Age', type: 'number', align: 'center' },
  { key: 'email', title: 'Email', type: 'link' },
  { key: 'salary', title: 'Salary', type: 'currency', align: 'right' },
  {
    key: 'active',
    title: 'Status',
    align: 'center',
    render: (value) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: value ? '#dcfce7' : '#fee2e2',
          color: value ? '#166534' : '#dc2626'
        }}
      >
        {value ? 'Active' : 'Inactive'}
      </span>
    )
  },
];

const sampleActions: TableAction[] = [
  {
    key: 'view',
    title: 'View',
    onClick: (record) => alert(`Viewing ${record.name}`),
  },
  {
    key: 'edit',
    title: 'Edit',
    type: 'primary',
    onClick: (record) => alert(`Editing ${record.name}`),
  },
  {
    key: 'delete',
    title: 'Delete',
    type: 'danger',
    onClick: (record) => alert(`Deleting ${record.name}`),
    disabled: (record) => record.active, // Can't delete active users
  },
];

const pagination = {
  current: 1,
  pageSize: 3,
  total: 50,
  onChange: (page: number, pageSize: number) => {
    console.log('Page changed:', { page, pageSize });
  },
};

// Default story
export const Default: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    size: 'medium',
    bordered: true,
    striped: false,
    hoverable: true,
    loading: false,
  },
};

// With Selection
export const WithSelection: Story = {
  args: {
    ...Default.args,
    selectable: 'multiple',
    selectedKeys: ['1', '3'],
    onSelectionChange: (keys, rows) => {
      console.log('Selected:', { keys, rows });
    },
  },
};

// Single Selection
export const SingleSelection: Story = {
  args: {
    ...Default.args,
    selectable: 'single',
    selectedKeys: ['2'],
    onSelectionChange: (keys, rows) => {
      console.log('Selected:', { keys, rows });
    },
  },
};

// With Actions
export const WithActions: Story = {
  args: {
    ...Default.args,
    actions: sampleActions,
  },
};

// Advanced Columns
export const AdvancedColumns: Story = {
  args: {
    ...Default.args,
    columns: advancedColumns,
    sortBy: { column: 'salary', direction: 'desc' },
    onSort: (column, direction) => {
      console.log('Sort changed:', { column, direction });
    },
  },
};

// Custom Rendering
export const CustomRendering: Story = {
  args: {
    ...Default.args,
    columns: customRenderColumns,
  },
};

// Small Size
export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
};

// Large Size
export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
};

// Striped Variant
export const Striped: Story = {
  args: {
    ...Default.args,
    striped: true,
  },
};

// Without Borders
export const WithoutBorders: Story = {
  args: {
    ...Default.args,
    bordered: false,
  },
};

// With Pagination
export const WithPagination: Story = {
  args: {
    ...Default.args,
    pagination,
  },
};

// Fixed Height (Scrollable)
export const FixedHeight: Story = {
  args: {
    ...Default.args,
    height: 300,
    data: [...sampleData, ...sampleData, ...sampleData], // More data to show scrolling
  },
};

// Loading State
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

// Empty State
export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
};

// Custom Empty Text
export const CustomEmptyText: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyText: 'No employees found. Add your first employee to get started!',
  },
};

// All Features Combined
export const AllFeatures: Story = {
  args: {
    data: sampleData,
    columns: advancedColumns,
    actions: sampleActions,
    selectable: 'multiple',
    pagination: {
      current: 1,
      pageSize: 3,
      total: sampleData.length,
    },
    sortBy: { column: 'name', direction: 'asc' },
    striped: true,
    size: 'medium',
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
    onSelectionChange: (keys, rows) => {
      console.log('Selection:', { keys, rows });
    },
  },
};
