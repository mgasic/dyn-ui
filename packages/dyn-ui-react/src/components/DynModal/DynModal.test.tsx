import React, { useState } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynModal } from './DynModal';
import styles from '../DynModalPlacement/DynModalPlacement.module.css';

const getClass = (key: string) => (styles as Record<string, string>)[key];

afterEach(() => {
  document.body.style.overflow = '';
});

describe('DynModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <DynModal isOpen={false}>
        <div>Hidden content</div>
      </DynModal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when open and forwards placement props', () => {
    render(
      <DynModal
        isOpen
        placement="bottom"
        alignment="start"
        data-testid="dyn-modal"
      >
        <div>Visible content</div>
      </DynModal>
    );

    const modal = screen.getByTestId('dyn-modal');
    const wrapper = modal.closest(`.${getClass('dynModalPlacement')}`);

    expect(modal).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('data-placement', 'bottom');
    expect(wrapper).toHaveAttribute('data-alignment', 'start');
  });

  it('closes when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <DynModal isOpen closeOnBackdropClick onClose={onClose}>
        <div>Visible content</div>
      </DynModal>
    );

    const backdrop = screen.getByTestId('dyn-modal-backdrop');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss when disabled', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <DynModal isOpen disabled onClose={onClose}>
        <button type="button">Focusable</button>
      </DynModal>
    );

    const backdrop = screen.getByTestId('dyn-modal-backdrop');
    await user.click(backdrop);
    await user.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
    const modal = screen.getByTestId('dyn-modal');
    expect(modal).toHaveAttribute('aria-disabled', 'true');
    expect(modal).toHaveAttribute('data-disabled', 'true');
  });

  it('handles escape key press when enabled', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <DynModal isOpen closeOnEsc onClose={onClose}>
        <div>Visible content</div>
      </DynModal>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus within the modal when tabbing', async () => {
    const user = userEvent.setup();
    render(
      <DynModal isOpen>
        <button type="button">First</button>
        <button type="button">Second</button>
      </DynModal>
    );

    const firstButton = screen.getByRole('button', { name: /first/i });
    const secondButton = screen.getByRole('button', { name: /second/i });

    await waitFor(() => expect(firstButton).toHaveFocus());

    await user.tab();
    expect(secondButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();
  });

  it('locks document scroll when open', () => {
    render(
      <DynModal isOpen lockScroll>
        <div>Scroll lock content</div>
      </DynModal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('applies maxWidth and minWidth styles', () => {
    render(
      <DynModal isOpen maxWidth={480} minWidth="320px" data-testid="styled-modal">
        <div>Styled content</div>
      </DynModal>
    );

    const modal = screen.getByTestId('styled-modal');
    expect(modal.style.getPropertyValue('--dyn-modal-max-width')).toBe('480px');
    expect(modal.style.getPropertyValue('--dyn-modal-min-width')).toBe('320px');
  });

  it('supports custom aria-label and polymorphic rendering', () => {
    render(
      <DynModal isOpen as="section" aria-label="Settings dialog">
        <div>Settings</div>
      </DynModal>
    );

    const modal = screen.getByLabelText('Settings dialog');
    expect(modal.tagName).toBe('SECTION');
  });

  it('restores focus to the trigger element when closed', async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            Open modal
          </button>
          <DynModal isOpen={open} onClose={() => setOpen(false)} closeOnEsc>
            <button type="button">Close</button>
          </DynModal>
        </div>
      );
    };

    render(<Wrapper />);

    const trigger = screen.getByRole('button', { name: /open modal/i });
    await user.click(trigger);

    await user.keyboard('{Escape}');

    expect(trigger).toHaveFocus();
  });
});
