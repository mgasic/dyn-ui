import type { HTMLAttributes } from 'react';

import type {
  DynContainerLayout,
  DynContainerProps as LayoutDynContainerProps,
} from '../../types/layout.types';

export type { DynContainerLayout } from '../../types/layout.types';

type NativeDivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | 'title' | 'id'
>;

export interface DynContainerProps
  extends LayoutDynContainerProps,
    NativeDivProps {
  layout?: DynContainerLayout;
}

export interface DynContainerRef {
  focus: () => void;
}
