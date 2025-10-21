import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import type {
  BreadcrumbItem,
  BreadcrumbItemInteractionEvent,
  DynBreadcrumbProps,
  DynBreadcrumbRef,
} from './DynBreadcrumb.types';
import styles from './DynBreadcrumb.module.css';

type VisibleItem = {
  item: BreadcrumbItem;
  originalIndex: number;
};

export const DynBreadcrumb = forwardRef<DynBreadcrumbRef, DynBreadcrumbProps>(
  (
    {
      className,
      items,
      size = 'medium',
      separator = 'slash',
      customSeparator,
      maxItems = 0,
      showEllipsis = true,
      navigationLabel = 'Breadcrumb',
      onItemClick,
      onEllipsisClick,
      expanded: controlledExpanded,
      linkComponent: LinkComponent = 'a',
      enableStructuredData = false,
      id,
      children,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    const [generatedId] = useState(() => generateId('breadcrumb'));
    const ellipsisButtonRef = useRef<HTMLButtonElement | null>(null);
    const [shouldRestoreEllipsisFocus, setShouldRestoreEllipsisFocus] = useState(false);
    const itemsSignature = useMemo(
      () =>
        items
          .map(item => `${item.id ?? item.label}:${item.href ?? ''}:${item.current ? '1' : '0'}`)
          .join('|'),
      [items]
    );

    useEffect(() => {
      if (controlledExpanded === undefined) {
        setInternalExpanded(false);
      }
    }, [controlledExpanded, itemsSignature]);

    const expanded = controlledExpanded ?? internalExpanded;
    const collapseBreadcrumb = useCallback(() => {
      if (controlledExpanded !== undefined || !expanded) {
        return false;
      }
      setInternalExpanded(false);
      setShouldRestoreEllipsisFocus(true);
      return true;
    }, [controlledExpanded, expanded]);

    useEffect(() => {
      if (!expanded && shouldRestoreEllipsisFocus && ellipsisButtonRef.current) {
        ellipsisButtonRef.current.focus();
        setShouldRestoreEllipsisFocus(false);
      }
    }, [expanded, shouldRestoreEllipsisFocus]);
    const navId = id ?? generatedId;
    const totalItems = items.length;
    const shouldCollapse = maxItems > 0 && totalItems > maxItems && !expanded;

    const visibleItems = useMemo<VisibleItem[]>(() => {
      if (!shouldCollapse) {
        return items.map((item, originalIndex) => ({ item, originalIndex }));
      }

      if (items.length === 0) {
        return [];
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (!firstItem || !lastItem) {
        return [];
      }

      const firstEntry: VisibleItem = { item: firstItem, originalIndex: 0 };
      const middleEntries = items
        .slice(1, -1)
        .map<VisibleItem>((item, index) => ({ item, originalIndex: index + 1 }))
        .filter(({ item }) => item && item.showWhenCollapsed);
      const lastEntry: VisibleItem = {
        item: lastItem,
        originalIndex: items.length - 1,
      };

      return [firstEntry, ...middleEntries, lastEntry];
    }, [items, shouldCollapse]);

    const hiddenItemCount = shouldCollapse ? totalItems - visibleItems.length : 0;
    const hasHiddenItems = hiddenItemCount > 0;

    const activateItem = useCallback(
      (item: BreadcrumbItem, event: BreadcrumbItemInteractionEvent) => {
        item.onClick?.(event);
        onItemClick?.(item, event);
      },
      [onItemClick]
    );

    const handleEllipsisClick = useCallback(() => {
      if (controlledExpanded === undefined) {
        setInternalExpanded(true);
      }
      onEllipsisClick?.();
    }, [controlledExpanded, onEllipsisClick]);

    const renderSeparator = useCallback(
      (index: number) => {
        if (separator === 'custom' && !customSeparator) {
          return null;
        }

        const separatorClasses = cn(
          styles.breadcrumbSeparator,
          separator !== 'slash' && styles[`breadcrumbSeparator--${separator}`],
          separator === 'custom' && styles['breadcrumbSeparator--custom']
        );

        return (
          <span
            key={`separator-${index}`}
            className={separatorClasses}
            aria-hidden="true"
            data-separator={separator}
          >
            {separator === 'custom' ? customSeparator : null}
          </span>
        );
      },
      [customSeparator, separator]
    );

    const renderItemContent = useCallback(
      (item: BreadcrumbItem, labelProps?: React.HTMLAttributes<HTMLSpanElement>) => (
        <>
          {item.icon ? (
            <span className={styles.breadcrumbIcon} aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className={styles.breadcrumbText} {...labelProps}>
            {item.label}
          </span>
        </>
      ),
      []
    );

    const renderItem = useCallback(
      (visibleItem: VisibleItem, index: number, array: VisibleItem[]) => {
        const { item } = visibleItem;
        const isLast = index === array.length - 1;
        const isCurrent = Boolean(item.current) || (isLast && !item.href);
        const listItemClasses = cn(
          styles.breadcrumbItem,
          item.showWhenCollapsed && styles['breadcrumbItem--show']
        );

        const listItemProps = enableStructuredData
          ? {
              itemProp: 'itemListElement' as const,
              itemScope: true,
              itemType: 'https://schema.org/ListItem',
            }
          : undefined;

        const itemAriaLabel = item['aria-label'];
        const itemDataState = item['data-state'];
        const isLoadingState = itemDataState === 'loading';
        const isDataStateDisabled = itemDataState === 'disabled';
        const isInteractionDisabled = Boolean(item.disabled || isDataStateDisabled || isLoadingState);
        const computedDataState = itemDataState ?? (isCurrent ? 'active' : undefined);

        const shouldRenderStaticContent =
          isCurrent || (!item.href && !item.onClick && !item.as);

        if (shouldRenderStaticContent) {
          return (
            <li
              key={item.id ?? `breadcrumb-item-${visibleItem.originalIndex}`}
              className={listItemClasses}
              {...listItemProps}
            >
              <span
                className={isCurrent ? styles.breadcrumbCurrent : styles.breadcrumbStatic}
                {...(isCurrent ? { 'aria-current': 'page' as const } : undefined)}
                {...(enableStructuredData ? { itemProp: 'name' } : undefined)}
                aria-label={itemAriaLabel}
                data-state={computedDataState}
                aria-disabled={isInteractionDisabled ? true : undefined}
                aria-busy={isLoadingState || undefined}
                data-disabled={isInteractionDisabled ? '' : undefined}
                data-loading={isLoadingState ? '' : undefined}
              >
                {renderItemContent(item)}
              </span>
              {enableStructuredData ? (
                <meta itemProp="position" content={String(index + 1)} />
              ) : null}
              {!isLast && renderSeparator(visibleItem.originalIndex)}
            </li>
          );
        }

        const isLink = Boolean(item.href) && !isCurrent;
        const Component = (item.as ?? (isLink ? LinkComponent : 'button')) as React.ElementType;
        const componentTagName =
          typeof Component === 'string' ? Component.toLowerCase() : undefined;
        const isDefaultButtonElement = componentTagName === 'button';
        const needsButtonRole =
          componentTagName !== undefined && componentTagName !== 'a' && componentTagName !== 'button';
        const shouldHandleKeyboardActivation = !isLink && !isDefaultButtonElement;

        const {
          onClick: linkOnClick,
          onKeyDown: linkOnKeyDown,
          tabIndex: linkTabIndex,
          className: linkClassName,
          ...restLinkProps
        } = item.linkProps ?? {};

        const resolvedTabIndex = isInteractionDisabled
          ? isDefaultButtonElement
            ? undefined
            : -1
          : linkTabIndex !== undefined
          ? linkTabIndex
          : shouldHandleKeyboardActivation
          ? 0
          : undefined;

        const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
          if (isInteractionDisabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          linkOnClick?.(event as React.MouseEvent<HTMLAnchorElement>);
          activateItem(item, event);
        };

        const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
          linkOnKeyDown?.(event as React.KeyboardEvent<HTMLAnchorElement>);

          if (event.defaultPrevented) {
            return;
          }

          if (event.key === 'Escape') {
            const collapsed = collapseBreadcrumb();
            if (collapsed) {
              event.preventDefault();
              event.stopPropagation();
            }
            return;
          }

          if (!shouldHandleKeyboardActivation) {
            return;
          }

          if (
            event.key === ' ' ||
            event.key === 'Enter' ||
            event.key === 'Spacebar' ||
            event.key === 'Space'
          ) {
            event.preventDefault();

            if (isInteractionDisabled) {
              return;
            }

            activateItem(item, event);
            if (typeof window !== 'undefined') {
              window.requestAnimationFrame(() => {
                if (typeof document === 'undefined') {
                  return;
                }
                const target = event.currentTarget as HTMLElement | null;
                if (target && document.activeElement !== target) {
                  target.focus();
                }
              });
            }
          }
        };

        const componentProps: Record<string, unknown> = {
          ...restLinkProps,
          className: cn(styles.breadcrumbLink, linkClassName),
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          tabIndex: resolvedTabIndex,
          'aria-label': itemAriaLabel,
          'aria-disabled': isInteractionDisabled ? true : undefined,
          'aria-busy': isLoadingState || undefined,
          'data-state': computedDataState,
          'data-disabled': isInteractionDisabled ? '' : undefined,
          'data-loading': isLoadingState ? '' : undefined,
        };

        if (isLink && item.href) {
          componentProps.href = item.href;
        }

        if (!isLink && isDefaultButtonElement) {
          if (componentProps.type === undefined) {
            componentProps.type = 'button';
          }
          componentProps.disabled = isInteractionDisabled ? true : undefined;
        }

        if (needsButtonRole && componentProps.role === undefined) {
          componentProps.role = 'button';
        }

        if (enableStructuredData) {
          componentProps.itemProp = 'item';
        }

        return (
          <li
            key={item.id ?? `breadcrumb-item-${visibleItem.originalIndex}`}
            className={listItemClasses}
            {...listItemProps}
          >
            <Component {...componentProps}>
              {enableStructuredData
                ? renderItemContent(item, { itemProp: 'name' })
                : renderItemContent(item)}
            </Component>
            {enableStructuredData ? (
              <meta itemProp="position" content={String(index + 1)} />
            ) : null}
            {!isLast && renderSeparator(visibleItem.originalIndex)}
          </li>
        );
      },
      [
        activateItem,
        collapseBreadcrumb,
        enableStructuredData,
        renderItemContent,
        renderSeparator,
        LinkComponent,
      ]
    );

    const renderEllipsis = useCallback(() => {
      if (!hasHiddenItems || !showEllipsis) {
        return null;
      }

      return (
        <>
          <li
            key="ellipsis"
            className={cn(styles.breadcrumbItem, styles['breadcrumbItem--ellipsis'])}
          >
            <button
              type="button"
              className={styles['breadcrumbItem--ellipsis']}
              ref={ellipsisButtonRef}
              onClick={handleEllipsisClick}
              aria-label={`Show ${hiddenItemCount} hidden breadcrumb items`}
              aria-expanded={expanded}
            >
              …
            </button>
          </li>
          {renderSeparator(-1)}
        </>
      );
    }, [expanded, handleEllipsisClick, hasHiddenItems, hiddenItemCount, renderSeparator, showEllipsis]);

    if (visibleItems.length === 0) {
      return null;
    }

    const breadcrumbClasses = cn(
      styles.breadcrumb,
      styles[`breadcrumb--${size}`],
      shouldCollapse && showEllipsis && styles['breadcrumb--collapsed'],
      className
    );

    const navStructuredDataProps = enableStructuredData
      ? {
          itemScope: true,
          itemType: 'https://schema.org/BreadcrumbList',
        }
      : undefined;

    return (
      <nav
        ref={ref}
        id={navId}
        className={breadcrumbClasses}
        aria-label={ariaLabel ?? navigationLabel}
        data-testid={dataTestId}
        {...navStructuredDataProps}
        {...rest}
      >
        <ol className={styles.breadcrumbList}>
          {visibleItems[0] && renderItem(visibleItems[0], 0, visibleItems)}
          {visibleItems.length > 1 ? (
            <>
              {renderEllipsis()}
              {visibleItems.slice(1).map((visibleItem, index) =>
                renderItem(visibleItem, index + 1, visibleItems)
              )}
            </>
          ) : null}
        </ol>
        {children}
      </nav>
    );
  }
);

DynBreadcrumb.displayName = 'DynBreadcrumb';

export default DynBreadcrumb;
