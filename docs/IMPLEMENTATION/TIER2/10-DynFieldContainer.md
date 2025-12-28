# DynFieldContainer - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2 days

## QUICK FACTS
- **Type**: Form field wrapper (label + input + error)
- **State**: Error/validation state
- **Keyboard**: N/A (wrapper component)
- **ARIA**: aria-describedby (for errors), aria-required
- **Testing**: TIER 2

## WANTED STATE
✅ Label positioning (top, left, inline)  
✅ Required indicator  
✅ Error message display  
✅ Helper text support  
✅ ARIA (aria-describedby for errors, aria-required)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.field-container {
  --dyn-field-label-color: var(--dyn-color-text), #1f2937;
  --dyn-field-error-color: var(--dyn-color-error), #ef4444;
  --dyn-field-helper-color: var(--dyn-color-text-muted), #6b7280;
  --dyn-field-gap: var(--dyn-spacing-xs), 4px;
}
```

## PROPS & TYPES
```typescript
export interface DynFieldContainerProps {
  label?: string;
  labelPosition?: 'top' | 'left' | 'inline';
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- Label positioning
- Required indicator
- Error display
- Helper text
- ARIA (aria-describedby, aria-required)
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
