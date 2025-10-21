/**
 * DynToolbar Storybook Stories
 * Interactive examples for toolbar component with responsive overflow and variants
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useRef } from 'react';
import { DynToolbar } from './DynToolbar';
import { ToolbarItem, DynToolbarRef } from './DynToolbar.types';
import React from 'react';

const meta: Meta<typeof DynToolbar> = {
  title: 'Navigation/DynToolbar',
  component: DynToolbar,
  args: {
    orientation: 'horizontal'
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DynToolbar component provides a flexible toolbar system with:

- **Responsive Design** - Automatically handles overflow with mobile-friendly menu
- **Multiple Variants** - Default, minimal, and floating styles
- **Flexible Items** - Buttons, dropdowns, search, separators, and custom components
- **Accessibility** - Full keyboard navigation and ARIA support
- **Positioning** - Top, bottom, fixed positioning options
- **Overflow Management** - Smart responsive overflow with threshold control
- **Theming** - Complete CSS custom properties support

## Usage

\`\`\`tsx
import { DynToolbar } from '@dyn-ui/react';

const toolbarItems = [
  { id: 'new', label: 'New', icon: 'add', action: () => console.log('New') },
  { id: 'save', label: 'Save', icon: 'save', action: () => console.log('Save') },
  { id: 'sep1', type: 'separator' },
  { id: 'search', type: 'search', label: 'Search...' }
];

<DynToolbar items={toolbarItems} />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      description: 'Visual style variant of the toolbar',
      control: { type: 'select' },
      options: ['default', 'minimal', 'floating']
    },
    size: {
      description: 'Size of the toolbar and its items',
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    position: {
      description: 'Position of the toolbar',
      control: { type: 'select' },
      options: ['top', 'bottom', 'fixed-top', 'fixed-bottom']
    },
    responsive: {
      description: 'Enable responsive overflow behavior',
      control: { type: 'boolean' }
    },
    overflowMenu: {
      description: 'Show overflow menu for items that don\'t fit',
      control: { type: 'boolean' }
    },
    overflowThreshold: {
      description: 'Minimum items before overflow kicks in',
      control: { type: 'number', min: 1, max: 10 }
    },
    showLabels: {
      description: 'Show text labels on toolbar items',
      control: { type: 'boolean' }
    },
    orientation: {
      description: 'Orientation of the toolbar for roving focus',
      control: { type: 'select' },
      options: ['horizontal', 'vertical']
    },
    onItemClick: {
      description: 'Callback fired when toolbar item is clicked',
      action: 'itemClicked'
    },
    onOverflowToggle: {
      description: 'Callback fired when overflow menu is toggled',
      action: 'overflowToggled'
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynToolbar>;

// Sample toolbar items
const basicItems: ToolbarItem[] = [
  {
    id: 'new',
    label: 'New',
    icon: '➕',
    tooltip: 'Create new item',
    action: () => console.log('New clicked')
  },
  {
    id: 'save',
    label: 'Save',
    icon: '💾',
    tooltip: 'Save current work',
    action: () => console.log('Save clicked')
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: '✏️',
    tooltip: 'Edit selected item',
    action: () => console.log('Edit clicked')
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: '🗑️',
    tooltip: 'Delete selected item',
    disabled: true,
    action: () => console.log('Delete clicked')
  }
];

const advancedItems: ToolbarItem[] = [
  {
    id: 'file',
    label: 'File',
    icon: '📁',
    type: 'dropdown',
    items: [
      { id: 'new-file', label: 'New File', icon: '📄', action: () => console.log('New File') },
      { id: 'open-file', label: 'Open File', icon: '📂', action: () => console.log('Open File') },
      { id: 'save-file', label: 'Save File', icon: '💾', action: () => console.log('Save File') }
    ]
  },
  {
    id: 'edit-menu',
    label: 'Edit',
    icon: '✂️',
    type: 'dropdown',
    items: [
      { id: 'cut', label: 'Cut', icon: '✂️', action: () => console.log('Cut') },
      { id: 'copy', label: 'Copy', icon: '📋', action: () => console.log('Copy') },
      { id: 'paste', label: 'Paste', icon: '📄', action: () => console.log('Paste') }
    ]
  },
  {
    id: 'sep1',
    type: 'separator'
  },
  {
    id: 'undo',
    label: 'Undo',
    icon: '↶',
    action: () => console.log('Undo')
  },
  {
    id: 'redo',
    label: 'Redo',
    icon: '↷',
    action: () => console.log('Redo')
  },
  {
    id: 'sep2',
    type: 'separator'
  },
  {
    id: 'search',
    type: 'search',
    label: 'Search documents...'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    badge: { count: 3 },
    action: () => console.log('Notifications')
  }
];

const manyItems: ToolbarItem[] = [
  { id: 'item1', label: 'Dashboard', icon: '📊', action: () => console.log('Dashboard') },
  { id: 'item2', label: 'Analytics', icon: '📈', action: () => console.log('Analytics') },
  { id: 'item3', label: 'Reports', icon: '📋', action: () => console.log('Reports') },
  { id: 'item4', label: 'Settings', icon: '⚙️', action: () => console.log('Settings') },
  { id: 'item5', label: 'Users', icon: '👥', action: () => console.log('Users') },
  { id: 'item6', label: 'Messages', icon: '💬', badge: { count: 5 }, action: () => console.log('Messages') },
  { id: 'item7', label: 'Calendar', icon: '📅', action: () => console.log('Calendar') },
  { id: 'item8', label: 'Tasks', icon: '✅', action: () => console.log('Tasks') },
  { id: 'item9', label: 'Files', icon: '📁', action: () => console.log('Files') },
  { id: 'item10', label: 'Help', icon: '❓', action: () => console.log('Help') }
];

export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    size: 'medium',
    showLabels: true
  }
};

export const Minimal: Story = {
  args: {
    items: basicItems,
    variant: 'minimal',
    showLabels: true
  }
};

export const Floating: Story = {
  args: {
    items: basicItems,
    variant: 'floating',
    position: 'bottom',
    showLabels: true
  }
};

export const Small: Story = {
  args: {
    items: basicItems,
    size: 'small',
    showLabels: true
  }
};

export const Large: Story = {
  args: {
    items: basicItems,
    size: 'large',
    showLabels: true
  }
};

export const IconsOnly: Story = {
  args: {
    items: basicItems,
    showLabels: false
  }
};

export const WithDropdowns: Story = {
  args: {
    items: advancedItems,
    showLabels: true
  }
};

export const ResponsiveOverflow: Story = {
  args: {
    items: manyItems,
    responsive: true,
    overflowMenu: true,
    overflowThreshold: 4,
    showLabels: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Resize the viewport to see responsive overflow behavior. Items that don\'t fit will move to the overflow menu.'
      }
    }
  }
};

export const FixedTop: Story = {
  args: {
    items: basicItems,
    position: 'fixed-top',
    showLabels: true
  },
  parameters: {
    layout: 'fullscreen'
  }
};

export const FixedBottom: Story = {
  args: {
    items: basicItems,
    position: 'fixed-bottom',
    variant: 'floating',
    showLabels: false
  },
  parameters: {
    layout: 'fullscreen'
  }
};

export const CustomComponents: Story = {
  args: {
    items: [
      { id: 'save', label: 'Save', icon: '💾', action: () => console.log('Save') },
      { id: 'sep1', type: 'separator' },
      {
        id: 'theme-picker',
        type: 'custom',
        component: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="theme-select" style={{ fontSize: '14px', color: '#666' }}>Theme:</label>
            <select id="theme-select" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        )
      },
      { id: 'sep2', type: 'separator' },
      {
        id: 'user-avatar',
        type: 'custom',
        component: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            borderRadius: '20px',
            backgroundColor: '#f0f0f0'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>JD</div>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>John Doe</span>
          </div>
        )
      }
    ],
    showLabels: true
  }
};

export const InteractiveExample: Story = {
  render: (args) => {
    const [items, setItems] = useState<ToolbarItem[]>([
      { id: 'counter', label: 'Count: 0', icon: '🔢' },
      { id: 'increment', label: 'Add', icon: '➕', action: () => {} },
      { id: 'decrement', label: 'Subtract', icon: '➖', action: () => {} },
      { id: 'reset', label: 'Reset', icon: '🔄', action: () => {} }
    ]);

    const [count, setCount] = useState(0);

    // Update items with current count and actions
    const updatedItems = items.map(item => {
      switch (item.id) {
        case 'counter':
          return { ...item, label: `Count: ${count}` };
        case 'increment':
          return { ...item, action: () => setCount(prev => prev + 1) };
        case 'decrement':
          return { ...item, action: () => setCount(prev => prev - 1) };
        case 'reset':
          return { ...item, action: () => setCount(0) };
        default:
          return item;
      }
    });

    return (
      <div>
        <DynToolbar {...args} items={updatedItems} />
        <div style={{ marginTop: '20px', padding: '20px', textAlign: 'center' }}>
          <h3>Interactive Toolbar Demo</h3>
          <p>Click the toolbar buttons to interact with the counter!</p>
          <div style={{ fontSize: '2em', margin: '20px 0' }}>{count}</div>
        </div>
      </div>
    );
  },
  args: {
    showLabels: true
  }
};

export const ImperativeAPI: Story = {
  render: (args) => {
    const toolbarRef = useRef<DynToolbarRef>(null);

    return (
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <button onClick={() => toolbarRef.current?.openOverflow()}>Open Overflow</button>
          <button onClick={() => toolbarRef.current?.closeOverflow()}>Close Overflow</button>
          <button onClick={() => toolbarRef.current?.toggleOverflow()}>Toggle Overflow</button>
          <button onClick={() => toolbarRef.current?.refreshLayout()}>Refresh Layout</button>
        </div>
        <DynToolbar
          {...args}
          ref={toolbarRef}
          items={manyItems}
          responsive={true}
          overflowMenu={true}
          overflowThreshold={3}
        />
      </div>
    );
  }
};

export const VariantShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Default Variant</h4>
        <DynToolbar items={basicItems} variant="default" showLabels={true} />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Minimal Variant</h4>
        <DynToolbar items={basicItems} variant="minimal" showLabels={true} />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Floating Variant</h4>
        <DynToolbar items={basicItems} variant="floating" showLabels={false} />
      </div>
    </div>
  )
};

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Small Size</h4>
        <DynToolbar items={basicItems} size="small" showLabels={true} />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Medium Size</h4>
        <DynToolbar items={basicItems} size="medium" showLabels={true} />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Large Size</h4>
        <DynToolbar items={basicItems} size="large" showLabels={true} />
      </div>
    </div>
  )
};

export const AccessibilityDemo: Story = {
  args: {
    items: [
      {
        id: 'accessible-item',
        label: 'Accessible Item',
        icon: '♿',
        tooltip: 'This item demonstrates proper accessibility features',
        action: () => alert('Accessibility features: ARIA labels, keyboard navigation, focus management')
      },
      { id: 'sep1', type: 'separator' },
      {
        id: 'keyboard-nav',
        label: 'Tab Navigation',
        icon: '⌨️',
        tooltip: 'Use Tab to navigate, Enter/Space to activate',
        action: () => alert('Try using Tab, Enter, and Space keys to navigate!')
      },
      {
        id: 'screen-reader',
        label: 'Screen Reader',
        icon: '🔊',
        tooltip: 'Optimized for screen readers with proper ARIA attributes',
        action: () => alert('This toolbar is optimized for screen readers!')
      }
    ],
    showLabels: true
  },
  parameters: {
    docs: {
      description: {
        story: 'This toolbar demonstrates accessibility features including keyboard navigation, ARIA attributes, and screen reader support. Try using Tab, Enter, and Space keys to navigate.'
      }
    }
  }
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [formats, setFormats] = useState({ bold: true, italic: false, underline: false });
    const toggleFormat = (key: 'bold' | 'italic' | 'underline') => {
      setFormats(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const items: ToolbarItem[] = [
      {
        id: 'bold',
        label: 'Bold',
        icon: <strong>B</strong>,
        tooltip: 'Toggle bold text',
        state: formats.bold ? 'on' : 'off',
        action: () => toggleFormat('bold')
      },
      {
        id: 'italic',
        label: 'Italic',
        icon: <em>I</em>,
        tooltip: 'Toggle italic text',
        state: formats.italic ? 'on' : 'off',
        action: () => toggleFormat('italic')
      },
      {
        id: 'underline',
        label: 'Underline',
        icon: <span style={{ textDecoration: 'underline' }}>U</span>,
        tooltip: 'Toggle underline text',
        state: formats.underline ? 'on' : 'off',
        action: () => toggleFormat('underline')
      },
      { id: 'separator-1', type: 'separator' },
      {
        id: 'find',
        type: 'search',
        label: 'Search in document'
      },
      {
        id: 'comment',
        label: 'Comment',
        icon: '💬',
        tooltip: 'Add a comment',
        badge: { count: 2 },
        action: () => console.log('Add comment')
      },
      {
        id: 'more',
        label: 'More',
        type: 'dropdown',
        items: [
          { id: 'highlight', label: 'Highlight', action: () => console.log('Highlight') },
          { id: 'strikethrough', label: 'Strikethrough', action: () => console.log('Strikethrough') },
          { id: 'clear-formatting', label: 'Clear formatting', action: () => console.log('Clear formatting') }
        ]
      }
    ];

    return (
      <DynToolbar
        items={items}
        showLabels
        responsive={false}
        overflowMenu={false}
        orientation="horizontal"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard roving focus demo — use Arrow keys, Home, and End to move between controls. Toggle buttons expose data-state and aria-pressed.'
      }
    }
  }
};
