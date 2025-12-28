# DynTag - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2 days

## QUICK FACTS
- **Type**: Removable tag/chip
- **State**: onRemove callback
- **Keyboard**: Tab, Enter/Space to remove
- **ARIA**: role="button" (for remove), aria-label
- **Testing**: TIER 2

## WANTED STATE
✅ All variants (primary, secondary, success, error)  
✅ Removable + non-removable modes  
✅ Icon support  
✅ All sizes (xs, sm, md, lg)  
✅ Keyboard support (Enter/Space to remove)  
✅ ARIA (aria-label for remove button)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.tag {
  --dyn-tag-bg-primary: var(--dyn-color-primary-light), #dbeafe;
  --dyn-tag-text-primary: var(--dyn-color-primary), #2563eb;
  --dyn-tag-padding-xs: 2px 6px;
  --dyn-tag-padding-sm: 4px 8px;
  --dyn-tag-padding-md: 6px 12px;
}
```

## PROPS & TYPES
```typescript
export interface DynTagProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onRemove?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- All variants
- onRemove callback
- Keyboard (Enter/Space on remove button)
- jest-axe

## REFERENCES
- PATTERNS/04-Testing-Pattern.md → TIER 2
