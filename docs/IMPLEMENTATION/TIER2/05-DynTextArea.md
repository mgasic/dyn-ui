# DynTextArea - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 2-3 days

## QUICK FACTS
- **Type**: Multi-line text input
- **State**: Controlled/uncontrolled
- **Keyboard**: Tab, typing
- **ARIA**: aria-label, aria-invalid, aria-describedby
- **Testing**: TIER 2

## WANTED STATE
✅ Controlled + uncontrolled modes  
✅ Auto-resize option  
✅ Max length with counter  
✅ Validation states  
✅ All sizes (sm, md, lg)  
✅ ARIA complete  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.textarea {
  --dyn-textarea-bg: var(--dyn-color-white), #ffffff;
  --dyn-textarea-border: var(--dyn-color-border), #d1d5db;
  --dyn-textarea-border-focus: var(--dyn-color-primary), #2563eb;
  --dyn-textarea-min-height-sm: 60px;
  --dyn-textarea-min-height-md: 80px;
  --dyn-textarea-min-height-lg: 120px;
}
```

## PROPS & TYPES
```typescript
export interface DynTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  autoResize?: boolean;
  maxLength?: number;
  showCounter?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

## TESTING (TIER 2)
- Controlled/uncontrolled
- Auto-resize
- Max length + counter
- jest-axe

## REFERENCES
- PATTERNS/03-State-Management-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
