# DynTooltip - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 4-5 days

## QUICK FACTS
- **Type**: Tooltip overlay
- **State**: Hover/focus state, positioning
- **Keyboard**: Focus triggers tooltip
- **ARIA**: role="tooltip", aria-describedby
- **Testing**: TIER 3

## WANTED STATE
✅ Hover + focus triggers  
✅ Smart positioning (auto-flip)  
✅ Delay support (show/hide)  
✅ ARIA complete (role="tooltip")  
✅ Dark mode  

## STATE MANAGEMENT
```typescript
const DynTooltip = ({ children, content, placement = 'top', delay = 200 }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const show = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <>
      <div onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
        {children}
      </div>
      {visible && <div role="tooltip">{content}</div>}
    </>
  );
};
```

## ARIA PATTERN
```tsx
<button aria-describedby="tooltip-1">
  Hover me
</button>
<div id="tooltip-1" role="tooltip">
  Tooltip content
</div>
```

## TESTING (TIER 3)
- Hover trigger
- Focus trigger
- Delay logic
- Positioning
- jest-axe

## REFERENCES
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 3
- PATTERNS/04-Testing-Pattern.md → TIER 3
