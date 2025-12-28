# DynResponsiveTabs - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 4 days

## QUICK FACTS
- **Type**: Responsive tabs (collapses to dropdown on mobile)
- **State**: Active tab + breakpoint state
- **Keyboard**: Tab, Arrow keys, Enter, Escape
- **ARIA**: role="tablist" (desktop), role="menu" (mobile)
- **Testing**: TIER 2

## WANTED STATE
✅ Desktop tabs + mobile dropdown  
✅ Breakpoint detection (sm, md, lg)  
✅ Keyboard support for both modes  
✅ ARIA complete (tabs + menu patterns)  
✅ Dark mode  

## IMPLEMENTATION TOKENS
```css
.responsive-tabs {
  --dyn-responsive-tabs-breakpoint-sm: 640px;
  --dyn-responsive-tabs-breakpoint-md: 768px;
  --dyn-responsive-tabs-dropdown-bg: var(--dyn-color-white), #ffffff;
}
```

## PROPS & TYPES
```typescript
export interface DynResponsiveTabsProps {
  activeTab?: number;
  onChange?: (index: number) => void;
  breakpoint?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

## TESTING (TIER 2)
- Desktop tabs mode
- Mobile dropdown mode
- Breakpoint switching
- jest-axe (both modes)

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 2
- PATTERNS/04-Testing-Pattern.md → TIER 2
