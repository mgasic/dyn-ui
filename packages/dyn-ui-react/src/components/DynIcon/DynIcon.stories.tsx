import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import DynIcon from './DynIcon';
import { IconDictionaryProvider } from '../../providers/IconDictionaryProvider';

const meta: Meta<typeof DynIcon> = {
  title: 'Components/DynIcon',
  component: DynIcon,
  decorators: [
    Story => (
      <IconDictionaryProvider>
        <Story />
      </IconDictionaryProvider>
    ),
  ],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Dictionary key, class string, or icon identifier',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    tone: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', undefined],
    },
    spin: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    icon: 'ok',
    size: 'medium',
    spin: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof DynIcon>;

export const Playground: Story = {};

export const RegistryIcon: Story = {
  args: {
    icon: 'check',
    size: 'large',
    tone: 'info',
  },
};

export const FontAwesome: Story = {
  args: {
    icon: 'fa-solid fa-user',
    size: 'medium',
    tone: undefined,
  },
};

export const CustomNode: Story = {
  render: args => (
    <DynIcon
      {...args}
      icon={<span style={{ fontSize: '0.75rem', fontWeight: 600 }}>AB</span>}
    />
  ),
  args: {
    tone: 'success',
    size: 'large',
  },
};
