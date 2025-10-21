import React from 'react';
import { render, screen } from '@testing-library/react';
import { DynTreeNode } from './DynTreeNode';

describe('DynTreeNode', () => {
  it('renders children inside a semantic wrapper', () => {
    render(
      <DynTreeNode data-testid="tree-node">
        <span>Child content</span>
      </DynTreeNode>
    );

    const node = screen.getByTestId('tree-node');
    expect(node).toBeInTheDocument();
    expect(node).toHaveTextContent('Child content');
    expect(node.tagName).toBe('DIV');
  });

  it('supports polymorphic rendering via the `as` prop', () => {
    render(
      <DynTreeNode as="section" data-testid="polymorphic">
        Section content
      </DynTreeNode>
    );

    expect(screen.getByTestId('polymorphic').tagName).toBe('SECTION');
  });

  it('applies spacing helpers using design tokens', () => {
    render(
      <DynTreeNode data-testid="spaced" gap="sm" p="lg" m={12} />
    );

    const node = screen.getByTestId('spaced');
    expect(node).toHaveStyle({
      gap: 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
      padding: 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
      margin: '12px',
    });
  });

  it('forwards refs to the underlying element', () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <DynTreeNode ref={ref}>
        Ref child
      </DynTreeNode>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.classList.contains('dyn-tree-node')).toBe(true);
  });

  it('merges class names and supports direction modifiers', () => {
    render(
      <DynTreeNode
        data-testid="column"
        direction="column"
        className="custom-node"
        align="center"
        justify="space-between"
      />
    );

    const node = screen.getByTestId('column');
    expect(node).toHaveClass('dyn-tree-node', 'dyn-tree-node--column', 'custom-node');
    expect(node).toHaveStyle({ alignItems: 'center', justifyContent: 'space-between' });
  });

  it('supports nested composition without losing semantics', () => {
    render(
      <DynTreeNode data-testid="outer" gap="sm" direction="column">
        <DynTreeNode data-testid="inner-a">A</DynTreeNode>
        <DynTreeNode data-testid="inner-b">B</DynTreeNode>
      </DynTreeNode>
    );

    expect(screen.getByTestId('outer')).toContainElement(screen.getByTestId('inner-a'));
    expect(screen.getByTestId('outer')).toContainElement(screen.getByTestId('inner-b'));
  });
});
