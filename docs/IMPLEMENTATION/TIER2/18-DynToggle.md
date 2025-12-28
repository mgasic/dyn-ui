# DynToggle - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2-3 days

## QUICK FACTS
- **Type**: Toggle switch
- **State**: Controlled/uncontrolled (on/off)
- **Keyboard**: Tab, Space
- **ARIA**: role="switch", aria-checked
- **Testing**: TIER 2

## WANTED STATE
✅ Controlled + uncontrolled modes  
✅ All sizes (sm, md, lg)  
✅ Keyboard support (Space to toggle)  
✅ ARIA complete (switch pattern)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.toggle {
  --dyn-toggle-bg-off: var(--dyn-color-bg-secondary), #e5e7eb;
  --dyn-toggle-bg-on: var(--dyn-color-primary), #2563eb;
  --dyn-toggle-thumb-bg: var(--dyn-color-white), #ffffff;
  --dyn-toggle-width-sm: 32px;
  --dyn-toggle-width-md: 40px;
  --dyn-toggle-width-lg: 48px;
}
```

## PROPS & TYPES
```typescript
export interface DynToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

## TESTING (TIER 2)
- Controlled/uncontrolled
- onChange callback
- Space to toggle
- ARIA (role="switch", aria-checked)
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (switch)
- PATTERNS/03-State-Management-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
