import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DynBreadcrumb } from './DynBreadcrumb';
import type { BreadcrumbItem } from './DynBreadcrumb.types';
import { testAccessibility } from '../../test-utils';

const baseItems: BreadcrumbItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Products', href: '/products' },
  { id: '3', label: 'Smartphones', current: true },
];

const longItems: BreadcrumbItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Electronics', href: '/electronics' },
  { id: '3', label: 'Mobile Phones', href: '/electronics/mobile' },
  { id: '4', label: 'Android', href: '/electronics/mobile/android' },
  { id: '5', label: 'Flagship', href: '/electronics/mobile/android/flagship' },
  { id: '6', label: 'Current Device', current: true },
];

describe('DynBreadcrumb', () => {
  it('renders breadcrumb navigation', () => {
    render(<DynBreadcrumb items={baseItems} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });

  it('renders all breadcrumb items', () => {
    render(<DynBreadcrumb items={baseItems} />);

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByText('Smartphones')).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(<DynBreadcrumb items={baseItems} />);

    const currentLabel = screen.getByText('Smartphones');
    const currentContainer = currentLabel.closest('[aria-current="page"]');

    expect(currentContainer).not.toBeNull();
  });

  it('handles item clicks', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<DynBreadcrumb items={baseItems} onItemClick={handleClick} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    await user.click(homeLink);

    expect(handleClick).toHaveBeenCalledWith(baseItems[0], expect.any(Object));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DynBreadcrumb items={baseItems} />);

    await testAccessibility(container);
  });

  it('supports custom navigation label', () => {
    render(<DynBreadcrumb items={baseItems} navigationLabel="Page navigation" />);

    expect(screen.getByLabelText('Page navigation')).toBeInTheDocument();
  });

  it('renders default slash separators', () => {
    render(<DynBreadcrumb items={baseItems} />);

    const separators = document.querySelectorAll('[data-separator="slash"]');
    expect(separators).toHaveLength(baseItems.length - 1);
  });

  it('renders separator variants', () => {
    const { rerender } = render(<DynBreadcrumb items={baseItems} separator="chevron" />);

    expect(document.querySelectorAll('[data-separator="chevron"]').length).toBe(
      baseItems.length - 1
    );

    rerender(<DynBreadcrumb items={baseItems} separator="arrow" />);
    expect(document.querySelectorAll('[data-separator="arrow"]').length).toBe(
      baseItems.length - 1
    );

    rerender(<DynBreadcrumb items={baseItems} separator="dot" />);
    expect(document.querySelectorAll('[data-separator="dot"]').length).toBe(
      baseItems.length - 1
    );
  });

  it('renders custom separator element', () => {
    const customSeparator = <span data-testid="custom-separator">→</span>;

    render(
      <DynBreadcrumb items={baseItems} separator="custom" customSeparator={customSeparator} />
    );

    expect(screen.getAllByTestId('custom-separator')).toHaveLength(baseItems.length - 1);
  });

  it('collapses items when maxItems is set', () => {
    render(<DynBreadcrumb items={longItems} maxItems={4} />);

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Current Device')).toBeInTheDocument();
    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile Phones')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /hidden breadcrumb items/i })
    ).toBeInTheDocument();
  });

  it('expands collapsed items when ellipsis is clicked', async () => {
    const user = userEvent.setup();

    render(<DynBreadcrumb items={longItems} maxItems={4} />);

    const ellipsis = screen.getByRole('button', { name: /hidden breadcrumb items/i });
    await user.click(ellipsis);

    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Mobile Phones')).toBeInTheDocument();
  });

  it('respects showWhenCollapsed flag', () => {
    const items: BreadcrumbItem[] = [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Pinned', href: '/pinned', showWhenCollapsed: true },
      { id: '3', label: 'Hidden', href: '/hidden' },
      { id: '4', label: 'Current', current: true },
    ];

    render(<DynBreadcrumb items={items} maxItems={3} />);

    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('invokes onEllipsisClick callback', async () => {
    const handleEllipsisClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DynBreadcrumb items={longItems} maxItems={4} onEllipsisClick={handleEllipsisClick} />
    );

    const ellipsis = screen.getByRole('button', { name: /hidden breadcrumb items/i });
    await user.click(ellipsis);

    expect(handleEllipsisClick).toHaveBeenCalled();
  });

  it('renders item icons', () => {
    const itemsWithIcons: BreadcrumbItem[] = [
      { id: '1', label: 'Home', href: '/', icon: <span data-testid="home-icon">🏠</span> },
      { id: '2', label: 'Docs', href: '/docs', icon: <span data-testid="docs-icon">📚</span> },
      { id: '3', label: 'Current', current: true },
    ];

    render(<DynBreadcrumb items={itemsWithIcons} />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('docs-icon')).toBeInTheDocument();
  });

  it('includes structured data markup when enabled', () => {
    render(<DynBreadcrumb items={baseItems} enableStructuredData />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('itemtype', 'https://schema.org/BreadcrumbList');

    const listItem = screen.getAllByRole('listitem')[0];
    expect(listItem).toBeDefined();
    expect(listItem).toHaveAttribute('itemtype', 'https://schema.org/ListItem');
    expect(listItem?.querySelector('meta[itemprop="position"]')).not.toBeNull();
  });

  it('uses a custom link component', () => {
    const CustomLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>( (
      { href, children, ...props },
      ref
    ) => (
      <a ref={ref} data-testid="custom-link" data-href={href} {...props}>
        {children}
      </a>
    ) );
    CustomLink.displayName = 'CustomLink';

    render(<DynBreadcrumb items={baseItems} linkComponent={CustomLink} />);

    expect(screen.getAllByTestId('custom-link')).toHaveLength(baseItems.length - 1);
  });

  it('supports controlled expansion', () => {
    render(<DynBreadcrumb items={longItems} maxItems={3} expanded />);

    expect(screen.queryByRole('button', { name: /hidden breadcrumb items/i })).not.toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('hides ellipsis when showEllipsis is false', () => {
    render(<DynBreadcrumb items={longItems} maxItems={3} showEllipsis={false} />);

    expect(screen.queryByRole('button', { name: /hidden breadcrumb items/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile Phones')).not.toBeInTheDocument();
  });

  it('returns null when no items are provided', () => {
    const { container } = render(<DynBreadcrumb items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('exposes list semantics', () => {
    render(<DynBreadcrumb items={baseItems} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(baseItems.length);
  });

  it('forwards data-testid to the nav element', () => {
    render(<DynBreadcrumb items={baseItems} data-testid="breadcrumb" />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('supports roving focus between breadcrumb item children', async () => {
    const user = userEvent.setup();

    render(
      <DynBreadcrumb>
        <DynBreadcrumb.Item href="/">Home</DynBreadcrumb.Item>
        <DynBreadcrumb.Item href="/products">Products</DynBreadcrumb.Item>
        <DynBreadcrumb.Item current>Details</DynBreadcrumb.Item>
      </DynBreadcrumb>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });

    expect(homeLink.tabIndex).toBe(0);
    expect(productsLink.tabIndex).toBe(-1);

    homeLink.focus();
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(productsLink);
    expect(productsLink.tabIndex).toBe(0);
    expect(homeLink.tabIndex).toBe(-1);
  });

  it('skips disabled breadcrumb items during keyboard navigation', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DynBreadcrumb>
        <DynBreadcrumb.Item href="/">Home</DynBreadcrumb.Item>
        <DynBreadcrumb.Item href="/reports" disabled onClick={handleClick}>
          Reports
        </DynBreadcrumb.Item>
        <DynBreadcrumb.Item href="/settings">Settings</DynBreadcrumb.Item>
      </DynBreadcrumb>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const disabledLink = screen.getByRole('link', { name: 'Reports' });
    const settingsLink = screen.getByRole('link', { name: 'Settings' });

    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    expect(disabledLink.tabIndex).toBe(-1);

    await user.click(disabledLink);
    expect(handleClick).not.toHaveBeenCalled();

    homeLink.focus();
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(settingsLink);
    expect(settingsLink.tabIndex).toBe(0);
  });
});
