import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynSelect } from './DynSelect';
import type { DynSelectProps } from '../../types/field.types';

const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
  { value: 'option5', label: 'Option 5' },
];

const largeOptionSet = Array.from({ length: 100 }, (_, i) => ({
  value: `option${i + 1}`,
  label: `Option ${i + 1}`,
}));

const meta: Meta<typeof DynSelect> = {
  title: 'Components/Form/DynSelect',
  component: DynSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced select component with search, multiple selection, virtual scrolling support, and full keyboard navigation via active option tracking.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    multiple: {
      control: 'boolean',
    },
    searchable: {
      control: 'boolean',
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
    loading: {
      control: 'boolean',
    },
    onChange: {
      action: 'changed',
    },
  },
};

export default meta;
type Story = StoryObj<DynSelectProps>;

export const Default: Story = {
  args: {
    name: 'default-select',
    label: 'Select Option',
    options: sampleOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use Arrow keys, Home/End, PageUp/PageDown, or type a character to move the active option. Press Enter or Space to confirm the highlighted choice.',
      },
    },
  },
};

Default.parameters = {
  docs: {
    description: {
      story:
        'Use Arrow keys, Home/End, Page Up/Down, and type-to-search to change the active option. The highlighted option follows aria-activedescendant and Enter or Space will confirm the selection.',
    },
  },
};

export const WithValue: Story = {
  args: {
    name: 'with-value-select',
    label: 'Select with Value',
    options: sampleOptions,
    value: 'option2',
  },
};

export const Multiple: Story = {
  args: {
    name: 'multiple-select',
    label: 'Multiple Select',
    options: sampleOptions,
    multiple: true,
    value: ['option1', 'option3'],
  },
};

export const Searchable: Story = {
  args: {
    name: 'searchable-select',
    label: 'Searchable Select',
    options: largeOptionSet,
    searchable: true,
  },
};

export const SearchableMultiple: Story = {
  args: {
    name: 'searchable-multiple-select',
    label: 'Searchable Multiple Select',
    options: largeOptionSet,
    searchable: true,
    multiple: true,
  },
};

export const Required: Story = {
  args: {
    name: 'required-select',
    label: 'Required Select',
    options: sampleOptions,
    required: true,
  },
};

export const WithHelp: Story = {
  args: {
    name: 'help-select',
    label: 'Select with Help',
    options: sampleOptions,
    help: 'Choose one of the available options from the dropdown.',
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled-select',
    label: 'Disabled Select',
    options: sampleOptions,
    disabled: true,
    value: 'option1',
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'readonly-select',
    label: 'Readonly Select',
    options: sampleOptions,
    readonly: true,
    value: 'option2',
  },
};

export const Loading: Story = {
  args: {
    name: 'loading-select',
    label: 'Loading Select',
    options: sampleOptions,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    name: 'error-select',
    label: 'Select with Error',
    options: sampleOptions,
    errorMessage: 'Please select an option.',
    required: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <DynSelect name="small" label="Small Select" options={sampleOptions} size="small" />
      <DynSelect name="medium" label="Medium Select" options={sampleOptions} size="medium" />
      <DynSelect name="large" label="Large Select" options={sampleOptions} size="large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <h3>Basic Select</h3>
        <DynSelect name="basic" label="Basic Select" options={sampleOptions} />
      </div>

      <div>
        <h3>Multiple Select</h3>
        <DynSelect name="multiple" label="Multiple Select" options={sampleOptions} multiple />
      </div>

      <div>
        <h3>Searchable Select</h3>
        <DynSelect name="searchable" label="Searchable Select" options={largeOptionSet.slice(0, 20)} searchable />
      </div>

      <div>
        <h3>With States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DynSelect name="disabled" label="Disabled" options={sampleOptions} disabled value="option1" />
          <DynSelect name="readonly" label="Readonly" options={sampleOptions} readonly value="option2" />
          <DynSelect name="loading" label="Loading" options={sampleOptions} loading />
          <DynSelect name="error" label="With Error" options={sampleOptions} errorMessage="Required field" />
        </div>
      </div>
    </div>
  ),
};
