# DynMenu - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 4 days

## QUICK FACTS
- **Type**: Menu / Context menu
- **State**: Open/close state, selected item
- **Keyboard**: Tab, Arrow keys, Enter, Escape
- **ARIA**: role="menu", role="menuitem", aria-expanded
- **Testing**: TIER 2

## WANTED STATE
✅ Dropdown menu + context menu modes  
✅ Keyboard navigation (Arrow keys, Enter, Escape)  
✅ Submenu support  
✅ ARIA complete (menu pattern)  
✅ Dark mode  
✅ 80%+ coverage  

## IMPLEMENTATION TOKENS
```css
.menu {
  --dyn-menu-bg: var(--dyn-color-white), #ffffff;
  --dyn-menu-border: var(--dyn-color-border), #d1d5db;
  --dyn-menu-item-hover-bg: var(--dyn-color-hover), #f3f4f6;
  --dyn-menu-shadow: var(--dyn-shadow-md), 0 4px 6px rgba(0,0,0,0.1);
}
```

## PROPS & TYPES
```typescript
export interface DynMenuProps {
  items: Array<{ label: string; value: string; icon?: React.ReactNode; disabled?: boolean }>;
  onSelect?: (value: string) => void;
  open?: boolean;
  onClose?: () => void;
}
```

## TESTING (TIER 2)
- Open/close state
- Arrow key navigation
- Enter to select
- Escape to close
- onSelect callback
- jest-axe (menu pattern)

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (menu)
- PATTERNS/04-Testing-Pattern.md → TIER 2
