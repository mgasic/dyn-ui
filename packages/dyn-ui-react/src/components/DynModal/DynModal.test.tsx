import React, { useState } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { testA11y } from '../../testing/accessibility';
import { DynModal } from './DynModal';

const renderBasicModal = (props: Partial<React.ComponentProps<typeof DynModal>> = {}) => {
  return render(
    <DynModal
      open
      aria-label="Example modal"
      {...props}
    >
      <button type="button">Primary action</button>
      <a href="#secondary">Secondary link</a>
    </DynModal>
  );
};

describe('DynModal', () => {
  it('renders when open and applies aria attributes', async () => {
    renderBasicModal();

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('data-testid', 'dyn-modal');

    await waitFor(() => expect(screen.getByRole('button', { name: 'Primary action' })).toHaveFocus());
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

    await user.tab();
    expect(link).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(link).toHaveFocus();
  });

  it('calls onClose when pressing the Escape key', async () => {
    const onClose = vi.fn();
    renderBasicModal({ onClose });

    const user = userEvent.setup();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Primary action' })).toHaveFocus());

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay', async () => {
    const onClose = vi.fn();
    renderBasicModal({ onClose });

    const overlay = await screen.findByTestId('dyn-modal-overlay');
    fireEvent.mouseDown(overlay);
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

  it('maintains focus trap when disabled', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <DynModal isOpen disabled>
          <button type="button">Inside first</button>
          <button type="button">Inside second</button>
        </DynModal>
      </div>
    );

    const firstButton = screen.getByRole('button', { name: /inside first/i });
    const secondButton = screen.getByRole('button', { name: /inside second/i });
    const outsideButton = screen.getByRole('button', { name: /outside/i });

    await waitFor(() => expect(firstButton).toHaveFocus());

    await user.tab();
    expect(secondButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();
    expect(outsideButton).not.toHaveFocus();

    await user.tab({ shift: true });
    expect(secondButton).toHaveFocus();
  });

  it('handles escape key press when enabled', async () => {
    const onClose = vi.fn();
    renderBasicModal({ onClose, disabled: true });

    const overlay = await screen.findByTestId('dyn-modal-overlay');
    fireEvent.mouseDown(overlay);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('returns focus to the trigger when closed', async () => {
    const Example = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)} data-testid="open-modal">
            Open modal
          </button>
          <DynModal
            open={open}
            onClose={() => setOpen(false)}
            aria-label="Managed modal"
          >
            <button type="button" onClick={() => setOpen(false)}>
              Close modal
            </button>
          </DynModal>
        </div>
      );
    };

    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByTestId('open-modal');
    await user.click(trigger);

    const closeButton = await screen.findByRole('button', { name: 'Close modal' });
    await user.click(closeButton);

    await waitFor(() => expect(trigger).toHaveFocus());
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
      <DynModal open as="section" aria-label="Section modal">
        Content
      </DynModal>
    );

    const dialog = screen.getByTestId('dyn-modal');
    expect(dialog.tagName).toBe('SECTION');
  });

  it('meets basic accessibility expectations', async () => {
    await testA11y(
      <DynModal open aria-label="Accessible modal">
        <button type="button">Action</button>
      </DynModal>
    );
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

