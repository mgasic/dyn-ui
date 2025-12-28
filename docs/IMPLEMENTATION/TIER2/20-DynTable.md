# DynTable - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 4-5 days

## QUICK FACTS
- **Type**: Data table
- **State**: Sorting, row selection
- **Keyboard**: Tab, Enter, Arrow keys (for row navigation)
- **ARIA**: role="table", role="row", role="columnheader", aria-sort
- **Testing**: TIER 2

## WANTED STATE
✅ Sortable columns  
✅ Row selection (single/multi)  
✅ Pagination support  
✅ Keyboard navigation (Arrow keys for rows)  
✅ ARIA complete (table pattern)  
✅ Responsive (horizontal scroll)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.table {
  --dyn-table-border: var(--dyn-color-border), #d1d5db;
  --dyn-table-header-bg: var(--dyn-color-bg-secondary), #f9fafb;
  --dyn-table-row-hover-bg: var(--dyn-color-hover), #f3f4f6;
  --dyn-table-row-selected-bg: var(--dyn-color-primary-light), #dbeafe;
}
```

## PROPS & TYPES
```typescript
export interface DynTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface DynTableProps {
  columns: DynTableColumn[];
  data: Array<Record<string, any>>;
  sortable?: boolean;
  selectable?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onSelect?: (selectedRows: any[]) => void;
}
```

## TESTING (TIER 2)
- Render columns + data
- Sorting (click column header)
- Row selection
- Keyboard navigation (Arrow keys)
- ARIA (table, row, columnheader, aria-sort)
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (table)
- PATTERNS/04-Testing-Pattern.md → TIER 2
