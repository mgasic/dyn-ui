import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect, useRef } from 'react';
import { DynMenuItem } from './DynMenuItem';

const meta: Meta<typeof DynMenuItem> = {
  title: 'Navigation/DynMenu/DynMenuItem',
  component: DynMenuItem,
  args: {
    label: 'Dashboard',
  },
  parameters: {
    docs: {
      description: {
        component: `DynMenuItem exposes the low-level building block used by DynMenu. It preserves button semantics even when rendered as a custom element via the \`as\` prop, handles disabled/loading states, and sets accessibility attributes automatically.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynMenuItem>;

export const Default: Story = {
  args: {
    label: 'Projects',
  },
};

export const Focused: Story = {
  render: (args) => {
    const ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      ref.current?.focus();
    }, []);

    return <DynMenuItem {...args} ref={ref} label="Focused" />;
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    loading: true,
  },
};

export const PolymorphicLink: Story = {
  args: {
    as: 'a',
    href: '#',
    label: 'Link item',
    ariaLabel: 'Link item',
  },
};
