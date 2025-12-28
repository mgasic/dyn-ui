# DynSelect - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 4 days

## QUICK FACTS
- **Type**: Dropdown select
- **State**: Controlled value state
- **Keyboard**: Tab, Arrow keys, Enter, Escape
- **ARIA**: role="combobox", aria-expanded, aria-controls, aria-activedescendant
- **Testing**: TIER 2

## WANTED STATE
✅ Native select + custom dropdown modes  
✅ Controlled state (value + onChange)  
✅ Keyboard navigation (Arrow keys, Enter to select, Escape to close)  
✅ Search/filter option  
✅ ARIA complete (combobox pattern)  
✅ All sizes (sm, md, lg)  
✅ Dark mode  
✅ 80%+ coverage  

## IMPLEMENTATION TOKENS
```css
.select {
  --dyn-select-bg: var(--dyn-color-white), #ffffff;
  --dyn-select-border: var(--dyn-color-border), #d1d5db;
  --dyn-select-border-focus: var(--dyn-color-primary), #2563eb;
  --dyn-select-dropdown-bg: var(--dyn-color-white), #ffffff;
  --dyn-select-option-hover-bg: var(--dyn-color-hover), #f3f4f6;
}
```

## PROPS & TYPES
```typescript
export interface DynSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  searchable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

## TESTING (TIER 2)
- Value state management
- Keyboard navigation (Arrow keys)
- Enter to select, Escape to close
- Search/filter
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2 (Arrow, Enter, Escape)
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (combobox)
- PATTERNS/04-Testing-Pattern.md → TIER 2
