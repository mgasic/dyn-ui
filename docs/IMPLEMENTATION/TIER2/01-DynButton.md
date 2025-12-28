# DynButton - Enterprise Implementation Guide

**TIER**: 2 | **Complexity**: MEDIUM | **Timeline**: 3-4 days

---

## 1. QUICK FACTS

- **Type**: Interactive button
- **State**: Controlled (disabled, loading states)
- **Keyboard**: Tab, Enter, Space
- **ARIA**: role="button", aria-label, aria-disabled, aria-busy
- **Testing**: TIER 2 (state + keyboard + jest-axe)
- **Dark Mode**: ✅ Required

---

## 2. CURRENT vs WANTED STATE

### ✅ Exists
- Basic button component
- Primary/secondary variants
- Size tokens (sm, md, lg)

### ❌ Missing
- All variants (ghost, danger, success)
- Loading state with spinner
- Icon support (leading/trailing)
- State suffixes (-hover, -active, -focus, -disabled)
- Full keyboard + ARIA support

**Completeness**: 65%

---

## 3. WANTED STATE

✅ All variants: primary, secondary, ghost, danger, success  
✅ All sizes: xs, sm, md, lg, xl  
✅ Loading state with spinner icon  
✅ Icon support (leading/trailing)  
✅ Full keyboard support (Tab, Enter, Space)  
✅ Complete ARIA (role, aria-label, aria-disabled, aria-busy)  
✅ Dark mode + high contrast  
✅ 80%+ test coverage  

---

## 4. IMPLEMENTATION

### 4.1 Token Template

```css
.button {
  /* COLOR TOKENS - PRIMARY */
  --dyn-button-bg-primary: var(--dyn-color-primary), var(--legacy-color-primary), #2563eb;
  --dyn-button-text-primary: var(--dyn-color-white), var(--legacy-color-white), #ffffff;
  --dyn-button-bg-primary-hover: var(--dyn-color-primary-hover), var(--legacy-color-primary-90), #1e3a8a;
  --dyn-button-bg-primary-active: var(--dyn-color-primary-active), var(--legacy-color-primary-80), #1e40af;
  --dyn-button-bg-primary-disabled: var(--dyn-color-disabled), var(--legacy-color-disabled), #9ca3af;

  /* SIZES */
  --dyn-button-padding-xs: var(--dyn-spacing-xs), var(--legacy-spacing-xs), 4px 8px;
  --dyn-button-padding-sm: var(--dyn-spacing-sm), var(--legacy-spacing-sm), 6px 12px;
  --dyn-button-padding-md: var(--dyn-spacing-md), var(--legacy-spacing-md), 8px 16px;
  --dyn-button-padding-lg: var(--dyn-spacing-lg), var(--legacy-spacing-lg), 12px 24px;
  --dyn-button-padding-xl: var(--dyn-spacing-xl), var(--legacy-spacing-xl), 16px 32px;

  /* DARK MODE */
  @media (prefers-color-scheme: dark) {
    --dyn-button-bg-primary: var(--dyn-color-primary-dark), #1e3a8a;
  }
}
```

### 4.2 Props & Types

```typescript
export interface DynButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
}

export const DynButton = React.forwardRef<HTMLButtonElement, DynButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconPosition = 'leading', ...props }, ref) => (
    <button
      ref={ref}
      className={`button button--${variant} button--${size}`}
      aria-busy={loading}
      aria-disabled={props.disabled}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && icon && iconPosition === 'leading' && icon}
      {props.children}
      {!loading && icon && iconPosition === 'trailing' && icon}
    </button>
  )
);
```

### 4.3 Testing (TIER 2)

Reference: `PATTERNS/04-Testing-Pattern.md` → TIER 2

```typescript
describe('DynButton', () => {
  test('renders with children', () => {
    render(<DynButton>Click me</DynButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('applies variant class', () => {
    const { container } = render(<DynButton variant="danger">Delete</DynButton>);
    expect(container.querySelector('.button--danger')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const onClick = jest.fn();
    render(<DynButton onClick={onClick}>Click</DynButton>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('supports keyboard activation (Enter)', () => {
    const onClick = jest.fn();
    render(<DynButton onClick={onClick}>Press Enter</DynButton>);
    fireEvent.keyDown(screen.getByText('Press Enter'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalled();
  });

  test('supports keyboard activation (Space)', () => {
    const onClick = jest.fn();
    render(<DynButton onClick={onClick}>Press Space</DynButton>);
    fireEvent.keyDown(screen.getByText('Press Space'), { key: ' ' });
    expect(onClick).toHaveBeenCalled();
  });

  test('disables interaction when disabled', () => {
    const onClick = jest.fn();
    render(<DynButton disabled onClick={onClick}>Disabled</DynButton>);
    fireEvent.click(screen.getByText('Disabled'));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('shows loading state', () => {
    render(<DynButton loading>Loading</DynButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<DynButton>Button</DynButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 4.4 Storybook Stories

```typescript
export default {
  title: 'Components/TIER2/DynButton',
  component: DynButton,
};

export const Primary = () => <DynButton variant="primary">Primary</DynButton>;
export const Secondary = () => <DynButton variant="secondary">Secondary</DynButton>;
export const Ghost = () => <DynButton variant="ghost">Ghost</DynButton>;
export const Danger = () => <DynButton variant="danger">Delete</DynButton>;
export const Loading = () => <DynButton loading>Loading...</DynButton>;
export const WithIcon = () => <DynButton icon={<Icon />}>With Icon</DynButton>;
export const AllSizes = () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <DynButton size="xs">XS</DynButton>
    <DynButton size="sm">SM</DynButton>
    <DynButton size="md">MD</DynButton>
    <DynButton size="lg">LG</DynButton>
    <DynButton size="xl">XL</DynButton>
  </div>
);
```

---

## 5. ENTERPRISE CHECKLIST (TIER 2)

Reference: `PATTERNS/05-Enterprise-Checklist.md` → TIER 2

- [ ] TypeScript strict mode, no `any`
- [ ] All tokens follow `--dyn-button-*` pattern with 3-level fallbacks
- [ ] Dark mode tokens defined and tested
- [ ] All variants implemented (primary, secondary, ghost, danger, success)
- [ ] All sizes implemented (xs, sm, md, lg, xl)
- [ ] Loading state with aria-busy
- [ ] Disabled state with aria-disabled
- [ ] Keyboard support (Tab, Enter, Space)
- [ ] ARIA attributes (role="button", aria-label)
- [ ] jest-axe tests pass
- [ ] All state changes tested (click, keyboard, loading, disabled)
- [ ] 80%+ test coverage
- [ ] Storybook stories for all variants + dark mode
- [ ] JSDoc comments
- [ ] No hardcoded colors/sizes

---

## 6. REFERENCES

- `00-MASTER-TEMPLATE.md` - Structure reference
- `PATTERNS/01-Keyboard-Navigation-Pattern.md` - TIER 2 keyboard (Tab, Enter, Space)
- `PATTERNS/02-ARIA-Attributes-Pattern.md` - TIER 2 ARIA
- `PATTERNS/03-State-Management-Pattern.md` - TIER 2 state patterns
- `PATTERNS/04-Testing-Pattern.md` - TIER 2 test template
- `PATTERNS/05-Enterprise-Checklist.md` - TIER 2 checklist

---

**Status**: ✅ GUIDE READY FOR IMPLEMENTATION
