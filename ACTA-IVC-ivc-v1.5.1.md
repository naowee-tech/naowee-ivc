# ACTA · Naowee IVC · ivc-v1.5.1

> 2 modos demo + fix botón asignación masiva.

## Cambios

| # | Fix | Resolución |
|---|---|---|
| 1 | Demo necesita 2 caminos (mock vs virgen) | Segmented control `.ivc-mode-switch` + `IVCStore.setMode('demo'/'blank')` |
| 2 | Botón masiva habilitado con 0 trámites | `disabled` cuando `selectedCount < 2` |
| 3 | Span `(0)` en gris dentro del botón naranja | `color: inherit` + `opacity: 0.85` |

## Patrón heredado

Modo "guided/free" del proyecto Project v2.0.3 — Doug 14/05/2026 lo definió como punto de partida estándar para las demos del ecosistema Naowee.

## URL

https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html

---
Doug Vargas · 2026-05-25 · ivc-v1.5.1
