import type {
  AnchorHTMLAttributes,
  ElementType,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps, ComponentSize } from '../../types';

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'arrow' | 'dot' | 'custom';

export interface BreadcrumbItem {
  /** Unique identifier for the item */
  id?: string;

  /** Label text to display */
  label: string;

  /** URL to navigate to (if not provided, item is treated as current) */
  href?: string;

  /** Whether this item is the current page */
  current?: boolean;

  /** Whether to show this item when collapsed */
  showWhenCollapsed?: boolean;

  /** Custom icon before label */
  icon?: ReactNode;

  /** Additional props for the link element */
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'aria-current'>;
}

export interface DynBreadcrumbProps
  extends BaseComponentProps,
    AccessibilityProps,
    Omit<HTMLAttributes<HTMLElement>, keyof BaseComponentProps | keyof AccessibilityProps> {
  /** Array of breadcrumb items */
  items?: BreadcrumbItem[];

  /** Size variant */
  size?: ComponentSize;

  /** Separator style */
  separator?: BreadcrumbSeparator;

  /** Custom separator element (when separator is 'custom') */
  customSeparator?: ReactNode;

  /** Maximum number of items to show before collapsing */
  maxItems?: number;

  /** Whether to show ellipsis button when collapsed */
  showEllipsis?: boolean;

  /** Navigation aria-label */
  navigationLabel?: string;

  /** Click handler for breadcrumb items */
  onItemClick?: (item: BreadcrumbItem, event: ReactMouseEvent<HTMLAnchorElement>) => void;

  /** Expand handler for ellipsis button */
  onEllipsisClick?: () => void;

  /** Whether breadcrumb is currently expanded (controlled) */
  expanded?: boolean;

  /** Custom link component (for router integration) */
  linkComponent?: ElementType;

  /** Schema.org structured data support */
  enableStructuredData?: boolean;
}

export type DynBreadcrumbRef = HTMLElement;
