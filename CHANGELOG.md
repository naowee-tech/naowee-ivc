# Changelog · Naowee IVC

Historial de versiones del módulo IVC (Inspección, Vigilancia y Control) — Ministerio del Deporte de Colombia.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) + esquema semver con prefijo de proyecto adoptado del Naowee Project: `ivc-vMAJOR.MINOR.PATCH`.

---

## [ivc-v1.1.1] — 2026-05-21

> 🔧 **Patch crítico: port del shell canónico de naowee-test-sidebar-shell.** Reemplaza la implementación reinventada con los componentes refinados de producción.

### Changed

- `prototype/shared/tokens.css` — canonical Naowee tokens
- `prototype/shared/shell.css` — full replace con shell refinado + glow naranja portado de `style/btn-glow-and-root-menu`
- `prototype/shared/components.css` — botones ahora reciben glow desde shell.css (sin conflictos)
- `prototype/shared/shell.js` — emite ahora el markup canónico (logos Ministerio + pill IVC, burger toggle, profile-switcher con dropdown, active-bar con View Transitions, tooltips en colapsado)

### Added

- **Logos oficiales en sidebar** (`shared/logos/ministerio.svg` + pill "IVC")
- **Botones primarios con glow naranja** (port de `style/btn-glow-and-root-menu` — hover lift -1px + sombra accent vibrante)
- **Sidebar colapsable con tooltips** (per commit 94c64cf — tooltip flotante position:fixed cuando el sidebar está collapsed)
- **Header con avatar dropdown** (per commit a32e92c — user-chip con chevron + profile-dd con Mi perfil / Notificaciones / Configuraciones / Cerrar sesión)
- **Active-bar slide vía View Transitions API** (per commit 446b091 — `shell-active-bar` morph entre items)
- **Burger button con rotate 180° en collapsed** (paridad con escenarios/incentivos)
- **Ghost buttons cream-hover** (per commit adaa8b2 — naowee-btn--mute con bg `#FFEDC7` sobre chevron del user-chip)

### Fixed

- Implementación reinventada reemplazada por canon de producción
- `is-collapsed` modifier sustituye `collapsed` (paridad con shell.js canónico)
- `is-active` modifier sustituye `active` para nav-row (paridad con sidebar.js canónico)
- Hover opacity .92 ya no dim los botones loud/accent (override explícito en shell.css)

---

## [ivc-v1.1.0] — 2026-05-21

> 🎨 **Fase 1 del prototipo Mid-Fi interactivo con tour guiado.** Pintadas 4 pantallas del happy path Usuario Externo + sistema shared (tokens, components, shell, data, tour reactivo).

### Added — `prototype/`

- `prototype/index.html` — Landing del prototipo con perfil picker (1 perfil activo + 3 stubs para Fase 2)
- `prototype/usuario-externo/dashboard.html` — Bandeja de trámites con stat cards, empty state y histórico
- `prototype/usuario-externo/nuevo-tramite.html` — Wizard de radicación con 7 docs del Decreto 1387/1970 Art. 2.1.1.2
- `prototype/usuario-externo/tramite-detalle.html` — Detalle con hero card + countdown 15 días + timeline de 12 pasos + acciones laterales
- `prototype/shared/tokens.css` — Tokens Naowee canónicos (colores, radii, sombras, tipografía, spacing)
- `prototype/shared/components.css` — Componentes Naowee (btn, card, modal, input, table, badge, message, stepper, snackbar, timeline, doc-upload-card)
- `prototype/shared/shell.css` — Sidebar 274px (colapsable 72px), header 88px, demo-switcher chip fixed bottom-right, overlay tour
- `prototype/shared/data.js` — Mock state + localStorage helpers (NIT real, Liga de Atletismo de Bolívar, perfiles, documentos, timeline)
- `prototype/shared/shell.js` — Layout + perfil switcher + nav rendering + snackbar
- `prototype/shared/demo-tour.js` — Tour reactivo (puerto vanilla del Naowee Project · 8 pasos Fase 1)

### Tour de 8 pasos — Fase 1

1. **Iniciar trámite** (Usuario Externo · dashboard.html)
2. **Cargar documentos del Decreto 1387/1970** (nuevo-tramite.html)
3. **Confirmación radicado IVC-2026-001** (tramite-detalle.html)
4. **Cambiar a perfil Profesional IVC** (chip DEMO)
5-8. Stubs preparados para Fase 2 (Profesional + Coordinador + Director)

### Datos placeholder reales del dominio

- **Liga**: Liga de Atletismo de Bolívar — NIT 800.245.678-3 — Cartagena de Indias
- **Trámite**: IVC-2026-001 (radicado 2026-05-21, vence 2026-06-12 = +15 días hábiles)
- **Histórico**: IVC-2024-204 (Renovación) + IVC-2021-088 (Otorgamiento original)
- **Perfiles**: Liga (activo), Carolina Méndez (Profesional · Fase 2), Andrés Salazar (Coordinador · Fase 2), María Helena Ramos (Director · Fase 2)
- **Timeline**: 12 pasos del flujo V2 oficial confirmado por Danna (Paso 1 ✓ complete, Paso 2 🟡 current, 3-12 pending)

### Notes

- El tour es reactivo al estado del trámite (avanza solo cuando el state cambia vía `naowee:ivc:state-change`)
- Estado persistido en localStorage (key prefix: `naowee.ivc.*`)
- Demo switcher chip fixed bottom-right pattern del Naowee Project
- Click en cualquier card de documento simula la carga (sin file picker real)
- Loader de radicación 1.4s antes de navegar a tramite-detalle
- Print stylesheet básico oculta sidebar + chip + tour overlay
- Responsive @900px: sidebar colapsa, demo switcher se mantiene visible

### Pendiente para ivc-v1.2.0+ (Fase 2)

- Pantallas Profesional IVC (bandeja, validación, generación de acto)
- Pantallas Coordinador IVC (revisión)
- Pantallas Director (firma electrónica)
- Sub-flujo de notificación + recursos

---

## [ivc-v1.0.0] — 2026-05-21

> 🎉 **Primera entrega oficial del módulo IVC.** Discovery completo + diseño de hipótesis listo para validación con cliente (Danna) y equipo técnico (Juanma).

### Added — Resumen Ejecutivo (`index.html`)

- Hero con badge V3 y status pill "Lo-Fi listo → Hi-Fi parcial"
- 4 métricas clave: **45+ estados** mapeados · **15 roles** identificados · **~32 pantallas** estimadas E1 · **5 HU críticas** a solicitar
- Sección "Qué construimos vs qué NO entra en E1" — bento asimétrico 60/40
- 3 insights críticos del último análisis: confirmaciones Danna (audio), tipologías de proceso, 15 HU pre-existentes
- Timeline visual de 5 nodos con estado pulsante en "Sesión con Danna + Juanma"
- 3 decisiones pendientes: Lane 2 en E1 · plantilla acto final · GESDOC integración
- 3 riesgos activos: HU sin entregar · matriz parcial · tipologías sin validar
- 5 próximas acciones priorizadas
- Asks formales al sponsor
- Print stylesheet A4 landscape (1 página)

### Added — Análisis Técnico (`flujos.html`)

- 19 secciones navegables con sidebar sticky (274px) + IntersectionObserver
- **11 diagramas Mermaid** branded con tokens Naowee:
  - Vista macro con 2 swim lanes V2 (Deporte Aficionado/Profesional + Actuaciones Administrativas)
  - **Trámite 1: Otorgamiento** con tiempos confirmados (15 días validación + 10 días recursos) + 7 documentos del Decreto 1387/1970
  - **Trámite 2: Renovación** con diferencias destacadas vs Otorgamiento
  - State machine V3 con 45+ estados color-coded por tipología
  - 7 mini-diagramas por rol (Usuario externo, Encargado Documental, Coordinador, Profesional, Coord IVC, Director, Sistema)
- Sección dedicada **"Confirmaciones Danna 2026-05-21"** con las 4 respuestas del audio (15 días, 10 días, firma renuncia, info adicional recurso)
- Sección **"3 Tipologías de proceso"** color-coded:
  - 🟦 Trámite (azul) — flujos de radicación a registro
  - 🟩 Actuación (verde) — gestiones puntuales del Profesional
  - 🟨 Procedimiento (naranja) — expedientes largos (auditorías, sancionatorios)
- Comparativa **V1 → V2 → V3** en tabla cruzada
- 15 roles consolidados con tipología que tocan y pasos donde actúan
- 4 componentes UI nuevos identificados: `<EstadoBadge />`, `<FirmaConfirmacion />`, `<SolicitudInfoAdicional />`, `<TimelineTramite />`
- 14 normas legales mapeadas + 15 validaciones automáticas
- 8 catálogos maestros en bento (con 2 nuevos: Tipologías + Estados)
- 32 pantallas E1 con estado del diseño por pantalla
- Accordions de preguntas: 17 para Danna · 25 para Juanma
- Sección **"15 HU pre-existentes a solicitar"** con marcado de prioridad
- Agenda visual de **sesión de 90 minutos** con Danna + Juanma
- Recomendación profesional final
- Print stylesheet con page-breaks calculados (S5/S6/S7/S8/S11/S15/S16/S18)
- Responsive con sidebar colapsado a top-nav en <1024px

### Added — Versionamiento

- Badge `ivc-v1.0.0` en footer de ambos HTMLs (pill --azul con dot --naranja)
- `CHANGELOG.md` siguiendo formato Keep a Changelog
- `ACTA-IVC-v1.0.0.md` con handoff formal
- `.gitignore` configurado
- Política de versionamiento documentada en README

### Insights derivados del proceso (no es código, pero forma parte del entregable)

13 documentos de análisis viven fuera de este repo (en `/Users/dvargas/Desktop/IVC/`) — se referencian aquí para trazabilidad:

- `IVC-ANALISIS-REUNION.md` · `IVC-PREGUNTAS-DOUG.md` · `IVC-LEVANTAMIENTO-COMPLETO.md`
- `IVC-DIAGRAMA-FLUJO-DECODIFICADO.md` · `IVC-GAPS-PDF-vs-REUNION.md` · `IVC-FLUJOS-HAPPY-PATH.md`
- `IVC-FLUJO-V2-DECODIFICADO.md` · `IVC-MARCO-LEGAL-ADMINISTRATIVO.md` · `IVC-SYNC-V2-CONSOLIDADO.md`
- `IVC-CATALOGO-FORMATOS.md` · `IVC-MATRIZ-DOCUMENTOS-DEPORTE-AFICIONADO.md` · `IVC-PLANTILLAS-ANALISIS-DETALLE.md`
- `IVC-IMPACTO-PLANTILLAS-EN-SCOPE.md` · `IVC-AUDIO-DANNA-2026-05-21.md` · `IVC-XLSX-COMPLETO-CON-HU.md`
- `IVC-RESPUESTAS-DANNA-CONSOLIDADAS.md` · `IVC-TIPOLOGIAS-PROCESO.md`

---

## [Próximas versiones esperadas]

### [ivc-v1.1.0] — TBD tras sesión con Juanma + Danna

Se espera:
- Decisión cerrada sobre Lane 2 (entra o no a E1)
- 5 HU pre-existentes recibidas y mapeadas a pantallas
- Plantilla del acto administrativo final integrada
- Correcciones de los flujos según validación
- Inicio de Lo-Fi de los 4 componentes nuevos

### [ivc-v2.0.0] — TBD

Se espera:
- Wireframes Lo-Fi de happy path Lane 1 completos
- Plan de Hi-Fi por sprint
- Estimación de esfuerzo por pantalla

---

[ivc-v1.0.0]: https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.0.0
