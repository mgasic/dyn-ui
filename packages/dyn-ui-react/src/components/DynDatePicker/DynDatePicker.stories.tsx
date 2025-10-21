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

export const KeyboardNavigationDemo: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(new Date());

    return (
      <DynDatePicker
        name="keyboard-demo"
        label="Keyboard navigation demo"
        locale="en-US"
        format="MM/dd/yyyy"
        value={value}
        onChange={setValue}
        help="Press Enter or ArrowDown to open, use Arrow keys/Home/End to move focus, and Enter to select."
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the roving focus calendar. Use the keyboard to open the picker, move between days, and press Escape to close.',
      },
    },
  },
};

export const OpenCloseBehavior: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(null);
    const [status, setStatus] = React.useState('Calendar ready');

    const handleChange: DynDatePickerProps['onChange'] = next => {
      setValue(next ?? null);
      if (next) {
        setStatus(`Selected ${next.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}`);
      } else {
        setStatus('Cleared selection');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px' }}>
        <DynDatePicker
          name="open-close"
          label="Open & close behavior"
          locale="en-US"
          format="MM/dd/yyyy"
          help="Press Enter or ArrowDown to open. Use Escape to close the calendar and return focus to the field."
          value={value}
          onChange={handleChange}
        />
        <p style={{ margin: 0 }}>Status: {status}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Highlights the default open/close interactions. Selecting a day closes the dropdown and updates the status text.',
      },
    },
  },
};

export const LocalizedWeekStarts: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      }}
    >
      <DynDatePicker
        name="locale-us"
        label="United States"
        locale="en-US"
        format="MM/dd/yyyy"
        help="Calendar starts on Sunday."
      />
      <DynDatePicker
        name="locale-gb"
        label="United Kingdom"
        locale="en-GB"
        format="dd/MM/yyyy"
        help="Calendar starts on Monday."
      />
      <DynDatePicker
        name="locale-de"
        label="Germany"
        locale="de-DE"
        format="dd.MM.yyyy"
        help="Localized weekday abbreviations and formatting."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compares how the calendar grid reflects locale-specific weekday ordering and formatting.',
      },
    },
  },
};
