import type { ComponentPropsWithoutRef, ComponentRef, ElementType, ReactNode } from 'react';

export type DynComponentNameElement = ElementType;

export type DynComponentNameSpacingToken = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';

export type DynComponentNameBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export type DynComponentNameSpacingValue = DynComponentNameSpacingToken | string | number;

export type DynComponentNameResponsiveSpacingValue =
  | DynComponentNameSpacingValue
  | Partial<Record<DynComponentNameBreakpoint, DynComponentNameSpacingValue>>;

export type DynComponentNameOwnProps = {
  /**
   * Change the underlying HTML element while keeping all spacing behaviour intact.
   * Accepts both native tags and custom React components.
   */
  as?: DynComponentNameElement;
  /** Optional gap spacing token or raw CSS length. */
  gap?: DynComponentNameResponsiveSpacingValue;
  /** Optional padding spacing token or raw CSS length. */
  p?: DynComponentNameResponsiveSpacingValue;
  /** Optional margin spacing token or raw CSS length. */
  m?: DynComponentNameResponsiveSpacingValue;
  /** Custom className merged with the component root. */
  className?: string;
  /** Inline style overrides merged after computed CSS variables. */
  style?: ComponentPropsWithoutRef<'div'>['style'];
  /** Test id for querying in tests. */
  'data-testid'?: string;
  children?: ReactNode;
};

export type DynComponentNameProps<E extends ElementType = 'div'> = DynComponentNameOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof DynComponentNameOwnProps>;

export type DynComponentNameRef<E extends ElementType = 'div'> = ComponentRef<E>;
