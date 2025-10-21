import type { HTMLAttributes, ReactNode } from 'react';

export const DYN_ICON_VARIANTS = ['default', 'muted', 'subtle', 'inverse', 'accent'] as const;
export type DynIconVariant = (typeof DYN_ICON_VARIANTS)[number];

export const DYN_ICON_SEMANTIC_COLORS = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
] as const;
export type DynIconSemanticColor = (typeof DYN_ICON_SEMANTIC_COLORS)[number];

export type DynIconSizeToken = 'small' | 'medium' | 'large';

export interface DynIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Icon identifier - string (dictionary key, class names) or React node */
  icon?: string | ReactNode;

  /** Icon size token or explicit dimension */
  size?: DynIconSizeToken | number | string;

  /** Visual variant that maps to design token driven color treatments */
  variant?: DynIconVariant;

  /** Semantic color token or custom color override */
  color?: DynIconSemanticColor | (string & {});

  /** Whether the icon should spin */
  spin?: boolean;

  /** Disabled state prevents interaction */
  disabled?: boolean;

  /** Icon content fallback */
  children?: ReactNode;

  /** Test identifier for automated testing */
  'data-testid'?: string;
}

export interface DynIconDefaultProps {
  size: DynIconSizeToken;
  spin: boolean;
  disabled: boolean;
  variant: DynIconVariant;
}

export const DYN_ICON_DEFAULT_PROPS: DynIconDefaultProps = {
  size: 'medium',
  spin: false,
  disabled: false,
  variant: 'default',
} as const;

export type IconDictionary = Record<string, string>;

export interface ProcessedIcon {
  baseClass: string;
  iconClass: string;
}
