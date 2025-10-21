import type { Meta, StoryObj } from '@storybook/react';
import { DynTreeNode } from './DynTreeNode';

type Story = StoryObj<typeof DynTreeNode>;

const meta: Meta<typeof DynTreeNode> = {
  title: 'Layout/DynTreeNode',
  component: DynTreeNode,
  args: {
    gap: 'sm',
    p: 'xs',
    style: {
      border: '1px solid var(--dyn-color-border, #d0d5dd)',
      borderRadius: '0.5rem',
      background: 'var(--dyn-color-background-secondary, #f8fafc)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'DynTreeNode is a lightweight, polymorphic layout primitive designed to wrap DynTreeView items or any nested tree structure. It provides spacing helpers while keeping the DOM semantics minimal.',
      },
    },
  },
};

export default meta;

export const Playground: Story = {
  args: {
    children: 'Tree node content',
  },
};

export const Polymorphic: Story = {
  args: {
    as: 'section',
    children: 'Rendered as a semantic section',
    p: 'md',
    gap: 'md',
  },
};

export const NestedComposition: Story = {
  render: () => (
    <DynTreeNode direction="column" gap="md">
      <DynTreeNode>
        <strong>Design System</strong>
      </DynTreeNode>
      <DynTreeNode direction="column" gap="sm" style={{ marginLeft: '1.5rem', border: 'none', background: 'transparent' }}>
        <DynTreeNode style={{ border: 'none', background: 'transparent' }}>Foundations</DynTreeNode>
        <DynTreeNode style={{ border: 'none', background: 'transparent' }}>Components</DynTreeNode>
        <DynTreeNode direction="column" gap="xs" style={{ marginLeft: '1rem', border: 'none', background: 'transparent' }}>
          <DynTreeNode style={{ border: 'none', background: 'transparent' }}>Inputs</DynTreeNode>
          <DynTreeNode style={{ border: 'none', background: 'transparent' }}>Data Display</DynTreeNode>
        </DynTreeNode>
      </DynTreeNode>
    </DynTreeNode>
  ),
};
