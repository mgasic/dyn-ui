# DynUI — Funkcionalna specifikacija (3/3): Quality Gates, CI/CD i release proces

**Verzija:** 1.0  
**Datum:** 21. October 2025  
**Opis:** Definicija kvaliteta, automatizovana provera, release protokoli i odgovornosti.

---

## 1. Definition of Done (DoD)

Komponenta je **završena** kada su ispunjeni sledeći kriterijumi:

1) **Funkcionalnost**: svi zahtevi iz dokumenta 1/3 su implementirani.  
2) **API**: potpisan i dokumentovan (dokument 2/3).  
3) **Testovi**: unit ≥ 80%, play/e2e pokrivaju kritične tokove; svi prolaze.  
4) **A11y**: axe bez “serious/critical” nalaza; tastatura kompletna.  
5) **Vizuelno**: bez neželjenih promena u vizuelnim regresionim testovima.  
6) **Tipovi i lint**: `tsc --noEmit` i `eslint` bez grešaka.  
7) **Dokumentacija**: Storybook sa Controls, Docs i primerima.  
8) **Bundle budžeti**: neprekoračeni; paket tree‑shakeable.  

## 2. Quality gates (automatizacija)

**Gate A — statička analiza**

- ESLint (precommit i CI) — bez `error` nivoa.
- TypeScript `--noEmit` — 0 grešaka.
- Format (`prettier --check`) — prolaz.

**Gate B — testovi**

- Unit testovi sa pokrivenošću (globalno) ≥ 80% linija i 70% grana.
- Storybook interaction (“play”) testovi za scenarije tipa klik/fokus.
- E2E (po potrebi) za “happy path”.

**Gate C — pristupačnost**

- `@axe-core` skeniranje Storybook stranica — bez *serious/critical*.
- Ručna provera tastature i kontrasta za bar po jedan primer po varijanti.

**Gate D — vizuelna regresija**

- Chromatic/Playwright screenshot uporedni testovi; promene zahtevaju “review & approve”.

**Gate E — kontrakt**

- API snapshot test (npr. `tsd` / vlastiti validator) — bez lomljenja.
- “Public surface” lista fajlova; `changeset` za verzionisanje.

**Gate F — performanse i bundle**

- Build analiza (`webpack-bundle-analyzer` ili `@rollup/plugin-visualizer`).
- Budžeti: paket ≤ definisanih KB gzip; report u CI.

## 3. CI/CD (predlog pipeline-a)

- **Pre-merge (PR)**: Gates A–E obavezni, D uslovno (ako postoje vizuelne promene).
- **Main**: nakon spajanja, tag “next” release kandidata, objava storybook pregleda.
- **Release**:
  - SemVer kroz `changesets`.
  - Automatski changelog, Git tag i publikacija u registry (privatni ili public).
  - Generisanje Release Notes (sa sažetkom promena i uputstvom za migraciju).

## 4. Checkliste

**PR checklista**

- [ ] Zahtevi pokriveni; link na user story/issue.  
- [ ] Dodati/izmenjeni testovi i story-jevi.  
- [ ] A11y ručna provera (fokus, screen reader oznake).  
- [ ] Migraciona napomena (ako lomi API).  

**Release checklista**

- [ ] Svi gate-ovi u “green”.  
- [ ] Changelog generisan i pregledan.  
- [ ] Verzija ažurirana (`patch|minor|major`).  
- [ ] Storybook build deployovan.  

## 5. Odgovornosti (RACI)

- **Owner (R)**: komponent tim (dev + QA).  
- **Accountable (A)**: Tech Lead biblioteke.  
- **Consulted (C)**: Dizajn, Accessibility specijalista.  
- **Informed (I)**: Konsumerski timovi (aplikacije koje koriste DynUI).

## 6. Metrike kvaliteta

- Prosečno vreme od PR do merge-a.  
- Broj regresija po release-u.  
- Procenat komponenti sa potpunom tastaturnom podrškom.  
- Prolaznost gate‑ova po PR-u.  

## 7. Rizici i mitigacije

- **Brzo širenje API-ja** → zamrznuti API pre release-a, obavezni RFC za promene.  
- **Vizuelne razlike po temama** → automatizovani screenshot testovi za obe teme.  
- **A11y propusti** → uključiti “a11y champion”-a u review.  

---
