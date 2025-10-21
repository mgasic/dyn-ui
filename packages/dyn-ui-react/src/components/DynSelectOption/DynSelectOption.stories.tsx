import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DynSelectOption } from './DynSelectOption';
import type { DynSelectOptionProps } from './DynSelectOption.types';

const meta: Meta<typeof DynSelectOption> = {
  title: 'Components/Form/DynSelect/DynSelectOption',
  component: DynSelectOption,
  argTypes: {
    onSelect: { action: 'select' },
    onActivate: { action: 'activate' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<DynSelectOptionProps>;

type StoryProps = DynSelectOptionProps & {
  onSelect?: DynSelectOptionProps['onSelect'];
  onActivate?: DynSelectOptionProps['onActivate'];
};

const Template = (args: StoryProps) => {
  const [activeIndex, setActiveIndex] = useState(args.index);
  const [selected, setSelected] = useState(args.isSelected);

  return (
    <DynSelectOption
      {...args}
      isActive={activeIndex === args.index}
      isSelected={selected}
      onActivate={() => {
        setActiveIndex(args.index);
        args.onActivate?.(args.index);
      }}
      onSelect={(option) => {
        setSelected((current) => !current);
        args.onSelect?.(option);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'option-1',
    index: 0,
    option: { value: 'value-1', label: 'Disponível' },
    isSelected: false,
    isActive: false,
    isMultiple: false,
  },
};

export const Active: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    isActive: true,
  },
};

export const Selected: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    option: { value: 'value-1', label: 'Indisponível', disabled: true },
  },
};

export const Multiple: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    isMultiple: true,
    isSelected: true,
  },
};
