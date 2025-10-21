import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';

export type DynBreadcrumbItemComponentProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  'children' | 'onClick'
>;

export interface DynBreadcrumbItemProps<T extends ElementType = 'a'>
  extends Omit<HTMLAttributes<HTMLLIElement>, 'children' | 'onClick' | 'aria-label'> {
  /** Custom element or component used for the interactive control. */
  as?: T;

  /** Visual label of the breadcrumb item. */
  label?: ReactNode;

  /** Custom children to render instead of the label prop. */
  children?: ReactNode;

  /** Optional icon displayed before the label. */
  icon?: ReactNode;

  /** Href passed to anchor based breadcrumb items. */
  href?: string;

  /** Marks the item as the current page. */
  current?: boolean;

  /** Keeps the item visible when breadcrumb is collapsed. */
  showWhenCollapsed?: boolean;

  /** Custom separator element provided by DynBreadcrumb. */
  separator?: ReactNode;

  /** Whether the item is the last visible element. */
  isLast?: boolean;

  /** Enables Schema.org structured data support. */
  enableStructuredData?: boolean;

  /** Position value for structured data meta tag. */
  structuredDataPosition?: number;

  /** Custom link component injected by DynBreadcrumb. */
  linkComponent?: ElementType;

  /** Additional props passed to the link component. */
  linkProps?: Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'onClick'>;

  /** Disables the breadcrumb item from receiving focus or clicks. */
  disabled?: boolean;

  /** Click handler for the interactive portion of the breadcrumb. */
  onClick?: MouseEventHandler<HTMLElement>;

  /** Accessible label for the interactive portion of the breadcrumb. */
  'aria-label'?: string;

  /** Forces the item to be considered focusable or not. */
  focusable?: boolean;

  /** Initial tabIndex assigned by the parent breadcrumb. */
  initialTabIndex?: number;

  /** Additional props forwarded to the rendered interactive component. */
  componentProps?: DynBreadcrumbItemComponentProps<T>;
}

export type DynBreadcrumbItemRef = HTMLLIElement;
