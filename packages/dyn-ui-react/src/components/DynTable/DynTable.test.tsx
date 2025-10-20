import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import DynTable from './DynTable';
import { DynTableColumn, TableAction, DynTableProps } from './DynTable.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Sample test data with various scenarios
const sampleData = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', active: true },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', active: false },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', active: true },
];

// Test data without standard ID fields (tests fallback key generation)
const dataWithoutIds = [
  { name: 'User 1', code: 'USR001', status: 'active' },
  { name: 'User 2', identifier: 'USR002', status: 'inactive' },
  { name: 'User 3', uuid: '123e4567-e89b-12d3-a456-426614174000', status: 'pending' },
];

// Test data with duplicate potential keys (edge case testing)
const duplicateKeyData = [
  { name: 'Duplicate 1', value: 1 },
  { name: 'Duplicate 2', value: 1 }, // Same value, should get unique keys
  { name: 'Duplicate 3', value: 2 },
];

const sampleColumns: DynTableColumn[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'age', title: 'Age', type: 'number', sortable: true, align: 'right' },
  { key: 'email', title: 'Email', type: 'link' },
  { key: 'active', title: 'Active', type: 'boolean', align: 'center' },
];

const sampleActions: TableAction[] = [
  {
    key: 'edit',
    title: 'Edit',
    onClick: vi.fn(),
  },
  {
    key: 'delete',
    title: 'Delete',
    type: 'danger',
    onClick: vi.fn(),
  },
];

describe('DynTable', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    sampleActions.forEach(action => {
      if (vi.isMockFunction(action.onClick)) {
        action.onClick.mockClear();
      }
    });
  });

  describe('Basic Functionality', () => {
    it('renders without crashing', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders loading state correctly', () => {
      render(<DynTable data={[]} columns={[]} loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('renders empty state with default message', () => {
      render(<DynTable data={[]} columns={sampleColumns} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByRole('note')).toBeInTheDocument();
    });

    it('renders custom empty text', () => {
      render(<DynTable data={[]} columns={sampleColumns} emptyText="Custom empty message" />);
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('renders all columns and data correctly', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} />);

      // Verify headers are present
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();

      // Verify data is present
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  describe('Key Generation and Uniqueness', () => {
    it('generates unique keys for all rows', () => {
      const { container } = render(<DynTable data={sampleData} columns={sampleColumns} />);
      const rows = container.querySelectorAll('tbody tr');
      const keys = Array.from(rows).map(row => row.getAttribute('key') || '');
      
      // Ensure all keys are unique
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it('handles data without standard id fields', () => {
      const columns: DynTableColumn[] = [
        { key: 'name', title: 'Name' },
        { key: 'status', title: 'Status' },
      ];
      
      render(<DynTable data={dataWithoutIds} columns={columns} />);
      
      // Should render without errors and show all data
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
      expect(screen.getByText('User 3')).toBeInTheDocument();
    });

    it('uses custom rowKey function properly', () => {
      const customRowKey = (row: any) => `custom-${row.name.replace(' ', '-').toLowerCase()}`;
      
      render(
        <DynTable 
          data={sampleData} 
          columns={sampleColumns} 
          rowKey={customRowKey}
        />
      );
      
      // Should render without React key warnings
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('uses custom rowKey string property', () => {
      render(
        <DynTable 
          data={sampleData} 
          columns={sampleColumns} 
          rowKey="email" // Use email as unique key
        />
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles duplicate values gracefully', () => {
      const columns: DynTableColumn[] = [
        { key: 'name', title: 'Name' },
        { key: 'value', title: 'Value' },
      ];
      
      render(<DynTable data={duplicateKeyData} columns={columns} />);
      
      // Should render all rows without key conflicts
      expect(screen.getByText('Duplicate 1')).toBeInTheDocument();
      expect(screen.getByText('Duplicate 2')).toBeInTheDocument();
      expect(screen.getByText('Duplicate 3')).toBeInTheDocument();
    });
  });

  describe('Selection Functionality', () => {
    it('renders selection checkboxes for multiple selection', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} selectable="multiple" />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4); // 3 rows + select all header
    });

    it('renders radio buttons for single selection', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} selectable="single" />);
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3); // 3 rows only
    });

    it('does not render selection controls when selectable is false', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} selectable={false} />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    });

    it('handles row selection correctly', () => {
      const onSelectionChange = vi.fn();
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          selectable="multiple"
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // Click first row checkbox (index 0 is select all)

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('1')]), 
        [sampleData[0]]
      );
    });

    it('handles select all functionality', () => {
      const onSelectionChange = vi.fn();
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          selectable="multiple"
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(selectAllCheckbox);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('1')]),
        sampleData
      );
    });

    it('handles controlled selection state', () => {
      const selectedKeys = ['row-1', 'row-3'];
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          selectable="multiple"
          selectedKeys={selectedKeys}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      // Check if appropriate checkboxes are selected
      expect(checkboxes.some(cb => cb.checked)).toBe(true);
    });
  });

  describe('Sorting Functionality', () => {
    it('renders sort indicators for sortable columns', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} />);
      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toHaveClass('dyn-table__cell--sortable');
    });

    it('does not render sort indicators for non-sortable columns', () => {
      const nonSortableColumns: DynTableColumn[] = [
        { key: 'name', title: 'Name', sortable: false },
        { key: 'email', title: 'Email' }, // No sortable specified, should use global setting
      ];
      
      render(<DynTable data={sampleData} columns={nonSortableColumns} sortable={false} />);
      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).not.toHaveClass('dyn-table__cell--sortable');
    });

    it('handles column sorting with callback', () => {
      const onSort = vi.fn();
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          onSort={onSort}
        />
      );

      const nameButton = screen.getByRole('button', { name: /sort by name/i });
      fireEvent.click(nameButton);

      expect(onSort).toHaveBeenCalledWith('name', 'asc');
    });

    it('toggles sort direction on repeated clicks', () => {
      const onSort = vi.fn();
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          onSort={onSort}
          sortBy={{ column: 'name', direction: 'asc' }}
        />
      );

      const nameButton = screen.getByRole('button', { name: /sort by name/i });
      fireEvent.click(nameButton);

      expect(onSort).toHaveBeenCalledWith('name', 'desc');
    });

    it('shows correct sort state indicators', () => {
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          sortBy={{ column: 'name', direction: 'asc' }}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      expect(nameHeader).toHaveClass('dyn-table__cell--sorted');
    });
  });

  describe('Actions Functionality', () => {
    it('renders action buttons for each row', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} actions={sampleActions} />);
      
      expect(screen.getAllByText('Edit')).toHaveLength(3);
      expect(screen.getAllByText('Delete')).toHaveLength(3);
      expect(screen.getByText('Actions')).toBeInTheDocument(); // Actions column header
    });

    it('calls action onClick handler with correct parameters', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} actions={sampleActions} />);

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      expect(sampleActions[0].onClick).toHaveBeenCalledWith(sampleData[0], 0);
    });

    it('handles conditional action visibility', () => {
      const conditionalActions: TableAction[] = [
        {
          key: 'activate',
          title: 'Activate',
          onClick: vi.fn(),
          visible: (record) => !record.active, // Only show for inactive users
        },
      ];

      render(<DynTable data={sampleData} columns={sampleColumns} actions={conditionalActions} />);
      
      // Should only show for Jane Smith (active: false)
      expect(screen.getAllByText('Activate')).toHaveLength(1);
    });

    it('handles conditional action disabled state', () => {
      const conditionalActions: TableAction[] = [
        {
          key: 'edit',
          title: 'Edit',
          onClick: vi.fn(),
          disabled: (record) => record.id === 1, // Disable for first user
        },
      ];

      render(<DynTable data={sampleData} columns={sampleColumns} actions={conditionalActions} />);
      
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons[0]).toBeDisabled();
      expect(editButtons[1]).not.toBeDisabled();
    });
  });

  describe('Cell Formatting', () => {
    it('formats boolean values correctly', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} />);
      expect(screen.getAllByText('Yes')).toHaveLength(2); // John and Bob are active
      expect(screen.getAllByText('No')).toHaveLength(1); // Jane is not active
    });

    it('handles custom cell renderers', () => {
      const customColumns: DynTableColumn[] = [
        {
          key: 'name',
          title: 'Name',
          render: (value) => <strong data-testid="custom-cell">Custom: {value}</strong>,
        },
      ];

      render(<DynTable data={sampleData} columns={customColumns} />);
      
      const customCells = screen.getAllByTestId('custom-cell');
      expect(customCells).toHaveLength(3);
      expect(customCells[0]).toHaveTextContent('Custom: John Doe');
    });

    it('handles link type cells', () => {
      const linkColumns: DynTableColumn[] = [
        { key: 'email', title: 'Email', type: 'link' },
      ];

      render(<DynTable data={sampleData} columns={linkColumns} />);
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveAttribute('href', 'john@example.com');
    });

    it('handles null and undefined values safely', () => {
      const dataWithNulls = [
        { id: 1, name: 'John', value: null },
        { id: 2, name: 'Jane', value: undefined },
        { id: 3, name: null, value: 'test' },
      ];
      
      const columns: DynTableColumn[] = [
        { key: 'name', title: 'Name' },
        { key: 'value', title: 'Value' },
      ];

      render(<DynTable data={dataWithNulls} columns={columns} />);
      
      // Should render without errors
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    const pagination = {
      current: 1,
      pageSize: 2,
      total: 10,
      onChange: vi.fn(),
    };

    beforeEach(() => {
      pagination.onChange.mockClear();
    });

    it('renders pagination controls', () => {
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          pagination={pagination}
        />
      );

      expect(screen.getByRole('navigation', { name: /table pagination/i })).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    it('handles pagination changes', () => {
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          pagination={pagination}
        />
      );

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      expect(pagination.onChange).toHaveBeenCalledWith(2, 2);
    });

    it('disables Previous button on first page', () => {
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          pagination={pagination}
        />
      );

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      const lastPagePagination = { ...pagination, current: 5, total: 10 };
      render(
        <DynTable
          data={sampleData}
          columns={sampleColumns}
          pagination={lastPagePagination}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Styling and Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <DynTable data={sampleData} columns={sampleColumns} className="custom-table" />
      );
      expect(container.firstChild).toHaveClass('custom-table');
    });

    it('applies size variants correctly', () => {
      const { container, rerender } = render(
        <DynTable data={sampleData} columns={sampleColumns} size="small" />
      );
      expect(container.firstChild).toHaveClass('dyn-table--small');

      rerender(<DynTable data={sampleData} columns={sampleColumns} size="large" />);
      expect(container.firstChild).toHaveClass('dyn-table--large');
    });

    it('applies visual variants correctly', () => {
      const { container } = render(
        <DynTable data={sampleData} columns={sampleColumns} striped bordered={false} hoverable />
      );
      expect(container.firstChild).toHaveClass('dyn-table--striped');
      expect(container.firstChild).not.toHaveClass('dyn-table--bordered');
      expect(container.firstChild).toHaveClass('dyn-table--hoverable');
    });

    it('applies height style correctly', () => {
      const { container } = render(
        <DynTable data={sampleData} columns={sampleColumns} height={400} />
      );
      expect(container.firstChild).toHaveStyle({ height: '400px' });
      expect(container.firstChild).toHaveClass('dyn-table--fixed-height');
    });

    it('applies height as string correctly', () => {
      const { container } = render(
        <DynTable data={sampleData} columns={sampleColumns} height="50vh" />
      );
      expect(container.firstChild).toHaveStyle({ height: '50vh' });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <DynTable 
          data={sampleData} 
          columns={sampleColumns} 
          aria-label="User data table"
          aria-describedby="table-description"
        />
      );

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'User data table');
      expect(table).toHaveAttribute('aria-describedby', 'table-description');
    });

    it('has proper column headers with scope', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} />);
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        if (header.textContent && header.textContent.trim() && header.textContent !== 'Actions') {
          expect(header).toHaveAttribute('scope', 'col');
        }
      });
    });

    it('has proper row selection accessibility', () => {
      render(<DynTable data={sampleData} columns={sampleColumns} selectable="multiple" />);
      
      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all rows/i });
      expect(selectAllCheckbox).toBeInTheDocument();
      
      const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
      expect(rowCheckboxes).toHaveLength(3);
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <DynTable 
          data={sampleData} 
          columns={sampleColumns}
          selectable="multiple"
          actions={sampleActions}
          aria-label="Test table"
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array gracefully', () => {
      render(<DynTable data={[]} columns={sampleColumns} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('handles empty columns array gracefully', () => {
      render(<DynTable data={sampleData} columns={[]} />);
      // Should render table structure without errors
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles missing column properties', () => {
      const minimalColumns: DynTableColumn[] = [
        { key: 'name', title: 'Name' }, // Minimal column definition
      ];
      
      render(<DynTable data={sampleData} columns={minimalColumns} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles data with missing properties', () => {
      const incompleteData = [
        { id: 1, name: 'Complete' },
        { id: 2 }, // Missing name
        { name: 'No ID' }, // Missing id
      ];
      
      render(<DynTable data={incompleteData} columns={[{ key: 'name', title: 'Name' }]} />);
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });
});