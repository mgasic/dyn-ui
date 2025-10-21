import type { ElementType } from 'react';
import type { DynBoxProps, DynBoxRef, SpacingSize } from '../DynBox';

export type DynUIBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export type ResponsiveSpacingValue =
  | SpacingSize
  | Partial<Record<DynUIBreakpoint, SpacingSize>>;

export interface DynUISpacingProps {
  padding?: ResponsiveSpacingValue;
  p?: ResponsiveSpacingValue;
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
  gap?: ResponsiveSpacingValue;
  rowGap?: ResponsiveSpacingValue;
  columnGap?: ResponsiveSpacingValue;
}

export type DynUITone = 'surface' | 'muted' | 'elevated' | 'inverse';

type DynBoxLikeProps<E extends ElementType> = Omit<
  DynBoxProps<E>,
  keyof DynUISpacingProps
>;

export type DynUIProps<E extends ElementType = 'section'> = DynBoxLikeProps<E> &
  DynUISpacingProps & {
    tone?: DynUITone;
  };

export type DynUIRef<E extends ElementType = 'section'> = DynBoxRef<E>;

export interface DynUIDefaultProps {
  tone: DynUITone;
  p: SpacingSize;
  as: 'section';
  'data-testid': string;
}

export const DYN_UI_DEFAULT_PROPS: DynUIDefaultProps = {
  tone: 'surface',
  p: 'lg',
  as: 'section',
  'data-testid': 'dyn-ui',
};
