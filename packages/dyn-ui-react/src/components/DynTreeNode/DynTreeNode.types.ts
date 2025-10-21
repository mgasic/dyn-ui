import type React from 'react';

export type DynTreeNodeSpacing =
  | 'none'
  | '0'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | number
  | string;

export interface DynTreeNodeBaseProps<E extends React.ElementType = 'div'> {
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
  gap?: DynTreeNodeSpacing;
  p?: DynTreeNodeSpacing;
  padding?: DynTreeNodeSpacing;
  m?: DynTreeNodeSpacing;
  margin?: DynTreeNodeSpacing;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type DynTreeNodeProps<E extends React.ElementType = 'div'> = DynTreeNodeBaseProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof DynTreeNodeBaseProps | 'as'>;

export type DynTreeNodeComponent = <E extends React.ElementType = 'div'>(
  props: DynTreeNodeProps<E> & { ref?: React.Ref<React.ElementRef<E>> }
) => React.ReactElement | null;
