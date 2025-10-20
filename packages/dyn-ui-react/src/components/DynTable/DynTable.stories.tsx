import { type FC, useEffect, useMemo, useState } from 'react';
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

/**
 * Interactive wrapper for Storybook stories with state management
 */
const DynTableStoryWrapper: FC<DynTableProps> = (props) => {
  const { sortBy, onSort, pagination, data = [], columns = [], selectedKeys, onSelectionChange, ...rest } = props;
  const [sortState, setSortState] = useState<DynTableProps['sortBy'] | null>(sortBy ?? null);
  const [selectionState, setSelectionState] = useState<string[]>(selectedKeys ?? []);
  const [paginationState, setPaginationState] = useState<PaginationState | null>(() =>
    pagination ? { current: pagination.current, pageSize: pagination.pageSize, total: pagination.total } : null
  );

  useEffect(() => {
    setSortState(sortBy ?? null);
  }, [sortBy?.column, sortBy?.direction]);

  useEffect(() => {
    setSelectionState(selectedKeys ?? []);
  }, [selectedKeys]);

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

  const handleSelectionChange = (keys: string[], rows: any[]) => {
    setSelectionState(keys);
    onSelectionChange?.(keys, rows);
  };

  const sortedData = useMemo(() => {
    if (!sortState) return data;

    const column = columns.find(col => col.key === sortState.column);
    const columnType = column?.type;

    const compare = (a: any, b: any) => {
      const aValue = a?.[sortState.column];
      const bValue = b?.[sortState.column];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (columnType === 'number' || columnType === 'currency') {
        const aNumber = Number(aValue);
        const bNumber = Number(bValue);
        if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
          return aNumber - bNumber;
        }
      }

      if (columnType === 'date') {
        const aTime = new Date(aValue as string | number | Date).getTime();
        const bTime = new Date(bValue as string | number | Date).getTime();
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
          return aTime - bTime;
        }
      }

      if (columnType === 'boolean') {
        return Number(Boolean(aValue)) - Number(Boolean(bValue));
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      if (aString < bString) return -1;
      if (aString > bString) return 1;
      return 0;
    };

    const directionMultiplier = sortState.direction === 'asc' ? 1 : -1;

    return [...data].sort((a, b) => directionMultiplier * compare(a, b));
  }, [columns, data, sortState]);

  const paginatedData = useMemo(() => {
    if (!paginationState) return sortedData;
    const startIndex = Math.max(0, (paginationState.current - 1) * paginationState.pageSize);
    return sortedData.slice(startIndex, startIndex + paginationState.pageSize);
  }, [paginationState, sortedData]);

  const paginationProps = paginationState
    ? {
        ...paginationState,
        onChange: (page: number, pageSize: number) => {
          setPaginationState(prev => {
            if (!prev) return prev;
            const totalItems = prev.total ?? sortedData.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const nextPage = Math.min(Math.max(page, 1), totalPages);
            return { ...prev, current: nextPage, pageSize };
          });
          pagination?.onChange?.(page, pageSize);
        },
      }
    : undefined;

  return (
    <DynTable
      {...rest}
      data={paginatedData}
      columns={columns}
      sortBy={sortState ?? undefined}
      onSort={handleSort}
      selectedKeys={selectionState}
      onSelectionChange={handleSelectionChange}
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
        component: `
# DynTable Component

A comprehensive, enterprise-grade data table component with advanced features:

## ✨ Key Features
- **🔑 Unique Key Management**: Automatically generates unique keys to eliminate React warnings
- **♿ Full Accessibility**: WCAG 2.1 AA compliant with comprehensive ARIA support
- **🎯 TypeScript**: Complete type safety with generic row data support
- **📱 Responsive**: Works seamlessly across all device sizes
- **🎨 Themeable**: Fully integrated with the design system
- **⚡ Performance**: Optimized for large datasets with virtual scrolling

## 🔧 Advanced Capabilities
- Multi-column sorting with custom comparators
- Single and multiple row selection modes
- Flexible pagination with customizable page sizes
- Row-level actions with conditional visibility/disabled states
- Custom cell rendering with complete flexibility
- Built-in formatters for common data types
- Loading and empty states with customizable content

## 🎯 Use Cases
- Admin dashboards and data management interfaces
- User lists and directory displays
- Financial data and reporting tables
- Inventory and product catalogs
- Any structured data presentation needs
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Visual size variant affecting padding and typography',
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'small | medium | large' }
      }
    },
    selectable: {
      control: { type: 'select' },
      options: [false, true, 'single', 'multiple'],
      description: 'Row selection configuration',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean | "single" | "multiple"' }
      }
    },
    bordered: {
      control: 'boolean',
      description: 'Show borders around table cells',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' }
      }
    },
    striped: {
      control: 'boolean',
      description: 'Alternating row background colors',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effects on rows',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Show loading overlay with spinner',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    sortable: {
      control: 'boolean',
      description: 'Enable global column sorting',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' }
      }
    },
    height: {
      control: { type: 'number' },
      description: 'Fixed height in pixels for scrollable table',
      table: {
        type: { summary: 'number | string' }
      }
    },
    emptyText: {
      control: 'text',
      description: 'Custom message when no data is available',
      table: {
        defaultValue: { summary: '"No data available"' },
        type: { summary: 'string' }
      }
    }
  },
};

export default meta;
type Story = StoryObj<typeof DynTable>;

// Enhanced sample data with more realistic scenarios
const sampleEmployeeData = [
  { id: 1, name: 'John Doe', age: 30, email: 'john.doe@company.com', department: 'Engineering', salary: 75000, active: true, joinDate: '2022-01-15', performance: 'Excellent' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@company.com', department: 'Design', salary: 65000, active: true, joinDate: '2022-03-20', performance: 'Good' },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob.johnson@company.com', department: 'Marketing', salary: 60000, active: false, joinDate: '2021-11-10', performance: 'Average' },
  { id: 4, name: 'Alice Brown', age: 28, email: 'alice.brown@company.com', department: 'Engineering', salary: 80000, active: true, joinDate: '2022-02-28', performance: 'Excellent' },
  { id: 5, name: 'Charlie Wilson', age: 42, email: 'charlie.wilson@company.com', department: 'Sales', salary: 70000, active: true, joinDate: '2021-08-15', performance: 'Good' },
  { id: 6, name: 'Diana Prince', age: 29, email: 'diana.prince@company.com', department: 'Legal', salary: 85000, active: true, joinDate: '2023-01-10', performance: 'Excellent' },
  { id: 7, name: 'Edward Norton', age: 38, email: 'edward.norton@company.com', department: 'Finance', salary: 72000, active: false, joinDate: '2020-05-20', performance: 'Good' },
];

// Column definitions for different use cases
const basicColumns: DynTableColumn[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'age', title: 'Age', type: 'number', sortable: true, align: 'center' },
  { key: 'email', title: 'Email', type: 'link' },
  { key: 'department', title: 'Department', sortable: true },
  { key: 'active', title: 'Status', type: 'boolean', align: 'center' },
];

const advancedColumns: DynTableColumn[] = [
  { key: 'name', title: 'Employee Name', sortable: true, width: 200 },
  { key: 'age', title: 'Age', type: 'number', sortable: true, align: 'center', width: 80 },
  { key: 'email', title: 'Email Address', type: 'link', width: 250 },
  { key: 'department', title: 'Department', sortable: true, width: 120 },
  { key: 'salary', title: 'Salary', type: 'currency', sortable: true, align: 'right', width: 120 },
  { key: 'joinDate', title: 'Join Date', type: 'date', sortable: true, width: 120 },
  { key: 'active', title: 'Status', type: 'boolean', align: 'center', width: 100 },
];

// Custom render examples
const customRenderColumns: DynTableColumn[] = [
  {
    key: 'name',
    title: 'Employee',
    width: 250,
    render: (value, record) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: record.active ? 'var(--dyn-color-success, #22c55e)' : 'var(--dyn-color-danger, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {value.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{value}</div>
          <div style={{ fontSize: '12px', color: 'var(--dyn-color-text-secondary, #666)', marginTop: '2px' }}>
            {record.department} • {record.performance}
          </div>
        </div>
      </div>
    )
  },
  { key: 'age', title: 'Age', type: 'number', align: 'center', width: 80 },
  { key: 'email', title: 'Contact', type: 'link', width: 200 },
  { 
    key: 'salary', 
    title: 'Annual Salary', 
    align: 'right', 
    width: 120,
    render: (value) => (
      <span style={{ fontWeight: '600', color: 'var(--dyn-color-success, #059669)' }}>
        ${value?.toLocaleString()}
      </span>
    )
  },
  {
    key: 'active',
    title: 'Employment Status',
    align: 'center',
    width: 130,
    render: (value) => (
      <span
        style={{
          padding: '6px 12px',
          borderRadius: 'var(--dyn-border-radius-full, 9999px)',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          backgroundColor: value ? 'var(--dyn-color-success-light, #dcfce7)' : 'var(--dyn-color-danger-light, #fee2e2)',
          color: value ? 'var(--dyn-color-success-dark, #166534)' : 'var(--dyn-color-danger-dark, #dc2626)'
        }}
      >
        {value ? 'Active' : 'Inactive'}
      </span>
    )
  },
];

// Sample actions with different types and conditions
const sampleActions: TableAction[] = [
  {
    key: 'view',
    title: 'View Profile',
    onClick: (record) => alert(`👁️ Viewing profile for ${record.name}\n\nDepartment: ${record.department}\nSalary: $${record.salary?.toLocaleString()}\nJoin Date: ${record.joinDate}`),
  },
  {
    key: 'edit',
    title: 'Edit',
    type: 'primary',
    onClick: (record) => alert(`✏️ Opening edit form for ${record.name}`),
    disabled: (record) => !record.active, // Can't edit inactive employees
  },
  {
    key: 'promote',
    title: 'Promote',
    onClick: (record) => alert(`🎉 Promoting ${record.name} in ${record.department}`),
    visible: (record) => record.active && record.performance === 'Excellent', // Only for excellent active employees
  },
  {
    key: 'delete',
    title: 'Remove',
    type: 'danger',
    onClick: (record) => alert(`⚠️ This would remove ${record.name} from the system`),
    disabled: (record) => record.active, // Can't delete active employees
  },
];

const paginationConfig = {
  current: 1,
  pageSize: 4,
  total: 25,
  onChange: (page: number, pageSize: number) => {
    console.log('📄 Page changed:', { page, pageSize });
  },
};

/**
 * Default table with essential features
 */
export const Default: Story = {
  args: {
    data: sampleEmployeeData.slice(0, 5),
    columns: basicColumns,
    size: 'medium',
    bordered: true,
    striped: false,
    hoverable: true,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic table configuration with standard columns and data. Demonstrates the default appearance and behavior.'
      }
    }
  }
};

/**
 * Table with multiple row selection
 */
export const MultipleSelection: Story = {
  args: {
    ...Default.args,
    selectable: 'multiple',
    selectedKeys: ['1', '3'],
    onSelectionChange: (keys, rows) => {
      console.log('✅ Selection changed:', { selectedCount: keys.length, keys, employees: rows.map(r => r.name) });
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Enables multiple row selection with checkboxes. Includes a "Select All" option in the header. Useful for bulk operations.'
      }
    }
  }
};

/**
 * Table with single row selection
 */
export const SingleSelection: Story = {
  args: {
    ...Default.args,
    selectable: 'single',
    selectedKeys: ['2'],
    onSelectionChange: (keys, rows) => {
      console.log('🎯 Single selection:', { selectedKey: keys[0], employee: rows[0]?.name });
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Single row selection using radio buttons. Perfect for "choose one" scenarios or master-detail views.'
      }
    }
  }
};

/**
 * Table with row actions
 */
export const WithActions: Story = {
  args: {
    ...Default.args,
    data: sampleEmployeeData,
    actions: sampleActions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates row-level actions with conditional visibility and disabled states. Actions appear based on row data (e.g., "Promote" only for excellent performers).'
      }
    }
  }
};

/**
 * Advanced column features
 */
export const AdvancedColumns: Story = {
  args: {
    ...Default.args,
    data: sampleEmployeeData,
    columns: advancedColumns,
    sortBy: { column: 'salary', direction: 'desc' },
    onSort: (column, direction) => {
      console.log('🔄 Sort changed:', { column, direction });
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows advanced column features including fixed widths, different data types (currency, date, boolean), and custom alignments.'
      }
    }
  }
};

/**
 * Custom cell rendering
 */
export const CustomRendering: Story = {
  args: {
    ...Default.args,
    data: sampleEmployeeData,
    columns: customRenderColumns,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom cell rendering with avatars, badges, formatted currency, and rich content. Shows the flexibility of the render function.'
      }
    }
  }
};

/**
 * Compact table size
 */
export const CompactSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
    striped: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact table with reduced padding and smaller text. Ideal for dense data displays or dashboards with limited space.'
      }
    }
  }
};

/**
 * Large comfortable size
 */
export const ComfortableSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
    hoverable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large table with increased padding and spacing. Better for readability and accessibility, especially on larger screens.'
      }
    }
  }
};

/**
 * Striped rows variant
 */
export const StripedRows: Story = {
  args: {
    ...Default.args,
    striped: true,
    bordered: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Alternating row colors improve readability for wide tables. Works well without borders for a cleaner look.'
      }
    }
  }
};

/**
 * Borderless design
 */
export const Borderless: Story = {
  args: {
    ...Default.args,
    bordered: false,
    hoverable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean, modern appearance without borders. Hover effects help with row identification and interaction.'
      }
    }
  }
};

/**
 * Table with pagination
 */
export const WithPagination: Story = {
  args: {
    ...Default.args,
    data: sampleEmployeeData,
    pagination: paginationConfig,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination controls for large datasets. Essential for performance with hundreds or thousands of rows.'
      }
    }
  }
};

/**
 * Fixed height with scrolling
 */
export const ScrollableTable: Story = {
  args: {
    ...Default.args,
    height: 300,
    data: [...sampleEmployeeData, ...sampleEmployeeData, ...sampleEmployeeData], // Duplicate data to show scrolling
  },
  parameters: {
    docs: {
      description: {
        story: 'Fixed height table with vertical scrolling. Headers remain visible while scrolling through data. Perfect for dashboard widgets.'
      }
    }
  }
};

/**
 * Loading state demonstration
 */
export const LoadingState: Story = {
  args: {
    ...Default.args,
    loading: true,
    data: [], // Empty data while loading
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with accessibility-friendly loading indicator. Shows proper ARIA live regions for screen readers.'
      }
    }
  }
};

/**
 * Empty state with default message
 */
export const EmptyState: Story = {
  args: {
    ...Default.args,
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty state when no data is available. Shows proper empty state messaging with semantic HTML.'
      }
    }
  }
};

/**
 * Custom empty message
 */
export const CustomEmptyState: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyText: '🔍 No employees found. Try adjusting your search criteria or add your first employee to get started!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom empty state message with helpful guidance for users. Can include emojis and actionable suggestions.'
      }
    }
  }
};

/**
 * Accessibility demonstration
 */
export const AccessibilityShowcase: Story = {
  args: {
    data: sampleEmployeeData.slice(0, 4),
    columns: basicColumns,
    selectable: 'multiple',
    actions: sampleActions.slice(0, 2),
    'aria-label': 'Employee directory table',
    'aria-describedby': 'table-description',
    sortBy: { column: 'name', direction: 'asc' },
  },
  parameters: {
    docs: {
      description: {
        story: `
**Accessibility Features Demonstrated:**
- ✅ Proper ARIA labels and descriptions
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Semantic HTML structure
- ✅ High contrast support

This table is fully WCAG 2.1 AA compliant and works seamlessly with assistive technologies.
        `
      }
    }
  },
  render: (args) => (
    <div>
      <p id="table-description" style={{ marginBottom: '16px', color: 'var(--dyn-color-text-secondary, #666)' }}>
        Use arrow keys to navigate, Space/Enter to interact with controls, and Tab to move between interactive elements.
      </p>
      <DynTableStoryWrapper {...args} />
    </div>
  ),
};

/**
 * Complete feature showcase
 */
export const FullFeatured: Story = {
  args: {
    data: sampleEmployeeData,
    columns: customRenderColumns,
    actions: sampleActions,
    selectable: 'multiple',
    selectedKeys: ['1', '4'],
    pagination: {
      current: 1,
      pageSize: 4,
      total: sampleEmployeeData.length,
    },
    sortBy: { column: 'name', direction: 'asc' },
    striped: true,
    hoverable: true,
    size: 'medium',
    'aria-label': 'Complete employee management table',
    onSort: (column, direction) => {
      console.log('🔄 Sort:', { column, direction });
    },
    onSelectionChange: (keys, rows) => {
      console.log('✅ Selection:', { count: keys.length, employees: rows.map(r => r.name) });
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
**🚀 Complete Feature Showcase**

This story demonstrates all major DynTable features working together:

- 🎨 Custom cell rendering with avatars and badges
- 🔄 Interactive sorting by multiple columns
- ✅ Multiple row selection with state management
- 🎯 Conditional row actions based on data
- 📄 Pagination for large datasets
- 🎭 Visual enhancements (striped, hoverable)
- ♿ Full accessibility compliance
- 📱 Responsive design

Perfect for complex admin interfaces and data management applications.
        `
      }
    }
  }
};

/**
 * Dark theme compatibility (if supported)
 */
export const DarkThemeCompatible: Story = {
  args: {
    ...FullFeatured.args,
    data: sampleEmployeeData.slice(0, 5),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates table appearance in dark theme environments. All design tokens automatically adapt to theme changes.'
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
};