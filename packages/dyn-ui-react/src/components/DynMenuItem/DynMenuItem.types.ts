import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types/theme';

export interface DynMenuItemStateProps {
  /** Visually mark the item as active (e.g. open submenu). */
  active?: boolean;

  /** Render the item in a loading state. Loading items are not interactive. */
  loading?: boolean;

  /** Disable the item. Disabled items are removed from the tab order. */
  disabled?: boolean;
}

export interface DynMenuItemA11yProps
  extends Pick<AccessibilityProps, 'aria-describedby' | 'aria-labelledby'> {
  /** Accessible label for icon-only menu items. */
  'aria-label'?: string;

  /** Convenience alias for `aria-label`. */
  ariaLabel?: string;
}

export interface DynMenuItemBaseProps
  extends BaseComponentProps,
    DynMenuItemStateProps,
    DynMenuItemA11yProps {
  /** Optional text label rendered when children are not provided. */
  label?: ReactNode;

  /** Test identifier used in unit tests. */
  'data-testid'?: string;
}

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P | 'as'> & {
    as?: E;
  };

export type DynMenuItemProps<E extends ElementType = 'button'> = PolymorphicComponentProps<
  E,
  DynMenuItemBaseProps
>;

export type DynMenuItemRef<E extends ElementType = 'button'> = ComponentRef<E>;
