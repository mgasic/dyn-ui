# DynPagination - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 4-5 days

## QUICK FACTS
- **Type**: Pagination control
- **State**: Current page, total pages
- **Keyboard**: Tab, Arrow keys, Enter
- **ARIA**: role="navigation", aria-label="Pagination", aria-current="page"
- **Testing**: TIER 3

## WANTED STATE
✅ Page navigation (prev/next, page numbers, jump to page)  
✅ Keyboard support (Arrow keys)  
✅ ARIA complete (pagination pattern)  
✅ Responsive (truncate on mobile)  
✅ Dark mode  

## STATE MANAGEMENT
```typescript
interface DynPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // Pages shown around current
  boundaryCount?: number; // Pages shown at start/end
}
```

## KEYBOARD NAVIGATION
- Arrow Left - Previous page
- Arrow Right - Next page
- Enter - Go to focused page

## ARIA PATTERN
```tsx
<nav role="navigation" aria-label="Pagination">
  <ul>
    <li>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
    </li>
    <li>
      <button aria-current="page">{currentPage}</button>
    </li>
    <li>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </li>
  </ul>
</nav>
```

## TESTING (TIER 3)
- Page navigation
- Keyboard support
- Truncation logic (siblingCount, boundaryCount)
- ARIA (aria-current="page")
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 3
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 3
- PATTERNS/04-Testing-Pattern.md → TIER 3
