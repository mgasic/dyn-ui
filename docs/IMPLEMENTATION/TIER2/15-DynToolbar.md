# DynToolbar - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2-3 days

## QUICK FACTS
- **Type**: Action toolbar
- **State**: Stateless (contains action buttons)
- **Keyboard**: Tab to navigate buttons
- **ARIA**: role="toolbar", aria-label
- **Testing**: TIER 2

## WANTED STATE
✅ Horizontal + vertical layouts  
✅ Action button slots  
✅ Responsive (collapse to overflow menu)  
✅ ARIA (role="toolbar")  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.toolbar {
  --dyn-toolbar-bg: var(--dyn-color-bg), #ffffff;
  --dyn-toolbar-border: var(--dyn-color-border), #d1d5db;
  --dyn-toolbar-gap: var(--dyn-spacing-sm), 8px;
}
```

## PROPS & TYPES
```typescript
export interface DynToolbarProps {
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- Orientation
- Button slots
- ARIA (role="toolbar")
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
