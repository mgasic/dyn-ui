import '../../../test-setup';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from 'react';
import { DynMenu } from './DynMenu';
import type { MenuItem } from './DynMenu.types';

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    children: [
      {
        label: 'Home',
        action: vi.fn()
      }
    ]
  },
  {
    label: 'Products',
    children: [
      {
        label: 'All Products',
        action: vi.fn()
      },
      {
        label: 'Categories',
        action: 'open-categories'
      },
      {
        label: 'Inventory',
        loading: true
      }
    ]
  },
  {
    label: 'Settings'
  }
];

const renderMenu = (override: Partial<React.ComponentProps<typeof DynMenu>> = {}) =>
  render(<DynMenu items={menuItems} {...override} />);

describe('DynMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a menubar with all top level items', () => {
    renderMenu();

    const menubar = screen.getByRole('menubar');
    expect(menubar).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
  });

  it('opens a submenu when a top level item is clicked', async () => {
    const user = userEvent.setup();
    renderMenu();

    const productsButton = screen.getByRole('menuitem', { name: 'Products' });
    expect(screen.queryByRole('menuitem', { name: 'All Products' })).not.toBeInTheDocument();
    expect(productsButton).toHaveAttribute('data-state', 'closed');

    await user.click(productsButton);

    expect(screen.getByRole('menuitem', { name: 'All Products' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Categories' })).toBeInTheDocument();
    expect(productsButton).toHaveAttribute('data-state', 'open');
  });

  it('closes an open submenu when another item is activated', async () => {
    const user = userEvent.setup();
    renderMenu();

    const productsButton = screen.getByRole('menuitem', { name: 'Products' });
    const dashboardButton = screen.getByRole('menuitem', { name: 'Dashboard' });

    await user.click(productsButton);
    expect(screen.getByRole('menuitem', { name: 'All Products' })).toBeInTheDocument();
    expect(productsButton).toHaveAttribute('data-state', 'open');

    await user.click(dashboardButton);
    expect(screen.queryByRole('menuitem', { name: 'All Products' })).not.toBeInTheDocument();
    expect(productsButton).toHaveAttribute('data-state', 'closed');
  });

  it('closes the submenu when clicking outside the component', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DynMenu items={menuItems} />
        <button type="button" data-testid="outside-button">
          Outside
        </button>
      </>
    );

    await user.click(screen.getByRole('menuitem', { name: 'Products' }));
    expect(screen.getByRole('menuitem', { name: 'All Products' })).toBeInTheDocument();

    await user.click(screen.getByTestId('outside-button'));

    expect(screen.queryByRole('menuitem', { name: 'All Products' })).not.toBeInTheDocument();
  });

  it('runs an action callback when a submenu item with a function is clicked', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('menuitem', { name: 'Dashboard' }));
    const homeAction = menuItems[0].children?.[0].action as ReturnType<typeof vi.fn>;

    await user.click(screen.getByRole('menuitem', { name: 'Home' }));
    expect(homeAction).toHaveBeenCalledTimes(1);
  });

  it('calls onAction prop when a submenu item with a string action is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderMenu({ onAction });

    await user.click(screen.getByRole('menuitem', { name: 'Products' }));
    await user.click(screen.getByRole('menuitem', { name: 'Categories' }));

    expect(onAction).toHaveBeenCalledWith('open-categories');
  });

  it('supports horizontal keyboard navigation', async () => {
    renderMenu();

    const menubar = screen.getByRole('menubar');
    const buttons = screen.getAllByRole('menuitem', { hidden: false }).slice(0, 3);

    expect(buttons[0]).toHaveFocus();

    fireEvent.keyDown(menubar, { key: 'ArrowRight' });
    expect(buttons[1]).toHaveFocus();

    fireEvent.keyDown(menubar, { key: 'ArrowLeft' });
    expect(buttons[0]).toHaveFocus();
  });

  it('supports roving focus and keyboard selection within an open submenu', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderMenu({ onAction });

    const productsButton = screen.getByRole('menuitem', { name: 'Products' });
    await user.click(productsButton);

    const submenu = screen.getByRole('menu');
    const allProducts = screen.getByRole('menuitem', { name: 'All Products' });
    const categories = screen.getByRole('menuitem', { name: 'Categories' });

    await waitFor(() => expect(allProducts).toHaveFocus());
    expect(submenu).toHaveAttribute('aria-activedescendant', allProducts.id);
    expect(allProducts).toHaveAttribute('tabindex', '0');
    expect(categories).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(allProducts, { key: 'ArrowDown' });

    expect(categories).toHaveFocus();
    expect(submenu).toHaveAttribute('aria-activedescendant', categories.id);
    expect(allProducts).toHaveAttribute('tabindex', '-1');
    expect(categories).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(categories, { key: 'ArrowUp' });
    expect(allProducts).toHaveFocus();

    fireEvent.keyDown(allProducts, { key: 'End' });
    expect(categories).toHaveFocus();

    fireEvent.keyDown(categories, { key: 'Home' });
    expect(allProducts).toHaveFocus();

    fireEvent.keyDown(allProducts, { key: 'ArrowDown' });
    fireEvent.keyDown(categories, { key: 'Enter' });

    expect(onAction).toHaveBeenCalledWith('open-categories');
    expect(screen.queryByRole('menuitem', { name: 'All Products' })).not.toBeInTheDocument();
  });

  it('applies passed in className to the menubar element', () => {
    const { container } = renderMenu({ className: 'custom-class' });
    const menuRoot = container.querySelector('[role="menubar"]');

    expect(menuRoot).toHaveClass('custom-class');
  });

  it('applies orientation specific class names', () => {
    const { rerender } = renderMenu();

    let menubar = screen.getByRole('menubar');
    expect(menubar).toHaveClass('dyn-menu--horizontal');

    rerender(<DynMenu items={menuItems} orientation="vertical" />);
    menubar = screen.getByRole('menubar');
    expect(menubar).toHaveClass('dyn-menu--vertical');
  });

  it('closes open submenus when clicking or focusing outside', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('menuitem', { name: 'Products' }));
    expect(screen.getByRole('menuitem', { name: 'Categories' })).toBeInTheDocument();

    await user.click(document.body);
    await waitFor(() =>
      expect(screen.queryByRole('menuitem', { name: 'Categories' })).not.toBeInTheDocument()
    );

    await user.click(screen.getByRole('menuitem', { name: 'Products' }));
    expect(screen.getByRole('menuitem', { name: 'Categories' })).toBeInTheDocument();

    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'Outside';
    document.body.appendChild(outsideButton);

    await act(async () => {
      outsideButton.focus();
      fireEvent.focusIn(outsideButton);
    });

    await waitFor(() =>
      expect(screen.queryByRole('menuitem', { name: 'Categories' })).not.toBeInTheDocument()
    );

    outsideButton.remove();
  });

  it('supports roving focus within open submenus', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderMenu({ onAction });

    await user.click(screen.getByRole('menuitem', { name: 'Products' }));

    const submenu = screen.getByRole('menu', { name: 'Products' });

    await waitFor(() => expect(submenu).toHaveFocus());

    const getActiveText = () => {
      const activeId = submenu.getAttribute('aria-activedescendant');
      if (!activeId) return null;
      return document.getElementById(activeId)?.textContent;
    };

    expect(getActiveText()).toContain('All Products');

    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(getActiveText()).toContain('Categories'));

    await user.keyboard('{ArrowUp}');
    await waitFor(() => expect(getActiveText()).toContain('All Products'));

    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(getActiveText()).toContain('Categories'));
    await user.keyboard('{Enter}');

    expect(onAction).toHaveBeenCalledWith('open-categories');
    await waitFor(() =>
      expect(screen.queryByRole('menuitem', { name: 'Categories' })).not.toBeInTheDocument()
    );
  });

  it('renders disabled top-level items with aria-disabled when using DynMenuTrigger', () => {
    renderMenu({
      items: [
        { label: 'Enabled' },
        { label: 'Disabled', disabled: true },
      ],
    });

    const disabledTrigger = screen.getByRole('menuitem', { name: 'Disabled' });
    expect(disabledTrigger).toHaveAttribute('data-disabled', 'true');
    expect(disabledTrigger).toBeDisabled();
  });
});
