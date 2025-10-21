import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynListItem } from './DynListItem';
import { DYN_LIST_ITEM_DEFAULT_PROPS } from './DynListItem.types';
import styles from './DynListItem.module.css';
import { DynListView } from '../DynListView';

describe('DynListItem', () => {
  const getClass = (name: string) => (styles as Record<string, string>)[name] ?? name;

  it('renders with default configuration', () => {
    render(<DynListItem>Content</DynListItem>);

    const element = screen.getByTestId(DYN_LIST_ITEM_DEFAULT_PROPS['data-testid']);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass(getClass('root'));
    expect(element).toHaveTextContent('Content');
  });

  it('supports polymorphic rendering and ref forwarding', () => {
    const ref = createRef<HTMLLIElement>();

    render(
      <ul>
        <DynListItem as="li" ref={ref} data-testid="polymorphic-item">
          Item
        </DynListItem>
      </ul>
    );

    const element = screen.getByTestId('polymorphic-item');
    expect(element.tagName).toBe('LI');
    expect(ref.current).toBe(element);
  });

  it('applies spacing tokens as CSS custom properties', () => {
    render(
      <DynListItem
        data-testid="spaced"
        p="md"
        px="lg"
        py="sm"
        mt="xs"
        mx="auto"
        gap="sm"
      />
    );

    const element = screen.getByTestId('spaced');

    expect(element).toHaveStyle({
      '--dyn-list-item-padding': 'var(--dyn-spacing-md, var(--spacing-md, 1rem))',
      '--dyn-list-item-padding-left': 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
      '--dyn-list-item-padding-right': 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
      '--dyn-list-item-padding-top': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
      '--dyn-list-item-margin-top': 'var(--dyn-spacing-xs, var(--spacing-xs, 0.25rem))',
      '--dyn-list-item-margin-left': 'auto',
      '--dyn-list-item-margin-right': 'auto',
      '--dyn-list-item-gap': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
    });
  });

  it('merges inline style overrides with computed variables', () => {
    render(
      <DynListItem
        data-testid="styled"
        style={{ backgroundColor: 'papayawhip' }}
        justify="space-between"
        align="center"
      />
    );

    const element = screen.getByTestId('styled');
    expect(element).toHaveStyle(`
      --dyn-list-item-justify: space-between;
      --dyn-list-item-align: center;
      background-color: rgb(255, 239, 213);
    `);
  });

  it('forwards additional DOM props', () => {
    render(
      <DynListItem
        role="option"
        aria-selected="true"
        data-testid="forwarded"
      />
    );

    const element = screen.getByTestId('forwarded');
    expect(element).toHaveAttribute('role', 'option');
    expect(element).toHaveAttribute('aria-selected', 'true');
  });

  it('composes cleanly within DynListView custom renderers', () => {
    render(
      <DynListView
        data={[{ id: '1', title: 'First' }]}
        renderItem={(item) => (
          <DynListItem
            as="div"
            key={item.id}
            role="option"
            data-testid={`custom-${item.id}`}
            p="sm"
          >
            {item.title}
          </DynListItem>
        )}
      />
    );

    const element = screen.getByTestId('custom-1');
    expect(element).toHaveTextContent('First');
    expect(element).toHaveAttribute('role', 'option');
  });
});
