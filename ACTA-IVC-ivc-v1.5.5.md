# ACTA · Naowee IVC · ivc-v1.5.5

> Handoff de la versión `ivc-v1.5.5` — Nombre y NIT del organismo se autopopulan con un ejemplo realista del tipo elegido (Liga / Asociación / Federación).

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.5` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Feedback origen | Doug (review de v1.5.4) |
| Release notes | https://github.com/naowee-tech/releases/tag/ivc-v1.5.5 |

## Bug fix crítico de demo

En las versiones anteriores el seed de `STATE.data.nombre` tenía hardcoded `'Liga de Atletismo de Antioquia'`. Esto provocaba que:

- Si el usuario elegía **Federación Deportiva Nacional** en el paso 0 → al avanzar al paso 1, el campo "Nombre del organismo" seguía mostrando "Liga de Atletismo de Antioquia".
- Igual problema con **Asociación Deportiva**.
- Mismo problema con el NIT (`'800123456-7'`).

Solución: el seed inicial queda vacío y se aplica un ejemplo del tipo correspondiente cuando el usuario hace su selección. Si el usuario después tipea algo a mano, ese valor custom NUNCA se pisa (solo se pisa si está vacío o si coincide con otro ejemplo canónico).

## Ejemplos por tipo de organismo

| Tipo | Nombre | NIT |
|---|---|---|
| Liga Deportiva Departamental | Liga de Atletismo de Antioquia | 800123456-7 |
| Asociación Deportiva | Asociación de Tenis de Cundinamarca | — (no aplica) |
| Federación Deportiva Nacional | Federación Colombiana de Fútbol | — (no aplica) |

## Implementación

- Nuevo catálogo `EJEMPLOS_POR_ORGANISMO` al lado del `STATE`.
- Helper `aplicarEjemploOrganismo(orgId)` que respeta el input del usuario.
- `orgOnChange` del dropdown del paso 0 ahora llama al helper antes de re-renderizar.
- Placeholder del campo "Nombre del organismo" en el paso 1 cambia dinámicamente.

Aplicado en ambas copias del formulario:
- `prototype/usuario-externo/formulario-fase-1.html` (el del repo)
- `IVC/demo-fase-1-formulario.html` (el local standalone)

## Bloqueantes activos (sin cambio)

Igual que v1.5.4 — plantillas Word/PDF, matriz Excel, lista cerrada de roles, HUs faltantes pasos 7-12, acceso a HU-26/27/28.

## Próximos pasos comprometidos

Sin cambio respecto a v1.5.4.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.5`
