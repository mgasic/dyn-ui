import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynMenuItem } from './DynMenuItem';

const meta: Meta<typeof DynMenuItem> = {
  title: 'Navigation/DynMenuItem',
  component: DynMenuItem,
  parameters: {
    docs: {
      description: {
        component:
          'Low-level primitive used by `DynMenu` to render interactive entries with accessible button semantics.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible text label rendered inside the menu item.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the menu item preventing pointer and keyboard activation.',
    },
    loading: {
      control: 'boolean',
      description: 'Marks the menu item as busy. Loading items are rendered inert.',
    },
    active: {
      control: 'boolean',
      description: 'Applies the active visual state.',
    },
    open: {
      control: 'boolean',
      description: 'Reflects whether the parent submenu is open. Used for styling hooks.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynMenuItem>;

export const Default: Story = {
  args: {
    label: 'Dashboard',
  },
};

export const Focused: Story = {
  args: {
    label: 'Projects',
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates keyboard focus styles. The `autoFocus` attribute is forwarded to the underlying button.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Reports',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Syncing…',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading menu items set `aria-busy` and expose a `data-loading` hook for custom indicators.',
      },
    },
  },
};
