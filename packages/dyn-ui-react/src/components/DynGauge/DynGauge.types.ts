import { BaseComponentProps } from '../../types';

export interface GaugeRange {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export type GaugeSize = 'small' | 'medium' | 'large';
export type GaugeType = 'arc' | 'circle' | 'line';

export interface DynGaugeProps extends BaseComponentProps {
  /** Current value to display */
  value: number;
  
  /** Minimum value */
  min?: number;
  
  /** Maximum value */
  max?: number;
  
  /** Gauge title */
  title?: string;
  
  /** Gauge label (alias for title) */
  label?: string;
  
  /** Gauge subtitle */
  subtitle?: string;
  
  /** Gauge type/style */
  type?: GaugeType;
  
  /** Unit of measurement */
  unit?: string;
  
  /** Color ranges */
  ranges?: GaugeRange[];
  
  /** Show the numeric value */
  showValue?: boolean;
  
  /** Show range indicators */
  showRanges?: boolean;
  
  /** Gauge size */
  size?: GaugeSize;
  
  /** Arc thickness */
  thickness?: number;
  
  /** Rounded line caps */
  rounded?: boolean;
  
  /** Animated transitions */
  animated?: boolean;
  
  /** Custom color (overrides range colors) */
  color?: string;
  
  /** Background arc color */
  backgroundColor?: string;
  
  /** Custom value formatter */
  format?: (value: number) => string;
}
