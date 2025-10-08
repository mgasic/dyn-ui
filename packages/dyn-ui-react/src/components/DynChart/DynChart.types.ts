import { BaseComponentProps } from '../../types';

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

export interface DynChartProps extends BaseComponentProps {
  /** Chart type */
  type?: ChartType;
  
  /** Chart data - can be array of data points or series */
  data: ChartDataPoint[] | ChartSeries[];
  
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
  
  /** Show legend */
  showLegend?: boolean;
  
  /** Show tooltip on hover */
  showTooltip?: boolean;
  
  /** Show grid lines */
  showGrid?: boolean;
  
  /** X axis configuration */
  xAxis?: ChartAxis;
  
  /** Y axis configuration */
  yAxis?: ChartAxis;
}

export type DynChartType = DynChartProps;
