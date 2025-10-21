import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
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
  render: () => {
    const nestedStyles = {
      '--dyn-tree-node-nested-offset': '1.5rem',
      '--dyn-tree-node-nested-gap': '0.75rem',
    } as CSSProperties;

    return (
      <DynTreeNode direction="column" gap="md" style={nestedStyles}>
        <DynTreeNode>
          <strong>Design System</strong>
        </DynTreeNode>
        <DynTreeNode direction="column" gap="sm">
          <DynTreeNode>Foundations</DynTreeNode>
          <DynTreeNode>Components</DynTreeNode>
          <DynTreeNode direction="column" gap="xs">
            <DynTreeNode>Inputs</DynTreeNode>
            <DynTreeNode>Data Display</DynTreeNode>
          </DynTreeNode>
        </DynTreeNode>
      </DynTreeNode>
    );
  },
};

export const HierarchicalLayout: Story = {
  render: () => {
    const hierarchyStyles = {
      '--dyn-tree-node-nested-offset': '1.25rem',
      '--dyn-tree-node-nested-padding': '0.5rem',
      '--dyn-tree-node-nested-gap': '1rem',
      border: '1px solid var(--dyn-color-border-muted, rgba(15, 23, 42, 0.12))',
      borderRadius: '0.75rem',
      background: 'var(--dyn-color-surface-subtle, rgba(248, 250, 252, 0.75))',
      padding: '1.25rem',
    } as CSSProperties;

    return (
      <DynTreeNode direction="column" gap="sm" style={hierarchyStyles}>
        <DynTreeNode as="header" justify="space-between" px="sm" py="xs">
          <strong>Team Spaces</strong>
          <span style={{ color: 'var(--dyn-color-text-muted, #475569)' }}>6 collections</span>
        </DynTreeNode>
        <DynTreeNode direction="column" gap="xs">
          <DynTreeNode>
            <span>Design</span>
          </DynTreeNode>
          <DynTreeNode>
            <span>Engineering</span>
          </DynTreeNode>
          <DynTreeNode direction="column" gap="xs">
            <DynTreeNode>Frontend</DynTreeNode>
            <DynTreeNode>Backend</DynTreeNode>
          </DynTreeNode>
          <DynTreeNode>
            <span>Product Marketing</span>
          </DynTreeNode>
        </DynTreeNode>
      </DynTreeNode>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how CSS variables like `--dyn-tree-node-nested-offset` and `--dyn-tree-node-nested-gap` can orchestrate consistent indentation for hierarchical content.',
      },
    },
  },
};
