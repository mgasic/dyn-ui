import { type ImgHTMLAttributes, type ReactNode } from 'react';
import type { BaseComponentProps, AccessibilityProps } from '../../types';

// Direct type definitions - no external dependencies
export type DynAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DynAvatarShape = 'circle' | 'square' | 'rounded';
export type DynAvatarStatus = 'online' | 'offline' | 'away' | 'busy';

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
