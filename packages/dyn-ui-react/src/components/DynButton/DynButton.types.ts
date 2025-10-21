import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEvent,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types';

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

/**
 * Button variant types following design system standards
 */
export type DynButtonVariant = 'primary' | 'secondary' | 'tertiary';

/**
 * Button size variants using design token scale
 */
export type DynButtonSize = 'small' | 'medium' | 'large';

type DynButtonIcon = string | ReactNode;

/**
 * Base props exposed by the DynButton component regardless of rendered element
 */
export interface DynButtonOwnProps extends BaseComponentProps, AccessibilityProps {
  /** Visible text label */
  label?: string;
  /** Icon rendered before the label */
  startIcon?: DynButtonIcon;
  /** Icon rendered after the label */
  endIcon?: DynButtonIcon;
  /** Native button type when rendering a `<button>` */
  type?: 'button' | 'submit' | 'reset';
  /** Explicit disabled state */
  disabled?: boolean;
  /** Variant styling */
  variant?: DynButtonVariant;
  /** Size styling */
  size?: DynButtonSize;
  /** Loading indicator */
  loading?: boolean;
  /** Text announced to assistive tech while loading */
  loadingText?: string;
  /** Apply danger/destructive styling */
  danger?: boolean;
  /** Expand button to full width */
  fullWidth?: boolean;
  /** Hide button on viewports narrower than 768px */
  hideOnMobile?: boolean;
  /** Display icon-only button on mobile while keeping the label accessible */
  iconOnlyOnMobile?: boolean;
  /** Prevent invoking `onClick` multiple times while awaiting a promise */
  preventDuplicateClicks?: boolean;
  /** Accessible expanded state (for disclosure buttons, etc.) */
  'aria-expanded'?: boolean;
  /** ID reference of the element controlled by the button */
  'aria-controls'?: string;
  /** Pressed/toggled state for ARIA toggle buttons */
  'aria-pressed'?: boolean;
  /** Blur handler */
  onBlur?: FocusEventHandler<Element>;
  /** Click handler that may be async */
  onClick?: (event: MouseEvent<Element>) => void | Promise<void>;
  /** Key down handler */
  onKeyDown?: KeyboardEventHandler<Element>;
}

export type DynButtonProps<E extends ElementType = 'button'> = PolymorphicComponentProps<
  E,
  DynButtonOwnProps & { as?: E }
>;

export type DynButtonRef<E extends ElementType = 'button'> = ComponentRef<E>;

/**
 * Default props type for DynButton
 */
export type DynButtonDefaultProps = Required<
  Pick<
    DynButtonOwnProps,
    | 'type'
    | 'variant'
    | 'size'
    | 'loading'
    | 'loadingText'
    | 'danger'
    | 'disabled'
    | 'fullWidth'
    | 'hideOnMobile'
    | 'iconOnlyOnMobile'
    | 'preventDuplicateClicks'
  >
>;

/**
 * Default props values for DynButton component
 */
export const DYN_BUTTON_DEFAULT_PROPS: DynButtonDefaultProps = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  loading: false,
  loadingText: 'Loading…',
  danger: false,
  disabled: false,
  fullWidth: false,
  hideOnMobile: false,
  iconOnlyOnMobile: false,
  preventDuplicateClicks: true,
} as const;