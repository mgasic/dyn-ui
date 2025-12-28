# DynRating - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 3 days

## QUICK FACTS
- **Type**: Star rating input
- **State**: Controlled value (rating 1-5)
- **Keyboard**: Tab, Arrow keys, Enter, Space
- **ARIA**: role="radiogroup", aria-label
- **Testing**: TIER 2

## WANTED STATE
✅ Controlled rating value  
✅ Read-only + interactive modes  
✅ Half-star support  
✅ Keyboard navigation (Arrow keys)  
✅ ARIA (radiogroup pattern)  
✅ All sizes (sm, md, lg)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.rating {
  --dyn-rating-color: var(--dyn-color-warning), #f59e0b;
  --dyn-rating-color-empty: var(--dyn-color-border), #d1d5db;
  --dyn-rating-size-sm: 16px;
  --dyn-rating-size-md: 24px;
  --dyn-rating-size-lg: 32px;
}
```

## PROPS & TYPES
```typescript
export interface DynRatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

## TESTING (TIER 2)
- Controlled value
- onChange callback
- Arrow key navigation
- Half-star support
- Read-only mode
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
