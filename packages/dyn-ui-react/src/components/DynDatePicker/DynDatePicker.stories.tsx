import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DynDatePicker } from './DynDatePicker';
import type { DynDatePickerProps } from '../../types/field.types';

const meta: Meta<typeof DynDatePicker> = {
  title: 'Components/Form/DynDatePicker',
  component: DynDatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced date picker with natural language parsing and validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    format: {
      control: 'select',
      options: ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'],
    },
    disabled: {
      control: 'boolean',
    },
    readonly: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    onChange: {
      action: 'changed',
    },
  },
};

export default meta;
type Story = StoryObj<DynDatePickerProps>;

export const Default: Story = {
  args: {
    name: 'default-date',
    label: 'Select Date',
  },
};

export const WithValue: Story = {
  args: {
    name: 'with-value-date',
    label: 'Date with Value',
    value: new Date('2023-12-25'),
  },
};

export const Required: Story = {
  args: {
    name: 'required-date',
    label: 'Required Date',
    required: true,
  },
};

export const WithHelp: Story = {
  args: {
    name: 'help-date',
    label: 'Date with Help',
    help: 'Select your preferred date. You can type naturally like "today", "tomorrow", or use dd/mm/yyyy format.',
  },
};

export const WithMinMax: Story = {
  args: {
    name: 'minmax-date',
    label: 'Date with Restrictions',
    help: 'Select a date between January 1st and December 31st, 2024',
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31'),
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled-date',
    label: 'Disabled Date Picker',
    disabled: true,
    value: new Date(),
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'readonly-date',
    label: 'Readonly Date Picker',
    readonly: true,
    value: new Date(),
  },
};

export const WithError: Story = {
  args: {
    name: 'error-date',
    label: 'Date with Error',
    errorMessage: 'Please select a valid date.',
    required: true,
  },
};

export const DifferentFormats: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '300px' }}>
      <DynDatePicker
        name="br-format"
        label="Brazilian Format (dd/MM/yyyy)"
        format="dd/MM/yyyy"
        value={new Date('2023-12-25')}
      />
      <DynDatePicker
        name="us-format"
        label="US Format (MM/dd/yyyy)"
        format="MM/dd/yyyy"
        value={new Date('2023-12-25')}
      />
      <DynDatePicker
        name="iso-format"
        label="ISO Format (yyyy-MM-dd)"
        format="yyyy-MM-dd"
        value={new Date('2023-12-25')}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <DynDatePicker name="small" label="Small Date Picker" size="small" />
      <DynDatePicker name="medium" label="Medium Date Picker" size="medium" />
      <DynDatePicker name="large" label="Large Date Picker" size="large" />
    </div>
  ),
};

export const InteractiveExample: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

    return (
      <div style={{ width: '300px' }}>
        <DynDatePicker
          name="interactive-date"
          label="Interactive Date Picker"
          help="Try typing: 'hoje', 'amanhã', '25/12/2023', or any natural date"
          value={selectedDate}
          onChange={setSelectedDate}
        />

        {selectedDate && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Selected Date:</strong><br />
            <code>{selectedDate.toISOString().split('T')[0]}</code><br />
            <small>{selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</small>
          </div>
        )}
      </div>
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
        Use the arrow keys, Home/End, and PageUp/PageDown to move the roving focus across the
        calendar grid. Press Enter to select and Escape to close.
      </p>
      <DynDatePicker name="keyboard" label="Keyboard navigation" />
    </div>
  ),
};

export const LocalizationExamples: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <DynDatePicker name="locale-pt" label="Português (Brasil)" locale="pt-BR" />
      <DynDatePicker name="locale-en" label="English (US)" locale="en-US" format="MM/dd/yyyy" />
      <DynDatePicker name="locale-fr" label="Français" locale="fr-FR" format="dd/MM/yyyy" />
    </div>
  ),
};

export const RangeValidation: Story = {
  args: {
    name: 'range-validation',
    label: 'Conference window',
    locale: 'en-US',
    minDate: new Date('2024-05-10'),
    maxDate: new Date('2024-05-20'),
    help: 'Only conference dates between May 10 and May 20, 2024 are available.',
  },
};

export const OpenAndCloseBehaviors: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DynDatePicker name="open-close" label="Try opening with the keyboard" />
      <ul style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '1.25rem', color: '#4b5563' }}>
        <li>Press Enter or Arrow Down while focused on the input to open the calendar.</li>
        <li>Press Escape to close the dropdown from either the input or the calendar grid.</li>
        <li>Choosing a day commits the selection and returns focus to the field.</li>
      </ul>
    </div>
  ),
};
