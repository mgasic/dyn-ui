import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types/theme';

export type DynMenuItemState = 'default' | 'active' | 'open' | 'disabled' | 'loading';

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P | 'ref'>;

export interface DynMenuItemOwnProps extends BaseComponentProps, AccessibilityProps {
  /** Optional element type override for polymorphic rendering */
  as?: ElementType;
  /** Visible label text. Falls back to children if omitted */
  label?: ReactNode;
  /** Leading visual element */
  prefix?: ReactNode;
  /** Trailing visual element */
  suffix?: ReactNode;
  /** Marks the item as currently active */
  active?: boolean;
  /** Indicates the parent disclosure state */
  open?: boolean;
  /** Disables pointer and keyboard interactions */
  disabled?: boolean;
  /** Indicates an in-progress action. Implies disabled semantics. */
  loading?: boolean;
  /** Accessible description id list */
  'aria-describedby'?: string;
  /** Accessible expanded state */
  'aria-expanded'?: boolean | 'true' | 'false' | undefined;
  /** Accessible controls relationship */
  'aria-controls'?: string;
  /** Accessible haspopup relationship */
  'aria-haspopup'?: ComponentPropsWithoutRef<'button'>['aria-haspopup'];
  /** Optional role override */
  role?: AccessibilityProps['role'];
  /** Keyboard event handler */
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  /** Pointer event handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Unified activation handler fired on click or keyboard activation */
  onPress?: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
}

export type DynMenuItemBaseProps = Omit<DynMenuItemOwnProps, 'as'>;

export type DynMenuItemProps<E extends ElementType = 'button'> = PolymorphicComponentProps<
  E,
  DynMenuItemBaseProps & { as?: E }
>;

export type DynMenuItemRef<E extends ElementType = 'button'> = ComponentRef<E>;
