/**
 * DynGrid - Advanced data table component
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import React from 'react';
import { DynGridProps, DynGridColumn } from '../../types/layout.types';
import { classNames } from '../../utils/classNames';

export const DynGrid: React.FC<DynGridProps> = ({
  columns,
  data,
  loading = false,
  size = 'medium',
  bordered = true,
  striped = false,
  hoverable = true,
  sortable = true,
  filterable = false,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onSort,
  onFilter,
  pagination,
  emptyText = 'Nenhum dado disponível',
  className,
  id,
  'data-testid': testId
}) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<string[]>(selectedKeys);

  const gridClasses = classNames(
    'dyn-grid',
    `dyn-grid--${size}`,
    {
      'dyn-grid--bordered': bordered,
      'dyn-grid--striped': striped,
      'dyn-grid--hoverable': hoverable,
      'dyn-grid--loading': loading,
      'dyn-grid--selectable': selectable
    },
    className
  );

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key: columnKey, direction });
    onSort?.(columnKey, direction);
  };

  const handleRowSelect = (rowKey: string, selected: boolean) => {
    if (!selectable) return;

    let newSelection: string[];
    if (selectable === 'single') {
      newSelection = selected ? [rowKey] : [];
    } else {
      newSelection = selected
        ? [...selectedRows, rowKey]
        : selectedRows.filter(key => key !== rowKey);
    }

    setSelectedRows(newSelection);
    const selectedRowData = data.filter((row, index) => 
      newSelection.includes(row.id || index.toString())
    );
    onSelectionChange?.(newSelection, selectedRowData);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selectable !== 'multiple') return;

    const allKeys = data.map((row, index) => row.id || index.toString());
    const newSelection = selected ? allKeys : [];
    
    setSelectedRows(newSelection);
    const selectedRowData = selected ? data : [];
    onSelectionChange?.(newSelection, selectedRowData);
  };

  const renderCell = (column: DynGridColumn, record: any, rowIndex: number) => {
    if (column.render) {
      return column.render(record[column.key], record, rowIndex);
    }
    return record[column.key];
  };

  if (loading) {
    return (
      <div className={gridClasses} id={id} data-testid={testId}>
        <div className="dyn-grid-loading">
          <div className="dyn-grid-spinner"></div>
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={gridClasses} id={id} data-testid={testId}>
        <div className="dyn-grid-empty">
          {typeof emptyText === 'string' ? (
            <span className="dyn-grid-empty-text">{emptyText}</span>
          ) : (
            emptyText
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={gridClasses} id={id} data-testid={testId}>
      <div className="dyn-grid-wrapper">
        <table className="dyn-grid-table">
          <thead className="dyn-grid-header">
            <tr className="dyn-grid-header-row">
              {selectable === 'multiple' && (
                <th className="dyn-grid-header-cell dyn-grid-select-cell">
                  <input
                    type="checkbox"
                    className="dyn-grid-checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Selecionar todos"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={classNames(
                    'dyn-grid-header-cell',
                    {
                      'dyn-grid-header-cell--sortable': column.sortable && sortable,
                      'dyn-grid-header-cell--sorted': sortConfig?.key === column.key,
                      [`dyn-grid-header-cell--align-${column.align}`]: column.align
                    }
                  )}
                  style={{ width: column.width, minWidth: column.minWidth }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="dyn-grid-header-content">
                    <span className="dyn-grid-header-title">{column.title}</span>
                    {column.sortable && sortable && (
                      <span className="dyn-grid-sort-indicator">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="dyn-grid-body">
            {data.map((record, rowIndex) => {
              const rowKey = record.id || rowIndex.toString();
              const isSelected = selectedRows.includes(rowKey);
              
              return (
                <tr
                  key={rowKey}
                  className={classNames(
                    'dyn-grid-row',
                    {
                      'dyn-grid-row--selected': isSelected,
                      'dyn-grid-row--even': rowIndex % 2 === 0,
                      'dyn-grid-row--odd': rowIndex % 2 === 1
                    }
                  )}
                >
                  {selectable && (
                    <td className="dyn-grid-cell dyn-grid-select-cell">
                      <input
                        type={selectable === 'single' ? 'radio' : 'checkbox'}
                        className="dyn-grid-checkbox"
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(rowKey, e.target.checked)}
                        name={selectable === 'single' ? 'dyn-grid-selection' : undefined}
                        aria-label={`Selecionar linha ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={classNames(
                        'dyn-grid-cell',
                        {
                          [`dyn-grid-cell--align-${column.align}`]: column.align
                        }
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
        <div className="dyn-grid-pagination">
          <div className="dyn-grid-pagination-info">
            {pagination.showTotal && 
              pagination.showTotal(
                pagination.total, 
                [(pagination.current - 1) * pagination.pageSize + 1, 
                 Math.min(pagination.current * pagination.pageSize, pagination.total)]
              )
            }
          </div>
          <div className="dyn-grid-pagination-controls">
            {/* Pagination controls would be implemented here */}
            <span>Página {pagination.current} de {Math.ceil(pagination.total / pagination.pageSize)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

DynGrid.displayName = 'DynGrid';

export default DynGrid;