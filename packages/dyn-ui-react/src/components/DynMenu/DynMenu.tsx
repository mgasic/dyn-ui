import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DynMenuTrigger } from '../DynMenuTrigger';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import { DynMenuItem as DynMenuButton } from '../DynMenuItem';
import styles from './DynMenu.module.css';
import type { DynMenuProps, DynMenuItem as DynMenuEntry } from './DynMenu.types';

const getStyleClass = (name: string) => (styles as Record<string, string>)[name] || '';

const findFirstEnabled = (items: DynMenuEntry[]) =>
  items.findIndex((item) => !item.disabled);

const findLastEnabled = (items: DynMenuEntry[]) => {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index]?.disabled) return index;
  }
  return -1;
};

const findNextEnabled = (items: DynMenuEntry[], start: number, delta: number) => {
  if (!items.length) return -1;
  let next = start;
  for (let iteration = 0; iteration < items.length; iteration += 1) {
    next = (next + delta + items.length) % items.length;
    if (!items[next]?.disabled) {
      return next;
    }
  }
  return start;
};

type DynMenuComponentType = React.FC<DynMenuProps> & {
  Trigger: typeof DynMenuTrigger;
};

const DynMenuComponent: React.FC<DynMenuProps> = ({
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
  const resolvedItems = useMemo<DynMenuEntry[]>(
    () => (items && items.length ? items : menus ?? []),
    [items, menus]
  );
  const isHorizontal = orientation === 'horizontal';

  const menubarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const submenuItemRefs = useRef<Array<Array<HTMLButtonElement | null>>>([]);
  const submenuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ignoreClickRef = useRef<number | null>(null);

  const firstEnabledIndex = useMemo(
    () => findFirstEnabled(resolvedItems),
    [resolvedItems]
  );
  const lastEnabledIndex = useMemo(
    () => findLastEnabled(resolvedItems),
    [resolvedItems]
  );

  const [focusIndex, setFocusIndex] = useState(() =>
    firstEnabledIndex >= 0 ? firstEnabledIndex : -1
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [submenuFocusIndex, setSubmenuFocusIndex] = useState<Record<number, number>>({});

  useEffect(() => {
    if (focusIndex >= 0) {
      itemRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex]);

  useEffect(() => {
    if (focusIndex === -1 && firstEnabledIndex >= 0) {
      setFocusIndex(firstEnabledIndex);
    }
  }, [firstEnabledIndex, focusIndex]);

  const closeAll = useCallback(() => {
    setOpenIndex(null);
    setSubmenuFocusIndex({});
    ignoreClickRef.current = null;
  }, []);

  useEffect(() => {
    if (openIndex === null) return;

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && menubarRef.current?.contains(target)) return;
      closeAll();
    };

    const handleFocusIn = (event: FocusEvent) => {
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

  const focusSubmenuItem = useCallback((menuIdx: number, subIdx: number) => {
    const button = submenuItemRefs.current[menuIdx]?.[subIdx];
    if (!button) return;
    try {
      button.focus();
    } catch {
      /* no-op */
    }
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const childItems =
      resolvedItems[openIndex]?.children ?? resolvedItems[openIndex]?.subItems ?? [];
    if (!childItems.length) {
      setSubmenuFocusIndex((prev) => {
        const next = { ...prev };
        delete next[openIndex];
        return next;
      });
      return;
    }

    const focusContainer = () => {
      const container = submenuRefs.current[openIndex];
      if (!container) return;
      try {
        container.focus();
      } catch {
        /* ignore focus errors */
      }
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(focusContainer);
    } else {
      focusContainer();
    }

    const firstEnabledSub = findFirstEnabled(childItems);
    setSubmenuFocusIndex((prev) => ({
      ...prev,
      [openIndex]: firstEnabledSub,
    }));

    if (firstEnabledSub >= 0) {
      focusSubmenuItem(openIndex, firstEnabledSub);
    }
  }, [focusSubmenuItem, openIndex, resolvedItems]);

  const moveFocus = (delta: number) => {
    if (firstEnabledIndex === -1) return;
    setFocusIndex((prev) => {
      const start = prev >= 0 ? prev : firstEnabledIndex;
      const next = findNextEnabled(resolvedItems, start, delta);
      return next >= 0 ? next : start;
    });
  };

  const handleTopLevelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          moveFocus(1);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          moveFocus(-1);
        }
        break;
      case 'ArrowDown':
        if (isHorizontal) {
          event.preventDefault();
          if (focusIndex >= 0) {
            setOpenIndex(focusIndex);
          }
        } else {
          event.preventDefault();
          moveFocus(1);
        }
        break;
      case 'ArrowUp':
        if (!isHorizontal) {
          event.preventDefault();
          moveFocus(-1);
        }
        break;
      case 'Home':
        if (firstEnabledIndex !== -1) {
          event.preventDefault();
          setFocusIndex(firstEnabledIndex);
        }
        break;
      case 'End':
        if (lastEnabledIndex !== -1) {
          event.preventDefault();
          setFocusIndex(lastEnabledIndex);
        }
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (focusIndex >= 0 && !resolvedItems[focusIndex]?.disabled) {
          setOpenIndex((prev) => (prev === focusIndex ? null : focusIndex));
        }
        break;
      }
      case 'Escape':
        if (openIndex !== null) {
          event.preventDefault();
          closeAll();
        }
        break;
      default:
        break;
    }
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

  const handleSubItemInvoke = (item: DynMenuEntry) => {
    if (item.disabled) return;
    if (typeof item.action === 'function') {
      try {
        item.action();
      } catch {
        /* swallow user errors */
      }
    } else if (typeof item.action === 'string') {
      onAction?.(item.action);
    } else {
      onAction?.(item);
    }
    closeAll();
  };

  const handleSubmenuKeyDown = (
    menuIdx: number,
    childItems: DynMenuEntry[]
  ) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!childItems.length) return;
    const current = submenuFocusIndex[menuIdx] ?? findFirstEnabled(childItems);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        event.stopPropagation();
        const startIndex = current >= 0 ? current : findFirstEnabled(childItems);
        if (startIndex === -1) return;
        const next = findNextEnabled(childItems, startIndex, 1);
        if (next !== -1) {
          setSubmenuFocusIndex((prev) => ({ ...prev, [menuIdx]: next }));
          focusSubmenuItem(menuIdx, next);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        event.stopPropagation();
        const startIndex = current >= 0 ? current : findLastEnabled(childItems);
        if (startIndex === -1) return;
        const next = findNextEnabled(childItems, startIndex, -1);
        if (next !== -1) {
          setSubmenuFocusIndex((prev) => ({ ...prev, [menuIdx]: next }));
          focusSubmenuItem(menuIdx, next);
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        event.stopPropagation();
        const first = findFirstEnabled(childItems);
        if (first !== -1) {
          setSubmenuFocusIndex((prev) => ({ ...prev, [menuIdx]: first }));
          focusSubmenuItem(menuIdx, first);
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        event.stopPropagation();
        const last = findLastEnabled(childItems);
        if (last !== -1) {
          setSubmenuFocusIndex((prev) => ({ ...prev, [menuIdx]: last }));
          focusSubmenuItem(menuIdx, last);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        event.stopPropagation();
        if (current >= 0) {
          const activeItem = childItems[current];
          if (activeItem && !activeItem.disabled) {
            ignoreClickRef.current = menuIdx;
            handleSubItemInvoke(activeItem);
            setFocusIndex(menuIdx);
          }
        }
        break;
      }
      case 'Escape':
      case 'ArrowLeft': {
        event.preventDefault();
        event.stopPropagation();
        closeAll();
        itemRefs.current[menuIdx]?.focus();
        setFocusIndex(menuIdx);
        break;
      }
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          event.stopPropagation();
          closeAll();
          moveFocus(1);
        }
        break;
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
      onKeyDown={handleTopLevelKeyDown}
      {...rest}
    >
      {resolvedItems.map((item, index) => {
        const isOpen = openIndex === index;
        const childItems = (item.children ?? item.subItems ?? []) as DynMenuEntry[];
        const buttonId = `${internalId}-item-${index}`;
        const menuId = `${internalId}-submenu-${index}`;
        const activeSubIndex = submenuFocusIndex[index];

        return (
          <div
            key={buttonId}
            className={cn(getStyleClass('menubar__item'), 'dyn-menu-item-container')}
          >
            <DynMenuButton
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              id={buttonId}
              className={cn(
                getStyleClass('menubar__button'),
                isOpen && getStyleClass('menubar__button--open')
              )}
              active={isOpen}
              open={isOpen}
              disabled={item.disabled}
              aria-haspopup={childItems.length ? 'menu' : undefined}
              aria-expanded={childItems.length ? isOpen : undefined}
              aria-controls={childItems.length ? menuId : undefined}
              onClick={() => handleItemClick(index)}
            >
              {item.label}
            </DynMenuButton>

            {childItems.length > 0 && isOpen ? (
              <div
                id={menuId}
                role="menu"
                aria-labelledby={buttonId}
                aria-activedescendant={
                  activeSubIndex !== undefined && activeSubIndex >= 0
                    ? `${menuId}-opt-${activeSubIndex}`
                    : undefined
                }
                className={cn(getStyleClass('menu'), 'dyn-menu-subitems')}
                tabIndex={-1}
                onKeyDown={handleSubmenuKeyDown(index, childItems)}
                ref={(element) => {
                  submenuRefs.current[index] = element;
                }}
              >
                {childItems.map((subItem, subIndex) => (
                  <DynMenuButton
                    key={`${menuId}-opt-${subIndex}`}
                    id={`${menuId}-opt-${subIndex}`}
                    ref={(element) => {
                      if (!submenuItemRefs.current[index]) {
                        submenuItemRefs.current[index] = [];
                      }
                      submenuItemRefs.current[index][subIndex] = element;
                    }}
                    className={cn(
                      getStyleClass('menu__item')
                    )}
                    active={activeSubIndex === subIndex}
                    tabIndex={activeSubIndex === subIndex ? 0 : -1}
                    disabled={subItem.disabled}
                    onClick={() => handleSubItemInvoke(subItem)}
                  >
                    {subItem.label}
                  </DynMenuButton>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const DynMenu = Object.assign(DynMenuComponent, {
  Trigger: DynMenuTrigger
}) as DynMenuComponentType;

export default DynMenu;
