import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import styles from './DynMenu.module.css';
import type { DynMenuProps, DynMenuItem } from './DynMenu.types';

const getStyleClass = (n: string) => (styles as Record<string, string>)[n] || '';

export const DynMenu: React.FC<DynMenuProps> = ({
  items,
  menus,
  orientation = 'horizontal',
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
  onAction,
  ...rest
}) => {
  const [internalId] = useState(() => id || generateId('menu'));
  const resolvedItems = useMemo<DynMenuItem[]>(
    () => (items && items.length ? items : menus ?? []),
    [items, menus]
  );
  const isHorizontal = orientation === 'horizontal';
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const firstEnabledIndex = useMemo(
    () => resolvedItems.findIndex((item) => !item.disabled),
    [resolvedItems]
  );
  const lastEnabledIndex = useMemo(() => {
    for (let i = resolvedItems.length - 1; i >= 0; i -= 1) {
      if (!resolvedItems[i]?.disabled) return i;
    }
    return -1;
  }, [resolvedItems]);
  const [focusIndex, setFocusIndex] = useState<number>(() =>
    firstEnabledIndex >= 0 ? firstEnabledIndex : -1
  );
  const [subFocusIndex, setSubFocusIndex] = useState<Record<number, number>>({});

  const menubarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const submenuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ignoreClickRef = useRef<number | null>(null);

  useEffect(() => {
    if (focusIndex >= 0 && openIndex !== focusIndex) {
      itemRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex, openIndex]);

  useEffect(() => {
    if (focusIndex === -1 && firstEnabledIndex >= 0) {
      setFocusIndex(firstEnabledIndex);
    }
  }, [firstEnabledIndex, focusIndex]);

  const closeAll = useCallback(() => {
    setOpenIndex(null);
  }, []);

  useEffect(() => {
    if (openIndex === null) {
      setSubFocusIndex({});
      ignoreClickRef.current = null;
      return;
    }

    const item = resolvedItems[openIndex];
    const subItems = (item?.children ?? item?.subItems ?? []) as DynMenuItem[];
    const firstEnabledSubIndex = subItems.findIndex((sub) => !sub.disabled);
    setSubFocusIndex(() =>
      firstEnabledSubIndex >= 0 ? { [openIndex]: firstEnabledSubIndex } : {}
    );

    const focusSubmenu = () => {
      submenuRefs.current[openIndex]?.focus();
    };

    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      window.requestAnimationFrame(focusSubmenu);
    } else {
      focusSubmenu();
    }
  }, [openIndex, resolvedItems]);

  useEffect(() => {
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (openIndex === null) return;
      const target = event.target as Node | null;
      if (target && menubarRef.current?.contains(target)) return;
      closeAll();
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (openIndex === null) return;
      const target = event.target as Node | null;
      if (target && menubarRef.current?.contains(target)) return;
      closeAll();
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [closeAll, openIndex]);

  const visibleMenuCount = useMemo(() => resolvedItems.length, [resolvedItems]);

  const moveFocus = (delta: number) => {
    if (!visibleMenuCount || firstEnabledIndex === -1) return;
    setFocusIndex((prev) => {
      const start = prev >= 0 ? prev : firstEnabledIndex;
      let next = start;
      for (let i = 0; i < visibleMenuCount; i += 1) {
        next = (next + delta + visibleMenuCount) % visibleMenuCount;
        if (!resolvedItems[next]?.disabled) {
          return next;
        }
      }
      return start;
    });
  };

  const onMenubarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const horizontal = isHorizontal;
    switch (e.key) {
      case 'ArrowRight':
        if (horizontal) {
          e.preventDefault();
          moveFocus(1);
        }
        break;
      case 'ArrowLeft':
        if (horizontal) {
          e.preventDefault();
          moveFocus(-1);
        }
        break;
      case 'ArrowDown':
        if (!horizontal) {
          e.preventDefault();
          moveFocus(1);
        } else {
          e.preventDefault();
          if (focusIndex >= 0) {
            setOpenIndex(focusIndex);
          }
        }
        break;
      case 'ArrowUp': if (!horizontal) { e.preventDefault(); moveFocus(-1); } break;
      case 'Home':
        if (firstEnabledIndex !== -1) {
          e.preventDefault();
          setFocusIndex(firstEnabledIndex);
        }
        break;
      case 'End':
        if (lastEnabledIndex !== -1) {
          e.preventDefault();
          setFocusIndex(lastEnabledIndex);
        }
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (focusIndex >= 0 && !resolvedItems[focusIndex]?.disabled) {
          setOpenIndex((prev) => (prev === focusIndex ? null : focusIndex));
        }
        break;
      }
      case 'Escape':
        if (openIndex !== null) { e.preventDefault(); closeAll(); }
        break;
    }
  };

  const findNextEnabledSubIndex = (
    items: DynMenuItem[],
    start: number,
    delta: number
  ) => {
    if (!items.length) return -1;
    let next = start;
    for (let i = 0; i < items.length; i += 1) {
      next = (next + delta + items.length) % items.length;
      if (!items[next]?.disabled) {
        return next;
      }
    }
    return start;
  };

  const handleItemClick = (index: number) => {
    if (resolvedItems[index]?.disabled) return;
    if (ignoreClickRef.current !== null) {
      if (ignoreClickRef.current === index) {
        ignoreClickRef.current = null;
        return;
      }
      ignoreClickRef.current = null;
    }
    setOpenIndex((prev) => (prev === index ? null : index));
    setFocusIndex(index);
  };

  const onSubItemClick = (action: string | (() => void) | undefined) => {
    if (typeof action === 'string') {
      onAction?.(action);
    } else if (typeof action === 'function') {
      try {
        action();
      } catch {
        // ignore errors from provided callback
      }
    }
    closeAll();
  };

  return (
    <div
      id={internalId}
      role="menubar"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-orientation={orientation}
      className={cn(
        getStyleClass('menubar'),
        getStyleClass(`menubar--${orientation}`),
        'dyn-menu',
        `dyn-menu--${orientation}`,
        className
      )}
      data-testid={dataTestId || 'dyn-menu'}
      ref={menubarRef}
      onKeyDown={onMenubarKeyDown}
      {...rest}
    >
      {resolvedItems.map((item, idx) => {
        const isOpen = openIndex === idx;
        const buttonId = `${internalId}-item-${idx}`;
        const menuId = `${internalId}-submenu-${idx}`;
        const childItems = item.children ?? item.subItems ?? [];
        const activeSubIndex = subFocusIndex[idx];
        const firstEnabledSubIndex = childItems.findIndex((sub) => !sub.disabled);
        const lastEnabledSubIndex = (() => {
          for (let s = childItems.length - 1; s >= 0; s -= 1) {
            if (!childItems[s]?.disabled) return s;
          }
          return -1;
        })();
        const currentSubIndex =
          activeSubIndex ?? (firstEnabledSubIndex >= 0 ? firstEnabledSubIndex : -1);
        const handleSubmenuKeyDown = (
          event: React.KeyboardEvent<HTMLDivElement>
        ) => {
          if (!childItems.length) return;
          const items = childItems as DynMenuItem[];
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault();
              if (firstEnabledSubIndex === -1) return;
              setSubFocusIndex((prev) => {
                const prevIndex =
                  prev[idx] ??
                  (firstEnabledSubIndex >= 0 ? firstEnabledSubIndex : -1);
                if (prevIndex === -1) return prev;
                const next = findNextEnabledSubIndex(items, prevIndex, 1);
                if (next === prevIndex) return prev;
                return { ...prev, [idx]: next };
              });
              break;
            case 'ArrowUp':
              event.preventDefault();
              if (firstEnabledSubIndex === -1) return;
              setSubFocusIndex((prev) => {
                const prevIndex =
                  prev[idx] ??
                  (firstEnabledSubIndex >= 0 ? firstEnabledSubIndex : -1);
                if (prevIndex === -1) return prev;
                const next = findNextEnabledSubIndex(items, prevIndex, -1);
                if (next === prevIndex) return prev;
                return { ...prev, [idx]: next };
              });
              break;
            case 'Home':
              event.preventDefault();
              if (firstEnabledSubIndex === -1) return;
              setSubFocusIndex((prev) => {
                if (prev[idx] === firstEnabledSubIndex) return prev;
                return { ...prev, [idx]: firstEnabledSubIndex };
              });
              break;
            case 'End':
              event.preventDefault();
              if (lastEnabledSubIndex === -1) return;
              setSubFocusIndex((prev) => {
                if (prev[idx] === lastEnabledSubIndex) return prev;
                return { ...prev, [idx]: lastEnabledSubIndex };
              });
              break;
            case 'Enter':
            case ' ': {
              event.preventDefault();
              event.stopPropagation();
              const activeIndex =
                currentSubIndex !== -1
                  ? currentSubIndex
                  : firstEnabledSubIndex >= 0
                  ? firstEnabledSubIndex
                  : -1;
              const activeItem =
                activeIndex === -1 ? undefined : items[activeIndex];
              if (!activeItem || activeItem.disabled) return;
              ignoreClickRef.current = idx;
              onSubItemClick(activeItem.action);
              setFocusIndex(idx);
              break;
            }
            case 'Escape':
              event.preventDefault();
              closeAll();
              itemRefs.current[idx]?.focus();
              setFocusIndex(idx);
              break;
          }
        };
        return (
          <div key={buttonId} className={cn(getStyleClass('menubar__item'), 'dyn-menu-item-container')}>
            <button
              ref={(el) => { itemRefs.current[idx] = el; }}
              id={buttonId}
              type="button"
              role="menuitem"
              className={cn(
                getStyleClass('menubar__button'),
                isOpen && getStyleClass('menubar__button--open'),
                'dyn-menu-item',
                isOpen && 'dyn-menu-item-active',
                item.disabled && 'dyn-menu-item-disabled'
              )}
              aria-haspopup={childItems.length ? 'menu' : undefined}
              aria-expanded={childItems.length ? isOpen : undefined}
              aria-controls={childItems.length ? menuId : undefined}
              disabled={item.disabled}
              onClick={() => handleItemClick(idx)}
            >
              {item.label}
            </button>
            {childItems.length > 0 && isOpen && (
              <div
                id={menuId}
                role="menu"
                aria-labelledby={buttonId}
                aria-activedescendant={
                  currentSubIndex !== -1 ? `${menuId}-opt-${currentSubIndex}` : undefined
                }
                tabIndex={-1}
                className={cn(getStyleClass('menu'), 'dyn-menu-subitems')}
                ref={(el) => {
                  submenuRefs.current[idx] = el;
                }}
                onKeyDown={handleSubmenuKeyDown}
              >
                {childItems.map((sub, sidx) => (
                  <button
                    key={`${menuId}-opt-${sidx}`}
                    id={`${menuId}-opt-${sidx}`}
                    role="menuitem"
                    type="button"
                    className={cn(
                      getStyleClass('menu__item'),
                      'dyn-menu-item',
                      currentSubIndex === sidx && 'dyn-menu-item-active'
                    )}
                    tabIndex={-1}
                    data-active={currentSubIndex === sidx ? 'true' : undefined}
                    disabled={sub.disabled}
                    onClick={() => {
                      if (sub.disabled) return;
                      onSubItemClick(sub.action);
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynMenu;
