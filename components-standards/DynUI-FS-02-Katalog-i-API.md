# DynUI — Funkcionalna specifikacija (2/3): Katalog komponenti i API kontrakti

**Verzija:** 1.0  
**Datum:** 21. October 2025  
**Opis:** Formalni opis komponenti: svrha, minimalni API, događaji, stanja, tastatura i a11y, uz opšte smernice proširenja.

---

## 1. Smernice za API

- **Stabilnost**: promene koje lome kompatibilnost zahtevaju major verziju.
- **Imenovanje**: kratko i konzistentno (`onChange`, ne `onValueChanged`).
- **Prop drilling**: izbegavati; koristiti kontekste samo za temu i layout.
- **Slotovi**: `startIcon`, `endIcon`, `prefix`, `suffix` — jasno dokumentovani.
- **Data atribute**: `data-testid` i `data-state` za testiranje/stilizaciju.
- **Greške**: ne bacati iz render-a; vraćati stanja kroz propove.

## 2. Specifikacije po komponentama

### `DynAvatar`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynBadge`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** neutral, info, success, warning, danger

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynBox`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynBreadcrumb`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynBreadcrumbItem`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynButton`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynChart`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynCheckbox`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynComponentName`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynContainer`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynDatePicker`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynDivider`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynFieldContainer`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynGauge`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynGrid`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynIcon`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynInput`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynLabel`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynListItem`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynListView`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynMenu`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynMenuItem`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynMenuTrigger`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynModal`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynModalPlacement`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynNewComponent`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynPage`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynSelect`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynSelectOption`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynStep`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynStepper`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynTable`

**Kategorija:** Prikaz podataka / Status

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `children`
- `variant`
- `size`
- `color`
- `aria-label`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A (sem fokusibilnih delova)

**A11y zahtevi:**

- Semantika (npr. th/td, role="img" sa opisom)
- Kontrast i čitljivost

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynTabs`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynTextArea`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynToolbar`

**Kategorija:** Kontrola / Navigacija

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `disabled`
- `onClick`
- `aria-label`

**Događaji:**

- `onClick(event)`

**Stanja:** focused, hover, active, disabled, loading

**Tastatura:**

- Enter/Space — aktivacija
- Escape — zatvaranje (ako otvara overlay)
- Arrow — navigacija (Tabs/Menu)

**A11y zahtevi:**

- Ispravne `role` i `aria-*` atribute
- Vraćanje fokusa na trigger (Modal/Menu)

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynTreeNode`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynTreeView`

**Kategorija:** Form input

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `id`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `required`
- `onChange`
- `onBlur`
- `onFocus`
- `aria-describedby`
- `aria-invalid`

**Događaji:**

- `onChange(value)`
- `onFocus()`
- `onBlur()`

**Stanja:** focused, hover, disabled, readonly, error, loading

**Tastatura:**

- Tab/Shift+Tab — fokus
- Space/Enter — potvrda/otvaranje
- Escape — zatvaranje
- Arrow — kretanje

**A11y zahtevi:**

- Label povezan sa poljem
- Opis greške kroz `aria-describedby`
- Kontrast i fokus ring

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---

### `DynUI`

**Kategorija:** Layout / Ostalo

**Svrha (sažetak):** _{cat} komponenta u okviru DynUI._

**Minimalni API (MVP):**

- `as`
- `children`
- `gap`
- `p`
- `m`

**Događaji:** N/A

**Stanja:** N/A

**Tastatura:**

- N/A

**A11y zahtevi:**

- Semantički wrapper bez narušavanja hijerarhije

**Proširenja (opciono):**

- `size` (`sm|md|lg`)
- `variant` (npr. `solid|outline|ghost`)
- `startIcon`/`endIcon` (gde je primenjivo)

---
