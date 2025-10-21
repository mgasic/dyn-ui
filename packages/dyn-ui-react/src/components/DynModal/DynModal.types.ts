import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  CSSProperties,
  ElementType,
  ReactNode
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types/theme';
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types';

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

/** Base props shared across all modal variants */
export interface DynModalBaseProps extends BaseComponentProps, AccessibilityProps {
  /** Controls whether the modal is visible. */
  isOpen: boolean;
  /** Callback invoked when the modal requests to close (escape, backdrop click, etc.). */
  onClose?: () => void;
  /** Preferred vertical placement, forwarded to {@link DynModalPlacement}. */
  placement?: DynModalVerticalPlacement;
  /** Preferred horizontal alignment, forwarded to {@link DynModalPlacement}. */
  alignment?: DynModalHorizontalAlignment;
  /** Placement strategy (`fixed` by default). */
  strategy?: DynModalPlacementStrategy;
  /** Additional props forwarded to {@link DynModalPlacement}. */
  placementProps?: Omit<DynModalPlacementConfig, 'placement' | 'alignment' | 'strategy'>;
  /** Whether clicking on the backdrop should trigger `onClose`. */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape should trigger `onClose`. */
  closeOnEsc?: boolean;
  /** Locks the document scroll when the modal is open (default: `true`). */
  lockScroll?: boolean;
  /** Disables modal dismissal interactions when `true`. */
  disabled?: boolean;
  /** Optional class applied to the outer placement wrapper. */
  wrapperClassName?: string;
  /** Optional class applied to the backdrop element. */
  backdropClassName?: string;
  /** Inline style applied to the backdrop element. */
  backdropStyle?: CSSProperties;
  /** Inline style applied to the modal content container. */
  style?: CSSProperties;
  /** Maximum width of the modal content (defaults to `min(90vw, 640px)`). */
  maxWidth?: number | string;
  /** Minimum width of the modal content. */
  minWidth?: number | string;
  /**
   * When provided, focus is returned to the element after the modal is closed.
   * Defaults to the element that had focus when the modal opened.
   */
  returnFocusElement?: HTMLElement | null;
  /** Content rendered inside the modal. */
  children?: ReactNode;
  /** Accessible modal semantics */
  role?: AccessibilityProps['role'];
  /** Indicates if the modal should be treated as modal by assistive tech. */
  'aria-modal'?: boolean;
}

export type DynModalProps<E extends ElementType = 'div'> = PolymorphicComponentProps<
  E,
  DynModalBaseProps
> & {
  as?: E;
};

export type DynModalRef<E extends ElementType = 'div'> = ComponentRef<E>;
