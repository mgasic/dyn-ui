import type { Meta, StoryObj } from '@storybook/react';
import { DynFieldContainer } from './DynFieldContainer';
import type { DynFieldContainerProps } from './DynFieldContainer.types';
import { DynInput } from '../DynInput';
import { DynCheckbox } from '../DynCheckbox';

const meta: Meta<typeof DynFieldContainer> = {
  title: 'Components/Form/DynFieldContainer',
  component: DynFieldContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Polymorphic form container that provides consistent spacing, labeling, and validation messaging. Supports responsive spacing tokens and automatically wires aria-describedby relationships for native inputs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    required: {
      control: 'boolean',
    },
    optional: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<DynFieldContainerProps>;

export const Default: Story = {
  args: {
    label: 'Field Label',
    children: <input type="text" placeholder="Enter text" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />,
  },
};

export const WithHelp: Story = {
  args: {
    label: 'Field with Help',
    helpText: 'This is helpful information about the field.',
    children: <input type="text" placeholder="Enter text" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />,
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    children: <input type="text" placeholder="Enter text" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />,
  },
};

export const Optional: Story = {
  args: {
    label: 'Optional Field',
    optional: true,
    children: <input type="text" placeholder="Enter text" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Field with Error',
    errorText: 'This field is required.',
    children: <input type="text" placeholder="Enter text" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', borderColor: '#e53e3e' }} />,
  },
};

export const WithDynInput: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <DynFieldContainer
        label="Input Field"
        helpText="Enter your name"
        required
      >
        <DynInput
          name="example-input"
          placeholder="Your name"
        />
      </DynFieldContainer>
    </div>
  ),
};

export const WithDynCheckbox: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <DynFieldContainer
        helpText="Check this to agree to terms"
        required
      >
        <DynCheckbox
          name="terms"
          label="I agree to the terms and conditions"
        />
      </DynFieldContainer>
    </div>
  ),
};

export const FormGroupLayout: Story = {
  render: () => (
    <form
      aria-labelledby="contact-form-heading"
      style={{
        display: 'grid',
        gap: '1.5rem',
        padding: '2rem',
        borderRadius: '16px',
        background: 'var(--dyn-color-surface-muted, #f8fafc)',
        width: 'min(100%, 420px)',
        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)',
      }}
    >
      <h2
        id="contact-form-heading"
        style={{ margin: 0, fontSize: '1.125rem', color: 'var(--dyn-color-text-primary, #0f172a)' }}
      >
        Contact preferences
      </h2>

      <DynFieldContainer
        as="section"
        label="Full name"
        htmlFor="full-name"
        helpText="Use your legal name"
        p="md"
        gap="sm"
        mb="0"
        style={{ borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.3)', background: '#ffffff' }}
      >
        <input
          id="full-name"
          type="text"
          placeholder="Jane Doe"
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(148, 163, 184, 0.6)',
            fontSize: '1rem',
          }}
        />
      </DynFieldContainer>

      <DynFieldContainer
        as="section"
        label="How should we contact you?"
        htmlFor="preferred-email"
        optional
        p="md"
        gap="sm"
        mb="0"
        style={{ borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.3)', background: '#ffffff' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.95rem' }}>
            <input id="preferred-email" type="checkbox" /> Email notifications
          </label>
          <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.95rem' }}>
            <input id="preferred-sms" type="checkbox" /> SMS alerts
          </label>
          <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.95rem' }}>
            <input id="preferred-phone" type="checkbox" /> Phone call follow-ups
          </label>
        </div>
      </DynFieldContainer>

      <DynFieldContainer
        as="section"
        label="Additional context"
        htmlFor="context"
        helpText="Let us know how we can best assist you"
        p="md"
        gap="sm"
        mb="0"
        style={{ borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.3)', background: '#ffffff' }}
      >
        <textarea
          id="context"
          rows={3}
          placeholder="Share project details or preferred meeting times"
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(148, 163, 184, 0.6)',
            fontSize: '1rem',
            resize: 'vertical',
          }}
        />
      </DynFieldContainer>
    </form>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <DynFieldContainer label="Basic Field">
        <input type="text" placeholder="Basic input" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
      </DynFieldContainer>

      <DynFieldContainer label="Required Field" required>
        <input type="text" placeholder="Required input" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
      </DynFieldContainer>

      <DynFieldContainer label="Optional Field" optional>
        <input type="text" placeholder="Optional input" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
      </DynFieldContainer>

      <DynFieldContainer label="Field with Help" helpText="This field needs some explanation">
        <input type="text" placeholder="Input with help" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
      </DynFieldContainer>

      <DynFieldContainer label="Field with Error" errorText="This field has an error">
        <input type="text" placeholder="Input with error" style={{ padding: '8px', border: '1px solid #e53e3e', borderRadius: '4px' }} />
      </DynFieldContainer>
    </div>
  ),
};
