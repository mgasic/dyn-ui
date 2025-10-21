import type { Meta, StoryObj } from '@storybook/react';
import { DynUI } from './DynUI';

const meta: Meta<typeof DynUI> = {
  title: 'Components/Layout/DynUI',
  component: DynUI,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DynUI is a polymorphic wrapper around DynBox that ships with semantic defaults,
responsive spacing helpers, and tone presets. Use it when you need a
high-level layout surface that can adapt across breakpoints without custom CSS.
        `,
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'HTML element DynUI should render as.',
    },
    tone: {
      control: 'radio',
      options: ['surface', 'muted', 'elevated', 'inverse'],
      description: 'Theme preset applied through CSS variables.',
    },
    p: {
      control: 'select',
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Base padding token. Responsive objects are also supported.',
    },
    gap: {
      control: 'select',
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Space between children when DynUI is used as a flex/grid container.',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    children: (
      <div>
        <h3>Composable layout surface</h3>
        <p>DynUI forwards all DynBox props while adding tone and responsive spacing helpers.</p>
      </div>
    ),
    tone: 'surface',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: 'section',
    p: 'lg',
  },
};

export const TonePresets: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <DynUI tone="surface" p="md">
        <strong>Surface</strong>
        <p>Inherits the design-system surface styling.</p>
      </DynUI>
      <DynUI tone="muted" p="md">
        <strong>Muted</strong>
        <p>Soft neutral background with subtle border.</p>
      </DynUI>
      <DynUI tone="elevated" p="md">
        <strong>Elevated</strong>
        <p>Surface background with a prominent shadow.</p>
      </DynUI>
      <DynUI tone="inverse" p="md">
        <strong>Inverse</strong>
        <p>High contrast surface for dark hero sections.</p>
      </DynUI>
    </div>
  ),
};

export const SemanticLayout: Story = {
  render: () => (
    <DynUI as="article" p="lg" tone="elevated">
      <header style={{ marginBottom: '1rem' }}>
        <h2>Semantic article</h2>
        <p>DynUI defaults to a section, but any landmark element can be used.</p>
      </header>
      <p>
        Combine `as` with the responsive spacing props (`p`, `px`, `py`, `gap`, etc.) to
        compose accessible layouts quickly.
      </p>
    </DynUI>
  ),
};

export const ResponsiveSpacing: Story = {
  render: () => (
    <DynUI
      tone="muted"
      p={{ base: 'sm', md: 'xl' }}
      px={{ sm: 'lg' }}
      gap={{ base: 'sm', md: 'lg' }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <p>The padding grows at the `md` breakpoint and beyond.</p>
      <p>Horizontal padding bumps to `lg` on small screens and larger.</p>
      <p>Gap increases to `lg` on medium screens.</p>
    </DynUI>
  ),
};
