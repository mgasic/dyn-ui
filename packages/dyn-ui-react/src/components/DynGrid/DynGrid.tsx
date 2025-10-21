import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/classNames';
import type {
  DynGridColumn,
  DynGridProps,
  DynGridSortDirection,
} from './DynGrid.types';
import { DYN_GRID_DEFAULT_PROPS } from './DynGrid.types';
import styles from './DynGrid.module.css';

const headerAlignClassMap: Record<'center' | 'right', string> = {
  center: styles.headerCellAlignCenter,
  right: styles.headerCellAlignRight,
};

const cellAlignClassMap: Record<'center' | 'right', string> = {
  center: styles.cellAlignCenter,
  right: styles.cellAlignRight,
};

const sizeClassNameMap: Record<NonNullable<DynGridProps['size']>, string | undefined> = {
  small: styles.sizeSmall,
  medium: undefined,
  large: styles.sizeLarge,
};

const DynGrid = forwardRef<HTMLDivElement, DynGridProps>((props, ref) => {
  const {
    columns,
    data,
    loading = DYN_GRID_DEFAULT_PROPS.loading,
    size = DYN_GRID_DEFAULT_PROPS.size,
    bordered = DYN_GRID_DEFAULT_PROPS.bordered,
    striped = DYN_GRID_DEFAULT_PROPS.striped,
    hoverable = DYN_GRID_DEFAULT_PROPS.hoverable,
    sortable = DYN_GRID_DEFAULT_PROPS.sortable,
    filterable = DYN_GRID_DEFAULT_PROPS.filterable,
    selectable = DYN_GRID_DEFAULT_PROPS.selectable,
    selectedKeys,
    onSelectionChange,
    onSort,
    onFilter,
    pagination,
    emptyText = DYN_GRID_DEFAULT_PROPS.emptyText,
    className,
    id,
    'data-testid': dataTestId = DYN_GRID_DEFAULT_PROPS['data-testid'],
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props;

  const selectionName = useId();

  void filterable;
  void onFilter;

  const selectionMode: 'none' | 'single' | 'multiple' = useMemo(() => {
    if (selectable === 'single') {
      return 'single';
    }

    if (selectable === 'multiple' || selectable === true) {
      return 'multiple';
    }

    return 'none';
  }, [selectable]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: DynGridSortDirection;
  } | null>(null);

  const resolvedSelectedKeys = useMemo(
    () => selectedKeys ?? DYN_GRID_DEFAULT_PROPS.selectedKeys,
    [selectedKeys]
  );

  const [selectedRows, setSelectedRows] = useState<string[]>(resolvedSelectedKeys);

  useEffect(() => {
    setSelectedRows(resolvedSelectedKeys);
  }, [resolvedSelectedKeys]);

  const visibleColumns = useMemo(
    () => columns.filter(column => !column.hidden),
    [columns]
  );

  const getRowKey = useCallback((record: Record<string, unknown>, index: number) => {
    const candidate =
      (record.id as string | number | undefined) ??
      (record.key as string | number | undefined) ??
      (record.rowKey as string | number | undefined);

    if (typeof candidate === 'string' || typeof candidate === 'number') {
      return String(candidate);
    }

    return index.toString();
  }, []);

  const handleSort = useCallback(
    (columnKey: string) => {
      if (!sortable) {
        return;
      }

      const column = visibleColumns.find(col => col.key === columnKey);
      if (!column?.sortable) {
        return;
      }

      let direction: DynGridSortDirection = 'asc';

      if (sortConfig?.key === columnKey && sortConfig.direction === 'asc') {
        direction = 'desc';
      }

      setSortConfig({ key: columnKey, direction });
      onSort?.(columnKey, direction);
    },
    [sortable, visibleColumns, sortConfig, onSort]
  );

  const getSelectedRowData = useCallback(
    (keys: string[]): Record<string, unknown>[] =>
      keys
        .map(key => {
          const rowIndex = data.findIndex((record, index) => getRowKey(record, index) === key);
          return rowIndex >= 0 ? data[rowIndex] : undefined;
        })
        .filter((record): record is Record<string, unknown> => Boolean(record)),
    [data, getRowKey]
  );

  const handleRowSelect = useCallback(
    (rowKey: string, selected: boolean) => {
      if (selectionMode === 'none') {
        return;
      }

      let newSelection: string[];

      if (selectionMode === 'single') {
        newSelection = selected ? [rowKey] : [];
      } else {
        newSelection = selected
          ? [...new Set([...selectedRows, rowKey])]
          : selectedRows.filter(key => key !== rowKey);
      }

      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection, getSelectedRowData(newSelection));
    },
    [selectionMode, selectedRows, onSelectionChange, getSelectedRowData]
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selectionMode !== 'multiple') {
        return;
      }

      const allKeys = data.map((record, index) => getRowKey(record, index));
      const newSelection = selected ? allKeys : [];

      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection, selected ? data : []);
    },
    [selectionMode, data, getRowKey, onSelectionChange]
  );

  const renderCell = useCallback(
    (column: DynGridColumn, record: Record<string, unknown>, rowIndex: number) => {
      if (column.render) {
        return column.render(record[column.key], record, rowIndex);
      }

      return record[column.key] as ReactNode;
    },
    []
  );

  const isAllSelected = useMemo(() => {
    if (selectionMode !== 'multiple' || data.length === 0) {
      return false;
    }

    const allKeys = data.map((record, index) => getRowKey(record, index));
    return allKeys.every(key => selectedRows.includes(key));
  }, [selectionMode, data, getRowKey, selectedRows]);

  const isSelectionIndeterminate = useMemo(() => {
    if (selectionMode !== 'multiple' || data.length === 0) {
      return false;
    }

    const selectedCount = data.filter((record, index) => selectedRows.includes(getRowKey(record, index))).length;
    return selectedCount > 0 && selectedCount < data.length;
  }, [selectionMode, data, getRowKey, selectedRows]);

  const gridClassName = cn(
    styles.root,
    sizeClassNameMap[size],
    bordered && styles.bordered,
    striped && styles.striped,
    hoverable && styles.hoverable,
    loading && styles.loading,
    className
  );

  if (loading) {
    return (
      <div
        ref={ref}
        className={gridClassName}
        id={id}
        data-testid={dataTestId}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        <div className={styles.loadingState} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <span>Loading data…</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        ref={ref}
        className={gridClassName}
        id={id}
        data-testid={dataTestId}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        <div className={styles.emptyState}>
          {typeof emptyText === 'string' ? (
            <span>{emptyText}</span>
          ) : (
            emptyText
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={gridClassName}
      id={id}
      data-testid={dataTestId}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      {...rest}
    >
      <div className={styles.wrapper}>
        <table className={styles.table} role="table">
          <thead className={styles.header}>
            <tr className={styles.headerRow}>
              {selectionMode === 'multiple' && (
                <th className={cn(styles.headerCell, styles.selectionCell)} scope="col">
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isAllSelected}
                    onChange={event => handleSelectAll(event.target.checked)}
                    aria-checked={isSelectionIndeterminate ? 'mixed' : isAllSelected}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {visibleColumns.map(column => {
                const isSorted = sortConfig?.key === column.key;
                const direction = isSorted ? sortConfig?.direction : undefined;
                const headerAlignmentClass =
                  column.align && column.align !== 'left'
                    ? headerAlignClassMap[column.align]
                    : undefined;

                return (
                  <th
                    key={column.key}
                    className={cn(
                      styles.headerCell,
                      headerAlignmentClass,
                      column.sortable && sortable && styles.headerCellSortable,
                      isSorted && styles.headerCellSorted
                    )}
                    style={{ width: column.width, minWidth: column.minWidth }}
                    onClick={() => column.sortable && handleSort(column.key)}
                    aria-sort={
                      column.sortable && sortable
                        ? direction === 'asc'
                          ? 'ascending'
                          : direction === 'desc'
                          ? 'descending'
                          : 'none'
                        : undefined
                    }
                    scope="col"
                  >
                    <div className={styles.headerContent}>
                      <span>{column.title}</span>
                      {column.sortable && sortable && (
                        <span className={styles.sortIndicator} aria-hidden="true">
                          {isSorted ? (direction === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.body}>
            {data.map((record, rowIndex) => {
              const rowKey = getRowKey(record, rowIndex);
              const isSelected = selectedRows.includes(rowKey);

              return (
                <tr
                  key={rowKey}
                  className={cn(
                    styles.row,
                    rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
                    isSelected && styles.rowSelected
                  )}
                  role="row"
                >
                  {selectionMode !== 'none' && (
                    <td className={cn(styles.cell, styles.selectionCell)}>
                      <input
                        type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                        className={styles.checkbox}
                        name={selectionMode === 'single' ? selectionName : undefined}
                        checked={isSelected}
                        onChange={event => handleRowSelect(rowKey, event.target.checked)}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {visibleColumns.map(column => (
                    <td
                      key={column.key}
                      className={cn(
                        styles.cell,
                        column.align && column.align !== 'left'
                          ? cellAlignClassMap[column.align]
                          : undefined
                      )}
                    >
                      {renderCell(column, record, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className={styles.pagination} role="navigation" aria-label="Table pagination">
          <div className={styles.paginationInfo}>
            {pagination.showTotal?.(
              pagination.total,
              [
                (pagination.current - 1) * pagination.pageSize + 1,
                Math.min(pagination.current * pagination.pageSize, pagination.total),
              ]
            )}
          </div>
          <div className={styles.paginationControls}>
            <span>
              Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

DynGrid.displayName = 'DynGrid';

export { DynGrid };
export default DynGrid;
