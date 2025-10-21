import React, {
  ElementType,
  FocusEvent,
  ForwardedRef,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { cn } from '../../utils/classNames';
import styles from '../DynBreadcrumb/DynBreadcrumb.module.css';
import type {
  DynBreadcrumbItemProps,
  DynBreadcrumbItemRef,
} from './DynBreadcrumbItem.types';

const DEFAULT_LINK_COMPONENT = 'a';

const mergeRefs = <T,>(
  ref: ForwardedRef<T>,
  node: T | null
) => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
};

const getEnabledFocusable = (container: Element) =>
  Array.from(
    container.querySelectorAll<HTMLElement>('[data-breadcrumb-focusable="true"]')
  ).filter(element => !element.hasAttribute('data-breadcrumb-disabled'));

const setExclusiveTabIndex = (target: HTMLElement) => {
  const container = target.closest('[data-dyn-breadcrumb="true"]');

  if (!container) {
    return;
  }

  const focusable = container.querySelectorAll<HTMLElement>(
    '[data-breadcrumb-focusable="true"]'
  );

  focusable.forEach(element => {
    if (element === target) {
      element.tabIndex = 0;
    } else if (!element.hasAttribute('data-breadcrumb-disabled')) {
      element.tabIndex = -1;
    }
  });
};

const moveFocus = (current: HTMLElement, direction: 'previous' | 'next' | 'first' | 'last') => {
  const container = current.closest('[data-dyn-breadcrumb="true"]');

  if (!container) {
    return;
  }

  const focusable = getEnabledFocusable(container);

  if (focusable.length === 0) {
    return;
  }

  const currentIndex = focusable.indexOf(current);

  if (currentIndex === -1) {
    return;
  }

  let nextIndex = currentIndex;

  switch (direction) {
    case 'previous':
      nextIndex = (currentIndex - 1 + focusable.length) % focusable.length;
      break;
    case 'next':
      nextIndex = (currentIndex + 1) % focusable.length;
      break;
    case 'first':
      nextIndex = 0;
      break;
    case 'last':
      nextIndex = focusable.length - 1;
      break;
    default:
      break;
  }

  if (nextIndex !== currentIndex) {
    focusable[nextIndex]?.focus();
  }
};

const getInteractiveClassName = (
  isCurrent: boolean,
  isFocusable: boolean
): string => {
  if (isCurrent) {
    return styles.breadcrumbCurrent;
  }

  if (isFocusable) {
    return styles.breadcrumbLink;
  }

  return styles.breadcrumbStatic;
};

const getDefaultComponent = (
  current: boolean,
  href?: string,
  onClick?: DynBreadcrumbItemProps['onClick']
): ElementType => {
  if (current) {
    return 'span';
  }

  if (href) {
    return DEFAULT_LINK_COMPONENT;
  }

  if (onClick) {
    return 'button';
  }

  return 'span';
};

export const DynBreadcrumbItem = forwardRef<DynBreadcrumbItemRef, DynBreadcrumbItemProps>(
  (
    {
      as,
      label,
      children,
      icon,
      href,
      current = false,
      showWhenCollapsed = false,
      separator,
      isLast = false,
      enableStructuredData = false,
      structuredDataPosition,
      linkComponent,
      linkProps,
      disabled = false,
      onClick,
      'aria-label': ariaLabel,
      focusable,
      initialTabIndex = -1,
      componentProps,
      className,
      ...rest
    },
    ref
  ) => {
    const listItemRef = useRef<HTMLLIElement | null>(null);
    const interactiveRef = useRef<HTMLElement | null>(null);

    const setListItemRef = useCallback(
      (node: HTMLLIElement | null) => {
        listItemRef.current = node;
        mergeRefs(ref, node);
      },
      [ref]
    );

    const LinkComponent = linkComponent ?? DEFAULT_LINK_COMPONENT;

    const Component = useMemo<ElementType>(() => {
      if (current) {
        return 'span';
      }

      if (as) {
        return as;
      }

      const defaultComponent = getDefaultComponent(current, href, onClick);

      if (defaultComponent === DEFAULT_LINK_COMPONENT && linkComponent) {
        return linkComponent;
      }

      return defaultComponent;
    }, [as, current, href, linkComponent, onClick]);

    const isFocusable = Boolean(
      !current && !disabled && (focusable ?? (Component !== 'span'))
    );

    const {
      onFocus: providedOnFocus,
      onKeyDown: providedOnKeyDown,
      className: providedInteractiveClassName,
      ...restComponentProps
    } = componentProps ?? {};

    useEffect(() => {
      const node = interactiveRef.current;

      if (!node) {
        return;
      }

      if (!isFocusable) {
        node.removeAttribute('data-breadcrumb-focusable');
        node.removeAttribute('data-breadcrumb-disabled');
        node.tabIndex = -1;
        return;
      }

      node.setAttribute('data-breadcrumb-focusable', 'true');

      if (disabled) {
        node.setAttribute('data-breadcrumb-disabled', 'true');
        node.tabIndex = -1;
      } else {
        node.removeAttribute('data-breadcrumb-disabled');
        node.tabIndex = initialTabIndex;
      }
    }, [disabled, initialTabIndex, isFocusable]);

    useEffect(() => {
      const node = interactiveRef.current;

      if (!node || !isFocusable || disabled || initialTabIndex !== 0) {
        return;
      }

      setExclusiveTabIndex(node);
    }, [disabled, initialTabIndex, isFocusable]);

    const handleFocus = (event: FocusEvent<HTMLElement>) => {
      providedOnFocus?.(event);

      if (!isFocusable || disabled) {
        return;
      }

      setExclusiveTabIndex(event.currentTarget);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      providedOnKeyDown?.(event);

      if (event.defaultPrevented || !isFocusable || disabled) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          moveFocus(event.currentTarget, 'previous');
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          moveFocus(event.currentTarget, 'next');
          break;
        case 'Home':
          event.preventDefault();
          moveFocus(event.currentTarget, 'first');
          break;
        case 'End':
          event.preventDefault();
          moveFocus(event.currentTarget, 'last');
          break;
        default:
          break;
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    const listItemClasses = cn(
      styles.breadcrumbItem,
      showWhenCollapsed && styles['breadcrumbItem--show'],
      className
    );

    const interactiveClassName = cn(
      getInteractiveClassName(current, isFocusable),
      providedInteractiveClassName
    );

    const labelContent: ReactNode = children ?? label;

    const commonInteractiveProps = {
      ref: interactiveRef,
      className: interactiveClassName,
      onClick: handleClick,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      'aria-label': ariaLabel,
      ...(isFocusable ? {} : { tabIndex: -1 }),
      ...(enableStructuredData && !current ? { itemProp: 'item' } : {}),
      ...(current ? { 'aria-current': 'page' as const } : {}),
    };

    const interactiveProps: Record<string, unknown> = {
      ...commonInteractiveProps,
      ...restComponentProps,
    };

    if (href && Component !== 'span') {
      interactiveProps.href = href;
    }

    if (Component === 'button' && !('type' in interactiveProps)) {
      interactiveProps.type = 'button';
    }

    if (linkProps && (Component === LinkComponent || Component === DEFAULT_LINK_COMPONENT)) {
      const { className: linkClassName, ...restLinkProps } = linkProps;

      if (linkClassName) {
        interactiveProps.className = cn(interactiveProps.className, linkClassName);
      }

      Object.assign(interactiveProps, restLinkProps);
    }

    if (enableStructuredData && current) {
      interactiveProps.itemProp = 'name';
    }

    if (disabled) {
      interactiveProps['aria-disabled'] = true;
      if (Component === 'button') {
        interactiveProps.disabled = true;
      }
    }

    const iconContent = icon ? (
      <span className={styles.breadcrumbIcon} aria-hidden="true">
        {icon}
      </span>
    ) : null;

    const labelElement = enableStructuredData && !current ? (
      <span className={styles.breadcrumbText} itemProp="name">
        {labelContent}
      </span>
    ) : (
      <span className={styles.breadcrumbText}>{labelContent}</span>
    );

    const content = (
      <Component {...interactiveProps}>
        {iconContent}
        {labelElement}
      </Component>
    );

    const listItemProps = enableStructuredData
      ? {
          itemProp: 'itemListElement' as const,
          itemScope: true,
          itemType: 'https://schema.org/ListItem',
        }
      : undefined;

    return (
      <li ref={setListItemRef} className={listItemClasses} {...listItemProps} {...rest}>
        {content}
        {enableStructuredData && structuredDataPosition ? (
          <meta itemProp="position" content={String(structuredDataPosition)} />
        ) : null}
        {!isLast ? separator : null}
      </li>
    );
  }
);

DynBreadcrumbItem.displayName = 'DynBreadcrumbItem';

export default DynBreadcrumbItem;
