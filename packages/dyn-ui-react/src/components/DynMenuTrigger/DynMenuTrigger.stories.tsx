import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynMenuTrigger } from './DynMenuTrigger';

const meta: Meta<typeof DynMenuTrigger> = {
  title: 'Navigation/DynMenuTrigger',
  component: DynMenuTrigger,
  parameters: {
    docs: {
      description: {
        component: [
          'The **DynMenuTrigger** component renders the interactive control used by `DynMenu` ',
          'for each top-level item. It is exported alongside `DynMenu` so consumers can compose ',
          'standalone triggers or provide custom trigger elements when integrating DynMenu into ',
          'complex layouts.\n\n',
          '### Usage\n\n',
          '```tsx\n',
          "import { DynMenu, DynMenuTrigger } from '@dyn-ui/react';\n\n",
          '<DynMenuTrigger aria-haspopup="menu">Open menu</DynMenuTrigger>\n\n',
          '// DynMenu internally renders DynMenuTrigger for every top-level item,\n',
          '// forwarding refs and state so you can style or wrap the trigger when needed.\n',
          '```\n\n',
          'The trigger exposes `isOpen`, `disabled`, and all ARIA attributes required for accessible ',
          'menu buttons. Hover, focus, and pressed states are styled by default and can be extended ',
          'via the `className` prop.',
        ].join(''),
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Marks the trigger as active/open.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables pointer and keyboard interaction.',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler invoked when the trigger is activated.',
    },
    as: {
      control: 'text',
      description: 'Custom element to render instead of a button.',
    },
  },
  args: {
    children: 'Menu trigger',
    'aria-haspopup': 'menu',
  },
};

export default meta;
type Story = StoryObj<typeof DynMenuTrigger>;

export const Default: Story = {};

export const OpenState: Story = {
  args: {
    isOpen: true,
    children: 'Products',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable',
  },
};

export const CustomElement: Story = {
  args: {
    as: 'a',
    href: '#',
    role: 'menuitem',
    children: 'Link trigger',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Render DynMenuTrigger as an anchor element while preserving accessibility attributes and focus behaviour.',
      },
    },
  },
};
