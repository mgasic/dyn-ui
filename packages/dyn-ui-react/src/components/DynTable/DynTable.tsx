import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import styles from './DynTable.module.css';
import type { DynTableProps, TableSortDirection } from './DynTable.types';

const getStyleClass = (n: string) => (styles as Record<string, string>)[n] || '';

const NON_DOM_PROPS = new Set([
  'columns',
  'data',
  'actions',
  'loading',
  'size',
  'bordered',
  'striped',
  'hoverable',
  'selectable',
  'selectedKeys',
  'rowKey',
  'pagination',
  'sortBy',
  'sortable',
  'onSort',
  'onSelectionChange',
  'emptyText',
  'height'
]);

/**
 * Generates a unique key for table rows
 * Priority: custom rowKey function > rowKey property > id property > index fallback
 * @param row - Row data object
 * @param index - Row index as fallback
 * @param rowKey - Optional key extraction function or property name
 * @returns Unique key string
 */
const getRowKey = (row: any, index: number, rowKey?: DynTableProps['rowKey']): string => {
  // Priority 1: Custom function
  if (typeof rowKey === 'function') {
    const result = rowKey(row);
    return `row-${String(result)}`;
  }
  
  // Priority 2: Property name
  if (typeof rowKey === 'string' && rowKey in row && row[rowKey] != null) {
    return `row-${String(row[rowKey])}`;
  }
  
  // Priority 3: Common id fields
  if (row.id != null) {
    return `row-${String(row.id)}`;
  }
  
  if (row.key != null) {
    return `row-${String(row.key)}`;
  }
  
  // Priority 4: Attempt unique field combination
  const uniqueFields = ['uuid', 'guid', 'identifier', 'code', 'name'];
  for (const field of uniqueFields) {
    if (row[field] != null) {
      return `row-${field}-${String(row[field])}`;
    }
  }
  
  // Fallback: Use index with warning
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `DynTable: Using index as key for row ${index}. Consider providing a unique 'rowKey' prop or ensure your data has 'id' property for better performance.`
    );
  }
  
  return `row-index-${index}`;
};

/**
 * Generates a unique key for table cells
 * @param rowKey - Unique row identifier
 * @param columnKey - Column key
 * @returns Unique cell key string
 */
const getCellKey = (rowKey: string, columnKey: string): string => {
  return `${rowKey}-cell-${columnKey}`;
};

/**
 * Generates a unique key for action buttons
 * @param rowKey - Unique row identifier 
 * @param actionKey - Action identifier
 * @returns Unique action key string
 */
const getActionKey = (rowKey: string, actionKey: string): string => {
  return `${rowKey}-action-${actionKey}`;
};

/**
 * Formats boolean values for display
 * @param value - Boolean value to format
 * @returns Formatted string
 */
const formatBoolean = (value: unknown): string => (value ? 'Yes' : 'No');

/**
 * Safely formats cell values for display
 * @param value - Value to format
 * @returns Formatted string
 */
const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Determines if a column is sortable
 * @param globalSortable - Global sortable setting
 * @param columnSortable - Column-specific sortable setting
 * @returns Whether the column should be sortable
 */
const isColumnSortable = (globalSortable: boolean, columnSortable?: boolean): boolean => {
  if (!globalSortable) return false;
  if (columnSortable === false) return false;
  return true;
};

/**
 * Sort icons component with proper accessibility
 */
const SortIcons: React.FC<{ direction?: TableSortDirection; isActive: boolean }> = ({ direction, isActive }) => {
  return (
    <span className={cn(getStyleClass('dyn-table__sort-icons'), 'dyn-table__sort-icons')} aria-hidden="true">
      <span
        className={cn(
          getStyleClass('dyn-table__sort-icon'),
          'dyn-table__sort-icon',
          isActive && direction === 'asc' && [
            getStyleClass('dyn-table__sort-icon--active'),
            'dyn-table__sort-icon--active'
          ]
        )}
      >
        ▲
      </span>
      <span
        className={cn(
          getStyleClass('dyn-table__sort-icon'),
          'dyn-table__sort-icon',
          isActive && direction === 'desc' && [
            getStyleClass('dyn-table__sort-icon--active'),
            'dyn-table__sort-icon--active'
          ]
        )}
      >
        ▼
      </span>
    </span>
  );
};

/**
 * Hook for generating stable component IDs
 */
const useStableId = (id?: string): string => {
  const [value] = useState(() => id || generateId('table'));
  return value;
};

/**
 * DynTable component with enterprise-grade features
 * 
 * Key features:
 * - ✅ Unique key generation for all elements (fixes React warnings)
 * - ✅ Comprehensive accessibility support (WCAG 2.1 AA)
 * - ✅ TypeScript type safety with proper generics
 * - ✅ Flexible sorting and selection
 * - ✅ Performance optimizations
 * - ✅ Design system integration
 */
export const DynTable: React.FC<DynTableProps> = ({
  columns,
  data,
  actions = [],
  loading = false,
  size = 'medium',
  bordered = true,
  striped = false,
  hoverable = false,
  selectable = false,
  sortable = true,
  selectedKeys,
  rowKey,
  pagination,
  sortBy,
  onSort,
  onSelectionChange,
  emptyText = 'No data available',
  height,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'data-testid': dataTestId,
  ...rest
}) => {
  const internalId = useStableId(id);

  const selectionMode = selectable === true ? 'multiple' : selectable === false ? undefined : selectable;
  const isSelectable = selectionMode === 'multiple' || selectionMode === 'single';
  const isMultiSelect = selectionMode === 'multiple';

  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(() => selectedKeys ?? []);
  useEffect(() => {
    if (selectedKeys !== undefined) {
      setInternalSelectedKeys(selectedKeys);
    }
  }, [selectedKeys]);

  const [internalSort, setInternalSort] = useState(sortBy ?? null);
  useEffect(() => {
    if (sortBy) setInternalSort(sortBy);
  }, [sortBy?.column, sortBy?.direction]);

  const activeSort = sortBy ?? internalSort ?? undefined;

  // Generate stable row keys with proper uniqueness
  const rowKeysMap = useMemo(
    () => new Map(data.map((row, index) => {
      const key = getRowKey(row, index, rowKey);
      return [index, key];
    })),
    [data, rowKey]
  );

  const rowKeys = useMemo(
    () => Array.from(rowKeysMap.values()),
    [rowKeysMap]
  );

  const domProps = useMemo(
    () => Object.fromEntries(Object.entries(rest).filter(([key]) => !NON_DOM_PROPS.has(key))),
    [rest]
  );

  const { style: inlineStyle, ...otherDomProps } = domProps as Record<string, unknown> & { style?: React.CSSProperties };

  const rootClasses = cn(
    getStyleClass('dyn-table'),
    'dyn-table',
    bordered && [getStyleClass('dyn-table--bordered'), 'dyn-table--bordered'],
    striped && [getStyleClass('dyn-table--striped'), 'dyn-table--striped'],
    hoverable && [getStyleClass('dyn-table--hoverable'), 'dyn-table--hoverable'],
    height !== undefined && [getStyleClass('dyn-table--fixed-height'), 'dyn-table--fixed-height'],
    size === 'small' && [getStyleClass('dyn-table--small'), 'dyn-table--small'],
    size === 'large' && [getStyleClass('dyn-table--large'), 'dyn-table--large'],
    className
  );

  const rootStyle = {
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : String(height) } : {}),
    ...(inlineStyle as React.CSSProperties | undefined)
  } as React.CSSProperties | undefined;

  const handleSelectionChange = (keys: string[]) => {
    if (!selectedKeys) {
      setInternalSelectedKeys(keys);
    }

    if (onSelectionChange) {
      const rows = keys.map(key => {
        const index = rowKeys.indexOf(key);
        return index >= 0 ? data[index] : undefined;
      }).filter(Boolean);
      onSelectionChange(keys, rows as any[]);
    }
  };

  const toggleRowSelection = (key: string) => {
    if (!isSelectable) return;

    if (isMultiSelect) {
      const exists = internalSelectedKeys.includes(key);
      const next = exists ? internalSelectedKeys.filter(k => k !== key) : [...internalSelectedKeys, key];
      handleSelectionChange(next);
    } else {
      handleSelectionChange([key]);
    }
  };

  const toggleSelectAll = () => {
    if (!isMultiSelect) return;
    const allSelected = rowKeys.length > 0 && rowKeys.every(key => internalSelectedKeys.includes(key));
    handleSelectionChange(allSelected ? [] : rowKeys);
  };

  const handleSortClick = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;
    if (!isColumnSortable(sortable, column.sortable)) return;

    const isCurrentlySorted = activeSort?.column === columnKey;
    const nextDirection: TableSortDirection = isCurrentlySorted && activeSort?.direction === 'asc' ? 'desc' : 'asc';

    if (!sortBy) {
      setInternalSort({ column: columnKey, direction: nextDirection });
    }

    onSort?.(columnKey, nextDirection);
  };

  const renderSelectionHeader = () => {
    if (!isSelectable) return null;
    
    const headerKey = `${internalId}-selection-header`;
    
    if (!isMultiSelect) {
      return (
        <th
          key={headerKey}
          role="columnheader"
          className={cn(
            getStyleClass('dyn-table__cell'),
            'dyn-table__cell',
            getStyleClass('dyn-table__cell--selection'),
            'dyn-table__cell--selection'
          )}
        />
      );
    }

    const allSelected = rowKeys.length > 0 && rowKeys.every(key => internalSelectedKeys.includes(key));

    return (
      <th
        key={headerKey}
        role="columnheader"
        scope="col"
        className={cn(
          getStyleClass('dyn-table__cell'),
          'dyn-table__cell',
          getStyleClass('dyn-table__cell--selection'),
          'dyn-table__cell--selection'
        )}
      >
        <input
          type="checkbox"
          aria-label="Select all rows"
          checked={allSelected}
          onChange={toggleSelectAll}
        />
      </th>
    );
  };

  const renderHeaderCells = () => columns.map(column => {
    const headerLabel = column.title ?? column.header ?? column.key;
    const isSorted = activeSort?.column === column.key;
    const sortableColumn = isColumnSortable(sortable, column.sortable);
    const headerKey = `${internalId}-header-${column.key}`;
    
    const thClasses = cn(
      getStyleClass('dyn-table__cell'),
      'dyn-table__cell',
      getStyleClass('dyn-table__cell--header'),
      'dyn-table__cell--header',
      column.align && [
        getStyleClass(`dyn-table__cell--${column.align}`),
        `dyn-table__cell--${column.align}`
      ],
      sortableColumn && 'dyn-table__cell--sortable',
      sortableColumn && getStyleClass('dyn-table__cell--sortable'),
      sortableColumn && isSorted && [
        getStyleClass('dyn-table__cell--sorted'),
        'dyn-table__cell--sorted'
      ]
    );

    const widthStyle = column.width ? { width: typeof column.width === 'number' ? `${column.width}px` : String(column.width) } : undefined;

    return (
      <th
        key={headerKey}
        role="columnheader"
        scope="col"
        aria-sort={isSorted ? (activeSort?.direction === 'asc' ? 'ascending' : 'descending') : undefined}
        className={thClasses}
        style={widthStyle}
        onClick={sortableColumn ? (event) => {
          if ((event.target as HTMLElement)?.closest('button')) return;
          handleSortClick(column.key);
        } : undefined}
      >
        <div className={cn(getStyleClass('dyn-table__cell-content'), 'dyn-table__cell-content')}>
          {sortableColumn ? (
            <button
              type="button"
              className={cn(getStyleClass('dyn-table__sort-button'), 'dyn-table__sort-button')}
              onClick={(event) => {
                event.stopPropagation();
                handleSortClick(column.key);
              }}
              aria-label={`Sort by ${headerLabel}`}
            >
              <span>{headerLabel}</span>
              <SortIcons direction={activeSort?.direction} isActive={isSorted} />
            </button>
          ) : (
            <span>{headerLabel}</span>
          )}
        </div>
      </th>
    );
  });

  const renderActionsHeader = () => {
    if (!actions.length) return null;
    
    const actionsHeaderKey = `${internalId}-actions-header`;
    
    return (
      <th
        key={actionsHeaderKey}
        role="columnheader"
        scope="col"
        className={cn(
          getStyleClass('dyn-table__cell'),
          'dyn-table__cell',
          getStyleClass('dyn-table__cell--actions'),
          'dyn-table__cell--actions'
        )}
      >
        <span>Actions</span>
      </th>
    );
  };

  const renderSelectionCell = (rowKey: string) => {
    if (!isSelectable) return null;
    
    const selectionCellKey = getCellKey(rowKey, 'selection');
    const checked = internalSelectedKeys.includes(rowKey);

    return (
      <td
        key={selectionCellKey}
        className={cn(
          getStyleClass('dyn-table__cell'),
          'dyn-table__cell',
          getStyleClass('dyn-table__cell--selection'),
          'dyn-table__cell--selection'
        )}
        role="cell"
      >
        {isMultiSelect ? (
          <input
            type="checkbox"
            aria-label="Select row"
            checked={checked}
            onChange={() => toggleRowSelection(rowKey)}
          />
        ) : (
          <input
            type="radio"
            aria-label="Select row"
            name={`${internalId}-selection`}
            checked={checked}
            onChange={() => toggleRowSelection(rowKey)}
          />
        )}
      </td>
    );
  };

  const renderActionsCell = (row: any, rowIndex: number, rowKey: string) => {
    if (!actions.length) return null;
    
    const actionsCellKey = getCellKey(rowKey, 'actions');
    
    return (
      <td
        key={actionsCellKey}
        className={cn(
          getStyleClass('dyn-table__cell'),
          'dyn-table__cell',
          getStyleClass('dyn-table__cell--actions'),
          'dyn-table__cell--actions'
        )}
        role="cell"
      >
        <div className={cn(getStyleClass('dyn-table-actions'), 'dyn-table-actions')}>
          {actions
            .filter(action => action.visible ? action.visible(row) : true)
            .map(action => {
              const actionKey = getActionKey(rowKey, action.key);
              return (
                <button
                  key={actionKey}
                  type="button"
                  className={cn(getStyleClass('dyn-table__action-button'), 'dyn-table__action-button')}
                  onClick={() => action.onClick(row, rowIndex)}
                  disabled={action.disabled ? action.disabled(row) : false}
                >
                  {action.title}
                </button>
              );
            })}
        </div>
      </td>
    );
  };

  const renderCellContent = (column: typeof columns[number], row: any, rowIndex: number) => {
    if (column.render) return column.render(row[column.key], row, rowIndex);
    if (column.type === 'boolean') return formatBoolean(row[column.key]);
    if (column.type === 'link') {
      const href = row[column.key];
      return href ? (
        <a href={String(href)}>{String(row[column.key])}</a>
      ) : '';
    }
    return formatCellValue(row[column.key]);
  };

  const renderBody = () => (
    <tbody className={cn(getStyleClass('dyn-table__body'), 'dyn-table__body')}>
      {data.map((row, rowIndex) => {
        const rowKey = rowKeysMap.get(rowIndex)!;
        return (
          <tr
            key={rowKey}
            role="row"
            aria-selected={isSelectable ? internalSelectedKeys.includes(rowKey) : undefined}
            className={cn(
              getStyleClass('dyn-table__row'),
              'dyn-table__row',
              isSelectable && internalSelectedKeys.includes(rowKey) && [
                getStyleClass('dyn-table__row--selected'),
                'dyn-table__row--selected'
              ]
            )}
          >
            {renderSelectionCell(rowKey)}
            {columns.map(column => {
              const cellKey = getCellKey(rowKey, column.key);
              return (
                <td
                  key={cellKey}
                  role="cell"
                  className={cn(
                    getStyleClass('dyn-table__cell'),
                    'dyn-table__cell',
                    column.align && [
                      getStyleClass(`dyn-table__cell--${column.align}`),
                      `dyn-table__cell--${column.align}`
                    ]
                  )}
                >
                  {renderCellContent(column, row, rowIndex)}
                </td>
              );
            })}
            {renderActionsCell(row, rowIndex, rowKey)}
          </tr>
        );
      })}
    </tbody>
  );

  const renderEmptyState = () => (
    <div className={cn(getStyleClass('dyn-table__empty'), 'dyn-table__empty')} role="note">
      {emptyText}
    </div>
  );

  const renderLoadingState = () => (
    <div className={cn(getStyleClass('dyn-table__loading'), 'dyn-table__loading')} role="status" aria-live="polite">
      Loading...
    </div>
  );

  const renderPagination = () => {
    if (!pagination) return null;
    const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
    const currentPage = Math.min(Math.max(1, pagination.current), totalPages);

    const goToPage = (page: number) => {
      const next = Math.min(Math.max(page, 1), totalPages);
      if (next !== currentPage) {
        pagination.onChange?.(next, pagination.pageSize);
      }
    };

    return (
      <div className={cn(getStyleClass('dyn-table__pagination'), 'dyn-table__pagination')} role="navigation" aria-label="Table pagination">
        <div className={cn(getStyleClass('dyn-table__pagination-controls'), 'dyn-table__pagination-controls')}>
          <button
            type="button"
            className={cn(getStyleClass('dyn-table__pagination-button'), 'dyn-table__pagination-button')}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={cn(getStyleClass('dyn-table__pagination-info'), 'dyn-table__pagination-info')}>
            Page {currentPage}
          </span>
          <button
            type="button"
            className={cn(getStyleClass('dyn-table__pagination-button'), 'dyn-table__pagination-button')}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      id={internalId}
      className={rootClasses}
      data-testid={dataTestId || 'dyn-table'}
      style={rootStyle}
      {...otherDomProps}
    >
      <div className={cn(getStyleClass('dyn-table__wrapper'), 'dyn-table__wrapper')}>
        <table
          role="table"
          className={cn(getStyleClass('dyn-table__table'), 'dyn-table__table')}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <thead className={cn(getStyleClass('dyn-table__head'), 'dyn-table__head')}>
            <tr
              role="row"
              className={cn(getStyleClass('dyn-table__row'), 'dyn-table__row')}
            >
              {renderSelectionHeader()}
              {renderHeaderCells()}
              {renderActionsHeader()}
            </tr>
          </thead>
          {renderBody()}
        </table>
      </div>
      {loading ? renderLoadingState() : data.length === 0 ? renderEmptyState() : null}
      {renderPagination()}
    </div>
  );
};

export default DynTable;