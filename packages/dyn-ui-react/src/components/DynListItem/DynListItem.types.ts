import type { ComponentPropsWithoutRef, ComponentRef, ElementType } from 'react';
import type {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  SpacingSize,
} from '../DynBox/DynBox.types';

export type DynListItemDisplay =
  | 'block'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'inline-block'
  | 'inline'
  | 'contents';

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

export interface DynListItemOwnProps {
  padding?: SpacingSize;
  p?: SpacingSize;
  px?: SpacingSize;
  py?: SpacingSize;
  pt?: SpacingSize;
  pr?: SpacingSize;
  pb?: SpacingSize;
  pl?: SpacingSize;

  m?: SpacingSize;
  mx?: SpacingSize;
  my?: SpacingSize;
  mt?: SpacingSize;
  mr?: SpacingSize;
  mb?: SpacingSize;
  ml?: SpacingSize;

  gap?: SpacingSize;
  rowGap?: SpacingSize;
  columnGap?: SpacingSize;

  display?: DynListItemDisplay;
  direction?: FlexDirection;
  align?: AlignItems;
  justify?: JustifyContent;
  wrap?: FlexWrap;
}

export type DynListItemProps<E extends ElementType = 'div'> =
  PolymorphicComponentProps<E, DynListItemOwnProps> & {
    as?: E;
  };

export type DynListItemRef<E extends ElementType = 'div'> = ComponentRef<E>;

export interface DynListItemDefaultProps {
  'data-testid': string;
}

export const DYN_LIST_ITEM_DEFAULT_PROPS: DynListItemDefaultProps = {
  'data-testid': 'dyn-list-item',
};
