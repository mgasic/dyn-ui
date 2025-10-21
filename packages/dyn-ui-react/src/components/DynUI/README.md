# DynUI

`DynUI` is the design-system ready wrapper around `DynBox` that exposes a
polymorphic container with opinionated defaults and responsive spacing helpers.
It keeps the full layout API from `DynBox` while adding theme-aware tone
presets and shorthand responsive spacing tokens.

## When to use

Use `DynUI` when you need a semantic layout wrapper that:

- Renders with accessible defaults (`section` element, `lg` padding).
- Supports all standard spacing props (`p`, `px`, `py`, `m`, `gap`, …).
- Allows responsive overrides through breakpoint-aware tokens.
- Provides quick surface treatments via the `tone` prop without hand-tuning
  shadows, backgrounds, or borders.

## Basic usage

```tsx
import { DynUI } from '@dyn/ui-react';

export function MarketingSection() {
  return (
    <DynUI tone="elevated">
      <h2>Launch updates</h2>
      <p>Ship features faster with consistent spacing and theming.</p>
    </DynUI>
  );
}
```

## Responsive spacing

Each spacing prop accepts either a token (`'sm'`, `'lg'`, `'2xl'`, `'auto'`) or a
breakpoint object. Breakpoints map to `sm` (≥640px), `md` (≥768px), `lg`
(≥1024px), and `xl` (≥1280px).

```tsx
<DynUI
  p={{ base: 'sm', md: 'xl' }}
  mx={{ sm: 'auto', lg: 'xl' }}
  gap={{ base: 'sm', md: 'lg' }}
>
  <ContentGrid />
</DynUI>
```

The component proxies these values to `DynBox` and injects CSS variables so the
spacing adapts automatically at each breakpoint.

## Tone presets

`DynUI` ships with tone presets that configure background, text, borders, and
shadows. The presets are safe defaults—you can still pass explicit `bg`,
`backgroundColor`, `color`, `border`, or `shadow` props to override them.

| Tone      | Description                                           |
| --------- | ----------------------------------------------------- |
| `surface` | Inherits the default surface styling (no overrides).  |
| `muted`   | Muted surface with subtle border.                     |
| `elevated`| Surface background with elevated shadow treatment.    |
| `inverse` | High-contrast inverse surface and text colors.        |

```tsx
<DynUI tone="inverse" py={{ base: 'md', lg: 'xl' }}>
  <Heading level={2}>Status dashboard</Heading>
</DynUI>
```

## Types and defaults

- `DynUIProps` – complete prop contract including responsive spacing helpers.
- `ResponsiveSpacingValue` – union used by each spacing prop.
- `DynUITone` – union of available tone presets.
- `DYN_UI_DEFAULT_PROPS` – default configuration (`section`, `tone="surface"`,
  `p="lg"`, `data-testid="dyn-ui"`).

Since the implementation proxies to `DynBox`, all layout, flex, and grid props
from `DynBox` remain available.
