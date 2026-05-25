# ACTA · Naowee IVC · ivc-v1.4.7

> Stepper Fase 1: pulse sin recortar + connectors a la altura del número.

## Cambios

| # | Fix | Resolución |
|---|---|---|
| 1 | Pulse cortado al llegar al máximo | `overflow:visible` en wrap+stepper + `padding-top: 24px` |
| 2 | Connectors atravesaban labels | Layout vertical (número arriba / label abajo) + connector `align-self: flex-start; margin-top: 12px` |

Patrón canónico de stepper (Material/HIG): número-arriba label-abajo connectors-a-altura-del-número.

## URL
https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html

---
Doug Vargas · 2026-05-23 · ivc-v1.4.7
