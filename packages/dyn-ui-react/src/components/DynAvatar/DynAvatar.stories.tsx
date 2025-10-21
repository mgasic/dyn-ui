import type { Meta, StoryObj } from '@storybook/react';
import { DynAvatar } from './DynAvatar';
import type { DynAvatarProps } from './DynAvatar.types';

const meta: Meta<typeof DynAvatar> = {
  title: 'Components/DynAvatar',
  component: DynAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar component aligned with design token system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Avatar size using design token scale',
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square', 'rounded'],
      description: 'Avatar shape variant',
    },
    variant: {
      control: { type: 'select' },
      options: ['subtle', 'solid', 'outline'],
      description: 'Visual treatment for avatar background',
    },
    color: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      description: 'Semantic color token applied to the avatar background',
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'busy', 'away'],
      description: 'Status indicator',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Error state',
    },
  },
};

export default meta;
type Story = StoryObj<DynAvatarProps>;

export const Default: Story = {
  args: {
    alt: 'User Avatar',
    initials: 'JD',
    size: 'md',
    variant: 'subtle',
    color: 'neutral',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'John Doe',
    size: 'md',
    variant: 'subtle',
    color: 'neutral',
  },
};

export const Interactive: Story = {
  args: {
    alt: 'Clickable Avatar',
    initials: 'CU',
    size: 'lg',
    onClick: () => alert('Avatar clicked!'),
  },
};

export const Loading: Story = {
  args: {
    alt: 'Loading Avatar',
    loading: true,
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <DynAvatar {...args} size="xs" alt="XS" initials="XS" />
      <DynAvatar {...args} size="sm" alt="SM" initials="SM" />
      <DynAvatar {...args} size="md" alt="MD" initials="MD" />
      <DynAvatar {...args} size="lg" alt="LG" initials="LG" />
      <DynAvatar {...args} size="xl" alt="XL" initials="XL" />
    </div>
  ),
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'All available sizes using design token scale.',
      },
    },
  },
};

export const AllStatuses: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <DynAvatar {...args} status="online" alt="Online" initials="ON" />
      <DynAvatar {...args} status="away" alt="Away" initials="AW" />
      <DynAvatar {...args} status="busy" alt="Busy" initials="BU" />
      <DynAvatar {...args} status="offline" alt="Offline" initials="OF" />
    </div>
  ),
  args: {
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'All status indicators with semantic meaning.',
      },
    },
  },
};

export const VariantStyles: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <DynAvatar {...args} variant="subtle" alt="Subtle" initials="SU" />
      <DynAvatar {...args} variant="solid" alt="Solid" initials="SO" />
      <DynAvatar {...args} variant="outline" alt="Outline" initials="OU" />
    </div>
  ),
  args: {
    color: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'All visual treatments available for the avatar background.',
      },
    },
  },
};

export const SemanticColors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <DynAvatar {...args} color="neutral" alt="Neutral" initials="NE" />
      <DynAvatar {...args} color="primary" alt="Primary" initials="PR" />
      <DynAvatar {...args} color="secondary" alt="Secondary" initials="SE" />
      <DynAvatar {...args} color="success" alt="Success" initials="SU" />
      <DynAvatar {...args} color="warning" alt="Warning" initials="WA" />
      <DynAvatar {...args} color="danger" alt="Danger" initials="DA" />
      <DynAvatar {...args} color="info" alt="Info" initials="IN" />
    </div>
  ),
  args: {
    variant: 'subtle',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Semantic background colors aligned with the design token palette.',
      },
    },
  },
};
