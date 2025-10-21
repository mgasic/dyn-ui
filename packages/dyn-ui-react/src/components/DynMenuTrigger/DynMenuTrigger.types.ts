import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  MouseEventHandler,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types/theme';

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

export interface DynMenuTriggerOwnProps extends BaseComponentProps, AccessibilityProps {
  /** Render the trigger in the active/open state */
  isOpen?: boolean;
  /** Disable pointer and keyboard interactions */
  disabled?: boolean;
  /** Click handler for the trigger element */
  onClick?: MouseEventHandler<any>;
}

export type DynMenuTriggerProps<E extends ElementType = 'button'> =
  PolymorphicComponentProps<
    E,
    DynMenuTriggerOwnProps & {
      /** Custom element to render instead of the default button */
      as?: E;
    }
  >;

export type DynMenuTriggerRef<E extends ElementType = 'button'> = ComponentRef<E>;
