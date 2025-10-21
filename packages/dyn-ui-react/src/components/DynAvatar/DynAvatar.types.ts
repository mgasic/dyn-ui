import { type ImgHTMLAttributes, type ReactNode } from 'react';
import type { BaseComponentProps, AccessibilityProps } from '../../types';

// Direct type definitions - no external dependencies
export type DynAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DynAvatarShape = 'circle' | 'square' | 'rounded';
export type DynAvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export const DYN_AVATAR_VARIANTS = ['solid', 'subtle', 'outline'] as const;
export type DynAvatarVariant = (typeof DYN_AVATAR_VARIANTS)[number];

export const DYN_AVATAR_COLORS = [
  'neutral',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
] as const;
export type DynAvatarColor = (typeof DYN_AVATAR_COLORS)[number];

export const AVATAR_COLOR_TOKENS = {
  neutral: 'var(--dyn-color-neutral-100, var(--color-surface, #f8fafc))',
  primary: 'var(--dyn-color-primary, #2563eb)',
  secondary: 'var(--dyn-color-secondary, #6b7280)',
  success: 'var(--dyn-color-success, #10b981)',
  warning: 'var(--dyn-color-warning, #f59e0b)',
  danger: 'var(--dyn-color-danger, #dc2626)',
  info: 'var(--dyn-color-info, #0ea5e9)',
} as const satisfies Record<DynAvatarColor, string>;

/**
 * Token-based avatar size map that mirrors CSS module sizing
 */
export const AVATAR_SIZES = {
  xs: 'var(--dyn-spacing-2xl, 2rem)',
  sm: 'var(--dyn-spacing-3xl, 3rem)',
  md: '4rem',
  lg: '5rem',
  xl: '6rem',
} as const satisfies Record<DynAvatarSize, string>;

/**
 * Props interface for DynAvatar component
 * Clean TypeScript implementation without external namespace dependencies
 */
export interface DynAvatarProps extends
  Omit<BaseComponentProps, 'children'>,
  AccessibilityProps,
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseComponentProps | keyof AccessibilityProps | 'onClick' | 'children'> {

  /** Image source URL */
  src?: string;

  /** Alt text for image (required for accessibility) */
  alt: string;

  /** Avatar size using design token scale */
  size?: DynAvatarSize;

  /** Avatar shape variant */
  shape?: DynAvatarShape;

  /** Visual variant style */
  variant?: DynAvatarVariant;

  /** Semantic color token */
  color?: DynAvatarColor;

  /** Manual initials override */
  initials?: string;

  /** Status indicator */
  status?: DynAvatarStatus;

  /** Loading state */
  loading?: boolean;

  /** Error state */
  error?: boolean;

  /** Click handler for interactive avatars */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /** Custom fallback content */
  fallback?: ReactNode;

  /** Children content */
  children?: ReactNode;

  /** Image loading strategy */
  imageLoading?: 'eager' | 'lazy';

  /** Custom image properties */
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'loading'> & {
    'data-testid'?: string;
  };
}

/**
 * Ref type for DynAvatar component
 */
export type DynAvatarRef = HTMLDivElement;

/**
 * Status accessibility labels
 */
export const DYN_AVATAR_STATUS_LABELS: Record<DynAvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy',
} as const;
