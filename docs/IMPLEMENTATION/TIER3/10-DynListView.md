# DynListView - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 6-7 days

## QUICK FACTS
- **Type**: List view with virtualization
- **State**: Complex (scroll position, visible items, selection)
- **Keyboard**: Arrow keys, Home, End, Space (select), Ctrl+A (select all)
- **ARIA**: role="listbox", role="option", aria-selected
- **Testing**: TIER 3

## WANTED STATE
✅ Virtual scrolling (large lists)  
✅ Single/multi selection  
✅ Keyboard navigation (Arrow keys, Home, End)  
✅ ARIA complete (listbox pattern)  
✅ Dark mode  

## STATE MANAGEMENT (useReducer)
```typescript
type ListViewState = {
  selectedItems: Set<string>;
  focusedIndex: number;
  scrollTop: number;
  visibleRange: { start: number; end: number };
};

type ListViewAction =
  | { type: 'SELECT'; id: string; multi?: boolean }
  | { type: 'NAVIGATE'; direction: 'up' | 'down' | 'home' | 'end' }
  | { type: 'UPDATE_SCROLL'; scrollTop: number };
```

## VIRTUAL SCROLLING LOGIC
```typescript
const calculateVisibleRange = (scrollTop: number, itemHeight: number, containerHeight: number) => {
  const start = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = start + visibleCount + 1; // Buffer
  return { start, end };
};
```

## KEYBOARD NAVIGATION
- Arrow Down - Next item
- Arrow Up - Previous item
- Home - First item
- End - Last item
- Space - Toggle selection
- Ctrl+A - Select all

## ARIA PATTERN
```tsx
<div role="listbox" aria-multiselectable="true">
  {visibleItems.map(item => (
    <div
      key={item.id}
      role="option"
      aria-selected={selectedItems.has(item.id)}
      tabIndex={focusedIndex === item.index ? 0 : -1}
    >
      {item.label}
    </div>
  ))}
</div>
```

## TESTING (TIER 3)
- Virtual scrolling logic
- Selection (single/multi)
- Keyboard navigation
- ARIA (listbox pattern)
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 3
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 3 (listbox)
- PATTERNS/03-State-Management-Pattern.md → TIER 3
- PATTERNS/04-Testing-Pattern.md → TIER 3
