# DynPopover - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 5-6 days

## QUICK FACTS
- **Type**: Popover overlay
- **State**: Complex (open/close, positioning, focus management)
- **Keyboard**: Tab, Escape
- **ARIA**: role="dialog" or role="tooltip", aria-labelledby, aria-describedby
- **Testing**: TIER 3

## WANTED STATE
✅ Smart positioning (top, bottom, left, right, auto)  
✅ Focus management (optional focus trap)  
✅ Escape to close  
✅ Click outside to close  
✅ ARIA complete  
✅ Dark mode  
✅ 85%+ coverage  

## POSITIONING LOGIC
```typescript
const calculatePosition = (trigger: HTMLElement, popover: HTMLElement, placement: Placement) => {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();

  const positions = {
    top: { top: triggerRect.top - popoverRect.height, left: triggerRect.left },
    bottom: { top: triggerRect.bottom, left: triggerRect.left },
    left: { top: triggerRect.top, left: triggerRect.left - popoverRect.width },
    right: { top: triggerRect.top, left: triggerRect.right },
  };

  return positions[placement];
};
```

## ARIA PATTERN
```tsx
<div
  role="dialog"
  aria-labelledby="popover-title"
  aria-describedby="popover-content"
  style={{ position: 'absolute', ...positionStyles }}
>
  {children}
</div>
```

## TESTING (TIER 3)
- Positioning logic (all placements)
- Click outside to close
- Escape to close
- Focus management
- jest-axe

## REFERENCES
- PATTERNS/03-State-Management-Pattern.md → TIER 3
- PATTERNS/04-Testing-Pattern.md → TIER 3
