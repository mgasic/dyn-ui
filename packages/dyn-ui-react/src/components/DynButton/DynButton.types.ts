/**
 * TypeScript interfaces for DynButton component
 * Follows the exact specification from DYN UI documentation
 * Extends BaseComponentProps for consistency
 */

import { BaseComponentProps } from '../../types';

export interface DynButtonProps extends BaseComponentProps {
  /** Button text label */
  label?: string;
  
  /** Icon - can be string (icon name) or React component */
  icon?: string | React.ReactNode;
  
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  
  /** Loading state with spinner */
  loading?: boolean;
  
  /** Danger/destructive state styling */
  danger?: boolean;
  
  /** Button kind/variant */
  kind?: 'primary' | 'secondary' | 'tertiary';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** ARIA label for accessibility */
  ariaLabel?: string;
  
  /** ARIA expanded state */
  ariaExpanded?: boolean;
  
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
