# dyn-ui — Kompletno rešenje (TS-first, design-tokens, Storybook, skripte)

Ovaj paket sadrži **sve što treba za normalan rad** biblioteke i Storybook-a, uz **jedinstven izvor istine** —
postojeći `design-tokens` (isti koji koristi *DynButton*). Ako `design-tokens` nije prisutan, koristi se *fallback* tema.

## Sadržaj (glavne stavke)
- **Runtime tema/tokens (bridge ka design-tokens):**
  - `packages/dyn-ui-react/src/theme/bridge/themeLoader.design-tokens.ts` — dinamičko učitavanje tema iz `design-tokens/themes/*`
  - `packages/dyn-ui-react/src/theme/bridge/normalize.ts` — usklađivanje naziva grupa (`space→spacing`, `radii→radius`, …)
  - `packages/dyn-ui-react/src/theme/applyCssVars.ts` — generiše CSS varijable; prefiks preuzima iz `design-tokens/config` (ako postoji)
  - `packages/dyn-ui-react/src/theme/ThemeProvider.tsx` — koristi **bridge loader**, primenjuje CSS varijable u runtime-u i podržava `light`/`dark`/`high-contrast`
  - `packages/dyn-ui-react/src/system/sx.ts` — `sx` API (propovi su **ključevi tokena** → `var(--...)`)

- **I18n i formatiranje:**
  - `packages/dyn-ui-react/src/i18n/I18nProvider.tsx` — globalni provider sa pluralizacijom, Intl formatiranjem i RTL mirroring-om
  - `packages/dyn-ui-react/src/i18n/I18nProvider.test.tsx` — validira plural rules i ažuriranje `dir/lang` atributa

- **Komponente i primeri:**
  - `ThemeSwitcher` (runtime promena teme, oslanja se na tokene)
  - `DynBox` primer (`sx` showcase)
  - `DynAvatar.stories.tsx` — sređen story

- **Storybook:**
  - `.storybook/preview.tsx` — toolbar za izbor teme (`getAvailableThemes()` iz design-tokens), globalni dekorator

- **TS-first alatke:**
  - `scripts/create-barrels.ts` — kreira `index.ts` (barrels) za komponente
  - `scripts/fix-icon-provider-imports.ts` — normalizuje `IconDictionaryProvider` import
  - `scripts/verify-stories.ts` — sanity (provider import, Avatar `name` prop, raw px/hex u args, missing barrels)
  - `scripts/token-verify.ts` — **oslanjanje na token** validacija (učita *jednu* temu iz `design-tokens` — `light` ako postoji, inače prvu)
  - `scripts/token-fix-stories.ts` — auto-mapiranje raw vrednosti na **ključeve tokena** (samo *stories*)
  - `scripts/scan-hardcoded-styles.ts` — traži px/rem/hex u source-u koji nisu pokriveni tokenima/CSS var

- **Fallback teme (za nove projekte / lokalni test):**
  - `packages/dyn-ui-react/src/theme/themes/light.json`
  - `packages/dyn-ui-react/src/theme/themes/dark.json`

> **Napomena**: Ako već imaš `packages/dyn-ui-react/src/design-tokens/*`, bridge će koristiti **njih** i fallback neće biti potreban.

## Instalacija (kratko)
```bash
pnpm add -D tsx @types/node

# Barrels + import fix
pnpm tsx scripts/create-barrels.ts
pnpm tsx scripts/fix-icon-provider-imports.ts

# (opciono) auto-fix storija na token ključeve
pnpm tsx scripts/token-fix-stories.ts

# Validacije
pnpm tsx scripts/token-verify.ts
pnpm tsx scripts/verify-stories.ts
pnpm tsx scripts/scan-hardcoded-styles.ts

# Storybook
rm -rf node_modules/.vite
pnpm run storybook
```
