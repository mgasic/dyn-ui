import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DynButton } from '../DynButton';
import { DynModal } from './DynModal';

const meta: Meta<typeof DynModal> = {
  title: 'Components/DynModal',
  component: DynModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'DynModal provides a high-accessibility dialog with built-in focus management, escape/overlay dismissal, and polymorphic rendering via the `as` prop. It automatically returns focus to the trigger when closed and exposes granular control over dismissal affordances.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls visibility of the modal dialog.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents overlay and ESC dismissal when true.',
      table: { defaultValue: { summary: 'false' } },
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Determines whether clicking the scrim closes the modal.',
      table: { defaultValue: { summary: 'true' } },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Determines whether pressing Escape closes the modal.',
      table: { defaultValue: { summary: 'true' } },
    },
    overlayClassName: {
      control: 'text',
      description: 'Custom class name applied to the overlay.',
    },
    className: {
      control: 'text',
      description: 'Custom class name applied to the dialog surface.',
    },
    as: {
      control: 'text',
      description: 'Polymorphic element override for the dialog surface.',
      table: { defaultValue: { summary: 'div' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label when no visible heading is provided.',
    },
    'aria-labelledby': {
      control: 'text',
      description: 'ID of an element that labels the dialog.',
    },
    'aria-describedby': {
      control: 'text',
      description: 'ID of an element describing the dialog contents.',
    },
    onClose: {
      action: 'closed',
      description: 'Called when the modal requests to close (ESC or overlay).',
    },
  },
  args: {
    open: true,
    'aria-label': 'Example modal',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Team invitation</h2>
        <p style={{ margin: 0 }}>
          Invite teammates to collaborate on the current workspace. Everyone you add will receive an email
          notification with a link to join the project.
        </p>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span>Email address</span>
          <input type="email" placeholder="teammate@example.com" style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5f5' }} />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <DynButton kind="tertiary" label="Cancel" />
          <DynButton label="Send invite" />
        </div>
      </div>
    ),
  },
};

export const WithTrigger: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <DynButton label="Launch modal" onClick={() => setOpen(true)} />
        <DynModal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Keyboard and focus management</h2>
            <p style={{ margin: 0 }}>
              The modal traps focus inside while open and restores focus to the triggering button once closed.
            </p>
            <DynButton label="Close" kind="secondary" onClick={() => setOpen(false)} />
          </div>
        </DynModal>
      </div>
    );
  },
  args: {
    open: undefined,
    'aria-label': 'Interactive modal',
  },
  parameters: {
    docs: {
      description: {
        story:
          'An interactive example that demonstrates opening and closing the modal, including focus restoration to the launch button.',
      },
    },
  },
};

export const NonDismissable: Story = {
  args: {
    open: true,
    disabled: true,
    closeOnEscape: false,
    closeOnOverlayClick: false,
    'aria-label': 'Non dismissable modal',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Important update</h2>
        <p style={{ margin: 0 }}>
          This modal cannot be dismissed via the overlay or ESC key. Provide an explicit action inside the dialog to
          continue.
        </p>
        <DynButton label="Acknowledge" />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the disabled and dismissal control props when the experience must remain on screen until a primary action is taken.',
      },
    },
  },
};

