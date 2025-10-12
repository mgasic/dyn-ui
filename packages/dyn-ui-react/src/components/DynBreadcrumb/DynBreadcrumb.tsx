import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import type {
  BreadcrumbItem,
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

      const firstEntry: VisibleItem = { item: items[0], originalIndex: 0 };
      const middleEntries = items
        .slice(1, -1)
        .map<VisibleItem>((item, index) => ({ item, originalIndex: index + 1 }))
        .filter(({ item }) => item.showWhenCollapsed);
      const lastEntry: VisibleItem = {
        item: items[items.length - 1],
        originalIndex: items.length - 1,
      };

      return [firstEntry, ...middleEntries, lastEntry];
    }, [items, shouldCollapse]);

    const hiddenItemCount = shouldCollapse ? totalItems - visibleItems.length : 0;
    const hasHiddenItems = hiddenItemCount > 0;

    const handleEllipsisClick = useCallback(() => {
      if (controlledExpanded === undefined) {
        setInternalExpanded(true);
      }
      onEllipsisClick?.();
    }, [controlledExpanded, onEllipsisClick]);

    const handleItemClick = useCallback(
      (item: BreadcrumbItem) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        onItemClick?.(item, event);
      },
      [onItemClick]
    );

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
        const isLink = Boolean(item.href) && !isCurrent;
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

        const itemContent = isLink ? (
          <LinkComponent
            href={item.href}
            className={styles.breadcrumbLink}
            onClick={handleItemClick(item)}
            {...item.linkProps}
            {...(enableStructuredData ? { itemProp: 'item' } : undefined)}
          >
            {enableStructuredData
              ? renderItemContent(item, { itemProp: 'name' })
              : renderItemContent(item)}
          </LinkComponent>
        ) : (
          <span
            className={isCurrent ? styles.breadcrumbCurrent : styles.breadcrumbStatic}
            {...(isCurrent ? { 'aria-current': 'page' as const } : undefined)}
            {...(enableStructuredData ? { itemProp: 'name' } : undefined)}
          >
            {renderItemContent(item)}
          </span>
        );

        return (
          <li
            key={item.id ?? `breadcrumb-item-${visibleItem.originalIndex}`}
            className={listItemClasses}
            {...listItemProps}
          >
            {itemContent}
            {enableStructuredData ? (
              <meta itemProp="position" content={String(index + 1)} />
            ) : null}
            {!isLast && renderSeparator(visibleItem.originalIndex)}
          </li>
        );
      },
      [enableStructuredData, handleItemClick, renderItemContent, renderSeparator]
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
      {
        [styles['breadcrumb--collapsed']]: shouldCollapse && showEllipsis,
      },
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
          {renderItem(visibleItems[0], 0, visibleItems)}
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
