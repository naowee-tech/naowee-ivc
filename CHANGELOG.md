# Changelog · Naowee IVC

Historial de versiones del módulo IVC (Inspección, Vigilancia y Control) — Ministerio del Deporte de Colombia.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) + esquema semver con prefijo de proyecto adoptado del Naowee Project: `ivc-vMAJOR.MINOR.PATCH`.

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
