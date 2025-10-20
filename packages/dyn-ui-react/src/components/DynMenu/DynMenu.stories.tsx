/**
 * DynMenu Storybook Stories
 * Interactive examples and documentation for navigation menu component
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynMenu } from './DynMenu';
import { MenuItem } from './DynMenu.types';
import React from 'react';

const meta: Meta<typeof DynMenu> = {
  title: 'Navigation/DynMenu',
  component: DynMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The DynMenu component provides a hierarchical navigation menu system with:

- **Collapsible sidebar** - Toggle between expanded and collapsed states
- **Hierarchical structure** - Support for nested menu items
- **Search functionality** - Filter menu items with built-in search
- **Responsive design** - Automatic collapse on mobile devices
- **Badge support** - Display notification badges on menu items
- **Custom icons** - Support for icon-based navigation
- **Accessibility** - Full keyboard navigation and ARIA support

## Usage

\`\`\`tsx
import { DynMenu } from '@dyn-ui/react';

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'dyn-icon-dashboard',
    link: '/dashboard'
  },
  {
    label: 'Products',
    icon: 'dyn-icon-box',
    subItems: [
      { label: 'All Products', link: '/products' },
      { label: 'Categories', link: '/categories' }
    ]
  }
];

<DynMenu items={menuItems} />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    items: {
      description: 'Array of menu items with hierarchical structure',
      control: { type: 'object' }
    },
    collapsed: {
      description: 'Controls whether the menu is collapsed',
      control: { type: 'boolean' }
    },
    filter: {
      description: 'Enable search filter functionality',
      control: { type: 'boolean' }
    },
    automaticToggle: {
      description: 'Automatically collapse menu on mobile devices',
      control: { type: 'boolean' }
    },
    onCollapse: {
      description: 'Callback fired when menu collapse state changes',
      action: 'collapsed'
    },
    onMenuClick: {
      description: 'Callback fired when menu item is clicked',
      action: 'menuClick'
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynMenu>;

// Sample menu data
const sampleMenus: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dyn-icon-dashboard',
    shortLabel: 'Dash',
    action: () => console.log('Dashboard clicked'),
    badge: { count: 3, color: 'primary' }
  },
  {
    type: 'divider'
  },
  {
    label: 'Products',
    icon: 'dyn-icon-box',
    shortLabel: 'Prod',
    subItems: [
      {
        label: 'All Products',
        icon: 'dyn-icon-list',
        action: () => console.log('All Products clicked')
      },
      {
        label: 'Categories',
        icon: 'dyn-icon-folder',
        action: () => console.log('Categories clicked')
      },
      {
        label: 'Inventory',
        icon: 'dyn-icon-warehouse',
        badge: { count: 12, color: 'info' },
        action: () => console.log('Inventory clicked')
      }
    ]
  },
  {
    label: 'Orders',
    icon: 'dyn-icon-shopping-cart',
    shortLabel: 'Orders',
    badge: { count: 5, color: 'secondary' },
    subItems: [
      {
        label: 'Pending Orders',
        icon: 'dyn-icon-clock',
        badge: { count: 3, color: 'warning' },
        action: () => console.log('Pending Orders clicked')
      },
      {
        label: 'Completed Orders',
        icon: 'dyn-icon-check',
        action: () => console.log('Completed Orders clicked')
      }
    ]
  },
  {
    label: 'Customers',
    icon: 'dyn-icon-users',
    shortLabel: 'Cust',
    action: () => console.log('Customers clicked')
  },
  {
    label: 'Analytics',
    icon: 'dyn-icon-chart-line',
    shortLabel: 'Analytics',
    subItems: [
      {
        label: 'Sales Report',
        icon: 'dyn-icon-chart-bar',
        action: () => console.log('Sales Report clicked')
      },
      {
        label: 'Traffic Report',
        icon: 'dyn-icon-chart-area',
        action: () => console.log('Traffic Report clicked')
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    label: 'Settings',
    icon: 'dyn-icon-settings',
    shortLabel: 'Config',
    action: () => console.log('Settings clicked')
  },
  {
    label: 'Help & Support',
    icon: 'dyn-icon-help',
    shortLabel: 'Help',
    disabled: false,
    action: () => console.log('Help clicked')
  }
];

const basicMenus: MenuItem[] = [
  {
    label: 'Home',
    icon: 'dyn-icon-home',
    action: () => console.log('Home clicked')
  },
  {
    label: 'About',
    icon: 'dyn-icon-info',
    action: () => console.log('About clicked')
  },
  {
    label: 'Contact',
    icon: 'dyn-icon-envelope',
    action: () => console.log('Contact clicked')
  }
];

export const Default: Story = {
  args: {
    items: sampleMenus,
    collapsed: false,
    filter: true,
    automaticToggle: true,
    logo: 'https://via.placeholder.com/120x32/0066cc/ffffff?text=DynUI',
    shortLogo: 'https://via.placeholder.com/32x32/0066cc/ffffff?text=D'
  }
};

export const Collapsed: Story = {
  args: {
    items: sampleMenus,
    collapsed: true,
    filter: false,
    automaticToggle: false,
    logo: 'https://via.placeholder.com/120x32/0066cc/ffffff?text=DynUI',
    shortLogo: 'https://via.placeholder.com/32x32/0066cc/ffffff?text=D'
  }
};

export const WithoutFilter: Story = {
  args: {
    items: sampleMenus,
    collapsed: false,
    filter: false,
    automaticToggle: true,
    logo: 'https://via.placeholder.com/120x32/0066cc/ffffff?text=DynUI',
    shortLogo: 'https://via.placeholder.com/32x32/0066cc/ffffff?text=D'
  }
};

export const BasicMenu: Story = {
  args: {
    items: basicMenus,
    collapsed: false,
    filter: false,
    automaticToggle: false
  }
};

export const CustomLiterals: Story = {
  args: {
    items: sampleMenus,
    collapsed: false,
    filter: true,
    automaticToggle: false,
    literals: {
      collapse: 'Minimize Menu',
      expand: 'Maximize Menu',
      search: 'Search menu items...'
    },
    logo: 'https://via.placeholder.com/120x32/28a745/ffffff?text=Custom',
    shortLogo: 'https://via.placeholder.com/32x32/28a745/ffffff?text=C'
  }
};

export const WithBadges: Story = {
  args: {
    items: [
      {
        label: 'Notifications',
        icon: 'dyn-icon-bell',
        badge: { count: 15, color: 'secondary' },
        action: () => console.log('Notifications clicked')
      },
      {
        label: 'Messages',
        icon: 'dyn-icon-envelope',
        badge: { count: 3, color: 'warning' },
        action: () => console.log('Messages clicked')
      },
      {
        label: 'Tasks',
        icon: 'dyn-icon-tasks',
        badge: { count: 8, color: 'success' },
        action: () => console.log('Tasks clicked')
      }
    ],
    collapsed: false,
    filter: false,
    automaticToggle: false
  }
};

export const Vertical: Story = {
  args: {
    items: sampleMenus,
    orientation: 'vertical',
    collapsed: false,
    filter: true,
    automaticToggle: false,
    logo: 'https://via.placeholder.com/120x32/0066cc/ffffff?text=DynUI',
    shortLogo: 'https://via.placeholder.com/32x32/0066cc/ffffff?text=D'
  }
};
