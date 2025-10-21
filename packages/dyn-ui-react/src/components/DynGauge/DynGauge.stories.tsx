import type { Meta, StoryObj } from '@storybook/react';
import { DynGauge } from './DynGauge';
import type { DynGaugeProps } from './DynGauge.types';

const meta: Meta<typeof DynGauge> = {
  title: 'Components/DataDisplay/DynGauge',
  component: DynGauge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Gauge component for displaying progress and metrics with customizable appearance. Automatically derives accessible progressbar labels using provided titles, aria-labels, and value formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['arc', 'circle', 'line'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<DynGaugeProps>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Progress',
  },
};

export const Linear: Story = {
  args: {
    type: 'line',
    value: 45,
    label: 'Linear Gauge',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <DynGauge size="small" value={60} label="Small" />
      <DynGauge size="medium" value={60} label="Medium" />
      <DynGauge size="large" value={60} label="Large" />
    </div>
  ),
};

export const DifferentValues: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <DynGauge value={25} label="25%" />
      <DynGauge value={50} label="50%" />
      <DynGauge value={75} label="75%" />
      <DynGauge value={100} label="100%" />
    </div>
  ),
};

export const BothTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3>Circular Gauges</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <DynGauge type="circle" value={30} label="Low" />
          <DynGauge type="circle" value={65} label="Medium" />
          <DynGauge type="circle" value={90} label="High" />
        </div>
      </div>

      <div style={{ textAlign: 'center', width: '100%' }}>
        <h3>Linear Gauges</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
          <DynGauge type="line" value={30} label="CPU Usage" />
          <DynGauge type="line" value={65} label="Memory" />
          <DynGauge type="line" value={90} label="Storage" />
        </div>
      </div>
    </div>
  ),
};

export const AccessibleUsage: Story = {
  args: {
    value: 72,
    showValue: false,
    format: value => `${Math.round(value)}% utilized`,
    'aria-label': 'Database CPU utilization',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `showValue` is hidden, the gauge still announces its formatted value to assistive technologies via `aria-valuetext`. You can override the accessible label with `aria-label` and provide custom text with `aria-valuetext` if needed.',
      },
    },
  },
};
