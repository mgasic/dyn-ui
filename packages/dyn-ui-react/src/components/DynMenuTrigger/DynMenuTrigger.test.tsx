import '../../../test-setup';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DynMenuTrigger } from './DynMenuTrigger';

describe('DynMenuTrigger', () => {
  it('renders a button element by default with menu trigger styling', () => {
    render(<DynMenuTrigger>Menu</DynMenuTrigger>);

    const trigger = screen.getByRole('button', { name: 'Menu' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('dyn-menu-trigger');
  });

  it('allows rendering a custom element via the `as` prop', () => {
    render(
      <DynMenuTrigger as="a" href="#" role="menuitem" aria-label="Open menu">
        Open
      </DynMenuTrigger>
    );

    const trigger = screen.getByRole('menuitem');
    expect(trigger.tagName.toLowerCase()).toBe('a');
    expect(trigger).toHaveAttribute('aria-label', 'Open menu');
    expect(trigger).not.toHaveAttribute('disabled');
  });

  it('marks the trigger as open when `isOpen` is provided', () => {
    render(
      <DynMenuTrigger isOpen aria-haspopup="menu">
        Products
      </DynMenuTrigger>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveClass('dyn-menu-trigger-active');
  });

  it('prevents user interaction when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <DynMenuTrigger disabled onClick={onClick}>
        Disabled
      </DynMenuTrigger>
    );

    const trigger = screen.getByRole('button', { name: 'Disabled' });
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes a pressed state data attribute on pointer interaction', () => {
    render(<DynMenuTrigger>Interact</DynMenuTrigger>);

    const trigger = screen.getByRole('button', { name: 'Interact' });

    fireEvent.pointerDown(trigger);
    expect(trigger).toHaveAttribute('data-pressed', 'true');

    fireEvent.pointerUp(trigger);
    expect(trigger).not.toHaveAttribute('data-pressed');
  });

  it('handles keyboard activation for non-button elements', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <DynMenuTrigger as="div" role="menuitem" tabIndex={0} onClick={onClick}>
        Keyboard
      </DynMenuTrigger>
    );

    const trigger = screen.getByRole('menuitem');

    trigger.focus();

    await user.keyboard('{Enter}');
    await waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));

    await user.keyboard('[Space]');
    await waitFor(() => expect(onClick).toHaveBeenCalledTimes(2));
  });
});
