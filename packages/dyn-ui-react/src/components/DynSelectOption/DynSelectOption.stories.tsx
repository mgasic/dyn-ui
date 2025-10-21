import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynSelectOption } from './DynSelectOption';
import type { DynSelectOptionProps } from './DynSelectOption.types';

const sampleOption = { value: 'option-1', label: 'Option 1' };

const meta: Meta<typeof DynSelectOption> = {
  title: 'Components/Form/DynSelect/DynSelectOption',
  component: DynSelectOption,
  args: {
    id: 'option-story',
    option: sampleOption,
    isSelected: false,
    isActive: false,
    onSelect: () => undefined,
    onActivate: () => undefined,
  },
  argTypes: {
    onSelect: { action: 'select' },
    onActivate: { action: 'activate' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Low-level building block used by DynSelect to render individual options with ARIA attributes and interactive states.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<DynSelectOptionProps>;

export const Default: Story = {
  args: {
    children: 'Option 1',
  },
};

export const Active: Story = {
  args: {
    children: 'Active option',
    isActive: true,
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected option',
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled option',
    option: { ...sampleOption, disabled: true },
  },
};

export const MultipleSelected: Story = {
  args: {
    children: 'Selected in multi-select',
    multiple: true,
    isSelected: true,
  },
};

export const Showcase: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '220px' }}>
      <DynSelectOption {...args} id="option-showcase-1" option={sampleOption}>
        Default
      </DynSelectOption>
      <DynSelectOption
        {...args}
        id="option-showcase-2"
        option={sampleOption}
        isActive
      >
        Active
      </DynSelectOption>
      <DynSelectOption
        {...args}
        id="option-showcase-3"
        option={sampleOption}
        isSelected
      >
        Selected
      </DynSelectOption>
      <DynSelectOption
        {...args}
        id="option-showcase-4"
        option={{ ...sampleOption, disabled: true }}
      >
        Disabled
      </DynSelectOption>
      <DynSelectOption
        {...args}
        id="option-showcase-5"
        option={sampleOption}
        multiple
        isSelected
      >
        Multiple Selected
      </DynSelectOption>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
