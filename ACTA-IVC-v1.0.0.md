# ACTA · Naowee IVC · v1.0.0

> Handoff formal del entregable de discovery + diseño de hipótesis del módulo IVC del Ministerio del Deporte.
> Para PM, PO, sponsor y equipo de desarrollo.

---

## Metadata

| Campo | Valor |
|---|---|
| **Versión** | `ivc-v1.0.0` |
| **Fecha de entrega** | 2026-05-21 |
| **Head of Product** | Doug Vargas |
| **PM Cliente** | Danna Arrieta (Ministerio del Deporte) |
| **Tech Lead** | Juan Manuel Armero |
| **Cliente** | Ministerio del Deporte de Colombia |
| **Módulo** | IVC — Inspección, Vigilancia y Control |
| **Universo** | ~1.200 organismos deportivos · 30 trámites · 18 procesos IVC-PD |

---

## 1. Qué se entrega en esta versión

Esta es la **primera versión oficial** del módulo IVC. NO es código de producción — es la **base de hipótesis y diseño** sobre la cual se construirá el módulo. Los entregables son:

| Entregable | Formato | Líneas | Audiencia |
|---|---|---|---|
| Resumen ejecutivo | HTML standalone | 1.230 | Sponsor, gerencia, stakeholders no técnicos |
| Análisis técnico detallado | HTML standalone con 11 Mermaid | 1.698 | Danna + Juanma para sesión de validación |
| CHANGELOG | Markdown | — | Equipo de desarrollo |
| README | Markdown | — | Equipo + PMO |
| Esta acta | Markdown | — | PM/PO + sponsor |

---

## 2. Qué se logró en discovery

### 2.1 Documentación procesada

- 1 transcripción de reunión de entrega (1.384 líneas — Gemini Notes 2026-05-20)
- 2 PDFs del cliente (Levantamiento IVC SUID + Flujo Operativo V2)
- 1 presentación PPTX legal (36 slides — Marco Legal IVC en el Territorio)
- 5 formatos oficiales IVC-FR (Otorgamiento, Reforma estatutaria, Inscripción miembros, Asociaciones juveniles, Personería jurídica)
- 7 formatos transversales (notificaciones, renuncia a términos, autorización electrónica)
- 1 XLSX matriz documentos
- 1 XLSX Levantamiento SUID completo (con tabs IVC + MATRIZ + Procesos)
- 1 audio de aclaraciones de Danna (89 segundos, transcrito vía whisper)
- 1 imagen del Decreto 1387/1970 Art. 3

### 2.2 Hallazgos críticos

1. **El flujo no era único** — V2 oficial introdujo 2 swim lanes (Deporte Aficionado/Profesional vs Actuaciones Administrativas) en lugar de uno genérico.
2. **3 tipologías de proceso** descubiertas en el XLSX: Trámite (azul), Actuación (verde), Procedimiento (amarillo) — definen la navegación y filtrado.
3. **45+ estados** mapeados (vs ~13 iniciales) distribuidos en las 3 tipologías.
4. **15 roles** consolidados (vs 8-9 iniciales) — incluye Profesional financiero, Analista LA/FT, Oficial cumplimiento, Auditor, Analista que no estaban en V1.
5. **15+ HU pre-existentes** referenciadas en el XLSX (HU-006, HU-26.x, HU-27.x, HU-28.x) — son User Stories del SITOD que deben solicitarse a Danna.
6. **14 normas legales** mapeadas con validaciones automáticas implícitas (Resolución 705/2024, Decreto 1085, Ley 181, etc.).
7. **Tiempos confirmados por Danna (audio 2026-05-21):** 15 días hábiles por trámite + 10 días para interponer recursos + firma digital en renuncia a términos + info adicional opcional en recursos.

### 2.3 Componentes UI nuevos identificados

| Componente | Propósito |
|---|---|
| `<EstadoBadge />` | Badge color-coded por tipología (azul/verde/naranja) + estado específico |
| `<FirmaConfirmacion />` | Modal con captura de firma digital + auditoría inmutable (renuncia, transiciones críticas) |
| `<SolicitudInfoAdicional />` | Campo dinámico parametrizable donde Profesional detalla info adicional pedida |
| `<TimelineTramite />` | Countdown 15d/10d con alertas a 5/2/0 días e integración con state machine |

---

## 3. Scope acordado para Entrega 1

### Trámites priorizados
- **Otorgamiento de Reconocimiento Deportivo** de Ligas/Asociaciones Deportivas
- **Renovación de Reconocimiento Deportivo** de Ligas/Asociaciones Deportivas

### Organismos objetivo
- Ligas o Asociaciones Deportivas Departamentales

### Roles instanciados (8 de 15)
1. Usuario Externo (organismo deportivo)
2. Encargado de Gestión Documental
3. Coordinador Interno
4. Profesional IVC
5. Coordinador IVC (Revisor)
6. Director de Inspección, Vigilancia y Control
7. Sistema (automatizado)
8. Profesional financiero (si aplica)

### Pantallas
- **~24 pantallas funcionales** del happy path Aficionado
- **~6 pantallas como mock estático** (auditorías, sancionatorios)
- **~2 pantallas bloqueadas** por plantilla acto admin final faltante

### NO entra en E1
- Régimen Sancionatorio completo (audiencias virtuales, pliegos)
- Control LA/FT y reportes UIAF
- Auditorías programadas
- Trámites de Clubes Profesionales
- Integración real con GESDOC (Fase 2)

---

## 4. Bloqueantes activos

| # | Bloqueante | Owner para resolver | Prioridad |
|---|---|---|---|
| B1 | Plantilla del **acto administrativo final** (Resolución firmada por Director) | Danna | 🔴 CRÍTICA |
| B2 | Las **5 HU pre-existentes prioritarias** (HU-006, HU-26.3, HU-27, HU-28, HU-001+HU-005) | Danna / Ministerio | 🔴 CRÍTICA |
| B3 | Decisión sobre **Lane 2 (Actuaciones Administrativas)** en E1 | Danna + Sponsor | 🟡 Alta |
| B4 | **GESDOC** — integración real o bandeja interna en E1 | Juanma + Cliente | 🟡 Alta |
| B5 | **Validación de tipologías** (Trámite/Actuación/Procedimiento) con Danna | Danna | 🟡 Media |
| B6 | Matriz Excel **completa** con tiempos, plantillas, especificaciones, info básica | Danna | 🟡 Media |

---

## 5. Riesgos identificados

1. **Las 15+ HU del SITOD pueden no existir documentadas** — si no las tienen, hay que crearlas desde cero, lo que extiende el discovery.
2. **Cambios de criterio post-Hi-Fi** — sin la matriz Excel cerrada, las validaciones a nivel campo se diseñan con supuestos.
3. **Dependencia de personas ausentes** ("el señor Jorge", "la señora Andrea") mencionadas en reunión sin SLA.
4. **Normativa cambiante** — el Proyecto de Resolución que modifica la Circular 015 podría alterar requisitos por trámite.

---

## 6. Acuerdos preliminares (de la reunión y audio)

| # | Acuerdo | Fuente |
|---|---|---|
| A1 | Empezar por trámites de Ligas Deportivas y Registro de organismos | Reunión 2026-05-20 |
| A2 | GESDOC se trata como bandeja interna Naowee en E1 | Análisis Doug + propuesta |
| A3 | Borradores parciales aplicando patrón ESC-08 ya validado | Naowee Design System |
| A4 | 15 días hábiles como tiempo de respuesta general | Audio Danna 2026-05-21 |
| A5 | 10 días para interponer recursos | Audio Danna 2026-05-21 |
| A6 | Firma digital en renuncia a términos | Audio Danna 2026-05-21 |
| A7 | Info adicional en recursos como campo opcional configurable | Audio Danna 2026-05-21 |

---

## 7. Próximos pasos comprometidos

| # | Acción | Owner | Fecha objetivo |
|---|---|---|---|
| 1 | Solicitar 5 HU críticas a Danna por escrito | Doug | 2026-05-22 |
| 2 | Solicitar plantilla del acto administrativo final | Doug | 2026-05-22 |
| 3 | Agendar sesión 90 min con Danna + Juanma | Doug | Esta semana |
| 4 | Decisión sobre Lane 2 in/out de E1 | Doug + sponsor | Esta semana |
| 5 | Iniciar Lo-Fi de 4 componentes nuevos | Doug | Próxima semana |
| 6 | Release `ivc-v1.1.0` con correcciones post-sesión | Doug | Próximas 2 semanas |
| 7 | Hi-Fi Lane 1 happy path completo | Doug | 2-3 semanas tras recibir HU |

---

## 8. Validación de esta acta

| Rol | Persona | Estado |
|---|---|---|
| Head of Product | Doug Vargas | ✅ Entrega esta acta |
| PM Cliente | Danna Arrieta | ☐ Por validar |
| Tech Lead | Juan Manuel Armero | ☐ Por validar |
| Sponsor | TBD | ☐ Por aprobar |

---

## Anexos

- `index.html` — Resumen ejecutivo (1 página A4 landscape)
- `flujos.html` — Análisis técnico completo (19 secciones, 11 diagramas Mermaid)
- `CHANGELOG.md` — Historial de versiones
- `README.md` — Documentación del repo
- Repositorio: https://github.com/naowee-tech/naowee-ivc

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-21 · `ivc-v1.0.0`
