# DynCard - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2-3 days

## QUICK FACTS
- **Type**: Content card container
- **State**: Interactive/clickable state (optional)
- **Keyboard**: Tab, Enter (if interactive)
- **ARIA**: role="article" or role="button" (if clickable)
- **Testing**: TIER 2

## WANTED STATE
✅ Header, body, footer slots  
✅ Interactive mode (clickable card)  
✅ All variants (default, outlined, elevated)  
✅ Keyboard support (Enter if clickable)  
✅ ARIA (role="article" or role="button")  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.card {
  --dyn-card-bg: var(--dyn-color-white), #ffffff;
  --dyn-card-border: var(--dyn-color-border), #d1d5db;
  --dyn-card-shadow: var(--dyn-shadow-sm), 0 1px 3px rgba(0,0,0,0.1);
  --dyn-card-shadow-elevated: var(--dyn-shadow-md), 0 4px 6px rgba(0,0,0,0.1);
  --dyn-card-padding: var(--dyn-spacing-md), 16px;
}
```

## PROPS & TYPES
```typescript
export interface DynCardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  interactive?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- All variants
- Interactive mode (onClick, keyboard Enter)
- Header/footer slots
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
