import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  CSSProperties,
  ElementType,
} from 'react';
import type { BaseComponentProps } from '../../types/theme';

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P | 'as'>;

export type DynNewComponentSpacingToken = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
export type DynNewComponentSpacingValue =
  | DynNewComponentSpacingToken
  | number
  | string;

export interface DynNewComponentOwnProps extends BaseComponentProps {
  /** Controls the gap between child elements. */
  gap?: DynNewComponentSpacingValue;
  /** Applies padding using spacing tokens, raw CSS values or numbers. */
  p?: DynNewComponentSpacingValue;
  /** Applies margin using spacing tokens, raw CSS values or numbers. */
  m?: DynNewComponentSpacingValue;
  /** Inline style overrides. */
  style?: CSSProperties;
}

export type DynNewComponentBaseProps = DynNewComponentOwnProps;

export type DynNewComponentProps<E extends ElementType = 'div'> =
  PolymorphicComponentProps<E, DynNewComponentBaseProps> & {
    as?: E;
  };

export type DynNewComponentRef<E extends ElementType = 'div'> = ComponentRef<E>;

export interface DynNewComponentDefaultProps {
  'data-testid': string;
}

export const DYN_NEW_COMPONENT_DEFAULT_PROPS: DynNewComponentDefaultProps = {
  'data-testid': 'dyn-new-component',
};
