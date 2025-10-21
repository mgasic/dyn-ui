import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynLabel } from './DynLabel';
import type { DynLabelProps } from '../../types/label.types';

const meta: Meta<typeof DynLabel> = {
  title: 'Components/Display/DynLabel',
  component: DynLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Label component for form fields and general text display with semantic styling. Styling is now provided solely via the CSS module after removing the legacy SCSS asset.',
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
type Story = StoryObj<DynLabelProps>;

export const Default: Story = {
  args: {
    children: 'Default Label',
  },
};

export const Required: Story = {
  args: {
    children: 'Required Label',
    required: true,
  },
};

export const Optional: Story = {
  args: {
    children: 'Optional Label',
    optional: true,
  },
};

export const WithHtmlFor: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <DynLabel htmlFor="example-input" required>
        Email Address
      </DynLabel>
      <input
        id="example-input"
        type="email"
        placeholder="Enter your email"
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DynLabel>Basic Label</DynLabel>
      <DynLabel required>Required Label</DynLabel>
      <DynLabel optional>Optional Label</DynLabel>
      <DynLabel className="custom-style" style={{ color: '#007acc' }}>Styled Label</DynLabel>
    </div>
  ),
};
