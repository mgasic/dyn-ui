import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { DynBreadcrumb } from './DynBreadcrumb';
import { DynBreadcrumbItem } from '../DynBreadcrumbItem';
import type { BreadcrumbItem } from './DynBreadcrumb.types';

const meta = {
  title: 'Components/DynBreadcrumb',
  component: DynBreadcrumb,
  subcomponents: { DynBreadcrumbItem },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Navigation breadcrumb component with accessibility support and responsive behavior.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    separator: {
      control: 'select',
      options: ['slash', 'chevron', 'arrow', 'dot', 'custom'],
      description: 'Separator style',
    },
    maxItems: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Maximum items before collapsing',
    },
    showEllipsis: {
      control: 'boolean',
      description: 'Show ellipsis when collapsed',
    },
    enableStructuredData: {
      control: 'boolean',
      description: 'Enable Schema.org structured data',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DynBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'current', label: 'Current Page', current: true },
];

const longItems: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'category', label: 'Category', href: '/category' },
  { id: 'subcategory', label: 'Subcategory', href: '/category/subcategory' },
  { id: 'type', label: 'Product Type', href: '/category/subcategory/type' },
  { id: 'brand', label: 'Brand', href: '/category/subcategory/type/brand' },
  { id: 'model', label: 'Model', href: '/category/subcategory/type/brand/model' },
  { id: 'current', label: 'Current Product', current: true },
];

const itemsWithIcons: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: '🏠' },
  { id: 'docs', label: 'Documentation', href: '/docs', icon: '📚' },
  { id: 'api', label: 'API Reference', href: '/docs/api', icon: '⚙️' },
  { id: 'current', label: 'Components', current: true, icon: '🧩' },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
};

export const Separators: Story = {
  args: {
    items: basicItems,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '320px' }}>
      <div>
        <h3>Slash (Default)</h3>
        <DynBreadcrumb items={basicItems} separator="slash" />
      </div>
      <div>
        <h3>Chevron</h3>
        <DynBreadcrumb items={basicItems} separator="chevron" />
      </div>
      <div>
        <h3>Arrow</h3>
        <DynBreadcrumb items={basicItems} separator="arrow" />
      </div>
      <div>
        <h3>Dot</h3>
        <DynBreadcrumb items={basicItems} separator="dot" />
      </div>
      <div>
        <h3>Custom</h3>
        <DynBreadcrumb
          items={basicItems}
          separator="custom"
          customSeparator={<span style={{ color: '#475569' }}>→</span>}
        />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    items: basicItems,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '320px' }}>
      <div>
        <h3>Small</h3>
        <DynBreadcrumb items={basicItems} size="small" />
      </div>
      <div>
        <h3>Medium</h3>
        <DynBreadcrumb items={basicItems} size="medium" />
      </div>
      <div>
        <h3>Large</h3>
        <DynBreadcrumb items={basicItems} size="large" />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
  },
};

export const LongPath: Story = {
  args: {
    items: longItems,
  },
};

export const CollapsedPath: Story = {
  args: {
    items: longItems,
    maxItems: 4,
    showEllipsis: true,
  },
};

export const WithoutEllipsis: Story = {
  args: {
    items: longItems,
    maxItems: 4,
    showEllipsis: false,
  },
};

export const StructuredData: Story = {
  args: {
    items: basicItems,
    enableStructuredData: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Includes Schema.org structured data for better SEO.',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    items: basicItems,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: args => (
    <div data-theme="dark" style={{ padding: '2rem', background: '#0f172a' }}>
      <DynBreadcrumb {...args} />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  args: {
    items: longItems,
    maxItems: 5,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Automatically collapses on smaller screens and maintains comfortable touch targets.',
      },
    },
  },
};

export const ItemChildrenWithSeparator: Story = {
  render: () => (
    <DynBreadcrumb separator="custom" customSeparator={<span aria-hidden="true">|</span>}>
      <DynBreadcrumb.Item href="/" icon="🏠" aria-label="Go to home">
        Home
      </DynBreadcrumb.Item>
      <DynBreadcrumb.Item href="/products" aria-label="Browse products">
        Products
      </DynBreadcrumb.Item>
      <DynBreadcrumb.Item as="button" onClick={() => {}} disabled aria-label="Disabled action">
        Disabled
      </DynBreadcrumb.Item>
      <DynBreadcrumb.Item current>Current View</DynBreadcrumb.Item>
    </DynBreadcrumb>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'DynBreadcrumb items can be composed manually with `DynBreadcrumb.Item`, supporting custom separators, disabled states, and polymorphic rendering.',
      },
    },
  },
};

export const Accessibility: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'section', label: 'Accessible Section', href: '/accessible' },
      { id: 'current', label: 'Current Accessible Page', current: true },
    ],
    navigationLabel: 'Main page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessible navigation labeling and semantic markup.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    items: longItems,
    maxItems: 3,
  },
  render: (args) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
      <DynBreadcrumb
        {...args}
        expanded={expanded}
        onEllipsisClick={() => setExpanded(true)}
        onItemClick={(item, event) => {
          event.preventDefault();
          // eslint-disable-next-line no-alert
          alert(`Navigating to: ${item.label}`);
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with controlled expansion and custom click handling.',
      },
    },
  },
};
