# DynDropdown - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 5-6 days

## QUICK FACTS
- **Type**: Advanced dropdown menu
- **State**: Complex (open/close, selected item, keyboard focus)
- **Keyboard**: Tab, Arrow keys, Enter, Escape, Home, End, type-ahead
- **ARIA**: role="combobox", aria-expanded, aria-activedescendant, aria-controls
- **Testing**: TIER 3

## WANTED STATE
✅ Open/close state with focus management  
✅ Full keyboard navigation (Arrow keys, Home, End, type-ahead)  
✅ ARIA complete (combobox pattern)  
✅ Search/filter support  
✅ Multi-select mode  
✅ Dark mode  
✅ 85%+ coverage  

## STATE MANAGEMENT (useReducer)
```typescript
type DropdownState = {
  open: boolean;
  selectedIndex: number;
  searchQuery: string;
};

type DropdownAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT'; index: number }
  | { type: 'NAVIGATE'; direction: 'up' | 'down' | 'home' | 'end' };
```

## KEYBOARD NAVIGATION (TIER 3)
- Arrow Up/Down - Navigate options
- Home/End - Jump to first/last option
- Enter - Select option and close
- Escape - Close dropdown
- Type-ahead - Search by typing

## ARIA PATTERN
```tsx
<div role="combobox" aria-expanded={open} aria-controls="dropdown-list">
  <button aria-haspopup="listbox" aria-labelledby="dropdown-label">
    {selectedOption}
  </button>
  <ul id="dropdown-list" role="listbox" aria-activedescendant={`option-${activeIndex}`}>
    <li role="option" id="option-0">Option 1</li>
  </ul>
</div>
```

## TESTING (TIER 3)
- Open/close with keyboard
- Arrow navigation
- Type-ahead search
- Multi-select mode
- Focus management (return focus on close)
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 3
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 3 (combobox)
- PATTERNS/03-State-Management-Pattern.md → TIER 3
- PATTERNS/04-Testing-Pattern.md → TIER 3
