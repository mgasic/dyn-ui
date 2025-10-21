import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';
import type { BaseComponentProps } from '../../types/theme';
import type {
  LayoutAlignment,
  LayoutDirection,
  LayoutJustify,
  LayoutSize,
  LayoutSpacing,
} from '../../types/layout.types';

export type DynContainerBackground = 'none' | 'surface' | 'card';
export type DynContainerLayout = 'fluid' | 'fixed';
export type DynContainerMaxWidthToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DynContainerSpaceValue = LayoutSpacing | number | string;

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

export interface DynContainerOwnProps {
  /** Optional title displayed above the content */
  title?: string;
  /** Optional subtitle displayed under the title */
  subtitle?: string;
  /** Layout direction for the content area */
  direction?: LayoutDirection;
  /** Cross-axis alignment for content */
  align?: LayoutAlignment;
  /** Main-axis alignment for content */
  justify?: LayoutJustify;
  /** Spacing between content elements */
  spacing?: LayoutSpacing;
  /** Visual size variant which controls internal padding */
  size?: LayoutSize;
  /** Controls whether the container has a border */
  bordered?: boolean;
  /** Controls whether the container has a shadow */
  shadow?: boolean;
  /** Background style variant */
  background?: DynContainerBackground;
  /** Fixed height for the container */
  height?: number | string;
  /** Maximum width constraint, accepts design tokens or raw CSS values */
  maxWidth?: number | string | DynContainerMaxWidthToken;
  /** Layout behavior for responsive alignment */
  layout?: DynContainerLayout;
  /** Optional padding override using spacing tokens or raw CSS values */
  padding?: DynContainerSpaceValue;
  /** Optional margin override using spacing tokens or raw CSS values */
  margin?: DynContainerSpaceValue;
  /** Render prop children are supported in addition to nodes */
  children?: ReactNode;
  /** Removes border regardless of bordered value (legacy prop support) */
  noBorder?: boolean;
  /** Removes padding regardless of size value (legacy prop support) */
  noPadding?: boolean;
  /** Inline style overrides */
  style?: CSSProperties;
}

export type DynContainerBaseProps = BaseComponentProps & DynContainerOwnProps;

export type DynContainerProps<E extends ElementType = 'div'> =
  PolymorphicComponentProps<E, DynContainerBaseProps> & {
    as?: E;
  };

export type DynContainerRef<E extends ElementType = 'div'> = ComponentRef<E>;

export interface DynContainerDefaultProps {
  direction: LayoutDirection;
  spacing: LayoutSpacing;
  size: LayoutSize;
  background: DynContainerBackground;
  bordered: boolean;
  shadow: boolean;
  layout: DynContainerLayout;
  'data-testid': string;
}

export const DYN_CONTAINER_DEFAULT_PROPS: DynContainerDefaultProps = {
  direction: 'vertical',
  spacing: 'md',
  size: 'medium',
  background: 'surface',
  bordered: true,
  shadow: false,
  layout: 'fluid',
  'data-testid': 'dyn-container',
};
