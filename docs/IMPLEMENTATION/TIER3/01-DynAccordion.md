# DynAccordion - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 5-6 days

---

## 1. QUICK FACTS

- **Type**: Collapsible sections (accordion)
- **State**: Complex (multiple panel states, single/multi expand modes)
- **Keyboard**: Tab, Enter, Space, Arrow keys, Home, End
- **ARIA**: role="region", aria-expanded, aria-controls, aria-labelledby
- **Testing**: TIER 3 (complex state + keyboard + focus)
- **Dark Mode**: ✅ Required

---

## 2. CURRENT vs WANTED STATE

### ✅ Exists
- Basic accordion structure
- Single expand mode

### ❌ Missing
- Multi-expand mode
- Full keyboard navigation (Arrow keys, Home, End)
- ARIA complete (aria-controls, aria-labelledby)
- Focus management
- Animation tokens

**Completeness**: 55%

---

## 3. WANTED STATE

✅ Single expand + multi-expand modes  
✅ Full keyboard navigation (Arrow keys, Home, End)  
✅ ARIA complete (accordion pattern)  
✅ Smooth expand/collapse animations  
✅ Focus management  
✅ Dark mode  
✅ 85%+ test coverage  

---

## 4. IMPLEMENTATION

### 4.1 State Management (TIER 3)

Reference: `PATTERNS/03-State-Management-Pattern.md` → TIER 3

```typescript
type AccordionState = {
  expandedPanels: Set<string>;
};

type AccordionAction =
  | { type: 'TOGGLE_PANEL'; id: string }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL' };

function accordionReducer(state: AccordionState, action: AccordionAction): AccordionState {
  switch (action.type) {
    case 'TOGGLE_PANEL':
      const newExpanded = new Set(state.expandedPanels);
      if (newExpanded.has(action.id)) {
        newExpanded.delete(action.id);
      } else {
        newExpanded.add(action.id);
      }
      return { ...state, expandedPanels: newExpanded };
    // ... other cases
  }
}

export const DynAccordion = ({ allowMultiple, children }) => {
  const [state, dispatch] = useReducer(accordionReducer, { expandedPanels: new Set() });
  // ...
};
```

### 4.2 Keyboard Navigation (TIER 3)

Reference: `PATTERNS/01-Keyboard-Navigation-Pattern.md` → TIER 3

```typescript
const handleKeyDown = (e: React.KeyboardEvent, panelId: string) => {
  switch (e.key) {
    case 'ArrowDown':
      focusNextPanel();
      break;
    case 'ArrowUp':
      focusPreviousPanel();
      break;
    case 'Home':
      focusFirstPanel();
      break;
    case 'End':
      focusLastPanel();
      break;
    case 'Enter':
    case ' ':
      dispatch({ type: 'TOGGLE_PANEL', id: panelId });
      break;
  }
};
```

### 4.3 Token Template

```css
.accordion {
  --dyn-accordion-border: var(--dyn-color-border), #d1d5db;
  --dyn-accordion-header-bg: var(--dyn-color-bg), #ffffff;
  --dyn-accordion-header-bg-hover: var(--dyn-color-hover), #f3f4f6;
  --dyn-accordion-panel-bg: var(--dyn-color-white), #ffffff;
  --dyn-accordion-animation-duration: var(--dyn-transition-normal), 200ms;
}
```

### 4.4 ARIA Pattern (TIER 3)

Reference: `PATTERNS/02-ARIA-Attributes-Pattern.md` → TIER 3

```tsx
<div className="accordion">
  <h3>
    <button
      id={`accordion-header-${id}`}
      aria-expanded={isExpanded}
      aria-controls={`accordion-panel-${id}`}
      onClick={() => dispatch({ type: 'TOGGLE_PANEL', id })}
    >
      {title}
    </button>
  </h3>
  <div
    id={`accordion-panel-${id}`}
    role="region"
    aria-labelledby={`accordion-header-${id}`}
    hidden={!isExpanded}
  >
    {content}
  </div>
</div>
```

### 4.5 Testing (TIER 3)

Reference: `PATTERNS/04-Testing-Pattern.md` → TIER 3

```typescript
describe('DynAccordion (TIER 3)', () => {
  test('single expand mode - collapses others when expanding', () => {
    render(
      <DynAccordion allowMultiple={false}>
        <AccordionPanel id="1" title="Panel 1">Content 1</AccordionPanel>
        <AccordionPanel id="2" title="Panel 2">Content 2</AccordionPanel>
      </DynAccordion>
    );
    
    fireEvent.click(screen.getByText('Panel 1'));
    expect(screen.getByText('Content 1')).toBeVisible();
    
    fireEvent.click(screen.getByText('Panel 2'));
    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.getByText('Content 1')).not.toBeVisible();
  });

  test('multi expand mode - keeps others open', () => {
    render(
      <DynAccordion allowMultiple={true}>
        <AccordionPanel id="1" title="Panel 1">Content 1</AccordionPanel>
        <AccordionPanel id="2" title="Panel 2">Content 2</AccordionPanel>
      </DynAccordion>
    );
    
    fireEvent.click(screen.getByText('Panel 1'));
    fireEvent.click(screen.getByText('Panel 2'));
    
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  test('keyboard navigation - Arrow Down focuses next panel', () => {
    render(<DynAccordion>...</DynAccordion>);
    const firstHeader = screen.getByText('Panel 1');
    firstHeader.focus();
    
    fireEvent.keyDown(firstHeader, { key: 'ArrowDown' });
    expect(screen.getByText('Panel 2')).toHaveFocus();
  });

  test('keyboard navigation - Home focuses first panel', () => {
    render(<DynAccordion>...</DynAccordion>);
    const lastHeader = screen.getByText('Panel 3');
    lastHeader.focus();
    
    fireEvent.keyDown(lastHeader, { key: 'Home' });
    expect(screen.getByText('Panel 1')).toHaveFocus();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<DynAccordion>...</DynAccordion>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## 5. ENTERPRISE CHECKLIST (TIER 3)

Reference: `PATTERNS/05-Enterprise-Checklist.md` → TIER 3

- [ ] TypeScript strict mode
- [ ] useReducer for state management
- [ ] Full keyboard support (Arrow keys, Home, End, Enter, Space)
- [ ] ARIA complete (role, aria-expanded, aria-controls, aria-labelledby)
- [ ] Focus management (focus trap if needed)
- [ ] Single + multi expand modes
- [ ] Animation tokens
- [ ] Dark mode tokens
- [ ] All state transitions tested
- [ ] All keyboard interactions tested
- [ ] jest-axe tests pass
- [ ] 85%+ coverage
- [ ] Storybook stories for all modes

---

## 6. REFERENCES

- `PATTERNS/01-Keyboard-Navigation-Pattern.md` → TIER 3 (FULL)
- `PATTERNS/02-ARIA-Attributes-Pattern.md` → TIER 3 (accordion pattern)
- `PATTERNS/03-State-Management-Pattern.md` → TIER 3 (useReducer)
- `PATTERNS/04-Testing-Pattern.md` → TIER 3
- `PATTERNS/05-Enterprise-Checklist.md` → TIER 3

---

**Status**: ✅ GUIDE READY FOR IMPLEMENTATION
