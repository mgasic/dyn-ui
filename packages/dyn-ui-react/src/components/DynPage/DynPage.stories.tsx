/**
 * DynPage Component Stories
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynPage } from './DynPage';
import type { DynPageBreadcrumb, DynPageAction } from '../../types/layout.types';
import React from 'react';

const meta: Meta<typeof DynPage> = {
  title: 'Layout/DynPage',
  component: DynPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete page layout component with header, breadcrumbs, actions, flexible content area, and semantic helpers for accessible landmarks.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'text',
      description: 'Polymorphic element rendered by the page root. Defaults to `<main>`.'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl']
    },
    headerPadding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Overrides header padding using design tokens.'
    },
    background: {
      control: 'select',
      options: ['none', 'surface', 'page']
    },
    loading: {
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample breadcrumbs
const breadcrumbs: DynPageBreadcrumb[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '/users' },
  { title: 'Profile' }
];

// Sample actions
const actions: DynPageAction[] = [
  {
    key: 'save',
    title: 'Save Changes',
    type: 'primary',
    icon: 'save',
    onClick: () => console.log('Save clicked')
  },
  {
    key: 'cancel',
    title: 'Cancel',
    type: 'secondary',
    onClick: () => console.log('Cancel clicked')
  },
  {
    key: 'delete',
    title: 'Delete',
    type: 'danger',
    icon: 'trash',
    onClick: () => console.log('Delete clicked')
  }
];

// Sample content
const SampleContent = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ marginBottom: '2rem' }}>
      <h3>User Profile</h3>
      <p>This is sample page content that would typically contain forms, tables, or other UI elements.</p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        background: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4>Personal Information</h4>
        <p>Name: John Doe</p>
        <p>Email: john.doe@example.com</p>
        <p>Role: Administrator</p>
      </div>

      <div style={{
        background: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4>Account Settings</h4>
        <p>Last Login: October 3, 2023</p>
        <p>Status: Active</p>
        <p>Two-Factor: Enabled</p>
      </div>
    </div>

    <div style={{
      background: '#ffffff',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <h4>Recent Activity</h4>
      <ul>
        <li>Updated profile information (2 hours ago)</li>
        <li>Changed password (1 day ago)</li>
        <li>Logged in from new device (3 days ago)</li>
        <li>Updated email preferences (1 week ago)</li>
      </ul>
    </div>
  </div>
);

export const Basic: Story = {
  args: {
    title: 'User Profile',
    children: <SampleContent />
  }
};

export const WithSubtitle: Story = {
  args: {
    title: 'User Profile',
    subtitle: 'Manage your account information and settings',
    children: <SampleContent />
  }
};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'User Profile',
    subtitle: 'Manage your account information and settings',
    breadcrumbs,
    children: <SampleContent />
  }
};

export const WithActions: Story = {
  args: {
    title: 'User Profile',
    subtitle: 'Manage your account information and settings',
    breadcrumbs,
    actions,
    children: <SampleContent />
  }
};

export const SmallSize: Story = {
  args: {
    title: 'Compact Profile',
    subtitle: 'Smaller layout for mobile',
    breadcrumbs,
    actions: actions.slice(0, 2),
    size: 'small',
    children: <SampleContent />
  }
};

export const LargeSize: Story = {
  args: {
    title: 'Executive Dashboard',
    subtitle: 'Comprehensive overview with enhanced spacing',
    breadcrumbs,
    actions,
    size: 'large',
    children: <SampleContent />
  }
};

export const Loading: Story = {
  args: {
    title: 'Loading Page',
    subtitle: 'Please wait while we load your data',
    breadcrumbs,
    loading: true,
    children: <SampleContent />
  }
};

export const Error: Story = {
  args: {
    title: 'Error Page',
    error: 'Failed to load user profile. Please try again later.',
    breadcrumbs,
    children: <SampleContent />
  }
};

export const CustomError: Story = {
  args: {
    title: 'Custom Error',
    error: (
      <div>
        <h3>Access Denied</h3>
        <p>You don't have permission to view this page.</p>
        <button onClick={() => console.log('Go back')}>Go Back</button>
      </div>
    ),
    breadcrumbs,
    children: <SampleContent />
  }
};

export const DifferentBackgrounds: Story = {
  args: {
    title: 'Surface Background',
    subtitle: 'Page with surface background',
    breadcrumbs,
    actions,
    background: 'surface',
    children: <SampleContent />
  }
};

export const CustomPadding: Story = {
  args: {
    title: 'No Padding',
    subtitle: 'Page content with no padding',
    breadcrumbs,
    actions,
    padding: 'none',
    children: (
      <div style={{
        background: 'linear-gradient(45deg, #f0f9ff, #e0f2fe)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Full Width Content</h2>
          <p>This content spans the full width without padding</p>
        </div>
      </div>
    )
  }
};

export const AlternativeSemantic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'DynPage renders a `<main>` by default. Use the `as` prop with an explicit `aria-labelledby` reference when embedding the page layout inside other landmarks.'
      }
    }
  },
  render: (args) => {
    const headingId = 'reports-dashboard-heading';

    return (
      <div style={{ padding: '1.5rem', background: '#f8fafc' }}>
        <h1 id={headingId} style={{ marginBottom: '1rem' }}>
          Executive Reports Overview
        </h1>
        <DynPage {...args} aria-labelledby={headingId} />
      </div>
    );
  },
  args: {
    as: 'section',
    title: 'Reports Dashboard',
    subtitle: 'Embedded inside a larger document structure',
    breadcrumbs,
    actions,
    children: <SampleContent />
  }
};

export const CustomHeaderSlot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `slots.header` render prop allows replacing the header content while preserving breadcrumb and action helpers.'
      }
    }
  },
  args: {
    title: 'Analytics Overview',
    subtitle: 'Custom header composition via slot',
    breadcrumbs,
    actions,
    slots: {
      header: ({ titleId, renderBreadcrumbs, renderActions, subtitle }) => (
        <>
          <div style={{ marginBottom: '1rem' }}>{renderBreadcrumbs()}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1.5rem'
            }}
          >
            <div>
              <h1 id={titleId} style={{ margin: 0 }}>
                Quarterly Analytics
              </h1>
              {subtitle && (
                <p style={{ margin: '0.25rem 0 0', color: '#475569' }}>{subtitle}</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>{renderActions()}</div>
          </div>
        </>
      )
    },
    children: <SampleContent />
  }
};

export const ResponsivePadding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Responsive breakpoints automatically collapse large paddings on narrow viewports. Resize the Storybook canvas to see the `padding="xl"` tokens adjust to mobile spacing.'
      }
    }
  },
  args: {
    title: 'Responsive Padding',
    subtitle: 'Uses spacing tokens that adapt on small screens',
    padding: 'xl',
    children: <SampleContent />
  }
};

export const InteractiveDemo: Story = {
  args: {
    title: 'Interactive Demo',
    subtitle: 'Try the breadcrumbs and actions',
    breadcrumbs: [
      { title: 'Home', onClick: () => alert('Navigate to Home') },
      { title: 'Products', onClick: () => alert('Navigate to Products') },
      { title: 'Details' }
    ],
    actions: [
      {
        key: 'edit',
        title: 'Edit',
        type: 'primary',
        onClick: () => alert('Edit action clicked!')
      },
      {
        key: 'share',
        title: 'Share',
        type: 'secondary',
        onClick: () => alert('Share action clicked!')
      }
    ],
    children: (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>Interactive Elements</h3>
        <p>Click on breadcrumb links or action buttons to see interactions.</p>
      </div>
    )
  }
};
