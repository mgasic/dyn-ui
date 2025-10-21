import type React from 'react';

export type DynTreeNodeBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export type DynTreeNodeSpacingToken = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';

export type DynTreeNodeSpacingPrimitive = DynTreeNodeSpacingToken | number | string;

export type DynTreeNodeResponsiveSpacingValue =
  | DynTreeNodeSpacingPrimitive
  | Partial<Record<DynTreeNodeBreakpoint, DynTreeNodeSpacingPrimitive>>;

export interface DynTreeNodeSpacingProps {
  padding?: DynTreeNodeResponsiveSpacingValue;
  p?: DynTreeNodeResponsiveSpacingValue;
  px?: DynTreeNodeResponsiveSpacingValue;
  py?: DynTreeNodeResponsiveSpacingValue;
  pt?: DynTreeNodeResponsiveSpacingValue;
  pr?: DynTreeNodeResponsiveSpacingValue;
  pb?: DynTreeNodeResponsiveSpacingValue;
  pl?: DynTreeNodeResponsiveSpacingValue;
  margin?: DynTreeNodeResponsiveSpacingValue;
  m?: DynTreeNodeResponsiveSpacingValue;
  mx?: DynTreeNodeResponsiveSpacingValue;
  my?: DynTreeNodeResponsiveSpacingValue;
  mt?: DynTreeNodeResponsiveSpacingValue;
  mr?: DynTreeNodeResponsiveSpacingValue;
  mb?: DynTreeNodeResponsiveSpacingValue;
  ml?: DynTreeNodeResponsiveSpacingValue;
  gap?: DynTreeNodeResponsiveSpacingValue;
  rowGap?: DynTreeNodeResponsiveSpacingValue;
  columnGap?: DynTreeNodeResponsiveSpacingValue;
}

export interface DynTreeNodeBaseProps<E extends React.ElementType = 'div'>
  extends DynTreeNodeSpacingProps {
  /**
   * Polymorphic component element type.
   * Defaults to a `div` so the node behaves as a semantic wrapper by default.
   */
  as?: E;
  /** Layout direction for the node. */
  direction?: 'row' | 'column';
  /** Horizontal and vertical alignment helpers. */
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  /** Spacing helpers following Dyn UI spacing tokens. */
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type DynTreeNodeProps<E extends React.ElementType = 'div'> = DynTreeNodeBaseProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof DynTreeNodeBaseProps | 'as'>;

export type DynTreeNodeComponent = <E extends React.ElementType = 'div'>(
  props: DynTreeNodeProps<E> & { ref?: React.Ref<React.ElementRef<E>> }
) => React.ReactElement | null;
