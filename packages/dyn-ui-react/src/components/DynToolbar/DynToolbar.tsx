/**
 * DynToolbar - Responsive Toolbar Component
 * Flexible toolbar with action buttons, responsive overflow, and multiple layout variants
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import classNames from 'classnames';
import { DynToolbarProps, ToolbarItem, DynToolbarRef, TOOLBAR_DEFAULTS } from './DynToolbar.types';
import { focusElement, getFocusableElements } from '../../utils/focus';
import { activateFocusTrap } from '../../utils/focusTrap';
import { DynIcon } from '../DynIcon';
import { DynBadge } from '../DynBadge';
import styles from './DynToolbar.module.css';

const PICTOGRAPH_REGEX = /\p{Extended_Pictographic}/u;
const SYMBOL_ONLY_REGEX = /^[\p{S}\p{P}]{1,3}$/u;

const isSymbolicIcon = (icon: string) => {
  if (!icon) {
    return false;
  }

  return PICTOGRAPH_REGEX.test(icon) || SYMBOL_ONLY_REGEX.test(icon);
};

const OVERFLOW_FOCUS_KEY = '__overflow__';

const TEXTUAL_INPUT_TYPES = new Set([
  'text',
  'search',
  'url',
  'tel',
  'email',
  'password',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week'
]);

const isEditableTextControl = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  if (target instanceof HTMLTextAreaElement) {
    return !target.readOnly && !target.disabled;
  }

  if (target instanceof HTMLInputElement) {
    if (target.readOnly || target.disabled) {
      return false;
    }

    const inputType = target.type?.toLowerCase();

    if (!inputType) {
      return true;
    }

    if (TEXTUAL_INPUT_TYPES.has(inputType)) {
      return true;
    }
  }

  return false;
};

const DynToolbar = forwardRef<DynToolbarRef, DynToolbarProps>((
  {
    as: asProp,
    items = [],
    variant = TOOLBAR_DEFAULTS.variant,
    size = TOOLBAR_DEFAULTS.size,
    position = TOOLBAR_DEFAULTS.position,
    responsive = TOOLBAR_DEFAULTS.responsive,
    overflowMenu = TOOLBAR_DEFAULTS.overflowMenu,
    overflowThreshold = TOOLBAR_DEFAULTS.overflowThreshold,
    showLabels = TOOLBAR_DEFAULTS.showLabels,
    orientation = 'horizontal',
    className,
    itemClassName,
    onItemClick,
    onOverflowToggle,
    role: roleProp,
    onKeyDown: onKeyDownProp,
    'aria-orientation': ariaOrientationProp,
    ...rest
  },
  ref
) => {
  const Component = (asProp ?? 'div') as React.ElementType;
  const [visibleItems, setVisibleItems] = useState<ToolbarItem[]>(items);
  const [overflowItems, setOverflowItems] = useState<ToolbarItem[]>([]);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLElement | null>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const focusableRefs = useRef<Array<HTMLElement | null>>([]);
  const focusIntentRef = useRef<'keyboard' | null>(null);
  const [focusIndex, setFocusIndex] = useState<number>(-1);

  // Filter visible items
  const filteredItems = useMemo(() => {
    return items.filter(item => item.visible !== false);
  }, [items]);

  // Handle responsive layout
  const updateLayout = useCallback(() => {
    if (!overflowMenu) {
      setVisibleItems(filteredItems);
      setOverflowItems([]);
      return;
    }

    if (!responsive) {
      setVisibleItems(filteredItems);
      setOverflowItems([]);
      return;
    }

    const thresholdValue = Math.max(1, overflowThreshold);
    const hasThresholdOverflow = filteredItems.length > thresholdValue;

    const applyThreshold = () => {
      if (!hasThresholdOverflow) {
        setVisibleItems(filteredItems);
        setOverflowItems([]);
        return;
      }

      const maxVisible = Math.max(1, Math.min(thresholdValue, filteredItems.length - 1));
      setVisibleItems(filteredItems.slice(0, maxVisible));
      setOverflowItems(filteredItems.slice(maxVisible));
    };

    if (!toolbarRef.current) {
      applyThreshold();
      return;
    }

    const toolbarWidth = toolbarRef.current.offsetWidth;

    // If toolbar has no measurable width (jsdom environment), fall back to
    // threshold handling so tests and SSR render deterministically.
    if (!toolbarWidth || toolbarWidth === 0) {
      applyThreshold();
      return;
    }

    const itemElements = toolbarRef.current.querySelectorAll('[data-toolbar-item]');

    if (itemElements.length === 0 || filteredItems.length === 0) {
      setVisibleItems([]);
      setOverflowItems([]);
      return;
    }

    const padding = 32;
    const measureVisibleItems = (reserveOverflowButton: boolean) => {
      const overflowButtonWidth = reserveOverflowButton ? 48 : 0;
      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < itemElements.length; i++) {
        const itemWidth = itemElements[i].getBoundingClientRect().width;
        if (totalWidth + itemWidth + overflowButtonWidth + padding <= toolbarWidth) {
          totalWidth += itemWidth;
          count++;
        } else {
          break;
        }
      }

      return count;
    };

    let measuredVisible = measureVisibleItems(hasThresholdOverflow);
    const needsOverflowByWidth = measuredVisible < filteredItems.length;
    const shouldShowOverflow = hasThresholdOverflow || needsOverflowByWidth;

    if (shouldShowOverflow && !hasThresholdOverflow) {
      measuredVisible = measureVisibleItems(true);
    }

    if (!shouldShowOverflow) {
      setVisibleItems(filteredItems);
      setOverflowItems([]);
      return;
    }

    const maxVisible = hasThresholdOverflow
      ? Math.max(1, Math.min(thresholdValue, filteredItems.length - 1))
      : Math.max(1, filteredItems.length - 1);

    const visibleCount = Math.max(1, Math.min(measuredVisible, maxVisible));

    setVisibleItems(filteredItems.slice(0, visibleCount));
    setOverflowItems(filteredItems.slice(visibleCount));
  }, [filteredItems, responsive, overflowMenu, overflowThreshold]);

  useEffect(() => {
    updateLayout();
  }, [updateLayout]);

  useEffect(() => {
    if (!responsive) return;

    const handleResize = () => {
      updateLayout();
    };

    let resizeObserver: ResizeObserver | null = null;

    if (typeof window !== 'undefined' && typeof window.ResizeObserver === 'function') {
      const candidate = new window.ResizeObserver(handleResize) as unknown;

      if (
        candidate &&
        typeof (candidate as ResizeObserver).observe === 'function' &&
        typeof (candidate as ResizeObserver).disconnect === 'function'
      ) {
        resizeObserver = candidate as ResizeObserver;

        if (toolbarRef.current) {
          resizeObserver.observe(toolbarRef.current);
        }
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener('resize', handleResize);
    };
  }, [responsive, updateLayout]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Close overflow and dropdown when clicking outside the toolbar entirely
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setIsOverflowOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useImperativeHandle(ref, () => ({
    openOverflow: () => {
      setIsOverflowOpen(true);
      onOverflowToggle?.(true);
    },
    closeOverflow: () => {
      setIsOverflowOpen(false);
      onOverflowToggle?.(false);
    },
    toggleOverflow: () => {
      const newState = !isOverflowOpen;
      setIsOverflowOpen(newState);
      onOverflowToggle?.(newState);
    },
    refreshLayout: updateLayout
  }));

  const handleItemClick = useCallback((item: ToolbarItem, event?: React.MouseEvent) => {
    if (item.disabled) return;

    if (item.type === 'dropdown') {
      event?.preventDefault();
      setActiveDropdown(prev => {
        const next = prev === item.id ? null : item.id;
        lastDropdownIdRef.current = next ?? item.id;
        return next;
      });
      return;
    }

    if (item.action) {
      item.action();
    }

    onItemClick?.(item);

    if (activeDropdown) {
      lastDropdownIdRef.current = activeDropdown;
      setActiveDropdown(null);
    }

    // Close overflow menu after action
    if (isOverflowOpen) {
      setIsOverflowOpen(false);
      onOverflowToggle?.(false);
    }
  }, [activeDropdown, isOverflowOpen, onItemClick, onOverflowToggle]);

  const handleOverflowToggle = () => {
    const newState = !isOverflowOpen;
    setIsOverflowOpen(newState);
    onOverflowToggle?.(newState);
  };

  const focusableItems = useMemo(() => {
    const descriptors: Array<{ key: string; disabled: boolean }> = [];

    visibleItems.forEach(item => {
      if (!item || item.type === 'separator' || item.type === 'custom') {
        return;
      }

      if (item.type === 'search') {
        descriptors.push({ key: item.id, disabled: false });
        return;
      }

      descriptors.push({ key: item.id, disabled: Boolean(item.disabled) });
    });

    if (overflowItems.length > 0) {
      descriptors.push({ key: OVERFLOW_FOCUS_KEY, disabled: false });
    }

    return descriptors;
  }, [visibleItems, overflowItems]);

  const focusIndexLookup = useMemo(() => {
    const map = new Map<string, number>();
    focusableItems.forEach((descriptor, index) => {
      map.set(descriptor.key, index);
    });
    return map;
  }, [focusableItems]);

  const firstEnabledIndex = useMemo(() => {
    return focusableItems.findIndex(descriptor => !descriptor.disabled);
  }, [focusableItems]);

  const lastEnabledIndex = useMemo(() => {
    for (let i = focusableItems.length - 1; i >= 0; i--) {
      if (!focusableItems[i]?.disabled) {
        return i;
      }
    }
    return -1;
  }, [focusableItems]);

  useEffect(() => {
    focusableRefs.current.length = focusableItems.length;
  }, [focusableItems.length]);

  useEffect(() => {
    if (focusableItems.length === 0) {
      if (focusIndex !== -1) {
        setFocusIndex(-1);
      }
      return;
    }

    if (focusIndex === -1) {
      if (firstEnabledIndex !== -1) {
        setFocusIndex(firstEnabledIndex);
      }
      return;
    }

    if (focusIndex >= focusableItems.length) {
      if (firstEnabledIndex !== -1) {
        setFocusIndex(firstEnabledIndex);
      }
      return;
    }

    const current = focusableItems[focusIndex];
    if (!current || current.disabled) {
      if (firstEnabledIndex !== -1) {
        setFocusIndex(firstEnabledIndex);
      }
    }
  }, [focusIndex, focusableItems, firstEnabledIndex]);

  useEffect(() => {
    if (focusIntentRef.current !== 'keyboard') {
      focusIntentRef.current = null;
      return;
    }

    if (focusIndex < 0) {
      focusIntentRef.current = null;
      return;
    }

    const target = focusableRefs.current[focusIndex];
    if (target && typeof target.focus === 'function') {
      target.focus();
    }

    focusIntentRef.current = null;
  }, [focusIndex]);

  const registerFocusable = useCallback(
    (index: number | undefined) => (node: HTMLElement | null) => {
      if (index === undefined || index < 0) {
        return;
      }
      focusableRefs.current[index] = node;
    },
    []
  );

  const handleFocusableFocus = useCallback(
    (index: number | undefined) => () => {
      if (index === undefined || index < 0) {
        return;
      }
      if (focusIndex !== index) {
        focusIntentRef.current = null;
        setFocusIndex(index);
      }
    },
    [focusIndex]
  );

  const moveFocus = useCallback(
    (direction: 1 | -1) => {
      if (focusableItems.length === 0) {
        return;
      }

      const start = focusIndex >= 0 ? focusIndex : firstEnabledIndex;
      if (start == null || start === -1) {
        return;
      }

      let nextIndex = start;
      for (let i = 0; i < focusableItems.length; i++) {
        nextIndex = (nextIndex + direction + focusableItems.length) % focusableItems.length;
        if (!focusableItems[nextIndex]?.disabled) {
          focusIntentRef.current = 'keyboard';
          setFocusIndex(nextIndex);
          return;
        }
      }
    },
    [firstEnabledIndex, focusIndex, focusableItems]
  );

  const handleToolbarKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (isEditableTextControl(event.target)) {
        onKeyDownProp?.(event);
        return;
      }

      const key = event.key;
      let handled = false;

      if (key === 'Home') {
        if (firstEnabledIndex !== -1) {
          event.preventDefault();
          focusIntentRef.current = 'keyboard';
          setFocusIndex(firstEnabledIndex);
          handled = true;
        }
      } else if (key === 'End') {
        if (lastEnabledIndex !== -1) {
          event.preventDefault();
          focusIntentRef.current = 'keyboard';
          setFocusIndex(lastEnabledIndex);
          handled = true;
        }
      } else if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
        const direction: 1 | -1 = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
        moveFocus(direction);
        handled = true;
      }

      onKeyDownProp?.(event);

      if (handled) {
        event.stopPropagation();
      }
    },
    [firstEnabledIndex, lastEnabledIndex, moveFocus, onKeyDownProp]
  );

  const renderBadge = useCallback((badge: ToolbarItem['badge']) => {
    if (!badge) {
      return null;
    }

    if (typeof badge === 'object') {
      const count = badge.count ?? badge.value;
      return (
        <DynBadge
          count={typeof count === 'number' ? count : undefined}
          maxCount={badge.maxCount}
          showZero={badge.showZero}
          color={badge.color}
          variant={badge.variant}
          size="small"
        >
          {badge.label}
        </DynBadge>
      );
    }

    if (typeof badge === 'number') {
      return <DynBadge count={badge} size="small" />;
    }

    return <DynBadge size="small">{badge}</DynBadge>;
  }, []);

  const renderIconContent = useCallback((icon: ToolbarItem['icon']) => {
    if (React.isValidElement(icon)) {
      return icon;
    }

    if (typeof icon === 'string') {
      const normalizedIcon = icon.trim();

      if (!normalizedIcon) {
        return null;
      }

      if (isSymbolicIcon(normalizedIcon)) {
        return (
          <span
            className={styles['toolbar-item-icon-text']}
            data-testid={`icon-${normalizedIcon}`}
            aria-hidden="true"
          >
            {normalizedIcon}
          </span>
        );
      }

      return <DynIcon icon={normalizedIcon} data-testid={`icon-${normalizedIcon}`} />;
    }

    if (icon == null) {
      return null;
    }

    return icon as React.ReactNode;
  }, []);

  const renderToolbarItem = (item: ToolbarItem, isInOverflow = false) => {
    if (item.type === 'separator') {
      return (
        <div
          key={item.id}
          className={classNames(styles['toolbar-separator'], 'toolbar-separator')}
          data-toolbar-item
        />
      );
    }

    if (item.type === 'search') {
      const focusIndexForItem = focusIndexLookup.get(item.id);
      const resolvedTabIndex =
        focusIndexForItem === undefined
          ? undefined
          : focusIndex === focusIndexForItem
          ? 0
          : -1;

      return (
        <div
          key={item.id}
          className={classNames(styles['toolbar-search'], 'toolbar-search')}
          data-toolbar-item
        >
          <input
            type="search"
            placeholder={item.label || 'Search...'}
            className={styles['search-input']}
            tabIndex={resolvedTabIndex}
            ref={registerFocusable(focusIndexForItem)}
            onFocus={handleFocusableFocus(focusIndexForItem)}
          />
        </div>
      );
    }

    if (item.type === 'custom' && item.component) {
      return (
        <div
          key={item.id}
          className={classNames(styles['toolbar-custom'], 'toolbar-custom')}
          data-toolbar-item
        >
          {item.component}
        </div>
      );
    }

    const itemClasses = classNames(
      styles['toolbar-item'],
      'toolbar-item',
      {
        [styles['toolbar-item-disabled']]: item.disabled,
        'toolbar-item-disabled': item.disabled,
        [styles['toolbar-item-active']]: activeDropdown === item.id,
        'toolbar-item-active': activeDropdown === item.id,
        [styles['toolbar-item-overflow']]: isInOverflow,
        'toolbar-item-overflow': isInOverflow,
        [styles['toolbar-item-dropdown']]: item.type === 'dropdown',
        'toolbar-item-dropdown': item.type === 'dropdown'
      },
      itemClassName
    );

    const iconContent = renderIconContent(item.icon);
    const focusIndexForItem = focusIndexLookup.get(item.id);
    const resolvedTabIndex =
      focusIndexForItem === undefined
        ? undefined
        : focusIndex === focusIndexForItem
        ? 0
        : -1;

    const computedState = item.state ?? (item.type === 'dropdown' && activeDropdown === item.id ? 'open' : undefined);
    const isToggleState = item.state === 'on' || item.state === 'off' || item.state === 'mixed';
    const ariaPressed: React.ButtonHTMLAttributes<HTMLButtonElement>['aria-pressed'] = isToggleState
      ? item.state === 'mixed'
        ? 'mixed'
        : item.state === 'on'
      : undefined;

    if (item.type === 'dropdown' && !dropdownRefs.current[item.id]) {
      dropdownRefs.current[item.id] = { trigger: null, menu: null };
    }

    return (
      <div key={item.id} className={styles['toolbar-item-wrapper']}>
        <button
          ref={(node) => {
            if (item.type === 'dropdown') {
              dropdownRefs.current[item.id] = {
                ...(dropdownRefs.current[item.id] ?? { trigger: null, menu: null }),
                trigger: node
              };
            }
          }}
          className={itemClasses}
          onClick={(e) => handleItemClick(item, e)}
          disabled={item.disabled}
          title={item.tooltip || item.label}
          data-toolbar-item
          aria-label={item.label}
          aria-expanded={item.type === 'dropdown' ? activeDropdown === item.id : undefined}
          aria-haspopup={item.type === 'dropdown' ? 'menu' : undefined}
          aria-pressed={ariaPressed}
          data-state={computedState}
          data-disabled={item.disabled ? '' : undefined}
          tabIndex={resolvedTabIndex}
          ref={registerFocusable(focusIndexForItem)}
          onFocus={handleFocusableFocus(focusIndexForItem)}
        >
          {iconContent && (
            <span className={styles['toolbar-item-icon']}>
              {iconContent}
            </span>
          )}
          {showLabels && item.label && (
            <span
              className={styles['toolbar-item-label']}
              title={item.tooltip || item.label}
              aria-label={item.label}
              aria-haspopup={item.type === 'dropdown' ? 'menu' : undefined}
              aria-expanded={item.type === 'dropdown' ? activeDropdown === item.id : undefined}
            >
              {item.label}
            </span>
          )}
          {item.badge && (() => {
            // compute simple numeric count for tests
            let count: number | string | undefined;
            if (typeof item.badge === 'number') count = item.badge;
            else if (typeof item.badge === 'object') count = item.badge.count ?? item.badge.value;

            return (
              <span
                className={styles['toolbar-item-badge']}
                data-testid="badge"
                {...(count !== undefined ? { 'data-count': String(count) } : {})}
              >
                {renderBadge(item.badge)}
              </span>
            );
          })()}
          {item.type === 'dropdown' && (
            <span className={styles['toolbar-dropdown-arrow']}>
              <DynIcon icon="dyn-icon-chevron-down" />
            </span>
          )}
        </button>

        {/* Dropdown menu */}
        {item.type === 'dropdown' && item.items && activeDropdown === item.id && (
          <div
            className={styles['toolbar-dropdown-menu']}
            role="menu"
            tabIndex={-1}
            ref={(node) => {
              dropdownRefs.current[item.id] = {
                ...(dropdownRefs.current[item.id] ?? { trigger: null, menu: null }),
                menu: node
              };
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Escape') return;
              event.preventDefault();
              lastDropdownIdRef.current = item.id;
              setActiveDropdown(null);
            }}
          >
            {item.items.map(subItem => (
              <button
                key={subItem.id}
                className={styles['toolbar-dropdown-item']}
                onClick={() => handleItemClick(subItem)}
                disabled={subItem.disabled}
                role="menuitem"
              >
                {subItem.icon && (
                  <span className={styles['toolbar-item-icon']}>
                    {typeof subItem.icon === 'string' ? (
                      <DynIcon icon={subItem.icon} />
                    ) : (
                      subItem.icon
                    )}
                  </span>
                )}
                <span className={styles['toolbar-item-label']}>
                  {subItem.label}
                </span>
                {subItem.badge && (
                  <span className={styles['toolbar-item-badge']}>
                    {renderBadge(subItem.badge)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toolbarClasses = classNames(
    styles['dyn-toolbar'],
    'dyn-toolbar',
    {
      [styles[`variant-${variant}`]]: variant,
      [`variant-${variant}`]: variant,
      [styles[`size-${size}`]]: size,
      [`size-${size}`]: size,
      [styles[`position-${position}`]]: position,
      [`position-${position}`]: position,
      [styles['responsive']]: responsive,
      'responsive': responsive,
      [styles['show-labels']]: showLabels,
      'show-labels': showLabels
    },
    className
  );

  return (
    <Component
      className={toolbarClasses}
      ref={(node: HTMLElement | null) => {
        toolbarRef.current = node;
      }}
      role={roleProp ?? 'toolbar'}
      data-orientation={orientation}
      aria-orientation={ariaOrientationProp ?? orientation}
      onKeyDown={handleToolbarKeyDown}
      {...rest}
    >
      <div className={styles['toolbar-content']}>
        <div className={styles['toolbar-items']}>
          {visibleItems.map(item => renderToolbarItem(item))}
        </div>

        {overflowItems.length > 0 && (
          <div className={styles['toolbar-overflow']} ref={overflowRef}>
            <button
              ref={(node) => {
                overflowButtonRef.current = node;
              }}
              className={classNames(
                styles['toolbar-overflow-button'],
                'toolbar-overflow-button',
                {
                  [styles['active']]: isOverflowOpen,
                  'active': isOverflowOpen
                },
                itemClassName
              )}
              onClick={handleOverflowToggle}
              aria-haspopup="menu"
              aria-expanded={isOverflowOpen}
              aria-label="More actions"
              title="More actions"
              data-state={isOverflowOpen ? 'open' : undefined}
              tabIndex={focusIndexLookup.get(OVERFLOW_FOCUS_KEY) === focusIndex ? 0 : -1}
              ref={registerFocusable(focusIndexLookup.get(OVERFLOW_FOCUS_KEY))}
              onFocus={handleFocusableFocus(focusIndexLookup.get(OVERFLOW_FOCUS_KEY))}
            >
              <DynIcon icon="more-horizontal" />
            </button>

            {isOverflowOpen && (
              <div
                className={styles['toolbar-overflow-menu']}
                role="menu"
                tabIndex={-1}
                ref={(node) => {
                  overflowMenuRef.current = node;
                }}
                onKeyDown={handleOverflowMenuKeyDown}
              >
                {overflowItems.map(item => renderToolbarItem(item, true))}
              </div>
            )}
          </div>
        )}
      </div>
    </Component>
  );
});

DynToolbar.displayName = 'DynToolbar';

export default DynToolbar;
export { DynToolbar };
