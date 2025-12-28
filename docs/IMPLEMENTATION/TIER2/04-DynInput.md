# DynInput - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 3-4 days

## QUICK FACTS
- **Type**: Text input
- **State**: Controlled/uncontrolled hybrid
- **Keyboard**: Tab, typing
- **ARIA**: aria-label, aria-invalid, aria-describedby
- **Testing**: TIER 2

## WANTED STATE
✅ Controlled + uncontrolled modes  
✅ All input types (text, email, password, number, tel, url)  
✅ Validation states (error, success)  
✅ Leading/trailing icons  
✅ All sizes (sm, md, lg)  
✅ ARIA (aria-invalid, aria-describedby for errors)  
✅ Dark mode  
✅ 80%+ coverage  

## IMPLEMENTATION TOKENS
```css
.input {
  --dyn-input-bg: var(--dyn-color-white), #ffffff;
  --dyn-input-border: var(--dyn-color-border), #d1d5db;
  --dyn-input-border-focus: var(--dyn-color-primary), #2563eb;
  --dyn-input-border-error: var(--dyn-color-error), #ef4444;
  --dyn-input-padding-sm: 6px 12px;
  --dyn-input-padding-md: 8px 16px;
  --dyn-input-padding-lg: 12px 20px;
}
```

## PROPS & TYPES
```typescript
export interface DynInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

## TESTING (TIER 2)
- Controlled/uncontrolled modes
- onChange callback
- Error state + aria-invalid
- aria-describedby for error messages
- Leading/trailing icons
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (aria-invalid, aria-describedby)
- PATTERNS/03-State-Management-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
