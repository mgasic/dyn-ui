import type {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode
} from 'react';
import type { BaseComponentProps, AccessibilityProps } from '../../types';

export const DYN_BADGE_SIZES = ['small', 'medium', 'large'] as const;
export type DynBadgeSize = (typeof DYN_BADGE_SIZES)[number];

export const DYN_BADGE_VARIANTS = ['solid', 'soft', 'outline', 'dot'] as const;
export type DynBadgeVariant = (typeof DYN_BADGE_VARIANTS)[number];

export const DYN_BADGE_STATES = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
export type DynBadgeState = (typeof DYN_BADGE_STATES)[number];

export const DYN_BADGE_COLORS = [
  'primary',
  'secondary',
  ...DYN_BADGE_STATES
] as const;

export type DynBadgeSemanticColor = (typeof DYN_BADGE_COLORS)[number];
export type DynBadgeColor = DynBadgeSemanticColor | (string & {});
export type DynBadgePosition = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';



/**
 * Props interface for DynBadge component
 * Clean TypeScript implementation following DynAvatar gold standard
 */
export interface DynBadgeProps
  extends BaseComponentProps,
    AccessibilityProps,
    Omit<HTMLAttributes<HTMLSpanElement>, keyof BaseComponentProps | keyof AccessibilityProps | 'color' | 'children'> {
  /** Badge content */
  children?: ReactNode;

  /** Badge variant style */
  variant?: DynBadgeVariant;

  /** Semantic color */
  color?: DynBadgeColor;

  /** Visual state token */
  state?: DynBadgeState;

  /** Size variant */
  size?: DynBadgeSize;

  /** Position when used as overlay */
  position?: DynBadgePosition;

  /** Click handler (makes badge interactive) */
  onClick?: (event: ReactMouseEvent<HTMLSpanElement>) => void;

  /** Icon before text */
  startIcon?: ReactNode;

  /** Icon after text */
  endIcon?: ReactNode;

  /** Max count before showing + */
  maxCount?: number;

  /** Numeric value (for count badges) */
  count?: number;

  /**
   * @deprecated Use `count` instead. Legacy alias maintained for backward compatibility.
   */
  value?: number;

  /** Show badge even when count is 0 */
  showZero?: boolean;

  /** Animate appearance */
  animated?: boolean;

  /** Pulse animation for notifications */
  pulse?: boolean;

  /** Accessible description for count */
  countDescription?: string;
}

/**
 * Ref type for DynBadge component
 */
export type DynBadgeRef = HTMLSpanElement;
