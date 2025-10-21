import type { Meta, StoryObj } from '@storybook/react';
import DynIcon from './DynIcon';
import { IconDictionaryProvider, DEFAULT_ICON_DICTIONARY } from '../../providers/IconDictionaryProvider';
import { DYN_ICON_SEMANTIC_COLORS, DYN_ICON_VARIANTS } from './DynIcon.types';
import { iconRegistry } from './icons';

const COLOR_CONTROL_OPTIONS = [undefined, ...DYN_ICON_SEMANTIC_COLORS] as const;
const GALLERY_ICONS = Array.from(
  new Set([
    ...Object.keys(DEFAULT_ICON_DICTIONARY),
    ...Object.keys(iconRegistry),
    'sprite:#check',
  ])
);

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
    variant: {
      control: 'select',
      options: [...DYN_ICON_VARIANTS],
    },
    color: {
      control: 'select',
      options: COLOR_CONTROL_OPTIONS,
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
    variant: 'default',
    color: undefined,
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
    variant: 'accent',
  },
};

export const FontAwesome: Story = {
  args: {
    icon: 'fa-solid fa-user',
    size: 'medium',
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
    size: 'large',
    variant: 'accent',
  },
};

export const Gallery: Story = {
  args: {
    size: 'medium',
    variant: 'default',
    color: undefined,
  },
  render: args => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--dyn-space-md, 1rem)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
      }}
    >
      {GALLERY_ICONS.map(iconKey => (
        <div
          key={iconKey}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <DynIcon
            {...args}
            icon={iconKey}
            aria-label={`${iconKey} icon`}
          />
          <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>{iconKey}</span>
        </div>
      ))}
    </div>
  ),
};
