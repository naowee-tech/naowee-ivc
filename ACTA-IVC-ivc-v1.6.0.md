# ACTA · Naowee IVC · ivc-v1.6.0

> Handoff de `ivc-v1.6.0` — Modal "Ver detalle del trámite" del Coordinador refinado: 5 fixes de UX según feedback Doug.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.6.0` |
| Fecha | 2026-05-26 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.6.0 |

## Cambios principales

### 🪟 Modal "Ver detalle del trámite" · 5 fixes (feedback Doug)

| # | Feedback | Fix aplicado |
|---|---|---|
| 1 | Tabs pegados al borde del modal | `max-width: 1200 → 1320px` + padding lateral del wrapper de 24px → **32px** |
| 2 | "Los tabs no son los del DS, no inventes estilos hardcodeados" | Removidos todos los `!important` que reseteaban `background`, `background-color`, `box-shadow`, `border`, `border-radius` y `color` sobre `.naowee-tab`. Ahora el wrapper sólo aporta padding y surface bg; los tabs son `.naowee-tabs.naowee-tabs--animated` + `.naowee-tab--selected` + `.naowee-tabs__indicator` **canónicos as-is** del DS v1.8.0 |
| 3 | Section titles muy grandes/negros | `.ivc-detail-block__title` y `.ivc-detail-subblock__title`: **13px bold negro → 11px gris letterspaced (.6px)**. Misma convención que `.ivc-data-grid__label` |
| 4 | Diagramar mejor las columnas con el nuevo ancho | Grid `repeat(3, minmax(0, 1fr))` (el `minmax(0, 1fr)` deja que valores largos hagan word-break sin romper grilla) + gap aumentado a `18px 32px`. Responsive: 2 cols ≤1200px, 1 col ≤700px |
| 5 | Alto del modal saltaba al cambiar de tab | `#modalDetalleOverlay .naowee-modal__body { height: 65vh; max-height: 65vh; }`. Antes el alto dependía del contenido (tabs con 3 campos se encogían, tabs con tablas extendidas crecían a 85vh). Ahora alto fijo + scroll interno |

## Bloqueantes activos (sin cambio)

- Plantillas Word/PDF de actos administrativos.
- Lista cerrada y final de roles.
- HUs faltantes pasos 7-12.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-26 · `ivc-v1.6.0`
