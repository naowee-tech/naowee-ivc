# ACTA · Naowee IVC · ivc-v1.4.8

> Pill de versionamiento + fix tooltips bandeja + limpieza paso 1 Fase 1.

## Cambios

| # | Tipo | Resolución |
|---|---|---|
| 1 | Added | `shared/version-pill.{css,js}` — componente compartido. Pill flotante con `IVC v1.4.8` → release notes |
| 2 | Added | Inyectado en `bandeja.html` (via shared) e inline en `formulario-fase-1.html` |
| 3 | Fixed | Tooltips bandeja: `.is-portaled` ahora fuerza `opacity:1` + `pointer-events` + `display` + `visibility` (el `:hover` del DS no aplica cuando el content está portaled) |
| 4 | Fixed | Eliminados los 2 info messages redundantes del paso 1 Fase 1 (commits previos sin tag) |

## Patrón cross-componente
Cuarto componente del proyecto con pattern portal-friendly:
1. `.naowee-dropdown__menu` (v1.4.0)
2. `.naowee-datepicker--popover` (v1.3.2)
3. `.naowee-tooltip__content` (v1.4.6 + fix v1.4.8)
4. `.ivc-version-pill` (v1.4.8 — fixed position, no portal)

## URLs
- Bandeja: https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html
- Fase 1: https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html

---
Doug Vargas · 2026-05-23 · ivc-v1.4.8
