# DynBreadcrumb - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2 days

## QUICK FACTS
- **Type**: Breadcrumb navigation
- **State**: Stateless (receives items array)
- **Keyboard**: Tab, Enter (for links)
- **ARIA**: role="navigation", aria-label="Breadcrumb"
- **Testing**: TIER 2

## WANTED STATE
✅ Breadcrumb items with separator  
✅ Current page indicator  
✅ Custom separator support  
✅ ARIA complete (navigation + aria-current)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.breadcrumb {
  --dyn-breadcrumb-color: var(--dyn-color-text-muted), #6b7280;
  --dyn-breadcrumb-color-active: var(--dyn-color-text), #1f2937;
  --dyn-breadcrumb-separator-color: var(--dyn-color-text-muted), #9ca3af;
}
```

## PROPS & TYPES
```typescript
export interface DynBreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  separator?: React.ReactNode;
}
```

## TESTING (TIER 2)
- Render items
- Separator
- aria-current on last item
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
