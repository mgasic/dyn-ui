# DynUI — Funkcionalna specifikacija (1/3): Audit i zahtevi po komponentama

**Verzija:** 1.0  
**Datum:** 21. October 2025  
**Opis:** Pregled biblioteke, ciljevi, opseg, standardi i sažeti funkcionalni zahtevi po grupama i komponentama.

---

## 1. Uvod

**Cilj.** Ova specifikacija pretvara postojeću tehničku dokumentaciju i kod u *funkcionalne zahteve* za DynUI biblioteku komponenti, kako bi dizajn, razvoj, testiranje i integracija mogli da rade na zajedničkom, proverljivom osnovu.

**Opseg.** Front-end React/TypeScript komponente i prateći pomoćni elementi (stilovi, theming, internacionalizacija, a11y). Back-end servisi, deployment okruženja i poslovna logika van UI sloja su van opsega.

**Principi.**

- **Konzistentnost** (API i UI obrazci).
- **Pristupačnost** (WCAG 2.2 AA minimum).
- **Internacionalizacija** (i18n, RTL).
- **Performanse** (lazily load, memo, minimalan bundle).
- **Testabilnost** (kontrakti i test slučajevi pre implementacije).

## 2. Glosar i skraćenice

- **A11y** — pristupačnost (Accessibility).  
- **DoD** — Definition of Done.  
- **NFR** — nefunkcionalni zahtevi.  
- **Tokeni** — dizajn tokeni (boje, spacing, tipografija).  

## 3. Arhitektura i konvencije

- React + TypeScript, `forwardRef`, **controlled/uncontrolled** obrasci gde je primenjivo.
- Svi interaktivni elementi moraju imati *vidljiv fokus*, `disabled` i `loading` stanja.
- Konvencije propova: `size`, `variant`, `color`, `as`, `id`, `name`, `value`, `defaultValue`, `disabled`, `required`, `aria-*`, `data-*`.
- Tematizacija: CSS varijable/tokens + mogućnost promene teme (svetla/tamna) u runtime-u.
- Internacionalizacija: tekstovi preko provajdera (`i18n`), format datuma/brojeva lokalno.
- Pristupačnost: tastaturna navigacija (Tab/Shift+Tab/Enter/Space/Escape/Arrow ključevi), ARIA role/atributi prema WAI-ARIA Authoring Practices.

## 4. Pregled komponenti (katalog)

### Form inputi

| Komponenta | Svrha (kratko) | Primarne radnje | A11y minimum | Integracija sa formama |
|---|---|---|---|---|
| `DynCheckbox` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |
| `DynDatePicker` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |
| `DynInput` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |
| `DynSelect` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |
| `DynSelectOption` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |
| `DynTextArea` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |
| `DynTreeView` | Unos ili izbor vrednosti | Fokus, unos, promena, validacija | Label, opis, error role/status, tastaturna navigacija | Da (name, value, onChange) |

### Kontrole i akcije

| Komponenta | Svrha (kratko) | Primarne radnje | A11y minimum | Integracija sa formama |
|---|---|---|---|---|
| `DynBreadcrumb` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynBreadcrumbItem` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynButton` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynMenu` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynMenuItem` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynMenuTrigger` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynModal` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynModalPlacement` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynStepper` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynTabs` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |
| `DynToolbar` | Pokretanje akcije / navigacija | Klik/Enter/Space; otvaranje/zatvaranje; promene fokusa | role, aria-*; fokus; escape/enter/space | N/A |

### Layout i kontejneri

| Komponenta | Svrha (kratko) | Primarne radnje | A11y minimum | Integracija sa formama |
|---|---|---|---|---|
| `DynBox` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynContainer` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynFieldContainer` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynGrid` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynPage` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |

### Ostalo

| Komponenta | Svrha (kratko) | Primarne radnje | A11y minimum | Integracija sa formama |
|---|---|---|---|---|
| `DynComponentName` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynLabel` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynListItem` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynListView` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynNewComponent` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynStep` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynTreeNode` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |
| `DynUI` | Strukturiranje layout-a / ostalo | N/A | Semantički wrapper, bez smetnji | N/A |

### Prikaz podataka

| Komponenta | Svrha (kratko) | Primarne radnje | A11y minimum | Integracija sa formama |
|---|---|---|---|---|
| `DynAvatar` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |
| `DynBadge` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |
| `DynChart` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |
| `DynDivider` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |
| `DynGauge` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |
| `DynIcon` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |
| `DynTable` | Prikaz informacija / statusa | Sortiranje/scroll (po potrebi), fokusibilni elementi | Semantika, kontrast, oznake zaglavlja | N/A |

## 5. Ukupni funkcionalni zahtevi po grupama

### 5.1 Form inputi

- **Label i pomoćni tekst**: eksplicitno u DOM-u (`<label for=...>` ili `aria-labelledby`).
- **Validacija**: sinhrona i asinhrona; stanja `valid`, `invalid`, `warning`; poruka vezana za `aria-describedby`.
- **Stanja**: `focused`, `hover`, `disabled`, `readonly`, `error`, `loading`, (po potrebi `indeterminate`).
- **Form integracija**: kompatibilno sa `react-hook-form` i nativnim `<form>` submit-om.
- **Tastatura**: Enter/Space/Arrow za izbor; Escape zatvara listu/modal; Home/End skok.

### 5.2 Kontrole i akcije

- **Button**: varijante `primary`, `secondary`, `tertiary`, `danger`; veličine `sm|md|lg`; icon-only mod sa `aria-label`.
- **Modal/Dialog**: fokus trap, ESC za zatvaranje, `aria-modal="true"`, vraćanje fokusa na `trigger`.
- **Tabs**: `role="tablist"`, `tabindex`, kretanje strelicama; *lazy* mount po tabu (konfigurisano).
- **Menu**: otvaranje po `click` ili `Enter/Space`; zatvaranje klikom van/ESC; fokus se kreće strelicama.

### 5.3 Prikaz podataka

- **Table**: opcioni sticky header, sort po koloni (taster Enter), `scope="col"`, `aria-sort`, prazna stanja.
- **Chart/Gauge**: tekstualna alternativa (opis), minimalni kontrast boja, opcioni `aria-live` za promene.
- **Badge/Avatar**: veličine i kontrasti definisani tokenima.

### 5.4 Layout i kontejneri

- `Box/Container/Page`: semantički wrapper (`as` prop), responsive props (npr. `gap`, `p`, `m`), bez nepredviđenih side‑effect‑a.

## 6. Detaljni zahtevi za ključne komponente

1) **DynButton**  

- Primarne radnje: klik ili Enter/Space; `loading` state blokira duple submit-e.  
- Onemogućeno: `disabled` uklanja iz tab order-a i odbija evente.  
- Ikonice: `startIcon`/`endIcon`; za icon-only obavezno `aria-label`.  
- DoD: snapshot vizuelni testovi za sve varijante/veličine (svetla/tamna tema); unit testovi za onClick i disabled.

2) **DynCheckbox**  

- Tri stanja: `checked`, `unchecked`, `indeterminate` (sa vizuelnim indikatorom i `aria-checked="mixed"`).  
- Tastatura: Space toggle; u grupi kretanje strelicama.  
- DoD: fokus ring, label klik toggluje stanje, a11y provereno (axe: bez ozbiljnih problema).

3) **DynInput**  

- Controlled/uncontrolled, `type` (`text|email|number|password`...), `maxLength`, `prefix/suffix` slotovi.  
- Validacija: sinhrona (regex, required) + asinhrona (npr. provera zauzetosti).  
- DoD: čitljivog kontrasta placeholder, ime polja i greška povezani.

4) **DynSelect**  

- Otvaranje na klik/Enter/ArrowDown; zatvaranje na ESC ili klik van.  
- Tastatura: slovo pretraga, Home/End, PageUp/PageDown za skokove.  
- A11y: Combobox pattern (`role="combobox"` ili `listbox` prema varijanti).  

5) **DynModal**  

- Fokus trap; pozadina inertna; zatvaranje ESC‑om i klikom na overlay (konfigurisano).  
- Vraćanje fokusa na trigger nakon zatvaranja.  

6) **DynTable**  

- Sortiranje, prazna stanja, paginacija (po potrebi), `aria-describedby` za pomoćni tekst.  
- Minimalna veličina klika 44×44 px za kontrole u tabeli.

> *Napomena*: Za ostale komponente primeniti iste obrasce; detalji API-ja definisani su u dokumentu 2/3.

## 7. Nefunkcionalni zahtevi (NFR)

- **Performanse**: svaka komponenta bezopterećujuća; inicijalni render < 16ms u proseku (lokalno).  
- **Bundle**: tree-shakeable; size budžeti po paketu (npr. ≤ 50 KB gzip po grupi).  
- **Pristupačnost**: WCAG 2.2 AA; bez axe “serious/critical” nalaza.  
- **Teme**: svetla/tamna obavezne; kontrast ≥ 4.5:1 za tekst.  
- **Dokumentacija**: Storybook sa kontrolama, primerima i “Play” testovima.

## 8. Zavisnosti i redosled implementacije

1) Osnova: tokeni, tipografija, boje, spacing.  
2) Jezgro: `DynButton`, `DynInput`, `DynCheckbox`, `DynSelect`.  
3) Kontejneri: `DynModal`, `DynTabs`, `DynMenu`, `DynToolbar`.  
4) Složeni prikaz: `DynTable`, `DynChart`, `DynTreeView`.  
5) Ostalo: `Avatar`, `Badge`, `Divider`, itd.

## 9. Prihvatanje i testiranje (DoD)

- Jedinični testovi ≥ 80% *linija/grananja* za jezgro.  
- Tip proveravanje (`tsc --noEmit`) bez greške.  
- Lint (`eslint`) bez greške (warn dozvoljen samo za TODO).  
- A11y (axe) bez “serious/critical”.  
- Vizuelna regresija (Chromatic/Playwright) bez promena ili uz odobrenje.  
- API kontrakt potpisan (videti dokument 2/3).  
- Checklista releasa (videti dokument 3/3).

---
