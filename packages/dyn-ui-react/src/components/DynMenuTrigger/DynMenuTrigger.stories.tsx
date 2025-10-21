import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { DynMenu } from '../DynMenu';
import { DynMenuTrigger } from './DynMenuTrigger';

const meta: Meta<typeof DynMenuTrigger> = {
  title: 'Navigation/DynMenuTrigger',
  component: DynMenuTrigger,
  parameters: {
    docs: {
      description: {
        component: `
The **DynMenuTrigger** component exposes the pressable control used by \`DynMenu\` to
open and close submenus. It ships with focus and pressed state styles, supports the
\`as\` prop for polymorphic rendering, and can forward all relevant ARIA attributes.

When you need to compose custom navigation experiences, you can import the trigger
directly or access it via \`DynMenu.Trigger\`.
        `
      }
    }
  },
  argTypes: {
    as: {
      control: false,
      description: 'Optional element or component to render instead of a native button.'
    },
    active: {
      control: { type: 'boolean' },
      description: 'Visually marks the trigger as representing an expanded/open menu.'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable pointer and keyboard interaction with the trigger.'
    },
    onClick: {
      control: false,
      description: 'Click handler invoked when the trigger is activated.'
    }
  },
  args: {
    children: 'Menu trigger'
  }
};

export default meta;
type Story = StoryObj<typeof DynMenuTrigger>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
    children: 'Active trigger'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled trigger'
  }
};

export const AsLink: Story = {
  render: (args) => (
    <DynMenuTrigger {...args}>
      {args.children ?? 'Documentation'}
    </DynMenuTrigger>
  ),
  args: {
    as: 'a',
    href: '#docs',
    children: 'Link trigger'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Render the trigger as an anchor element to align with navigation semantics while retaining focus and pressed styling.'
      }
    }
  }
};

export const WithDynMenu: Story = {
  render: () => (
    <DynMenu
      items={[
        {
          label: 'Workspace',
          children: [
            { label: 'Overview', action: 'workspace-overview' },
            { label: 'Members', action: 'workspace-members' }
          ]
        },
        {
          label: 'Billing',
          children: [
            { label: 'Plans', action: 'billing-plans' },
            { label: 'Invoices', action: 'billing-invoices' }
          ]
        }
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'DynMenu composes `DynMenuTrigger` for every top-level item. Custom triggers can be passed down by re-exporting `DynMenuTrigger` from the menu module.'
      }
    }
  }
};
