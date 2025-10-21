import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState, type ReactNode } from 'react';
import { DynModal } from './DynModal';
import type { DynModalProps } from './DynModal.types';
import { DynButton } from '../DynButton';
import { DynContainer } from '../DynContainer';

const meta: Meta<typeof DynModal> = {
  title: 'Components/DynModal',
  component: DynModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Enterprise modal component with built-in focus trapping, scroll locking and accessible dismissal controls.

### Accessibility

- Opening the modal captures focus on the first focusable element (or the dialog itself) and prevents tabbing outside.
- Dismissing the modal restores focus to the trigger element or a custom \`returnFocusElement\`.
- Escape and backdrop clicks call \`onClose\` when enabled, while disabled modals announce \`aria-disabled\`.

### Keyboard interactions

- Tab/Shift+Tab cycle through focusable elements within the modal.
- Escape invokes \`onClose\` (unless \`closeOnEsc\` is \`false\`).
- Focus is restored to the opener once the modal unmounts.
`
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof DynModal>;

const useModalState = (initial = false) => {
  const [open, setOpen] = useState(initial);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  return { open, openModal, closeModal };
};

const PlaygroundModal: React.FC<
  Partial<Omit<DynModalProps, 'isOpen' | 'onClose'>> & {
    label?: string;
    description?: string;
    content?: (close: () => void) => React.ReactNode;
  }
> = ({ label = 'Open modal', description, content, ...props }) => {
  const { open, openModal, closeModal } = useModalState();

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <DynButton onClick={openModal}>{label}</DynButton>
      <DynModal
        isOpen={open}
        onClose={closeModal}
        aria-label={description ?? 'Example modal dialog'}
        {...props}
      >
        <DynContainer spacing="md" className="storybook-modal-content">
          {content?.(closeModal) ?? (
            <>
              <header>
                <h2 style={{ margin: 0 }}>Modal heading</h2>
                <p style={{ margin: 0, color: 'var(--dyn-color-text-secondary, #64748b)' }}>
                  {description ?? 'Showcases modal focus management and dismissal behaviours.'}
                </p>
              </header>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <DynButton kind="secondary" onClick={closeModal}>
                  Cancel
                </DynButton>
                <DynButton kind="primary" onClick={closeModal}>
                  Confirm
                </DynButton>
              </div>
            </>
          )}
        </DynContainer>
      </DynModal>
    </div>
  );
};

export const Basic: Story = {
  name: 'Basic Modal',
  render: () => <PlaygroundModal />,
  parameters: {
    docs: {
      description: {
        story:
          'Default modal showcasing accessible naming, focus trapping and automatic focus return to the trigger button.'
      }
    }
  }
};

export const PreventOutsideClose: Story = {
  name: 'Prevent Outside Close',
  render: () => (
    <PlaygroundModal
      closeOnBackdropClick={false}
      description="Backdrop clicks are ignored while keyboard dismissal remains available."
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Set `closeOnBackdropClick` to `false` to require an explicit action within the modal to dismiss it.'
      }
    }
  }
};

export const Disabled: Story = {
  name: 'Disabled Modal',
  render: () => (
    <PlaygroundModal
      disabled
      description="Modal interactions are disabled; focus remains on the trigger while the dialog stays visible."
      content={() => (
        <>
          <header>
            <h2 style={{ margin: 0 }}>Processing data…</h2>
            <p style={{ margin: 0, color: 'var(--dyn-color-text-secondary, #64748b)' }}>
              Backdrop clicks and Escape are disabled until processing completes.
            </p>
          </header>
          <p style={{ margin: 0 }}>
            Use the `disabled` state to prevent premature dismissal while background tasks finish.
          </p>
        </>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled modals announce `aria-disabled` and block backdrop/Escape dismissal.'
      }
    }
  }
};

export const FormContent: Story = {
  name: 'Form Content',
  render: () => (
    <PlaygroundModal
      description="Focus is trapped inside the form inputs until the dialog closes."
      content={closeModal => (
        <>
          <header>
            <h2 style={{ margin: 0 }}>Invite teammate</h2>
            <p style={{ margin: 0, color: 'var(--dyn-color-text-secondary, #64748b)' }}>
              All fields keep focus inside the modal until you submit or cancel.
            </p>
          </header>
          <label style={{ display: 'block' }}>
            Name
            <input type="text" placeholder="Jane Doe" style={{ width: '100%', marginTop: '0.5rem' }} />
          </label>
          <label style={{ display: 'block' }}>
            Email
            <input type="email" placeholder="jane@example.com" style={{ width: '100%', marginTop: '0.5rem' }} />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <DynButton kind="secondary" onClick={closeModal}>
              Save draft
            </DynButton>
            <DynButton kind="primary" onClick={closeModal}>
              Send
            </DynButton>
          </div>
        </>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ideal for forms—focus remains inside the modal and is restored to the trigger on close.'
      }
    }
  }
};
