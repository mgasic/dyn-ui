import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  CSSProperties,
  ElementType,
} from 'react';
import type { BaseComponentProps } from '../../types';
import type { LayoutSpacing } from '../../types/layout.types';

export type DynStepSpacingValue = LayoutSpacing | number | string;

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

export interface DynStepOwnProps extends BaseComponentProps {
  /** Controls the vertical gap between children */
  spacing?: DynStepSpacingValue;
  /** Optional padding applied to the wrapper */
  padding?: DynStepSpacingValue;
  /** Optional inline style overrides */
  style?: CSSProperties;
}

export type DynStepBaseProps = DynStepOwnProps;

export type DynStepProps<E extends ElementType = 'section'> =
  PolymorphicComponentProps<E, DynStepBaseProps> & {
    as?: E;
  };

export type DynStepRef<E extends ElementType = 'section'> = ComponentRef<E>;

export interface DynStepDefaultProps {
  spacing: LayoutSpacing;
  as: 'section';
  'data-testid': string;
}

export const DYN_STEP_DEFAULT_PROPS: DynStepDefaultProps = {
  spacing: 'md',
  as: 'section',
  'data-testid': 'dyn-step',
};
