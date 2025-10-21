/**
 * DynGrid Component Stories
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DynGrid } from './DynGrid';
import type { DynGridColumn } from './DynGrid.types';
import React from 'react';

const meta: Meta<typeof DynGrid> = {
  title: 'Layout/DynGrid',
  component: DynGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Advanced data table component with sorting, filtering, and selection capabilities.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    selectable: {
      control: 'select',
      options: [false, 'single', 'multiple']
    },
    emptyText: {
      control: 'text'
    },
    role: {
      control: 'select',
      options: [undefined, 'grid', 'table', 'region'],
      description:
        'Sets an explicit role for assistive technologies (e.g., "grid" or "region").'
    },
    'aria-label': {
      control: 'text',
      description: 'Provides an accessible name for screen reader users.'
    },
    'aria-labelledby': {
      control: 'text',
      description:
        'References the id of another element whose text should be used as the grid label.'
    },
    'aria-describedby': {
      control: 'text',
      description:
        'References the id of an element that gives additional descriptive context.'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const columns: DynGridColumn[] = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    sortable: true,
    align: 'center'
  },
  {
    key: 'name',
    title: 'Full Name',
    sortable: true,
    width: 200
  },
  {
    key: 'email',
    title: 'Email Address',
    width: 250
  },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
    align: 'center',
    render: value => {
      const role = typeof value === 'string' ? value : '';
      const label = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

      return (
        <span className={`role-badge role-${role}`}>
          {label || '—'}
        </span>
      );
    }
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    render: value => {
      const status = typeof value === 'string' ? value : '';
      const icon = status === 'active' ? '🟢' : '🔴';

      return (
        <span className={`status-indicator ${status}`}>
          {icon} {status || 'unknown'}
        </span>
      );
    }
  },
  {
    key: 'lastLogin',
    title: 'Last Login',
    width: 150,
    render: value => {
      const resolvedValue =
        value instanceof Date || typeof value === 'number' || typeof value === 'string'
          ? value
          : undefined;
      if (resolvedValue === undefined) {
        return '—';
      }

      const date =
        resolvedValue instanceof Date ? resolvedValue : new Date(resolvedValue);

      return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
    }
  }
];

const data = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-10-01T10:30:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2023-10-02T14:15:00Z'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'manager',
    status: 'inactive',
    lastLogin: '2023-09-28T09:45:00Z'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2023-10-03T16:20:00Z'
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-10-03T11:10:00Z'
  }
];

export const Basic: Story = {
  args: {
    columns,
    data
  }
};

export const WithSelection: Story = {
  args: {
    columns,
    data,
    selectable: 'multiple'
  }
};

export const SingleSelection: Story = {
  args: {
    columns,
    data,
    selectable: 'single'
  }
};

export const WithBorders: Story = {
  args: {
    columns,
    data,
    bordered: true,
    striped: true,
    hoverable: true
  }
};

export const SmallSize: Story = {
  args: {
    columns,
    data,
    size: 'small',
    bordered: true
  }
};

export const LargeSize: Story = {
  args: {
    columns,
    data,
    size: 'large',
    bordered: true
  }
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true
  }
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyText: 'No users found'
  }
};

export const WithPagination: Story = {
  args: {
    columns,
    data,
    pagination: {
      current: 1,
      pageSize: 3,
      total: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      onChange: (page, pageSize) => console.log('Page changed:', page, pageSize)
    }
  }
};

export const Interactive: Story = {
  args: {
    columns,
    data,
    sortable: true,
    selectable: 'multiple',
    bordered: true,
    hoverable: true,
    onSort: (column, direction) => console.log('Sort:', column, direction),
    onSelectionChange: (keys, rows) => console.log('Selection:', keys, rows)
  }
};

export const AccessibleLabel: Story = {
  args: {
    columns,
    data,
    role: 'grid',
    'aria-label': 'Team member directory',
    bordered: true,
    hoverable: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to provide an accessible name for assistive technologies using `aria-label`.'
      }
    }
  }
};
