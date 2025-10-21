import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types/theme';

export type BoxDisplay =
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'none';

export type BoxPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type SpacingSize = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
export type DynBoxBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type ResponsiveSpacingValue =
  | SpacingSize
  | Partial<Record<DynBoxBreakpoint, SpacingSize>>;

export type BackgroundVariant =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'none'
  | string;
export type BorderRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
export type BorderVariant = 'none' | 'default' | 'subtle' | 'strong' | string;
export type Shadow = 'none' | 'sm' | 'md' | 'lg' | string;
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type Overflow = 'visible' | 'hidden' | 'auto' | 'scroll';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type AlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
export type AlignContent = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';

export interface ResponsiveVisibilityProps {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  mobileOnly?: boolean;
  tabletOnly?: boolean;
  desktopOnly?: boolean;
}

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

export interface DynBoxOwnProps
  extends BaseComponentProps,
    AccessibilityProps,
    ResponsiveVisibilityProps {
  display?: BoxDisplay;
  position?: BoxPosition;

  // Primary spacing API
  padding?: ResponsiveSpacingValue;
  p?: ResponsiveSpacingValue; // alias for padding
  px?: ResponsiveSpacingValue;
  py?: ResponsiveSpacingValue;
  pt?: ResponsiveSpacingValue;
  pr?: ResponsiveSpacingValue;
  pb?: ResponsiveSpacingValue;
  pl?: ResponsiveSpacingValue;

  m?: ResponsiveSpacingValue;
  mx?: ResponsiveSpacingValue;
  my?: ResponsiveSpacingValue;
  mt?: ResponsiveSpacingValue;
  mr?: ResponsiveSpacingValue;
  mb?: ResponsiveSpacingValue;
  ml?: ResponsiveSpacingValue;

  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  // Color API
  background?: BackgroundVariant;
  bg?: BackgroundVariant; // alias for background
  backgroundColor?: string;
  color?: string;

  // Border API
  border?: BorderVariant;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  radius?: BorderRadius;
  borderRadius?: BorderRadius; // alias for radius
  customBorderRadius?: string;

  // Effects
  shadow?: Shadow;

  textAlign?: TextAlign;

  // Overflow
  overflow?: Overflow;
  overflowX?: Overflow;
  overflowY?: Overflow;

  // Flex/Grid
  direction?: FlexDirection;
  flexDirection?: FlexDirection; // alias for direction
  wrap?: FlexWrap;
  justify?: JustifyContent;
  align?: AlignItems;
  alignContent?: AlignContent;
  gap?: ResponsiveSpacingValue;
  rowGap?: ResponsiveSpacingValue;
  columnGap?: ResponsiveSpacingValue;

  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;

  // Positioning
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;

  interactive?: boolean;

  cssVars?: Record<string, string | number>;

  ariaLiveMessage?: string;
  ariaLivePoliteness?: 'polite' | 'assertive' | 'off';

  focusOnMount?: boolean;
}

export type DynBoxProps<E extends ElementType = 'div'> = PolymorphicComponentProps<
  E,
  DynBoxOwnProps
> & {
  as?: E;
  onClick?: MouseEventHandler<any>;
  onKeyDown?: KeyboardEventHandler<any>;
};

export type DynBoxRef<E extends ElementType = 'div'> = ComponentRef<E>;

export interface DynBoxDefaultProps {
  'data-testid': string;
}

export const DYN_BOX_DEFAULT_PROPS: DynBoxDefaultProps = {
  'data-testid': 'dyn-box',
};
