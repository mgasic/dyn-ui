import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynModal } from './DynModal';

describe('DynModal', () => {
  it('focuses the first focusable element when opened and traps focus', async () => {
    const user = userEvent.setup();
    render(
      <DynModal isOpen aria-label="Example modal">
        <button type="button">Primary action</button>
        <button type="button">Secondary action</button>
      </DynModal>
    );

    const primary = await screen.findByRole('button', { name: 'Primary action' });
    const secondary = screen.getByRole('button', { name: 'Secondary action' });

    await waitFor(() => expect(primary).toHaveFocus());

    await user.tab();
    expect(secondary).toHaveFocus();

    await user.tab();
    expect(primary).toHaveFocus();

    await user.tab({ shift: true });
    expect(secondary).toHaveFocus();
  });

  it('invokes onClose when pressing Escape or clicking the backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <DynModal isOpen onClose={onClose} aria-label="Dismissible modal">
        <button type="button">Inside</button>
      </DynModal>
    );

    await screen.findByRole('button', { name: 'Inside' });

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();

    const backdrop = screen.getByTestId('dyn-modal-backdrop');
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('prevents dismissal interactions when disabled', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <DynModal isOpen disabled onClose={onClose} aria-label="Disabled modal">
        <button type="button">Inside</button>
      </DynModal>
    );

    await screen.findByRole('button', { name: 'Inside' });

    await user.keyboard('{Escape}');
    const backdrop = screen.getByTestId('dyn-modal-backdrop');
    await user.click(backdrop);

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByTestId('dyn-modal')).toHaveAttribute('aria-disabled', 'true');
  });

  it('returns focus to the triggering element after closing', async () => {
    const user = userEvent.setup();

    const Example = () => {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)} data-testid="open-modal">
            Open modal
          </button>
          <DynModal isOpen={open} onClose={() => setOpen(false)} aria-label="Return focus modal">
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </DynModal>
        </div>
      );
    };

    render(<Example />);

    const trigger = screen.getByTestId('open-modal');
    await user.click(trigger);

    const closeButton = await screen.findByRole('button', { name: 'Close' });
    await user.click(closeButton);

    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

