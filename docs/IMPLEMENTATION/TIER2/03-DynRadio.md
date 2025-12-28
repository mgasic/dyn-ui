# DynRadio - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 3 days

## QUICK FACTS
- **Type**: Form input (radio button)
- **State**: Controlled group state
- **Keyboard**: Tab, Arrow keys (within group), Space
- **ARIA**: role="radio", aria-checked, role="radiogroup"
- **Testing**: TIER 2

## WANTED STATE
✅ Radio group wrapper  
✅ Controlled state (value + onChange)  
✅ Keyboard navigation (Arrow keys to switch within group)  
✅ ARIA complete (radiogroup, radio, aria-checked)  
✅ All sizes (sm, md, lg)  
✅ Dark mode  
✅ 80%+ coverage  

## IMPLEMENTATION TOKENS
```css
.radio {
  --dyn-radio-bg: var(--dyn-color-white), #ffffff;
  --dyn-radio-bg-checked: var(--dyn-color-primary), #2563eb;
  --dyn-radio-border: var(--dyn-color-border), #d1d5db;
  --dyn-radio-size-sm: 16px;
  --dyn-radio-size-md: 20px;
  --dyn-radio-size-lg: 24px;
}
```

## PROPS & TYPES
```typescript
export interface DynRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface DynRadioProps {
  value: string;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

## TESTING (TIER 2)
- Group state management
- Arrow key navigation
- Space to select
- onChange callback
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2 (Arrow keys)
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (radiogroup, radio)
- PATTERNS/04-Testing-Pattern.md → TIER 2
