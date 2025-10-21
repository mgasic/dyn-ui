import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import { DynMenuItem as DynMenuItemElement } from '../DynMenuItem';
import styles from './DynMenu.module.css';
import type { DynMenuProps, MenuItem } from './DynMenu.types';

const getStyleClass = (n: string) => (styles as Record<string, string>)[n] || '';

const isMenuItemDisabled = (item?: MenuItem | null) => Boolean(item?.disabled || item?.loading);

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
  const resolvedItems = useMemo<MenuItem[]>(
    () => (items && items.length ? items : menus ?? []),
    [items, menus]
  );
  const isHorizontal = orientation === 'horizontal';
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [submenuFocusIndex, setSubmenuFocusIndex] = useState<Record<number, number>>({});
  const firstEnabledIndex = useMemo(
    () => resolvedItems.findIndex((item) => !isMenuItemDisabled(item)),
    [resolvedItems]
  );
  const lastEnabledIndex = useMemo(() => {
    for (let i = resolvedItems.length - 1; i >= 0; i -= 1) {
      if (!isMenuItemDisabled(resolvedItems[i])) return i;
    }
    return -1;
  }, [resolvedItems]);
  const [focusIndex, setFocusIndex] = useState<number>(() =>
    firstEnabledIndex >= 0 ? firstEnabledIndex : -1
  );
  const [subFocusIndex, setSubFocusIndex] = useState<Record<number, number>>({});

  const menubarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
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
    const subItems = (item?.children ?? item?.subItems ?? []) as MenuItem[];
    const firstEnabledSubIndex = subItems.findIndex((sub) => !isMenuItemDisabled(sub));
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
        if (!isMenuItemDisabled(resolvedItems[next])) {
          return next;
        }
      }
      return start;
    });
  };

  const closeAll = useCallback(() => {
    setOpenIndex(null);
    setSubmenuFocusIndex({});
  }, []);

  useEffect(() => {
    if (openIndex === null) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && menubarRef.current?.contains(target)) return;
      closeAll();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (target && menubarRef.current?.contains(target)) return;
      closeAll();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [closeAll, openIndex]);

  const focusSubmenuItem = useCallback((menuIdx: number, subIdx: number) => {
    const button = submenuItemRefs.current[menuIdx]?.[subIdx];
    if (button) {
      button.focus();
    }
  }, []);

  useEffect(() => {
    if (openIndex === null) return;

    const childItems =
      resolvedItems[openIndex]?.children ?? resolvedItems[openIndex]?.subItems ?? [];

    if (!childItems.length) return;

    const firstEnabled = childItems.findIndex((child) => !child.disabled);
    setSubmenuFocusIndex((prev) => ({
      ...prev,
      [openIndex]: firstEnabled
    }));

    if (firstEnabled >= 0) {
      // Defer focusing until refs have been updated in the DOM
      const focusTask = () => {
        focusSubmenuItem(openIndex, firstEnabled);
      };
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(focusTask);
      } else {
        setTimeout(focusTask, 0);
      }
    }
  }, [focusSubmenuItem, openIndex, resolvedItems]);

  const updateSubmenuFocus = useCallback(
    (menuIdx: number, nextIdx: number) => {
      setSubmenuFocusIndex((prev) => ({
        ...prev,
        [menuIdx]: nextIdx
      }));
      if (nextIdx >= 0) {
        focusSubmenuItem(menuIdx, nextIdx);
      }
    },
    [focusSubmenuItem]
  );

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
        if (focusIndex >= 0 && !isMenuItemDisabled(resolvedItems[focusIndex])) {
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
    items: MenuItem[],
    start: number,
    delta: number
  ) => {
    if (!items.length) return -1;
    let next = start;
    for (let i = 0; i < items.length; i += 1) {
      next = (next + delta + items.length) % items.length;
      if (!isMenuItemDisabled(items[next])) {
        return next;
      }
    }
    return start;
  };

  const handleItemClick = (index: number) => {
    if (isMenuItemDisabled(resolvedItems[index])) return;
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

  const onSubmenuKeyDown = (
    menuIdx: number,
    childItems: DynMenuItem[]
  ) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const visibleCount = childItems.length;
    if (!visibleCount) return;

    const findNextEnabled = (start: number, delta: number) => {
      if (!visibleCount) return -1;
      let next = start;
      for (let i = 0; i < visibleCount; i += 1) {
        next = (next + delta + visibleCount) % visibleCount;
        if (!childItems[next]?.disabled) {
          return next;
        }
      }
      return start;
    };

    const current = submenuFocusIndex[menuIdx] ?? -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        e.stopPropagation();
        const startIndex = current >= 0 ? current : findNextEnabled(-1, 1);
        if (startIndex === -1) return;
        const nextIdx = findNextEnabled(startIndex, 1);
        updateSubmenuFocus(menuIdx, nextIdx);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        e.stopPropagation();
        const startIndex = current >= 0 ? current : findNextEnabled(1, -1);
        if (startIndex === -1) return;
        const nextIdx = findNextEnabled(startIndex, -1);
        updateSubmenuFocus(menuIdx, nextIdx);
        break;
      }
      case 'Home': {
        e.preventDefault();
        e.stopPropagation();
        const firstEnabledSub = findNextEnabled(-1, 1);
        updateSubmenuFocus(menuIdx, firstEnabledSub);
        break;
      }
      case 'End': {
        e.preventDefault();
        e.stopPropagation();
        const lastEnabledSub = findNextEnabled(0, -1);
        updateSubmenuFocus(menuIdx, lastEnabledSub);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        e.stopPropagation();
        if (current >= 0) {
          const currentItem = childItems[current];
          if (!currentItem?.disabled) {
            onSubItemClick(currentItem?.action);
          }
        }
        break;
      }
      case 'Escape':
      case 'ArrowLeft': {
        e.preventDefault();
        e.stopPropagation();
        closeAll();
        itemRefs.current[menuIdx]?.focus();
        break;
      }
      case 'ArrowRight': {
        if (isHorizontal) {
          e.preventDefault();
          e.stopPropagation();
          closeAll();
          moveFocus(1);
        }
        break;
      }
      default:
        break;
    }
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
        const firstEnabledSubIndex = childItems.findIndex((sub) => !isMenuItemDisabled(sub));
        const lastEnabledSubIndex = (() => {
          for (let s = childItems.length - 1; s >= 0; s -= 1) {
            if (!isMenuItemDisabled(childItems[s])) return s;
          }
          return -1;
        })();
        const currentSubIndex =
          activeSubIndex ?? (firstEnabledSubIndex >= 0 ? firstEnabledSubIndex : -1);
        const handleSubmenuKeyDown = (
          event: React.KeyboardEvent<HTMLDivElement>
        ) => {
          if (!childItems.length) return;
          const items = childItems as MenuItem[];
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
              if (!activeItem || isMenuItemDisabled(activeItem)) return;
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
            <DynMenuItemElement
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              id={buttonId}
              className={cn(
                getStyleClass('menubar__button'),
                isOpen && getStyleClass('menubar__button--open'),
                isOpen && 'dyn-menu-item-active',
                (item.disabled || item.loading) && 'dyn-menu-item-disabled'
              )}
              aria-haspopup={childItems.length ? 'menu' : undefined}
              aria-expanded={childItems.length ? isOpen : undefined}
              aria-controls={childItems.length ? menuId : undefined}
              disabled={item.disabled}
              active={isOpen}
              loading={item.loading}
              ariaLabel={item.ariaLabel}
              aria-labelledby={item.ariaLabelledBy}
              aria-describedby={item.ariaDescribedBy}
              label={item.label}
              onClick={() => handleItemClick(idx)}
            />
            {childItems.length > 0 && isOpen && (
              <div
                id={menuId}
                role="menu"
                aria-labelledby={buttonId}
                aria-activedescendant={
                  submenuFocusIndex[idx] !== undefined && submenuFocusIndex[idx] >= 0
                    ? `${menuId}-opt-${submenuFocusIndex[idx]}`
                    : undefined
                }
                className={cn(getStyleClass('menu'), 'dyn-menu-subitems')}
                tabIndex={-1}
                onKeyDown={onSubmenuKeyDown(idx, childItems)}
              >
                {childItems.map((sub, sidx) => (
                  <DynMenuItemElement
                    key={`${menuId}-opt-${sidx}`}
                    id={`${menuId}-opt-${sidx}`}
                    className={cn(
                      getStyleClass('menu__item'),
                      currentSubIndex === sidx && 'dyn-menu-item-active'
                    )}
                    tabIndex={-1}
                    active={currentSubIndex === sidx}
                    disabled={sub.disabled}
                    loading={sub.loading}
                    ariaLabel={sub.ariaLabel}
                    aria-labelledby={sub.ariaLabelledBy}
                    aria-describedby={sub.ariaDescribedBy}
                    label={sub.label}
                    onClick={() => {
                      if (isMenuItemDisabled(sub)) return;
                      onSubItemClick(sub.action);
                    }}
                  />
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
