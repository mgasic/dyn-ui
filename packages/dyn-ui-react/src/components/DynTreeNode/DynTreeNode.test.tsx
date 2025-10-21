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

  it('supports responsive spacing props and exposes CSS variables for breakpoints', () => {
    render(
      <DynTreeNode
        data-testid="responsive"
        px={{ base: 'sm', md: 'lg' }}
        gap={{ lg: 'xl' }}
        margin={{ base: 'xs', xl: '2xl' }}
      />
    );

    const node = screen.getByTestId('responsive');
    expect(node).toHaveStyle({
      paddingLeft: 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
      paddingRight: 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
      margin: 'var(--dyn-spacing-xs, var(--spacing-xs, 0.25rem))',
    });

    expect(node.style.getPropertyValue('--dyn-tree-node-padding-left-md')).toBe(
      'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))'
    );
    expect(node.style.getPropertyValue('--dyn-tree-node-gap-lg')).toBe(
      'var(--dyn-spacing-xl, var(--spacing-xl, 2rem))'
    );
    expect(node.style.getPropertyValue('--dyn-tree-node-margin-xl')).toBe(
      'var(--dyn-spacing-2xl, var(--spacing-2xl, 3rem))'
    );
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
    expect(node).toHaveStyle({
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
    });
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

  it('enables hierarchical offsets through CSS variables for nested layouts', () => {
    const style = {
      '--dyn-tree-node-nested-offset': '1rem',
      '--dyn-tree-node-nested-padding': '0.5rem',
      '--dyn-tree-node-nested-gap': '2rem',
    } as React.CSSProperties;

    render(
      <DynTreeNode data-testid="root" direction="column" style={style}>
        <DynTreeNode data-testid="child-a">Child A</DynTreeNode>
        <DynTreeNode data-testid="child-b">Child B</DynTreeNode>
      </DynTreeNode>
    );

    const childA = screen.getByTestId('child-a');
    const childB = screen.getByTestId('child-b');

    expect(childA).toHaveStyle({
      marginInlineStart: '1rem',
      paddingInlineStart: '0.5rem',
      marginTop: '0px',
    });
    expect(childB).toHaveStyle({
      marginInlineStart: '1rem',
      paddingInlineStart: '0.5rem',
      marginTop: '2rem',
    });
  });
});
