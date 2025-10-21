import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynUI } from './DynUI';
import { DynTreeNode } from '../DynTreeNode';
import { DYN_UI_DEFAULT_PROPS } from './DynUI.types';

const spacingVar = (token: string) => `var(--dyn-spacing-${token}, var(--spacing-${token}, ${
  token === 'xs'
    ? '0.25rem'
    : token === 'sm'
    ? '0.5rem'
    : token === 'md'
    ? '1rem'
    : token === 'lg'
    ? '1.5rem'
    : token === 'xl'
    ? '2rem'
    : token === '2xl'
    ? '3rem'
    : '0'
}))`;

describe('DynUI', () => {
  it('renders as a section by default and supports semantic overrides', () => {
    const { rerender } = render(<DynUI>Content</DynUI>);
    const element = screen.getByTestId(DYN_UI_DEFAULT_PROPS['data-testid']);

    expect(element.tagName).toBe('SECTION');

    rerender(
      <DynUI as="nav" data-testid={DYN_UI_DEFAULT_PROPS['data-testid']}>
        Nav Content
      </DynUI>
    );

    expect(screen.getByTestId(DYN_UI_DEFAULT_PROPS['data-testid']).tagName).toBe('NAV');
  });

  it('applies tone-based theming when background is not overridden', () => {
    render(
      <DynUI tone="inverse" data-testid="tone-test">
        Inverse Tone
      </DynUI>
    );

    const element = screen.getByTestId('tone-test');

    expect(element).toHaveStyle({
      '--dyn-box-bg': 'var(--dyn-color-surface-inverse, var(--color-surface-inverse, #0f172a))',
      '--dyn-box-color': 'var(--dyn-color-text-on-inverse, var(--color-text-inverse, #f8fafc))',
    });
  });

  it('supports responsive spacing props', () => {
    render(
      <DynUI
        data-testid="responsive"
        p={{ base: 'sm', md: 'xl' }}
        mx={{ sm: 'auto', lg: 'xl' }}
        gap={{ md: 'lg' }}
      >
        Responsive Content
      </DynUI>
    );

    const element = screen.getByTestId('responsive');

    expect(element).toHaveStyle({
      '--dyn-box-padding': spacingVar('sm'),
    });
    expect(element).toHaveStyle({
      '--dyn-ui-padding-md': spacingVar('xl'),
    });
    expect(element).toHaveStyle({
      '--dyn-ui-margin-x-sm': 'auto',
    });
    expect(element).toHaveStyle({
      '--dyn-ui-margin-x-lg': spacingVar('xl'),
    });
    expect(element).toHaveStyle({
      '--dyn-ui-gap-md': spacingVar('lg'),
    });
  });

  it('allows tone overrides to defer to explicit props', () => {
    render(
      <DynUI tone="elevated" bg="primary" shadow="lg" data-testid="tone-override">
        Override Tone
      </DynUI>
    );

    const element = screen.getByTestId('tone-override');

    expect(element.style.getPropertyValue('--dyn-box-bg')).toBe('');
    expect(element.style.getPropertyValue('--dyn-box-shadow')).toBe('');
  });

  it('acts as a root layout container for hierarchical content', () => {
    render(
      <DynUI as="main" gap="md" data-testid="root-layout" tone="muted">
        <DynTreeNode data-testid="tree-root" direction="column" gap="sm">
          <DynTreeNode data-testid="tree-child-a">First</DynTreeNode>
          <DynTreeNode data-testid="tree-child-b">Second</DynTreeNode>
        </DynTreeNode>
      </DynUI>
    );

    const root = screen.getByTestId('root-layout');
    expect(root.tagName).toBe('MAIN');
    expect(root.style.getPropertyValue('--dyn-box-gap')).toBe(
      'var(--dyn-spacing-md, var(--spacing-md, 1rem))'
    );

    const treeRoot = screen.getByTestId('tree-root');
    expect(treeRoot).toHaveAttribute('data-dyn-tree-node', '');
    expect(treeRoot).toHaveStyle({ flexDirection: 'column' });
  });
});
