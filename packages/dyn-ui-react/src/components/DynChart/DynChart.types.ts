import type { AccessibilityProps, BaseComponentProps } from '../../types';

export interface ChartDataPoint {
  label?: string;
  value: number;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface ChartAxis {
  title?: string;
  min?: number;
  max?: number;
  showLabels?: boolean;
}

export type ChartType = 'line' | 'bar' | 'pie' | 'area';

export type DynChartData = ChartDataPoint[] | ChartSeries[];

export interface DynChartOptions {
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
}

export interface DynChartProps
  extends BaseComponentProps,
    DynChartOptions,
    AccessibilityProps {
  /** Chart type */
  type?: ChartType;

  /** Chart data - can be array of data points or series */
  data?: DynChartData;

  /** Chart title */
  title?: string;

  /** Chart subtitle */
  subtitle?: string;

  /** Chart width in pixels */
  width?: number;

  /** Chart height in pixels */
  height?: number;

  /** Color palette for chart elements */
  colors?: string[];

  /** X axis configuration */
  xAxis?: ChartAxis;

  /** Y axis configuration */
  yAxis?: ChartAxis;

  /** Accessible description for assistive technologies */
  ariaDescription?: string;
}

export interface NormalizedChartSeries extends ChartSeries {
  color: string;
}

export interface DynChartLegendItem {
  id: string;
  label: string;
  color: string;
  seriesIndex: number;
}

export type DynChartDefaultProps = Required<
  Pick<
    DynChartProps,
    'type' | 'data' | 'width' | 'height' | 'colors' | 'showLegend' | 'showTooltip' | 'showGrid'
  >
>;

export const DYN_CHART_DEFAULT_PROPS: DynChartDefaultProps = {
  type: 'line',
  data: [],
  width: 400,
  height: 300,
  colors: ['#0066cc', '#00b248', '#f44336', '#ff9800', '#9c27b0'],
  showLegend: true,
  showTooltip: true,
  showGrid: true,
};

export type DynChartType = DynChartProps;
