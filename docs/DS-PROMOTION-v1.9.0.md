# RFC — Promoción al Naowee Design System v1.9.0

> Patrones madurados en IVC (v1.3 → v1.13.59) candidatos a entrar al repo
> canónico `naowee-tech/naowee-design-system` como **v1.9.0**, para que TODO
> proyecto futuro los herede vía CDN sin copiar/pegar.
>
> Referencia de cada patrón: ver `DESIGN-PATTERNS.md`.

## Por qué
Hoy estos refinamientos viven como overrides en `prototype/shared/*.css`, JS inline
y reglas por página. Cada proyecto nuevo los re-implementaría. Al promoverlos al DS
se convierten en la base — IVC deja de necesitar los overrides.

## Componentes / utilidades a promover

### A. Estados de componentes (CSS, bajo riesgo) — empezar por acá
- [ ] **Textfield focus** canónico: `__input-wrap:focus-within` → borde `--accent` + `0 0 0 3px rgba(215,64,9,.15)`. (§3.1)
- [ ] **Checkbox** check svg canónico (`viewBox 24 24`, `points 20 6 9 17 4 12`, white, w3). (§3.2)
- [ ] **Message** `__content { gap: 3px }` (hoy DS trae 16px → demasiado aire). (§3.5)
- [ ] **Table-card header** = barra redondeada 4 esquinas, sin divider inferior. (§3.4)
- [ ] **Hover row** `#fafbfd` (unificar; hoy varía por página).

### B. Patrones responsive (CSS + convención) — medio
- [ ] **Tabla → stacked cards** (listados): mixin/utilidad `data-responsive-table`. (§2.3)
- [ ] **Repeatable → cards etiquetadas** + helper `labelRepeatableCells()`. (§2.3/§3.7)
- [ ] **Bottom-sheet de popovers** (dropdown/datepicker) en mobile + backdrop `:has()`. (§2.5)
- [ ] **Modal → bottom-sheet** mobile (`ivcMobileSheetIn`). (§2.6)
- [ ] **Tabs scroll horizontal**. (§2.4)
- [ ] **Cards edge-to-edge** + breakpoints 639/1023/1024. (§2.2)

### C. Layout / shell (requiere alinear con el shell del DS) — mayor
- [ ] **Sidebar drawer off-canvas** + trigger + backdrop + labels en drawer. (§2.1)
- [ ] **Footer pill** con scroll-hide en **capture phase** (host `.page` o `window`). (§3.8)
- [ ] **Stepper**: dinámico por contexto + **skeleton** de pasos restantes. (§3.6)

### D. Componentes nuevos
- [ ] **`.ivc-timeline`** (histórico con dots semánticos). (§3.9)
- [ ] **Avatares determinísticos** (paleta p1-p8 por hash). (§1.3)
- [ ] **Trazabilidad tree** (relación padre→hijo). (§3.10) — quizá específico de IVC, evaluar.

### E. Tokens
- [ ] Confirmar semánticos en el DS: `--accent`, `--purple` (trazabilidad), semáforo plazo, `--orange-bg`, paleta avatares.

## Plan de ejecución sugerido
1. **v1.9.0**: bloque A (estados, bajo riesgo, no rompe nada existente).
2. **v1.9.x**: bloque B (responsive utilities) + tokens (E).
3. **v1.10.0**: bloque C (shell/footer/stepper — cambios estructurales) + D.

## Criterios de aceptación por PR
- Sin breaking changes en componentes existentes del DS.
- Animar solo `transform`/`opacity`; respetar `prefers-reduced-motion`.
- Documentar cada componente en el playground del DS.
- Tras promover: **eliminar el override equivalente** en `prototype/shared/` y bumpear el CDN consumido (`@v1.9.0`).

## Estado
- [ ] Catálogo de patrones (Capa 1) — ✅ `DESIGN-PATTERNS.md`
- [ ] Kit starter (Capa 2) — `STARTER-KIT.md`
- [ ] Promoción al DS (Capa 3) — este RFC, pendiente de ejecutar en el repo del DS
