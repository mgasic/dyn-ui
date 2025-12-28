# DynTab - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 1-2 days

## QUICK FACTS
- **Type**: Single tab item (used with DynTabs)
- **State**: Selected state
- **Keyboard**: Tab, Enter, Space
- **ARIA**: role="tab", aria-selected
- **Testing**: TIER 2

## WANTED STATE
✅ Selected + unselected states  
✅ Icon support  
✅ Disabled state  
✅ ARIA (role="tab", aria-selected)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.tab {
  --dyn-tab-color: var(--dyn-color-text-muted), #6b7280;
  --dyn-tab-color-selected: var(--dyn-color-primary), #2563eb;
  --dyn-tab-border-selected: var(--dyn-color-primary), #2563eb;
}
```

## PROPS & TYPES
```typescript
export interface DynTabProps {
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- Selected/unselected states
- Disabled state
- Icon support
- ARIA (role="tab", aria-selected)
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
