import type { Meta, StoryObj } from '@storybook/react';
import { DynDivider } from './DynDivider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import {
  DYN_DIVIDER_COLORS,
  DYN_DIVIDER_SIZES,
  DYN_DIVIDER_VARIANTS,
  DynDividerProps,
} from './DynDivider.types';

const meta: Meta<typeof DynDivider> = {
  title: 'Components/DynDivider',
  component: DynDivider,
  decorators: [Story => (
    <ThemeProvider initialTheme="light">
      <Story />
    </ThemeProvider>
  )],
  argTypes: {
    children: { control: false },
    variant: {
      control: 'inline-radio',
      options: DYN_DIVIDER_VARIANTS,
    },
    size: {
      control: 'inline-radio',
      options: DYN_DIVIDER_SIZES,
    },
    color: {
      control: 'select',
      options: DYN_DIVIDER_COLORS,
    },
    labelPosition: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
  },
  args: {
    variant: 'horizontal',
    size: 'md',
    color: 'default',
    label: 'Section Title',
    labelPosition: 'center',
  } satisfies Partial<DynDividerProps>,
};

export default meta;

type Story = StoryObj<typeof DynDivider>;

export const Playground: Story = {
  args: {
    'aria-label': 'Section Title',
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Divider',
  },
};

export const Vertical: Story = {
  args: {
    variant: 'vertical',
    label: 'Timeline',
    labelPosition: 'right',
    size: 'lg',
    color: 'primary',
    'aria-label': 'Timeline divider',
  },
  parameters: {
    layout: 'centered',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    label: 'Continue exploring',
    'aria-label': 'Continue exploring',
  },
};
