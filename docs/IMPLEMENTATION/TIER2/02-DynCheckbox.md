# DynCheckbox - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 3 days

## QUICK FACTS
- **Type**: Form input (checkbox)
- **State**: Controlled/uncontrolled hybrid
- **Keyboard**: Tab, Space
- **ARIA**: role="checkbox", aria-checked, aria-label
- **Testing**: TIER 2

## WANTED STATE
✅ Controlled + uncontrolled modes  
✅ Indeterminate state  
✅ All sizes (sm, md, lg)  
✅ Keyboard support (Space to toggle)  
✅ ARIA complete (role, aria-checked)  
✅ Dark mode  
✅ 80%+ coverage  

## IMPLEMENTATION TOKENS
```css
.checkbox {
  --dyn-checkbox-bg: var(--dyn-color-white), #ffffff;
  --dyn-checkbox-bg-checked: var(--dyn-color-primary), #2563eb;
  --dyn-checkbox-border: var(--dyn-color-border), #d1d5db;
  --dyn-checkbox-size-sm: var(--dyn-size-sm), 16px;
  --dyn-checkbox-size-md: var(--dyn-size-md), 20px;
  --dyn-checkbox-size-lg: var(--dyn-size-lg), 24px;
}
```

## PROPS & TYPES
```typescript
export interface DynCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

## TESTING (TIER 2)
- Controlled mode (checked prop)
- Uncontrolled mode (defaultChecked)
- Indeterminate state
- Keyboard toggle (Space)
- onChange callback
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (role, aria-checked)
- PATTERNS/03-State-Management-Pattern.md → TIER 2 (controlled/uncontrolled)
- PATTERNS/04-Testing-Pattern.md → TIER 2
