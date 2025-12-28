# DynAlert - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2-3 days

## QUICK FACTS
- **Type**: Alert/notification message
- **State**: Dismissible state
- **Keyboard**: Tab, Enter/Escape to dismiss
- **ARIA**: role="alert", aria-live, aria-label (for close button)
- **Testing**: TIER 2

## WANTED STATE
✅ All variants (info, success, warning, error)  
✅ Dismissible + non-dismissible modes  
✅ Icon support  
✅ ARIA complete (role="alert", aria-live="polite")  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.alert {
  --dyn-alert-bg-info: var(--dyn-color-info-light), #dbeafe;
  --dyn-alert-text-info: var(--dyn-color-info), #2563eb;
  --dyn-alert-bg-success: var(--dyn-color-success-light), #d1fae5;
  --dyn-alert-text-success: var(--dyn-color-success), #10b981;
  --dyn-alert-bg-warning: var(--dyn-color-warning-light), #fef3c7;
  --dyn-alert-text-warning: var(--dyn-color-warning), #f59e0b;
  --dyn-alert-bg-error: var(--dyn-color-error-light), #fee2e2;
  --dyn-alert-text-error: var(--dyn-color-error), #ef4444;
}
```

## PROPS & TYPES
```typescript
export interface DynAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- All variants
- Dismissible mode
- onDismiss callback
- Keyboard (Enter/Escape to dismiss)
- ARIA (role="alert", aria-live)
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2 (role="alert")
- PATTERNS/04-Testing-Pattern.md → TIER 2
