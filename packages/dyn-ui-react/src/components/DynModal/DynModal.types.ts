import type React from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types';

type PolymorphicProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P> & { as?: E };

export interface DynModalOwnProps extends BaseComponentProps, AccessibilityProps {
  /**
   * Controls whether the modal is visible.
   */
  open: boolean;
  /**
   * Callback fired when the modal requests to be closed via ESC key or overlay click.
   */
  onClose?: () => void;
  /**
   * Disables dismissal interactions while keeping the modal rendered.
   */
  disabled?: boolean;
  /**
   * Accessible label for the modal when no visible heading is present.
   */
  'aria-label'?: string;
  /**
   * ID of the element that labels the modal.
   */
  'aria-labelledby'?: string;
  /**
   * ID of the element that describes the modal contents.
   */
  'aria-describedby'?: string;
  /**
   * Additional class applied to the overlay element.
   */
  overlayClassName?: string;
  /**
   * When false, prevents overlay clicks from closing the modal.
   */
  closeOnOverlayClick?: boolean;
  /**
   * When false, prevents the ESC key from closing the modal.
   */
  closeOnEscape?: boolean;
  /**
   * Content rendered inside the modal.
   */
  children?: ReactNode;
  /**
   * Optional role override. Defaults to `dialog`.
   */
  role?: React.AriaRole;
}

export type DynModalProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  DynModalOwnProps
>;

export type DynModalRef<E extends ElementType = 'div'> = ComponentRef<E>;

export interface DynModalDefaultProps {
  closeOnOverlayClick: boolean;
  closeOnEscape: boolean;
  disabled: boolean;
  role: React.AriaRole;
  'data-testid': string;
}

export const DYN_MODAL_DEFAULT_PROPS: DynModalDefaultProps = {
  closeOnOverlayClick: true,
  closeOnEscape: true,
  disabled: false,
  role: 'dialog',
  'data-testid': 'dyn-modal',
};

