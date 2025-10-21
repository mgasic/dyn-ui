# Design token distribution

The design token build pipeline now lives inside `@dyn-ui/react` and exposes the
same data in two ways:

- **TypeScript/JavaScript:** import from `@dyn-ui/react/tokens` to access the
  strongly-typed `tokens` object and helpers such as `cssVariables` and
  `buildCssCustomProperties()`.
- **CSS Custom Properties:** import `@dyn-ui/react/tokens.css` to register the
  canonical `--dyn-*` custom properties at `:root`.

Run `pnpm run build:tokens` inside `packages/dyn-ui-react` to rebuild the
artifacts whenever raw token JSON files change. The script reads the JSON files in
`src/tokens/raw/`, resolves aliases, and emits:

```
src/tokens/generated.ts
src/tokens/tokens.css
```

Both files are committed to the repository so that the package works without a
prepublish step.

## Token categories and mappings

| Category    | Token access (TS)               | CSS custom property prefix |
| ----------- | --------------------------------| -------------------------- |
| Spacing     | `tokens.spacing.<key>`          | `--dyn-spacing-<key>`      |
| Typography  | `tokens.typography.font.size.xs`| `--dyn-font-size-xs`       |
| Typography  | `tokens.typography.font.weight.bold` | `--dyn-font-weight-bold`|
| Typography  | `tokens.typography.line.height.tight`| `--dyn-line-height-tight`|
| Typography  | `tokens.typography.letter.spacing.tight` | `--dyn-letter-spacing-tight` |
| Colors      | `tokens.color.primary.default` | `--dyn-color-primary-default` |
| Colors      | `tokens.color.text.secondary`  | `--dyn-color-text-secondary` |
| Motion      | `tokens.motion.duration.normal`| `--dyn-duration-normal`    |
| Motion      | `tokens.motion.timing.standard`| `--dyn-timing-standard`    |

### Spacing usage updates

The following components now resolve spacing tokens through
`tokens.spacing` instead of hard-coded values:

- `DynBox`
- `DynUI`
- `DynContainer`
- `DynTreeNode`
- `DynComponentName`

Each component still emits CSS variables that reference `--dyn-spacing-*`, so
consumers can continue overriding spacing through custom properties.

### Typography tokens

Font family, size, weight, line-height, and letter-spacing scales are exposed via
`tokens.typography`. The generated CSS includes the matching custom properties,
which replace the fallback values that were previously embedded in component
styles.

### Color tokens

The consolidated color palette is surfaced through `tokens.color`. Aliases such
as `tokens.color.bg`, `tokens.color.bg-subtle`, and `tokens.color.bg-hover` map
back to the appropriate background/surface values while still emitting the
legacy `--dyn-color-bg*` variables.

### Motion tokens

Animation durations, easing curves, and transition presets are now centrally
defined under `tokens.motion`. Components should prefer the exported helpers
(e.g. `cssVariables['--dyn-duration-fast']`) instead of duplicating raw values.

## Helper utilities

`buildCssCustomProperties()` converts the generated token map into a CSS string,
while `tokenVar('--dyn-color-primary-default')` returns `var(--dyn-color-primary-default)`.
Both helpers allow build tools and runtime code to construct custom styles
without manually rebuilding the variable names.
