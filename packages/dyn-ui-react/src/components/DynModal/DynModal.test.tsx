import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('focuses the first focusable element and traps focus with Tab navigation', async () => {
    renderBasicModal();
    const user = userEvent.setup();

    const firstButton = await screen.findByRole('button', { name: 'Primary action' });
    await waitFor(() => expect(firstButton).toHaveFocus());

    const link = screen.getByRole('link', { name: 'Secondary link' });

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

  it('does not call onClose when disabled via overlay or Escape', async () => {
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

  it('supports rendering as a different element via the `as` prop', () => {
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
});

