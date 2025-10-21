import type { Meta, StoryObj } from '@storybook/react';
import { DynChart } from './DynChart';
import type { ChartDataPoint, ChartSeries, DynChartProps } from './DynChart.types';

const sampleDataPoints: ChartDataPoint[] = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 52 },
  { label: 'Apr', value: 89 },
  { label: 'May', value: 94 },
  { label: 'Jun', value: 71 },
];

const multiSeriesData: ChartSeries[] = [
  {
    name: 'Revenue',
    data: sampleDataPoints,
    color: '#0066cc',
  },
  {
    name: 'Costs',
    data: sampleDataPoints.map(point => ({ ...point, value: point.value * 0.7 })),
    color: '#f44336',
  },
  {
    name: 'Profit',
    data: sampleDataPoints.map(point => ({ ...point, value: point.value * 0.3 })),
    color: '#00b248',
  },
];

const pieData: ChartDataPoint[] = [
  { label: 'Desktop', value: 45, color: '#0066cc' },
  { label: 'Mobile', value: 35, color: '#00b248' },
  { label: 'Tablet', value: 15, color: '#f44336' },
  { label: 'Other', value: 5, color: '#ff9800' },
];

const meta = {
  title: 'Data Display/DynChart',
  component: DynChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile chart component that supports line, bar, pie and area visualisations with dynamic styling, built-in legend and tooltip support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['line', 'bar', 'pie', 'area'],
      description: 'Select the chart visualisation variant.',
    },
    title: {
      control: 'text',
      description: 'Chart title used for visual and accessible labelling.',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle displayed below the title.',
    },
    ariaDescription: {
      control: 'text',
      description: 'Descriptive text exposed to assistive technologies via figcaption.',
    },
    'aria-label': {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label applied directly to the chart canvas element.',
    },
    'aria-labelledby': {
      control: 'text',
      name: 'aria-labelledby',
      description:
        'ID reference list used to provide an accessible name for the chart when external headings are preferred.',
    },
    'aria-describedby': {
      control: 'text',
      name: 'aria-describedby',
      description:
        'ID reference list merged with subtitle and ariaDescription to describe the chart for assistive tech.',
    },
    role: {
      control: 'text',
      description: 'Overrides the default "img" role applied to the canvas element.',
    },
    width: {
      control: { type: 'number', min: 200, max: 1000 },
      description: 'Canvas width in pixels.',
    },
    height: {
      control: { type: 'number', min: 150, max: 600 },
      description: 'Canvas height in pixels.',
    },
    showLegend: {
      control: 'boolean',
      description: 'Toggle the legend visibility.',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Toggle tooltip interactions.',
    },
    showGrid: {
      control: 'boolean',
      description: 'Toggle axis grid rendering (non-pie charts).',
    },
  },
  args: {
    data: sampleDataPoints,
    type: 'line',
    title: 'Monthly Sales',
    subtitle: 'Sales performance over six months',
    width: 500,
    height: 300,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
  } satisfies DynChartProps,
} satisfies Meta<typeof DynChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Line: Story = {
  args: {
    type: 'line',
    title: 'Trend Line',
    data: sampleDataPoints,
  },
};

export const Bar: Story = {
  args: {
    type: 'bar',
    title: 'Bar Comparison',
    data: sampleDataPoints,
  },
};

export const Pie: Story = {
  args: {
    type: 'pie',
    title: 'Device Usage Distribution',
    subtitle: 'Percentage of users by device type',
    data: pieData,
    width: 400,
    height: 400,
    showGrid: false,
  },
};

export const Area: Story = {
  args: {
    type: 'area',
    title: 'Area Highlight',
    data: sampleDataPoints,
  },
};

export const MultiSeries: Story = {
  args: {
    type: 'line',
    title: 'Financial Performance',
    subtitle: 'Revenue, costs and profit over time',
    data: multiSeriesData,
    width: 640,
    height: 360,
  },
};

export const NoLegend: Story = {
  args: {
    showLegend: false,
  },
};

export const NoTooltip: Story = {
  args: {
    showTooltip: false,
  },
};

export const CustomColors: Story = {
  args: {
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    title: 'No Data Example',
  },
};

export const WithDescription: Story = {
  args: {
    ariaDescription: 'This chart compares revenue, costs and profit for the last six months.',
  },
};
