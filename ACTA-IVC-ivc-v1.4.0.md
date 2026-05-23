# ACTA · Naowee IVC · ivc-v1.4.0

> Fase 2 del flowchart BPMN: Remisión + Asignación. Refactor de `coordinador/bandeja.html` al nivel del DS v1.3.3 + alineación con estados oficiales del flowchart + cobertura completa HU-3.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.4.0` |
| Fecha | 2026-05-23 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Base | `ivc-v1.3.3` |
| HU cubiertas | HU-3 (Asignación) |
| Fase flowchart | Fase 2 — Remisión / Asignación |

## Resumen

`coordinador/bandeja.html` fue construida en `ivc-v1.2.0`, antes de los 14 refinamientos UX que se aplicaron al demo Fase 1 (`ivc-v1.3.2` + `ivc-v1.3.3`). El gap report mostró **66% alineación con v1.3.3** — esta versión cierra el 34% faltante (12 gaps) y alinea la pantalla con los estados oficiales del flowchart BPMN de Fase 2.

## Gaps cerrados (12)

| Prioridad | Gap | Resolución |
|---|---|---|
| 🔴 | Portal dropdown al body | `setupNaoweeDropdownController` portado del demo Fase 1 |
| 🔴 | Position fixed + flip-up del menú | `positionMenu()` con detección `spaceBelow < menuH + 6` |
| 🔴 | Keyboard navigation + scroll close | Enter/Space/ArrowDown/Up/Escape + rAF debounced |
| 🔴 | Icon button quiet (caneca naranja) | 4 botones migrados a `.naowee-btn--quiet --icon --small` |
| 🔴 | Datepicker CSS hover preparado | No había filtros de fecha; CSS hover listo para v1.4.x |
| 🟡 | Helper canónico negative + badge | Modal masivo + toolbar (cuando 0 trámites seleccionados) |
| 🟡 | Shake utility canónica | `shakeElement()` con reflow trick + 500ms |
| 🟡 | `.naowee-message--caution` | Warning de alta carga (umbral 8 trámites activos) |
| 🟢 | Badge "En remisión" canónico | Renombrado stat-card, filtro, badge — alineado con flowchart |
| 🟢 | Banner "Remisión automática" del Sistema | `.naowee-message--informative` al inicio |
| 🟢 | Histórico HU-3 con timeline | Modal `.ivc-timeline` con 3-4 eventos por trámite |
| 🟢 | SLA / Plazo visible | Columna con badge escalonado positive/caution/negative |

## Alineación con el flowchart BPMN Fase 2

| Paso flowchart | Actor | Estado | Cobertura |
|---|---|---|---|
| Remisión automática | Sistema | `En remisión` | Banner explica el comportamiento + badge naranja del estado |
| Asignación a profesional | Coordinador de Área | `Asignada` | Modal individual (dropdown con conteo) + masiva (3 estrategias) |

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html`

## Bloqueantes activos (sin cambios)

- Plantillas Word del acto administrativo de Diego (Analítica)
- 8 bloqueantes Diego/Danna (FR-037, FR-038, etc.)
- HU-26.3, HU-27, HU-28, HU-001, HU-005, HU-006 pendientes de Danna

## Pendiente (próximas iteraciones)

- **Sprint Fase 3:** Refactor `profesional/workspace.html` (Validación) + HU-5 Cumplimiento parcial + vista organismo devuelto.
- **Sprint Fase 4:** Coordinador IVC (revisión del acto) + Director (firma).
- **Sprint Fase 5:** Notificación cascada CPACA.
- **Sprint Fase 6:** Recursos (Reposición + Apelación + Renuncia).

## Tamaño

- Bandeja: 1,303 líneas / 60 KB (antes: 746 / 34.2 KB → +557 líneas).

---

**Firma:** Doug Vargas · Head of Product · 2026-05-23 · `ivc-v1.4.0`
