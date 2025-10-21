import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import styles from './DynTabs.module.css';
import type { DynTabsProps, DynTabsRef, TabChangeEvent } from './DynTabs.types';

const css = (n: string) => (styles as Record<string, string>)[n] || '';

const DynTabsInner = <E extends React.ElementType = 'div'>(
  {
    as,
    items = [],
    value,
    activeTab,
    defaultValue,
    defaultActiveTab,
    onChange,
    onTabClose,
    onTabAdd,
    closable,
    addable,
    position = 'top',
    orientation = 'horizontal',
    activation = 'auto',
    variant = 'default',
    size = 'medium',
    fitted = false,
    scrollable = false,
    lazy = false,
    lazyMount = false,
    animated = true,
    disabled = false,
    className,
    id,
    tabListClassName,
    contentClassName,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'data-testid': dataTestId,
    loadingComponent,
    ...rest
  }: DynTabsProps<E>,
  ref: React.ForwardedRef<DynTabsRef>
) => {
  const Component = (as ?? 'div') as React.ElementType;
    const [internalId] = useState(() => id || generateId('tabs'));

    // Build processed items
    type RawItem = NonNullable<DynTabsProps['items']>[number];
    type ProcessedItem = RawItem & { processedValue: string; processedKey: string };

    const processedItems = useMemo<ProcessedItem[]>(() => (items as RawItem[]).map((item: RawItem, index: number) => {
      const processedValue = item.value != null ? String(item.value) : item.id != null ? String(item.id) : `tab-${index}`;
      const processedKey = item.id != null ? String(item.id) : item.value != null ? String(item.value) : `tab-${index}`;
      return { ...item, processedValue, processedKey };
    }), [items]);

    // Determine control mode and initial
    const controlledVal = activeTab ?? value;
    const isControlled = controlledVal !== undefined;

    const getInitial = (): string | undefined => {
      if (controlledVal !== undefined) return String(controlledVal);
      if (defaultActiveTab !== undefined) return String(defaultActiveTab);
      if (defaultValue !== undefined) return String(defaultValue);
      const firstEnabled = processedItems.find(i => !i.disabled) ?? processedItems[0];
      return firstEnabled?.processedValue;
    };

    const [current, setCurrent] = useState<string | undefined>(getInitial());

    // Lazy: track loading states
    const [loaded, setLoaded] = useState<Record<string, boolean>>({});

    // Pre-mark initial current as not loaded for immediate placeholder
    useEffect(() => {
      if (lazy && current && loaded[current] === undefined) {
        setLoaded(prev => ({ ...prev, [current]: false }));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync controlled
    useEffect(() => {
      if (controlledVal !== undefined) setCurrent(String(controlledVal));
    }, [controlledVal]);

    // Guard if items change
    useEffect(() => {
      if (!processedItems.length) return;
      const exists = processedItems.some(i => i.processedValue === current);
      if (!exists) {
        const firstEnabled = processedItems.find(i => !i.disabled) ?? processedItems[0];
        setCurrent(firstEnabled?.processedValue);
      }
    }, [processedItems, current]);

    // Early return for empty items per tests
    if (!processedItems.length) {
      return null;
    }

    const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const tablistRef = useRef<HTMLDivElement | null>(null);

    const lazyMountEnabled = Boolean(lazyMount);

    const [mountedTabs, setMountedTabs] = useState<Record<string, boolean>>(() => {
      if (!lazyMountEnabled) return {};
      return current ? { [current]: true } : {};
    });

    // positions for close buttons keyed by processedValue
    const [closePositions, setClosePositions] = useState<Record<string, { left: number; top: number }>>({});

    const onSelect = (
      val: string,
      focusPanel = false,
      trigger: TabChangeEvent['trigger'] = 'click'
    ) => {
      if (disabled) return;
      const item = processedItems.find(i => i.processedValue === val);
      if (!item || item.disabled) return;

      const previous = current;

      if (!isControlled) setCurrent(val);

      onChange?.(val, {
        activeTab: val,
        previousTab: previous,
        tabData: item,
        trigger,
      });

      if (lazy) {
        // Immediately show loading for the newly selected tab (always set to false first)
        setLoaded(prev => ({ ...prev, [val]: false }));
        // Complete loading after a short delay so the loading state is observable
        setTimeout(() => setLoaded(prev => ({ ...prev, [val]: true })), 50);
      }
      if (lazyMountEnabled) {
        setMountedTabs(prev => (prev[val] ? prev : { ...prev, [val]: true }));
      }
      if (focusPanel) {
        const panel = document.getElementById(`${internalId}-panel-${val}`);
        panel?.focus?.();
      }
    };

    const currentIndex = useMemo(() => {
      if (!current) return -1;
      return processedItems.findIndex(i => i.processedValue === current);
    }, [processedItems, current]);

    const moveFocus = (startIndex: number, delta: number) => {
      if (disabled) return;
      const count = processedItems.length;
      if (count === 0) return;
      let idx = startIndex;
      for (let step = 0; step < count; step++) {
        idx = (idx + delta + count) % count;
        const cand = processedItems[idx];
        if (!cand?.disabled) {
          tabsRef.current[idx]?.focus();
          if (activation === 'auto') {
            onSelect(cand.processedValue, false, 'keyboard');
          }
          return;
        }
      }
    };

    const focusTabByOffset = (delta: number) => {
      const count = processedItems.length;
      if (!count) return;
      const idx = currentIndex < 0 ? 0 : currentIndex;
      moveFocus(idx, delta);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      const isH = orientation === 'horizontal';
      switch (e.key) {
        case 'ArrowRight': if (isH) { e.preventDefault(); focusTabByOffset(1); } break;
        case 'ArrowLeft':  if (isH) { e.preventDefault(); focusTabByOffset(-1);} break;
        case 'ArrowDown':  if (!isH){ e.preventDefault(); focusTabByOffset(1); } break;
        case 'ArrowUp':    if (!isH){ e.preventDefault(); focusTabByOffset(-1);} break;
        case 'Home': {
          e.preventDefault();
          const first = processedItems.find(i => !i.disabled) ?? processedItems[0];
          const idx = processedItems.indexOf(first);
          if (idx >= 0) {
            tabsRef.current[idx]?.focus();
            if (activation === 'auto') {
              onSelect(first.processedValue, false, 'keyboard');
            }
          }
          break;
        }
        case 'End': {
          e.preventDefault();
          const rev = [...processedItems].reverse();
          const last = rev.find(i => !i.disabled) ?? rev[0];
          const idx = processedItems.indexOf(last);
          if (idx >= 0) {
            tabsRef.current[idx]?.focus();
            if (activation === 'auto') {
              onSelect(last.processedValue, false, 'keyboard');
            }
          }
          break;
        }
        case 'Enter':
        case ' ': {
          if (activation === 'manual') {
            e.preventDefault();
            const target = e.target as HTMLElement;
            const val = target.getAttribute('data-value');
            if (val) onSelect(val, true, 'keyboard');
          }
          break;
        }
      }
    };

    const rootClass = cn(
      css('tabs'),
      position && css(`tabs--${position}`),
      scrollable && css('tabs--scrollable'),
      disabled && css('tabs--disabled'),
      className
    );

    const listClass = cn(css('tablist'), tabListClassName);

    // measure tabs and compute close button positions
    useLayoutEffect(() => {
      const container = tablistRef.current;
      if (!container) return;

      const measure = () => {
        const containerRect = container.getBoundingClientRect();
        const positions: Record<string, { left: number; top: number }> = {};

        processedItems.forEach((item, index) => {
          if (!(closable || item.closable)) return;
          const el = tabsRef.current[index];
          if (!el) return;
          const r = el.getBoundingClientRect();
          const left = r.left - containerRect.left + r.width - 8; // align near right edge
          const top = r.top - containerRect.top + r.height / 2; // center vertically
          positions[item.processedValue] = { left, top };
        });

        setClosePositions(positions);
      };

      measure();

      // observe resizes
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
      if (ro) {
        ro.observe(container);
        tabsRef.current.forEach(el => el && ro.observe(el));
      }

      window.addEventListener('resize', measure);
      return () => {
        window.removeEventListener('resize', measure);
        if (ro) {
          ro.disconnect();
        }
      };
    }, [processedItems, closable, size, position, variant]);

    useEffect(() => {
      if (!lazyMountEnabled) return;
      if (current) {
        setMountedTabs(prev => (prev[current] ? prev : { ...prev, [current]: true }));
      }
    }, [current, lazyMountEnabled]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          const active = tabsRef.current[currentIndex];
          if (active) {
            active.focus();
            return;
          }
          tablistRef.current?.focus?.();
        },
        blur: () => {
          const active = tabsRef.current[currentIndex];
          if (active && active === document.activeElement) {
            active.blur();
            return;
          }
          if (tablistRef.current && tablistRef.current === document.activeElement) {
            tablistRef.current.blur();
          }
        },
        focusTab: (tabId: string) => {
          const idx = processedItems.findIndex(i => i.processedValue === tabId);
          if (idx >= 0) {
            tabsRef.current[idx]?.focus();
          }
        },
        getActiveTab: () => current,
        setActiveTab: (tabId: string) => {
          onSelect(tabId, false, 'programmatic');
        },
        getTabs: () => tabsRef.current.filter((tab): tab is HTMLButtonElement => Boolean(tab)),
        getTabElement: (tabId: string) => {
          const idx = processedItems.findIndex(i => i.processedValue === tabId);
          return idx >= 0 ? tabsRef.current[idx] ?? null : null;
        },
        getActiveTabElement: () => {
          if (!current) return null;
          const idx = processedItems.findIndex(i => i.processedValue === current);
          return idx >= 0 ? tabsRef.current[idx] ?? null : null;
        },
        getTabPanel: (tabId: string) => {
          return document.getElementById(`${internalId}-panel-${tabId}`) as HTMLDivElement | null;
        },
        getActiveTabPanel: () => {
          if (!current) return null;
          return document.getElementById(`${internalId}-panel-${current}`) as HTMLDivElement | null;
        },
      }),
      [current, currentIndex, internalId, onSelect, processedItems]
    );

    return (
      <Component
        id={internalId}
        className={rootClass}
        data-testid={dataTestId || 'test-tabs'}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      >
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-orientation={orientation as 'horizontal' | 'vertical'}
          className={listClass}
          onKeyDown={handleKeyDown}
          ref={tablistRef}
          tabIndex={-1}
          aria-disabled={disabled || undefined}
        >
          {processedItems.map((item, index) => {
            const selected = item.processedValue === current;
            const tabDisabled = disabled || item.disabled;
            const tabId = `${internalId}-tab-${item.processedValue}`;
            const panelId = `${internalId}-panel-${item.processedValue}`;
            const tabClass = cn(
              css('tab'),
              size && css(`tab--${size}`),
              variant && css(`tab--${variant}`),
              selected && css('tab--active'),
              tabDisabled && css('tab--disabled'),
              item.closable && css('tab--closable')
            );

            return (
              <React.Fragment key={item.processedKey}>
                <button
                  ref={(el) => { tabsRef.current[index] = el; }}
                  id={tabId}
                  role="tab"
                  type="button"
                  className={cn(tabClass, css('tab__content'))}
                  data-value={item.processedValue}
                  aria-selected={selected}
                  aria-controls={panelId}
                  aria-disabled={tabDisabled || undefined}
                  tabIndex={selected ? 0 : -1}
                  data-status={tabDisabled ? 'disabled' : selected ? 'active' : 'inactive'}
                  onClick={() => !tabDisabled && onSelect(item.processedValue, activation === 'auto', 'click')}
                  disabled={tabDisabled}
                >
                  {item.icon && <span className={css('tab__icon')} aria-hidden="true">{item.icon}</span>}
                  <span className={css('tab__label')}>{item.label}</span>
                  {item.badge && (
                    <span className={css('tab__badge')} aria-hidden="true">{item.badge}</span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
          {addable && (
            <button
              type="button"
              className={css('tab-add')}
              aria-label="Add tab"
              data-testid={`${dataTestId || 'test-tabs'}-add-button`}
              disabled={disabled}
              aria-disabled={disabled || undefined}
              onClick={() => {
                if (disabled) return;
                onTabAdd?.();
              }}
            >
              +
            </button>
          )}
        </div>

        <div className={css('tab-close-container')} aria-hidden={true}>
          {processedItems.map((item) => {
            if (!(closable || item.closable)) return null;
            const pos = closePositions[item.processedValue];
            const style: React.CSSProperties = pos
              ? {
                  position: 'absolute',
                  left: `${pos.left}px`,
                  top: `${pos.top}px`,
                  transform: 'translate(-50%, -50%)'
                }
              : { visibility: 'hidden' };

            return (
              <button
                key={`close-${item.processedKey}`}
                type="button"
                className={cn(css('tab__close'), css('tab__close--positioned'))}
                aria-label={`Close ${item.label}`}
                data-testid={`${dataTestId || 'test-tabs'}-close-${item.processedValue}`}
                disabled={disabled}
                aria-disabled={disabled || undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) return;
                  onTabClose?.(item.processedValue);
                }}
                style={style}
              >
                ×
              </button>
            );
          })}
        </div>

        {processedItems.map(item => {
          const selected = item.processedValue === current;
          const tabId = `${internalId}-tab-${item.processedValue}`;
          const panelId = `${internalId}-panel-${item.processedValue}`;
          const panelClass = cn(css('panel'), animated && css('panel--animated'));

          const isLoaded = !lazy ? true : loaded[item.processedValue] === true;
          const showLoading = lazy && selected && !isLoaded;
          const isMounted = !lazyMountEnabled || mountedTabs[item.processedValue] || selected;

          if (!isMounted) {
            return null;
          }

          return (
            <div
              key={`panel-${item.processedKey}`}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              hidden={!selected}
              tabIndex={-1}
              className={cn(panelClass, contentClassName)}
            >
              {showLoading && (
                <div className={css('panel__loading')} aria-label="Loading content">
                  {loadingComponent || <span>Loading tab content</span>}
                </div>
              )}
              {!showLoading && (typeof item.content === 'function'
                ? item.content({ value: item.processedValue, selected })
                : item.content)}
            </div>
          );
        })}
      </Component>
    );
  };

const DynTabs = forwardRef(DynTabsInner) as <E extends React.ElementType = 'div'>(
  props: DynTabsProps<E> & { ref?: React.Ref<DynTabsRef> }
) => React.ReactElement | null;

DynTabs.displayName = 'DynTabs';

export { DynTabs };
export default DynTabs;
