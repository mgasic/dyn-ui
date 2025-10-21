# Dyn UI API Guidelines

These guidelines define the minimum API surface guarantees for Dyn UI components. They are
codified via the shared `eslint-plugin-dyn-ui` rule set so teams can rely on automated
feedback when building or reviewing components.

## Change handler naming

* Event handler props that surface change events **must be exposed as named functions**.
* When wiring JSX, provide a stable reference such as `handleValueChange` or forward an
  inherited `onChange` prop. Inline lambdas hide intent, create avoidable renders and make
  usage harder to document.
* The `dyn-ui/enforce-onchange-handler-name` rule flags inline handlers and requires
  handler identifiers that match `handle*Change`/`on*Change` conventions.

```tsx
// ✅ preferred
const handleFilterChange = useCallback((value: string) => setFilter(value), []);
<DynInput onChange={handleFilterChange} />;

// ❌ discouraged – reported by the linter
<DynInput onChange={(value) => setFilter(value)} />;
```

## Testing hooks (`data-testid`)

* Every exported Dyn component must accept a `'data-testid'` prop and attach it to the
  rendered root so consumers have a deterministic selector.
* The `dyn-ui/require-data-testid` rule verifies that components destructure the
  `'data-testid'` prop and forward it to their JSX.
* Prefer `data-testid` over bespoke attributes when writing new tests or examples.

```tsx
export const DynBadge = forwardRef<DynBadgeRef, DynBadgeProps>(({ 'data-testid': testId, ...rest }, ref) => {
  return <span data-testid={testId ?? 'dyn-badge'} {...rest} />;
});
```

## Prop drilling

* Avoid forwarding opaque prop bags (`...props`, `...rest`) into nested components. This
  quickly erodes type safety and creates hidden coupling between layers.
* The `dyn-ui/no-prop-drilling` rule warns when a component spreads a props object into a
  child JSX element. Prefer explicit props, context or dedicated composition helpers.

```tsx
// ✅ explicit API
<DynMenuItem label={label} onPress={onItemPress} />

// ❌ reported – forwards every prop to the child component
<DynMenuItem {...props} />
```

## Slot props and schematic tests

* Components that expose slot props such as `startIcon`, `endIcon`, `prefix` or `suffix`
  **must include tests** proving the slot is rendered and accessible.
* Add lightweight schematic tests in the component's test suite to render the slot and
  assert that it appears in the DOM with the expected semantics (e.g. `aria-hidden`).

Keeping these rules in sync with the codebase ensures new contributors understand the
expected API contract and that Storybook documentation always reflects the tested surface.
