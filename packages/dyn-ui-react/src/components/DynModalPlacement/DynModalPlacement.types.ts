import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Strategy used to position the modal container.
 * - `fixed`: stretches across the viewport (default for modals rendered in portals).
 * - `absolute`: positions relative to the closest positioned ancestor.
 * - `relative`: keeps the wrapper in normal flow (useful for docs/examples).
 */
export type DynModalPlacementStrategy = 'fixed' | 'absolute' | 'relative';

/** Supported vertical positioning zones for the modal. */
export type DynModalVerticalPlacement = 'top' | 'center' | 'bottom' | 'fullscreen';

/** Supported horizontal alignment values inside the placement container. */
export type DynModalHorizontalAlignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * Shared placement configuration that can be passed down from DynModal.
 */
export interface DynModalPlacementConfig {
  /** Vertical zone where the modal should appear. */
  placement?: DynModalVerticalPlacement;
  /** Horizontal alignment of the modal inside the placement container. */
  alignment?: DynModalHorizontalAlignment;
  /** Strategy used to position the wrapper (fixed by default). */
  strategy?: DynModalPlacementStrategy;
  /**
   * Optional padding applied to the wrapper. Accepts number (pixels) or full CSS string value.
   * Defaults to `var(--dyn-space-8, 2rem)`.
   */
  padding?: number | string;
  /**
   * Gap between stacked modal children when more than one modal is rendered.
   * Defaults to `var(--dyn-space-6, 1.5rem)`.
   */
  gap?: number | string;
  /**
   * Allows the modal content to overflow the viewport without clipping.
   * By default the wrapper will create an auto-scroll container.
   */
  allowOverflow?: boolean;
  /** Forces the wrapper to span the full viewport height even when strategy isn't `fixed`. */
  fullHeight?: boolean;
  /** Additional class name applied to the wrapper. */
  wrapperClassName?: string;
  /** Additional inline style merged with generated placement styles. */
  wrapperStyle?: CSSProperties;
}

export interface DynModalPlacementProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    DynModalPlacementConfig {
  /** Modal content rendered inside the placement wrapper. */
  children?: ReactNode;
}
