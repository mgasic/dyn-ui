# DynProgress - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2 days

## QUICK FACTS
- **Type**: Progress bar
- **State**: Progress value (0-100)
- **Keyboard**: N/A (visual only)
- **ARIA**: role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax
- **Testing**: TIER 2

## WANTED STATE
✅ Determinate + indeterminate modes  
✅ All variants (primary, success, warning, error)  
✅ All sizes (sm, md, lg)  
✅ ARIA complete (progressbar)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.progress {
  --dyn-progress-bg: var(--dyn-color-bg-secondary), #f3f4f6;
  --dyn-progress-fill-primary: var(--dyn-color-primary), #2563eb;
  --dyn-progress-fill-success: var(--dyn-color-success), #10b981;
  --dyn-progress-height-sm: 4px;
  --dyn-progress-height-md: 8px;
  --dyn-progress-height-lg: 12px;
}
```

## PROPS & TYPES
```typescript
export interface DynProgressProps {
  value?: number;
  indeterminate?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}
```

## TESTING (TIER 2)
- Determinate mode (value)
- Indeterminate mode
- All variants
- ARIA (progressbar attributes)
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
