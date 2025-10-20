import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import styles from './DynListView.module.css';
import type {
  DynListViewProps,
  ListViewItem,
  ListAction,
  DynListViewItemRenderContext,
} from './DynListView.types';

const getStyleClass = (n: string) => (styles as Record<string, string>)[n] || '';

const getActionButtonVariantClass = (type?: ListAction['type']) => {
  const normalized = (type ?? 'default').toLowerCase();
  const variantKey = `actionButton${normalized.replace(/^[a-z]/, (c) => c.toUpperCase())}`;
  return getStyleClass(variantKey) || getStyleClass('actionButtonDefault');
};

const isComplexItem = (item: unknown) => {
  if (item === null || typeof item !== 'object') {
    return false;
  }

  const displayKeys = new Set([
    'id',
    'title',
    'label',
    'value',
    'description',
    'icon',
    'disabled',
    'selected',
  ]);

  return Object.keys(item as Record<string, unknown>).some(
    (key) => !displayKeys.has(key)
  );
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

export const DynListView = forwardRef<DynListViewRef, DynListViewProps>(function DynListView(
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

  const toggleItemExpansion = useCallback((key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

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

  useImperativeHandle<DynListViewRef | null>(
    ref,
    () => {
      const node = rootRef.current;

      if (!node) {
        return null;
      }

      const handle = node as DynListViewRef;

      handle.selectAll = () => {
        if (!allKeys.length) return;
        selectAllKeys(allKeys);
      };

      handle.clearSelection = () => {
        clearSelection();
      };

      return handle;
    },
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
    'dyn-list-view',
    getStyleClass('root'),
    size === 'small' && [getStyleClass('rootSmall'), 'dyn-list-view--small'],
    size === 'large' && [getStyleClass('rootLarge'), 'dyn-list-view--large'],
    bordered && [getStyleClass('rootBordered'), 'dyn-list-view--bordered'],
    className
  );

  const rootStyle = height ? { 
    height: typeof height === 'number' ? `${height}px` : String(height) 
  } : undefined;

  const allChecked =
    (multiSelect || selectable) &&
    allKeys.length > 0 &&
    allKeys.every((key) => selection.isSelected(key));

  const computedAriaLabel = ariaLabel ?? (ariaLabelledBy ? undefined : 'List view');
  const selectAllButtonLabel = allChecked ? 'Deselect all items' : 'Select all items';

  return (
    <div
      ref={rootRef}
      id={internalId}
      role="listbox"
      aria-multiselectable={multiSelect || selectable || undefined}
      aria-label={computedAriaLabel}
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
        <div className={getStyleClass('bulkActions')}>
          <button
            type="button"
            className={cn(getStyleClass('option'), getStyleClass('bulkActions__button'))}
            aria-pressed={allChecked}
            aria-label={selectAllButtonLabel}
            onClick={() => selection.selectAll(allChecked ? [] : allKeys)}
          >
            <span
              aria-hidden="true"
              className={cn(
                getStyleClass('option__checkbox'),
                allChecked && getStyleClass('option__checkbox--checked')
              )}
            />
            <span className={getStyleClass('option__label')}>Select All</span>
            <span className={getStyleClass('visuallyHidden')}>
              {allChecked ? 'All items selected' : 'No items selected'}
            </span>
          </button>
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
          const labelId = `${itemIds[i]}-label`;
          const descriptionId = desc ? `${itemIds[i]}-description` : undefined;
          const usesDefaultRenderer = !renderItem;
          let optionLabelledBy = usesDefaultRenderer ? labelId : undefined;
          let optionDescribedBy = usesDefaultRenderer && desc ? descriptionId : undefined;
          const isExpandable = complex;
          const usesTitleAsExpandTrigger = isExpandable && usesDefaultRenderer;
          const isExpanded = !!expanded[key];
          const hasActions = actions && actions.length > 0;
          let customHandledExpansion = false;

          const markCustomHandledExpansion = () => {
            if (isExpandable) {
              customHandledExpansion = true;
            }
          };

          const toggleExpansion = () => {
            if (isExpandable) {
              toggleItemExpansion(key);
            }
          };

          const getTitleTriggerProps: DynListViewItemRenderContext['getTitleTriggerProps'] = (
            props = {}
          ) => {
            const {
              onClick,
              className,
              id: providedId,
              'aria-expanded': _ariaExpanded,
              ...rest
            } = props;
            const finalId = providedId ?? labelId;
            if (isExpandable) {
              markCustomHandledExpansion();
            }
            optionLabelledBy = finalId;

            return {
              type: 'button',
              id: finalId,
              className: cn(
                getStyleClass('option__label'),
                getStyleClass('option__label--expandable'),
                isExpanded && getStyleClass('option__label--expanded'),
                className
              ),
              onClick: (event) => {
                event.stopPropagation();
                if (isExpandable) {
                  toggleExpansion();
                }
                onClick?.(event);
              },
              'aria-expanded': isExpandable ? isExpanded : false,
              ...rest,
            };
          };

          const TitleButton: DynListViewItemRenderContext['TitleButton'] = ({
            children,
            ...buttonProps
          }) => {
            return (
              <button {...getTitleTriggerProps(buttonProps)}>
                {children ?? title}
              </button>
            );
          };

          const renderContext: DynListViewItemRenderContext = {
            isExpandable,
            isExpanded,
            toggleExpansion,
            getTitleTriggerProps,
            TitleButton,
            registerExpansionTrigger: markCustomHandledExpansion,
            setOptionLabelledBy: (value) => {
              optionLabelledBy = value;
            },
            setOptionDescribedBy: (value) => {
              optionDescribedBy = value;
            },
            title,
            description: desc,
            labelId,
            descriptionId,
          };

          const renderContent = () => {
            if (renderItem) {
              return renderItem(item, i, renderContext);
            }

            return (
              <>
                {usesTitleAsExpandTrigger ? (
                  <button
                    type="button"
                    id={labelId}
                    className={cn(
                      getStyleClass('option__label'),
                      getStyleClass('option__label--expandable'),
                      isExpanded && getStyleClass('option__label--expanded')
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleExpansion();
                    }}
                    aria-expanded={isExpanded}
                  >
                    {title}
                  </button>
                ) : (
                  <span id={labelId} className={getStyleClass('option__label')}>
                    {title}
                  </span>
                )}
                {desc && (
                  <span id={descriptionId} className={getStyleClass('option__description')}>
                    {desc}
                  </span>
                )}
              </>
            );
          };

          const content = renderContent();

          const contentIncludesTitleButton = (node: React.ReactNode): boolean => {
            if (node === null || node === undefined || typeof node === 'boolean') {
              return false;
            }

            if (Array.isArray(node)) {
              return node.some(contentIncludesTitleButton);
            }

            if (React.isValidElement(node)) {
              if (node.type === TitleButton) {
                return true;
              }

              return contentIncludesTitleButton(node.props?.children);
            }

            return false;
          };

          if (!customHandledExpansion && contentIncludesTitleButton(content)) {
            markCustomHandledExpansion();
            if (!optionLabelledBy) {
              optionLabelledBy = labelId;
            }
          }
          const renderSeparateExpandControl =
            isExpandable && !usesDefaultRenderer && !customHandledExpansion;
          const shouldRenderControls = hasActions || renderSeparateExpandControl;

          return (
            <div
              key={key}
              className={cn(
                getStyleClass('option'),
                selectedState && getStyleClass('option--selected'),
                i === activeIndex && getStyleClass('option--active'),
                item.disabled && getStyleClass('option--disabled')
              )}
              onMouseEnter={() => !item.disabled && setActiveIndex(i)}
            >
              <div
                id={itemIds[i]}
                role="option"
                aria-selected={selectedState}
                aria-disabled={item.disabled || undefined}
                aria-labelledby={optionLabelledBy}
                aria-describedby={optionDescribedBy}
                className={getStyleClass('option__main')}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => !item.disabled && selection.toggle(key)}
              >
                {(selectable || multiSelect) && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      getStyleClass('option__checkbox'),
                      selectedState && getStyleClass('option__checkbox--checked')
                    )}
                  />
                )}

                <div className={getStyleClass('option__content')}>{content}</div>
              </div>

              {shouldRenderControls && (
                <div
                  className={getStyleClass('option__controls')}
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderSeparateExpandControl && (
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${title}`}
                      className={cn(
                        getStyleClass('actionButton'),
                        getStyleClass('actionButtonDefault'),
                        getStyleClass('option__expandButton')
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleExpansion();
                      }}
                    >
                      <span aria-hidden="true" className={getStyleClass('option__expandButtonIcon')}>
                        {isExpanded ? '▴' : '▾'}
                      </span>
                    </button>
                  )}

                  {hasActions && (
                    <div className={getStyleClass('option__actions')}>
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
                </div>
              )}

              {isExpanded && (
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