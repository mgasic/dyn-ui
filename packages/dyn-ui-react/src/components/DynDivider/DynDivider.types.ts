export type DividerSize = 'small' | 'medium' | 'large';

export interface DynDividerProps {
  label?: string;
  borderWidth?: DividerSize;
  className?: string;
}

export interface DynDividerRef {
  focus(): void;
}

export const DIVIDER_COORDINATES = {
  small: { x1: '0.1%', x2: '99.9%' },
  medium: { x1: '0.2%', x2: '99.8%' },
  large: { x1: '0.3%', x2: '99.7%' }
} as const;
