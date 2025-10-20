/**
 * DynMenu TypeScript type definitions
 * Navigation component types for hierarchical menu system
 */

import type { BaseComponentProps, AccessibilityProps } from '../../types/theme';

export interface MenuItem {
  /** Visible label for the menu entry. */
  label: string;

  /** Callback or string identifier executed when the item is activated. */
  action?: string | (() => void);

  /** Nested items rendered as a submenu. */
  subItems?: MenuItem[];

  /** Alias for `subItems` kept for backwards compatibility. */
  children?: MenuItem[];

  /** Disable interactions with the menu entry. */
  disabled?: boolean;
}

// Alias for backward compatibility
export type DynMenuItem = MenuItem;

export type MenuOrientation = 'horizontal' | 'vertical';

export interface DynMenuProps extends BaseComponentProps, AccessibilityProps {
  /** Menu items array */
  items?: MenuItem[];

  /** Legacy menu items prop (alias for items) */
  menus?: MenuItem[];

  /** Menu orientation */
  orientation?: MenuOrientation;
  
  /** Additional CSS classes */
  className?: string;

  /** Generic action handler (alias for onMenuClick) */
  onAction?: (item: MenuItem | string) => void;

  /** Menu ID for ARIA */
  id?: string;
  
  /** ARIA label for menu */
  'aria-label'?: string;
  
  /** ARIA labelledby for menu */
  'aria-labelledby'?: string;
  
  /** ARIA describedby for menu */
  'aria-describedby'?: string;
  
  /** Test ID */
  'data-testid'?: string;
}
