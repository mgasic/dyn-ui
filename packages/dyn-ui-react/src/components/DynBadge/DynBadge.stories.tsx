import type { Meta, StoryObj } from '@storybook/react';
import { DynBadge, type DynBadgeProps } from './DynBadge';

const meta: Meta<typeof DynBadge> = {
  title: 'Display/DynBadge',
  component: DynBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'DynBadge component for displaying status indicators, counters, and labels with various styling options.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Numeric value to display in badge',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Badge size variant',
    },
    status: {
      control: 'select',
      options: ['positive', 'negative', 'warning', 'disabled'],
      description: 'Status color variant',
    },
    color: {
      control: 'select',
      options: ['color-01', 'color-02', 'color-03', 'color-04', 'color-05', 'color-06', 'color-07', 'color-08', 'color-09', 'color-10', 'color-11', 'color-12'],
      description: 'Color palette selection',
    },
    showBorder: {
      control: 'boolean',
      description: 'Show white border around badge',
    },
    icon: {
      control: 'text',
      description: 'Icon name or boolean for status-based icons',
    },
    children: {
      control: 'text',
      description: 'Badge content (text)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: 99,
    size: 'medium',
    color: 'color-07'
  },
};

export const StatusVariants: Story = {
  render: () => (
    <>
      <DynBadge status="positive" value={5}>Positive</DynBadge>
      <DynBadge status="negative" value={3}>Negative</DynBadge>
      <DynBadge status="warning" value={10}>Warning</DynBadge>
      <DynBadge status="disabled" value={0}>Disabled</DynBadge>
    </>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <>
      <DynBadge icon="check" status="positive" value={1}>Success</DynBadge>
      <DynBadge icon="close" status="negative">Error</DynBadge>
      <DynBadge icon="warning" status="warning" value={5}>Warning</DynBadge>
      <DynBadge icon={true} status="positive" value={3}>Auto Icon</DynBadge>
    </>
  ),
};

export const BorderVariant: Story = {
  render: () => (
    <>
      <DynBadge value={3} showBorder status="positive">With Border</DynBadge>
      <DynBadge value={7} showBorder color="color-02">Colored Border</DynBadge>
      <DynBadge showBorder color="color-04">Text Only</DynBadge>
    </>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <>
      <DynBadge size="small" value={5}>Small</DynBadge>
      <DynBadge size="medium" value={10}>Medium</DynBadge>
      <DynBadge size="large" value={15}>Large</DynBadge>
    </>
  ),
};

export const TextBadges: Story = {
  render: () => (
    <>
      <DynBadge>New</DynBadge>
      <DynBadge status="positive">Online</DynBadge>
      <DynBadge status="warning">Beta</DynBadge>
      <DynBadge status="negative">Offline</DynBadge>
      <DynBadge color="color-05">Premium</DynBadge>
    </>
  ),
};
