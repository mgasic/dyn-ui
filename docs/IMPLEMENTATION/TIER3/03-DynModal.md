# DynModal - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 6-7 days

## QUICK FACTS
- **Type**: Modal dialog
- **State**: Complex (open/close, focus trap, return focus)
- **Keyboard**: Tab (focus trap), Escape to close
- **ARIA**: role="dialog", aria-modal, aria-labelledby, aria-describedby
- **Testing**: TIER 3

## WANTED STATE
✅ Focus trap (keep focus inside modal)  
✅ Return focus to trigger on close  
✅ Escape to close  
✅ Click outside to close (optional)  
✅ ARIA complete (dialog pattern)  
✅ Body scroll lock  
✅ Animation tokens  
✅ Dark mode  
✅ 85%+ coverage  

## STATE MANAGEMENT (TIER 3)
```typescript
const DynModal = ({ open, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus trap
      const firstFocusable = modalRef.current?.querySelector('[tabindex="0"]');
      (firstFocusable as HTMLElement)?.focus();
    } else {
      // Return focus
      previousFocusRef.current?.focus();
    }
  }, [open]);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
};
```

## FOCUS TRAP IMPLEMENTATION
```typescript
const useFocusTrap = (ref: RefObject<HTMLElement>, active: boolean) => {
  useEffect(() => {
    if (!active || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [active, ref]);
};
```

## ARIA PATTERN
```tsx
<div
  ref={modalRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content</p>
  <button onClick={onClose}>Close</button>
</div>
```

## TESTING (TIER 3)
- Focus trap (Tab wraps around)
- Return focus on close
- Escape to close
- Click outside to close
- Body scroll lock
- ARIA (role="dialog", aria-modal)
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 3 (focus trap)
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 3 (dialog)
- PATTERNS/03-State-Management-Pattern.md → TIER 3 (focus management)
- PATTERNS/04-Testing-Pattern.md → TIER 3
