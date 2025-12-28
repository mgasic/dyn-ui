# DynTabs - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 3-4 days

## QUICK FACTS
- **Type**: Tab navigation
- **State**: Active tab index
- **Keyboard**: Tab, Arrow keys, Home, End
- **ARIA**: role="tablist", role="tab", role="tabpanel", aria-selected
- **Testing**: TIER 2

## WANTED STATE
✅ Controlled active tab state  
✅ Keyboard navigation (Arrow keys, Home, End)  
✅ All orientations (horizontal, vertical)  
✅ ARIA complete (tabs pattern)  
✅ Dark mode  
✅ 80%+ coverage  

## IMPLEMENTATION TOKENS
```css
.tabs {
  --dyn-tabs-border: var(--dyn-color-border), #d1d5db;
  --dyn-tabs-active-border: var(--dyn-color-primary), #2563eb;
  --dyn-tabs-bg-hover: var(--dyn-color-hover), #f3f4f6;
}
```

## PROPS & TYPES
```typescript
export interface DynTabsProps {
  activeTab?: number;
  defaultActiveTab?: number;
  onChange?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- Active tab state
- Arrow keys navigation
- Home/End keys
- onChange callback
- ARIA (tablist, tab, tabpanel)
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (tabs)
- PATTERNS/04-Testing-Pattern.md → TIER 2
