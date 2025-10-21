import '../../../test-setup';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DynMenuTrigger } from './DynMenuTrigger';

describe('DynMenuTrigger', () => {
  it('renders a button element by default with type="button"', () => {
    render(<DynMenuTrigger>Trigger</DynMenuTrigger>);

    const button = screen.getByRole('button', { name: 'Trigger' });
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button).toHaveAttribute('type', 'button');
  });

  it('supports rendering a custom element via the `as` prop', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DynMenuTrigger as="a" href="#details" onClick={onClick}>
        Details
      </DynMenuTrigger>
    );

    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '#details');

    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction when disabled, including custom elements', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DynMenuTrigger as="div" role="button" disabled onClick={onClick}>
        Disabled trigger
      </DynMenuTrigger>
    );

    const trigger = screen.getByRole('button', { name: 'Disabled trigger' });
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).toHaveAttribute('tabindex', '-1');

    await user.click(trigger);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('toggles pressed state for pointer interactions', () => {
    render(<DynMenuTrigger>Press me</DynMenuTrigger>);

    const trigger = screen.getByRole('button', { name: 'Press me' });
    expect(trigger).not.toHaveAttribute('data-pressed');

    fireEvent.pointerDown(trigger);
    expect(trigger).toHaveAttribute('data-pressed', 'true');

    fireEvent.pointerUp(trigger);
    expect(trigger).not.toHaveAttribute('data-pressed');

    fireEvent.pointerDown(trigger);
    fireEvent.pointerLeave(trigger);
    expect(trigger).not.toHaveAttribute('data-pressed');
  });

  it('sets pressed state on keyboard activation keys', () => {
    render(<DynMenuTrigger>Keyboard</DynMenuTrigger>);

    const trigger = screen.getByRole('button', { name: 'Keyboard' });

    fireEvent.keyDown(trigger, { key: ' ' });
    expect(trigger).toHaveAttribute('data-pressed', 'true');

    fireEvent.keyUp(trigger, { key: ' ' });
    expect(trigger).not.toHaveAttribute('data-pressed');

    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(trigger).toHaveAttribute('data-pressed', 'true');

    fireEvent.blur(trigger);
    expect(trigger).not.toHaveAttribute('data-pressed');
  });
});
