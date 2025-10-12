/**
 * DynMenu TypeScript type definitions
 * Navigation component types for hierarchical menu system
 */

import type { ReactNode } from 'react';
import type { DynBadgeColor, DynBadgeVariant } from '../DynBadge/DynBadge.types';

export interface MenuBadge {
  /** Badge numeric indicator */
  count?: number;

  /** @deprecated Legacy alias for `count` */
  value?: number;

  /** Optional text label rendered inside the badge */
  label?: ReactNode;

  /** Visual color token */
  color?: DynBadgeColor;

  /** Variant styling */
  variant?: DynBadgeVariant;

  /** Maximum count before `max+` is shown */
  maxCount?: number;

  /** Display when the count is zero */
  showZero?: boolean;
}

export interface MenuItem {
  label: string;
  icon?: string | React.ReactNode;
  shortLabel?: string;
  link?: string;
  action?: () => void;
  badge?: MenuBadge;
  subItems?: MenuItem[];
  disabled?: boolean;
  visible?: boolean;
  type?: 'divider' | 'item';
}

export interface MenuLiterals {
  collapse: string;
  expand: string;
  search: string;
}

export interface DynMenuProps {
  menus: MenuItem[];
  collapsed?: boolean;
  collapsedIcon?: string | React.ReactNode;
  filter?: boolean;
  shortLogo?: string;
  logo?: string;
  literals?: Partial<MenuLiterals>;
  automaticToggle?: boolean;
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
  onMenuClick?: (item: MenuItem) => void;
}

export interface DynMenuRef {
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
}

// Default literals
export const DEFAULT_MENU_LITERALS: MenuLiterals = {
  collapse: 'Retrair menu',
  expand: 'Expandir menu',
  search: 'Pesquisar'
};