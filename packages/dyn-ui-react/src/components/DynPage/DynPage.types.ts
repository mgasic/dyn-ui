import type { ComponentRef, ElementType } from 'react';
import type {
  DynPageAction,
  DynPageBreadcrumb,
  DynPageHeaderSlotProps,
  DynPageProps,
  DynPageSlots,
} from '../../types/layout.types';

export type { DynPageAction, DynPageBreadcrumb, DynPageHeaderSlotProps, DynPageProps, DynPageSlots };

export type DynPageRef<E extends ElementType = 'main'> = ComponentRef<E>;
