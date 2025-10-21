/**
 * DynMenu Storybook Stories
 * Interactive examples and documentation for navigation menu component
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynMenu } from './DynMenu';
import type { MenuItem } from './DynMenu.types';

const meta: Meta<typeof DynMenu> = {
  title: 'Navigation/DynMenu',
  component: DynMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The DynMenu component renders a simple hierarchical menu bar. Provide an array of menu
items (or the legacy \`menus\` prop) and optionally change the orientation between
horizontal and vertical layouts. Sub-items appear in a fly-out menu and can trigger the
\`onAction\` callback when they expose string-based actions.

DynMenu also re-exports the \`DynMenuTrigger\` component it uses internally for each
top-level item. This lets you compose custom trigger UIs while retaining focus and
keyboard behaviour managed by DynMenu.

### Accessibility

- Focus returns to the last interacted trigger whenever a submenu closes.
- Submenu focus is roved programmatically so items receive \`tabIndex\` and \`aria-activedescendant\` updates while arrowing.
- Escape collapses any open submenu and restores focus to the originating trigger.

### Keyboard interactions

- \`ArrowRight\` / \`ArrowLeft\` cycle across top-level triggers when the menu is horizontal.
- \`ArrowDown\` / \`ArrowUp\` move focus between submenu items.
- \`Home\` / \`End\` jump to the first or last enabled item.
- \`Enter\` / \`Space\` toggle the active submenu.
- \`Escape\` collapses the submenu and returns focus to its trigger.

## Usage

\`\`\`tsx
import { DynMenu, DynMenuTrigger } from '@dyn-ui/react';

const menuItems = [
  {
    label: 'Dashboard',
    subItems: [
      { label: 'Overview', action: () => { /* track navigation */ } },
      { label: 'Reports', action: 'open-reports' }
    ]
  },
  { label: 'Settings' }
];

<DynMenu items={menuItems} orientation="horizontal" />

<DynMenuTrigger aria-haspopup="menu">Open resources</DynMenuTrigger>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    items: {
      description: 'Collection of top-level menu entries to render.',
      control: { type: 'object' }
    },
    menus: {
      description: 'Legacy alias for `items`. Used only when `items` is undefined.',
      control: { type: 'object' }
    },
    orientation: {
      description: 'Orientation of the menu bar.',
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical']
    },
    onAction: {
      description: 'Invoked with the string action value when a submenu item defines one.',
      action: 'action'
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynMenu>;

const hierarchicalItems: MenuItem[] = [
  {
    label: 'Dashboard',
    subItems: [
      { label: 'Overview', action: () => { /* handled by consumer */ } },
      { label: 'Reports', action: 'open-reports' }
    ]
  },
  {
    label: 'Projects',
    subItems: [
      { label: 'Active', action: () => { /* handled by consumer */ } },
      { label: 'Archived', disabled: true }
    ]
  },
  { label: 'Settings' }
];

const actionItems: MenuItem[] = [
  {
    label: 'Teams',
    subItems: [
      { label: 'Engineering', action: 'team-engineering' },
      { label: 'Design', action: 'team-design' }
    ]
  },
  {
    label: 'Help',
    subItems: [
      { label: 'Documentation', action: 'open-docs' },
      { label: 'Contact support', action: 'open-support' }
    ]
  }
];

export const Default: Story = {
  args: {
    items: hierarchicalItems
  }
};

export const Vertical: Story = {
  args: {
    items: hierarchicalItems,
    orientation: 'vertical'
  }
};

export const UsingMenusProp: Story = {
  args: {
    menus: hierarchicalItems
  }
};

export const WithActionHandler: Story = {
  args: {
    items: actionItems
  }
};
