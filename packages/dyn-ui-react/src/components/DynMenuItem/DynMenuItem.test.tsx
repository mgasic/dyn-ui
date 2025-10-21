import '../../../test-setup';
import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynMenuItem } from './DynMenuItem';

describe('DynMenuItem', () => {
  it('renders as a button with menuitem role by default', () => {
    render(<DynMenuItem label="Projects" />);

    const item = screen.getByRole('menuitem', { name: 'Projects' });
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('type', 'button');
    expect(item).not.toHaveAttribute('aria-disabled');
  });

  it('supports polymorphic rendering while preserving button semantics', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DynMenuItem as="div" ariaLabel="Notifications" onClick={onClick} />
    );

    const item = screen.getByRole('menuitem', { name: 'Notifications' });
    expect(item).toHaveAttribute('tabindex', '0');

    await user.tab();
    expect(item).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents interactions when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DynMenuItem label="Disabled" disabled onClick={onClick} data-testid="disabled-item" />
    );

    const item = screen.getByTestId('disabled-item');
    expect(item).toHaveAttribute('disabled');
    expect(item).toHaveAttribute('data-disabled', 'true');

    await user.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks loading items as busy and non-interactive', () => {
    const { rerender } = render(
      <DynMenuItem label="Loading" loading data-testid="loading-item" />
    );

    const item = screen.getByTestId('loading-item');
    expect(item).toHaveAttribute('aria-busy', 'true');
    expect(item).toHaveAttribute('data-loading', 'true');
    expect(item).toHaveAttribute('disabled');

    rerender(
      <DynMenuItem label="Loading" loading as="a" href="#" data-testid="loading-link" />
    );

    const linkItem = screen.getByTestId('loading-link');
    expect(linkItem).toHaveAttribute('aria-busy', 'true');
    expect(linkItem).toHaveAttribute('aria-disabled', 'true');
    expect(linkItem).toHaveAttribute('tabindex', '-1');
  });

  it('exposes keyboard pressed state when space or enter is used', () => {
    render(<DynMenuItem label="Keyboard" data-testid="keyboard-item" />);

    const item = screen.getByTestId('keyboard-item');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(item).toHaveAttribute('data-pressed', 'true');

    fireEvent.keyUp(item, { key: 'Enter' });
    expect(item).not.toHaveAttribute('data-pressed');
  });

  it('applies focus-visible data attribute when focused', async () => {
    render(<DynMenuItem label="Focus" data-testid="focus-item" />);

    const item = screen.getByTestId('focus-item');

    act(() => {
      item.focus();
    });

    await waitFor(() =>
      expect(item).toHaveAttribute('data-focus-visible', 'true')
    );

    act(() => {
      item.blur();
    });

    await waitFor(() =>
      expect(item).not.toHaveAttribute('data-focus-visible')
    );
  });
});
