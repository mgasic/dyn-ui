# Toggle Group Pattern

The Theme Switcher introduced a lightweight `toggle-group` pattern that can be reused across
components that need segmented buttons (e.g. view switchers, format selectors).

## Implementation

- **Source:** `packages/dyn-ui-react/src/components/ThemeSwitcher/ThemeSwitcher.module.css`
- **Classes:**
  - `.toggleGroup` – wrapper that establishes shared layout, border, background and custom
    properties for paddings, font-size and radii.
  - `.toggleGroupButton` – base toggle button styling with state styles for hover, active and
    selected states driven by `[data-active="true"]`.
  - Modifier classes (`.sizeSm`, `.sizeMd`, `.roundedSm`, `.roundedMd`, `.roundedLg`, `.roundedFull`)
    adjust CSS custom properties so every child button inherits consistent spacing and radii.

The pattern relies exclusively on design tokens (`--dyn-…`) so it automatically adapts to theme
changes.

## Usage Guidelines

1. Wrap grouped buttons in an element with `styles.toggleGroup` and optional size/rounded modifiers.
2. Render each button with `styles.toggleGroupButton` and set `data-active="true"` on the selected
   item.
3. Consume the exposed `className`, `buttonClassName` and `activeButtonClassName` props to extend the
   styles when integrating into other components.

Because the layout is powered by CSS custom properties, downstream components can introduce new size
variants by extending the module and overriding `--theme-switcher-*` variables without duplicating
structural styles.
