import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { DynListViewProps } from './DynListView.types';
import styles from './DynListView.module.css';
// Import other components as needed
// import DynCheckbox from '../DynCheckbox';
// import DynButton from '../DynButton';
// import DynIcon from '../DynIcon';

export const DynListView: React.FC<DynListViewProps> = ({
  data = [],
  actions = [],
  loading = false,
  size = 'medium',
  bordered = true,
  selectable = false,
  selectedKeys = [],
  itemKey = 'id',
  renderItem,
  onSelectionChange,
  emptyText = 'No data available',
  height,
  className,
}) => {
  const [internalSelection, setInternalSelection] = useState<string[]>(selectedKeys);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get item key function
  const getItemKey = useCallback(
    (item: any, index: number): string => {
      if (typeof itemKey === 'function') {
        return itemKey(item);
      }
      return item[itemKey] || index.toString();
    },
    [itemKey]
  );

  // Handle selection
  const handleItemSelection = useCallback(
    (itemKey: string, checked: boolean) => {
      const newSelection = checked
        ? [...internalSelection, itemKey]
        : internalSelection.filter(key => key !== itemKey);
      
      setInternalSelection(newSelection);
      onSelectionChange?.(newSelection, newSelection.map(key => 
        data.find((item, idx) => getItemKey(item, idx) === key)
      ).filter(Boolean));
    },
    [internalSelection, onSelectionChange, data, getItemKey]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newSelection = checked
        ? data.map((item, idx) => getItemKey(item, idx))
        : [];
      
      setInternalSelection(newSelection);
      onSelectionChange?.(newSelection, checked ? data : []);
    },
    [data, getItemKey, onSelectionChange]
  );

  // Handle item expansion
  const handleItemExpand = useCallback(
    (itemKey: string) => {
      setExpandedItems(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(itemKey)) {
          newExpanded.delete(itemKey);
        } else {
          newExpanded.add(itemKey);
        }
        return newExpanded;
      });
    },
    []
  );

  // Check if all items are selected
  const isAllSelected = data.length > 0 && data.every((item, idx) => 
    internalSelection.includes(getItemKey(item, idx))
  );

  const isIndeterminate = internalSelection.length > 0 && 
    internalSelection.length < data.length;

  // Render actions for an item
  const renderItemActions = useCallback(
    (item: any, index: number) => {
      if (!actions.length) return null;

      const visibleActions = actions.filter(action => 
        action.visible ? action.visible(item) : true
      );

      if (!visibleActions.length) return null;

      return (
        <div className={styles['dyn-list-view__item-actions']}>
          {/* Render action buttons - TODO: import DynButton */}
          {visibleActions.map(action => (
            <button
              key={action.key}
              type="button"
              onClick={() => action.onClick(item, index)}
              className={styles['dyn-list-view__action-button']}
              disabled={action.disabled ? action.disabled(item) : false}
            >
              {action.title}
            </button>
          ))}
        </div>
      );
    },
    [actions]
  );

  // Default item renderer
  const defaultRenderItem = useCallback(
    (item: any, index: number) => {
      const key = getItemKey(item, index);
      const isExpanded = expandedItems.has(key);
      
      return (
        <div className={styles['dyn-list-view__item-content']}>
          <div className={styles['dyn-list-view__item-header']}>
            <div className={styles['dyn-list-view__item-info']}>
              {/* Expand/Collapse button if item has expandable content */}
              {typeof item === 'object' && Object.keys(item).length > 3 && (
                <button
                  type="button"
                  onClick={() => handleItemExpand(key)}
                  className={styles['dyn-list-view__expand-button']}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              
              <div className={styles['dyn-list-view__item-text']}>
                {/* Primary text - try to find title, name, or first string property */}
                <div className={styles['dyn-list-view__item-title']}>
                  {item.title || item.name || item.label || 
                   Object.values(item).find(val => typeof val === 'string') || 
                   'Item'}
                </div>
                
                {/* Secondary text */}
                {item.description && (
                  <div className={styles['dyn-list-view__item-description']}>
                    {item.description}
                  </div>
                )}
              </div>
            </div>
            
            {renderItemActions(item, index)}
          </div>
          
          {/* Expanded content */}
          {isExpanded && (
            <div className={styles['dyn-list-view__item-details']}>
              {Object.entries(item)
                .filter(([key, value]) => 
                  !['title', 'name', 'label', 'description'].includes(key) &&
                  value !== null && value !== undefined
                )
                .map(([key, value]) => (
                  <div key={key} className={styles['dyn-list-view__item-field']}>
                    <strong>{key}:</strong> {String(value)}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      );
    },
    [getItemKey, expandedItems, handleItemExpand, renderItemActions]
  );

  const listViewClasses = classNames(
    styles['dyn-list-view'],
    styles[`dyn-list-view--${size}`],
    {
      [styles['dyn-list-view--bordered']]: bordered,
      [styles['dyn-list-view--selectable']]: selectable,
      [styles['dyn-list-view--loading']]: loading,
      [styles['dyn-list-view--fixed-height']]: !!height,
    },
    className
  );

  if (loading) {
    return (
      <div className={listViewClasses}>
        <div className={styles['dyn-list-view__loading']}>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={listViewClasses}>
        <div className={styles['dyn-list-view__empty']}>
          <span>{emptyText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={listViewClasses} style={{ height }}>
      {/* Header with select all */}
      {selectable && (
        <div className={styles['dyn-list-view__header']}>
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={input => {
              if (input) input.indeterminate = isIndeterminate;
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className={styles['dyn-list-view__select-all-text']}>
            {internalSelection.length > 0 
              ? `${internalSelection.length} selected`
              : 'Select all'
            }
          </span>
        </div>
      )}
      
      {/* List content */}
      <div className={styles['dyn-list-view__content']}>
        {data.map((item, index) => {
          const key = getItemKey(item, index);
          const isSelected = internalSelection.includes(key);
          
          return (
            <div
              key={key}
              className={classNames(
                styles['dyn-list-view__item'],
                {
                  [styles['dyn-list-view__item--selected']]: isSelected,
                }
              )}
            >
              {/* Selection checkbox */}
              {selectable && (
                <div className={styles['dyn-list-view__item-selection']}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleItemSelection(key, e.target.checked)}
                  />
                </div>
              )}
              
              {/* Item content */}
              <div className={styles['dyn-list-view__item-body']}>
                {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

DynListView.displayName = 'DynListView';

export default DynListView;