import type { ComponentPropsWithoutRef } from 'react';
import type { BaseComponentProps, AccessibilityProps } from '../../types/theme';

export const DYN_DIVIDER_VARIANTS = ['horizontal', 'vertical', 'text'] as const;
export type DynDividerVariant = (typeof DYN_DIVIDER_VARIANTS)[number];

export const DYN_DIVIDER_SIZES = ['sm', 'md', 'lg'] as const;
export type DynDividerSize = (typeof DYN_DIVIDER_SIZES)[number];

export const DYN_DIVIDER_COLORS = [
  'default',
  'subtle',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
] as const;
export type DynDividerColor = (typeof DYN_DIVIDER_COLORS)[number];

export type DynDividerLabelPosition = 'left' | 'center' | 'right';

export interface DynDividerProps
  extends BaseComponentProps,
    AccessibilityProps,
    Omit<ComponentPropsWithoutRef<'div'>, keyof BaseComponentProps | keyof AccessibilityProps> {
  /** Visual variant of the divider */
  variant?: DynDividerVariant;
  /** Size token that controls spacing and thickness */
  size?: DynDividerSize;
  /** Color token for the divider */
  color?: DynDividerColor;
  /** Label text to display */
  label?: string;
  /** Position of the label */
  labelPosition?: DynDividerLabelPosition;
}

export type DynDividerRef = HTMLDivElement;

export interface DynDividerDefaultProps {
  variant: DynDividerVariant;
  size: DynDividerSize;
  color: DynDividerColor;
  labelPosition: DynDividerLabelPosition;
  'data-testid': string;
}

export const DYN_DIVIDER_DEFAULT_PROPS: DynDividerDefaultProps = {
  variant: 'horizontal',
  size: 'md',
  color: 'default',
  labelPosition: 'center',
  'data-testid': 'dyn-divider',
};