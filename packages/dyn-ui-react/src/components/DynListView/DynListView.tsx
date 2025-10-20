import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import styles from './DynListView.module.css';
import type { DynListViewProps, ListViewItem, ListAction } from './DynListView.types';

const getStyleClass = (n: string) => (styles as Record<string, string>)[n] || '';

const getActionButtonVariantClass = (type?: ListAction['type']) => {
  const normalized = (type ?? 'default').toLowerCase();
  const variantKey = `actionButton${normalized.replace(/^[a-z]/, (c) => c.toUpperCase())}`;
  return getStyleClass(variantKey) || getStyleClass('actionButtonDefault');
};

const isComplexItem = (item: any) => {
  // Consider item complex if it has more than typical display fields
  const displayKeys = new Set(['id','title','label','value','description','icon','disabled','selected']);
  const keys = Object.keys(item || {});
  return keys.filter(k => !displayKeys.has(k)).length >= 3; // threshold can be tuned
};

const resolveBaseKey = (
  item: ListViewItem,
  index: number,
  itemKey?: DynListViewProps['itemKey']
): string => {
  let candidate: unknown;
  if (typeof itemKey === 'function') {
    candidate = itemKey(item);
  } else if (typeof itemKey === 'string') {
    candidate = (item as Record<string, unknown>)[itemKey];
  } else if (item.id !== undefined && item.id !== null) {
    candidate = item.id;
  } else if (item.value !== undefined && item.value !== null) {
    candidate = item.value;
  }

  const normalized = candidate === undefined || candidate === null || candidate === ''
    ? String(index)
    : String(candidate);

  return normalized;
};

const createUniqueKeys = (
  items: ListViewItem[],
  itemKey?: DynListViewProps['itemKey']
) => {
  const occurrences = new Map<string, number>();

  return items.map((item, index) => {
    const baseKey = resolveBaseKey(item, index, itemKey);
    const seen = occurrences.get(baseKey) ?? 0;
    occurrences.set(baseKey, seen + 1);

    if (seen === 0) return baseKey;
    return `${baseKey}-${seen}`;
  });
};

const createKeyToItemMap = (items: ListViewItem[], keys: string[]) => {
  const map = new Map<string, ListViewItem>();
  keys.forEach((key, index) => {
    map.set(key, items[index]);
  });
  return map;
};

type SelectionInput = string[] | string | undefined;

const toInternalValue = (value: SelectionInput, multi: boolean): string[] | string | undefined => {
  if (multi) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value !== '') return [value];
    return [];
  }

  if (Array.isArray(value)) return value[0];
  return value;
};

const toKeyArray = (value: string[] | string | undefined, multi: boolean): string[] => {
  if (multi) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value !== '') return [value];
    return [];
  }

  return typeof value === 'string' && value !== '' ? [value] : [];
};

interface SelectionManagerConfig {
  multi: boolean;
  disabled: boolean;
  controlledValue?: string | string[];
  defaultValue?: string | string[];
  onChange?: DynListViewProps['onChange'];
  onSelectionChange?: DynListViewProps['onSelectionChange'];
  getSelectedItems: (keys: string[]) => ListViewItem[];
}

const useSelectionManager = ({
  multi,
  disabled,
  controlledValue,
  defaultValue,
  onChange,
  onSelectionChange,
  getSelectedItems,
}: SelectionManagerConfig) => {
  const isControlled = controlledValue !== undefined;
  const [selected, setSelected] = useState<string[] | string | undefined>(() => {
    const initial = isControlled ? controlledValue : defaultValue;
    return toInternalValue(initial, multi);
  });

  const updateFromExternal = useCallback(
    (value?: string | string[]) => {
      setSelected(toInternalValue(value, multi));
    },
    [multi]
  );

  React.useEffect(() => {
    if (isControlled) {
      updateFromExternal(controlledValue);
    }
  }, [controlledValue, isControlled, updateFromExternal]);

  const selectedKeys = useMemo(() => toKeyArray(selected, multi), [selected, multi]);

  const updateSelection = useCallback(
    (next: SelectionInput) => {
      const internalValue = toInternalValue(next, multi);

      if (!isControlled) {
        setSelected(internalValue);
      }

      const keysArray = toKeyArray(internalValue, multi);
      const items = getSelectedItems(keysArray);
      const valueForChange = multi ? keysArray : keysArray[0];

      onChange?.(valueForChange as any, multi ? items : items[0]);
      onSelectionChange?.(keysArray, items);
    },
    [getSelectedItems, isControlled, multi, onChange, onSelectionChange]
  );

  const toggle = useCallback(
    (key: string) => {
      if (disabled) return;

      if (multi) {
        const current = new Set(selectedKeys);
        if (current.has(key)) {
          current.delete(key);
        } else {
          current.add(key);
        }
        updateSelection(Array.from(current));
      } else {
        updateSelection(selectedKeys[0] === key ? undefined : key);
      }
    },
    [disabled, multi, selectedKeys, updateSelection]
  );

  const selectAll = useCallback(
    (keys: string[]) => {
      if (disabled) return;
      updateSelection(multi ? keys : keys[0]);
    },
    [disabled, multi, updateSelection]
  );

  const clearSelection = useCallback(() => {
    if (disabled) return;
    updateSelection(multi ? [] : undefined);
  }, [disabled, multi, updateSelection]);

  const isSelected = useCallback((key: string) => selectedKeys.includes(key), [selectedKeys]);

  return {
    selectedKeys,
    isSelected,
    toggle,
    selectAll,
    clearSelection,
  } as const;
};

export const DynListView = forwardRef<HTMLDivElement, DynListViewProps>(function DynListView(
  {
    items = [],
    data = [], // legacy alias
    value,
    defaultValue,
    multiSelect = false,
    selectable = false,
    disabled = false,
    loading = false,
    emptyText = 'No data available',
    actions = [],
    renderItem,
    size,
    height,
    bordered = false,
    selectedKeys,
    itemKey,
    onChange,
    onSelectionChange,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'data-testid': dataTestId,
    ...rest
  }, ref) {
  
  // Use items prop, fallback to data for backward compatibility
  const listItems = items.length > 0 ? items : data;

  const [internalId] = useState(() => id || generateId('listview'));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const itemIds = useMemo(
    () => listItems.map((_, i) => `${internalId}-option-${i}`),
    [listItems, internalId]
  );

  const uniqueItemKeys = useMemo(
    () => createUniqueKeys(listItems, itemKey),
    [itemKey, listItems]
  );

  const keyToItemMap = useMemo(
    () => createKeyToItemMap(listItems, uniqueItemKeys),
    [listItems, uniqueItemKeys]
  );

  const getItemsByKeys = useCallback(
    (keys: string[]) =>
      keys
        .map((key) => keyToItemMap.get(key))
        .filter((item): item is ListViewItem => Boolean(item)),
    [keyToItemMap]
  );

  const selection = useSelectionManager({
    multi: multiSelect || selectable,
    disabled,
    controlledValue: selectedKeys ?? value,
    defaultValue,
    onChange,
    onSelectionChange,
    getSelectedItems: getItemsByKeys,
  });

  const { selectAll: selectAllKeys, clearSelection } = selection;
  const allKeys = uniqueItemKeys;

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        rootRef.current?.focus();
      },
      selectAll: () => {
        if (!allKeys.length) return;
        selectAllKeys(allKeys);
      },
      clearSelection: () => {
        clearSelection();
      },
    }),
    [allKeys, clearSelection, selectAllKeys]
  );

  const moveActive = (delta: number) => {
    const count = listItems.length;
    if (!count) return;
    setActiveIndex(idx => (idx + delta + count) % count);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); moveActive(1); break;
      case 'ArrowUp': e.preventDefault(); moveActive(-1); break;
      case 'Home': e.preventDefault(); setActiveIndex(0); break;
      case 'End': e.preventDefault(); setActiveIndex(Math.max(0, listItems.length - 1)); break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = listItems[activeIndex];
        if (item) {
          const key = uniqueItemKeys[activeIndex];
          if (key) {
            selection.toggle(key);
          }
        }
        break;
      }
    }
  };

  const rootClasses = cn(
    getStyleClass('root'),
    'dyn-list-view',
    size === 'small' && getStyleClass('rootSmall'),
    size === 'large' && getStyleClass('rootLarge'),
    size === 'small' && 'dyn-list-view--small',
    size === 'large' && 'dyn-list-view--large',
    bordered && getStyleClass('rootBordered'),
    bordered && 'dyn-list-view--bordered',
    className
  );

  const rootStyle = height ? { 
    height: typeof height === 'number' ? `${height}px` : String(height) 
  } : undefined;

  const allChecked =
    (multiSelect || selectable) &&
    allKeys.length > 0 &&
    allKeys.every((key) => selection.isSelected(key));

  const selectAllCheckboxId = `${internalId}-select-all`;
  const selectAllLabelId = `${selectAllCheckboxId}-label`;

  return (
    <div
      ref={rootRef}
      id={internalId}
      role="listbox"
      aria-multiselectable={multiSelect || selectable || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-activedescendant={listItems[activeIndex] ? itemIds[activeIndex] : undefined}
      className={rootClasses}
      data-testid={dataTestId || 'dyn-listview'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={rootStyle}
      {...rest}
    >
      {(multiSelect || selectable) && (
        <div
          className={getStyleClass('option')}
          role="option"
          aria-selected={allChecked}
          aria-labelledby={selectAllLabelId}
          onClick={() => !disabled && selectAllKeys(allChecked ? [] : allKeys)}
        >
          <input
            type="checkbox"
            role="checkbox"
            aria-checked={allChecked}
            checked={allChecked}
            id={selectAllCheckboxId}
            aria-labelledby={selectAllLabelId}
            aria-label="Select all items"
            disabled={disabled}
            onChange={() => !disabled && selectAllKeys(allChecked ? [] : allKeys)}
            onClick={(event) => event.stopPropagation()}
          />
          <span className={getStyleClass('option__label')} id={selectAllLabelId}>
            Select All
          </span>
        </div>
      )}

      {loading ? (
        <div role="status" className={getStyleClass('loading')}>
          Loading...
        </div>
      ) : listItems.length === 0 ? (
        <div role="note" className={getStyleClass('empty')}>
          {emptyText}
        </div>
      ) : (
        listItems.map((item, i) => {
          const key = uniqueItemKeys[i];
          const selectedState = selection.isSelected(key);
          const title = (item as any).title ?? (item as any).label ?? (item as any).value ?? String((item as any).id ?? i + 1);
          const desc = (item as any).description;
          const complex = isComplexItem(item);
          const checkboxId = `${itemIds[i]}-checkbox`;
          const labelId = `${itemIds[i]}-label`;
          const descriptionId = desc ? `${itemIds[i]}-description` : undefined;
          const usesDefaultRenderer = !renderItem;
          const optionLabelledBy = usesDefaultRenderer ? labelId : undefined;
          const optionDescribedBy = usesDefaultRenderer && desc ? descriptionId : undefined;

          return (
            <div
              key={key}
              id={itemIds[i]}
              role="option"
              aria-selected={selectedState}
              aria-label={title}
              aria-labelledby={optionLabelledBy}
              aria-describedby={optionDescribedBy}
              className={cn(
                getStyleClass('option'),
                selectedState && getStyleClass('option--selected'),
                i === activeIndex && getStyleClass('option--active'),
                item.disabled && getStyleClass('option--disabled')
              )}
              onMouseEnter={() => !item.disabled && setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => !item.disabled && selection.toggle(key)}
            >
              {(selectable || multiSelect) && (
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-checked={!!selectedState}
                  checked={!!selectedState}
                  disabled={item.disabled}
                  id={checkboxId}
                  aria-labelledby={optionLabelledBy}
                  aria-describedby={optionDescribedBy}
                  aria-label={`Select ${title}`}
                  onChange={() => !item.disabled && selection.toggle(key)}
                  onClick={(e) => e.stopPropagation()}
                  className={getStyleClass('option__checkbox')}
                />
              )}

              <div className={getStyleClass('option__content')}>
                {renderItem ? (
                  renderItem(item, i)
                ) : (
                  <>
                    <span className={getStyleClass('option__label')} id={labelId}>
                      {title}
                    </span>
                    {desc && (
                      <span className={getStyleClass('option__description')} id={descriptionId}>
                        {desc}
                      </span>
                    )}
                  </>
                )}
              </div>

              {complex && (
                <button
                  type="button"
                  className={getStyleClass('option__expand')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
                  }}
                  aria-expanded={!!expanded[key]}
                >
                  {expanded[key] ? 'Collapse' : 'Expand'}
                </button>
              )}

              {actions && actions.length > 0 && (
                <div 
                  className={getStyleClass('option__actions')} 
                  onClick={(e) => e.stopPropagation()}
                >
                  {actions.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      className={cn(
                        getStyleClass('actionButton'),
                        getActionButtonVariantClass(action.type)
                      )}
                      onClick={() => action.onClick(item, i)}
                      title={action.title}
                    >
                      {action.title}
                    </button>
                  ))}
                </div>
              )}

              {expanded[key] && (
                <div className={getStyleClass('option__details')}>
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k}>
                      <strong>{k}:</strong> {String(v)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
});

export default DynListView;