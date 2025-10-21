import type { Meta, StoryObj } from '@storybook/react';
import { DynComponentName } from './DynComponentName';

const meta: Meta<typeof DynComponentName> = {
  title: 'Layout/DynComponentName',
  component: DynComponentName,
  args: {
    p: 'md',
    gap: 'sm',
    children: (
      <>
        <span>Primary content</span>
        <span>Secondary content</span>
      </>
    ),
    style: { display: 'flex', flexDirection: 'column' },
  },
};

export default meta;

type Story = StoryObj<typeof DynComponentName>;

export const Default: Story = {};

export const AsSection: Story = {
  args: {
    as: 'section',
    m: 'lg',
    children: (
      <>
        <h2 style={{ margin: 0 }}>Section heading</h2>
        <p style={{ margin: 0 }}>Content rendered inside a semantic section element.</p>
      </>
    ),
  },
};

export const AsList: Story = {
  args: {
    as: 'ul',
    gap: 'xs',
    p: 'sm',
    style: { listStyle: 'disc', display: 'flex', flexDirection: 'column' },
    children: (
      <>
        <li>Item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </>
    ),
  },
};

export const ResponsiveSpacing: Story = {
  args: {
    as: 'article',
    p: { base: 'sm', md: 'lg' },
    m: { base: '0', lg: 'xl' },
    gap: { base: 'xs', lg: 'md' },
    children: (
      <>
        <h3 style={{ margin: 0 }}>Responsive spacing</h3>
        <p style={{ margin: 0 }}>
          Padding, margin and gap respond to viewport width using Dyn UI spacing tokens.
        </p>
      </>
    ),
  },
};
