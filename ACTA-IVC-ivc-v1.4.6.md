# ACTA · Naowee IVC · ivc-v1.4.6

> 2 ajustes: tooltip portal pattern + header padding compacto.

## Cambios

| # | Fix | Resolución |
|---|---|---|
| 1 | Tooltip se cortaba dentro del container por `overflow` | Patrón portal al body (igual que dropdown/datepicker): `position:fixed` + coords dinámicas + flip-down + clamp horizontal |
| 2 | Espacio grande CTA → divider en header | Override page-scoped `padding-bottom: 4px` en `__head` |

## Patrón cross-componente

El portal pattern (mover al body + position:fixed) ahora se usa en 3 componentes:
- `.naowee-dropdown__menu` (v1.4.0)
- `.naowee-datepicker--popover` (v1.3.2)
- `.naowee-tooltip__content` (v1.4.6) ← nuevo

Todos comparten la misma estrategia para escapar containers con overflow.

## URL
https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html

---
Doug Vargas · 2026-05-23 · ivc-v1.4.6
