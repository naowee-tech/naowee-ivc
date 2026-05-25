# ACTA · Naowee IVC · ivc-v1.5.2

> Modo demo movido al panel del demo-switcher (patrón Project v2.0.3).

## Cambios

| # | Cambio | Resolución |
|---|---|---|
| 1 | Selector en wrong location | Movido del header de bandeja al panel del demo-switcher (junto a "Cambiar perfil") |
| 2 | Naming distinto al canónico | "Con datos" → "Libre · con datos" · "Virgen" → "Guiado · vacío" |
| 3 | Estilos custom local | Migrados a `shared/shell.{css,js}` (heredan en futuras pantallas) |
| 4 | Sin reactividad cross-pantalla | Listener `IVCStore.on('store:mode-changed')` en bandeja |

## Beneficio arquitectónico

Cuando se agreguen workspace Profesional / cola Coord IVC / vista Director, todas heredarán el control automáticamente al cargar `shell.js`. Cero duplicación.

## URL
https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html

---
Doug Vargas · 2026-05-25 · ivc-v1.5.2
