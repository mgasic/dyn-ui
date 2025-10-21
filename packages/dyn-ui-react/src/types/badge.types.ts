export type {
  DynBadgeProps,
  DynBadgeRef,
  DynBadgeVariant,
  DynBadgeColor,
  DynBadgePosition,
  DynBadgeSize,
  DynBadgeState,
  DYN_BADGE_COLORS,
  DYN_BADGE_SIZES,
  DYN_BADGE_STATES,
  DYN_BADGE_VARIANTS
} from '../components/DynBadge/DynBadge.types';

// AccessibilityProps is declared in the common types; re-export under badge namespace
export type { AccessibilityProps as DynBadgeAccessibilityProps } from './index';
