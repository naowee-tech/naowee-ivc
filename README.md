# Naowee IVC

> **Módulo IVC** (Inspección, Vigilancia y Control) del Ministerio del Deporte de Colombia — entregables de discovery, diseño de flujos e hipótesis de UI/UX listos para validación con cliente y equipo técnico.

[![Version](https://img.shields.io/badge/version-ivc--v1.0.0-002B5B?style=flat-square)](./CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-Lo--Fi%20listo%20%E2%86%92%20Hi--Fi%20parcial-FF7500?style=flat-square)](./ACTA-IVC-v1.0.0.md)
[![Naowee](https://img.shields.io/badge/Naowee-Design%20System-d74009?style=flat-square)](https://github.com/naowee-tech)

---

## Qué es esto

IVC digitaliza el proceso del Ministerio del Deporte para gestionar **30 trámites** distintos (reconocimiento deportivo, personería jurídica, impugnaciones, sancionatorios, auditorías) sobre los **~1.200 organismos deportivos** del país, reemplazando un proceso manual basado en Word + correo + GESDOC.

Este repositorio contiene los entregables de **discovery + diseño de hipótesis** producidos para alinear cliente (Ministerio) y equipo técnico (Naowee) antes de iniciar la fase de Hi-Fi y desarrollo.

---

## Entregables

| Archivo | Audiencia | Propósito |
|---|---|---|
| [`index.html`](./index.html) | Sponsor, gerencia Ministerio, stakeholders no técnicos | Resumen ejecutivo de 1 página A4 landscape: estado del proyecto, scope E1, decisiones pendientes, riesgos, acciones, asks |
| [`flujos.html`](./flujos.html) | Danna (PM Ministerio) + Juan Manuel Armero (Tech Lead) | Análisis técnico completo: 19 secciones, 11 diagramas Mermaid, 3 tipologías de proceso, 45+ estados, 15 roles, 32 pantallas, agenda de sesión de 90 min |
| [`CHANGELOG.md`](./CHANGELOG.md) | Equipo de desarrollo + PMO | Historial de versiones del entregable |
| [`ACTA-IVC-v1.0.0.md`](./ACTA-IVC-v1.0.0.md) | PM/PO + sponsor | Acta formal de handoff del entregable v1.0.0 |

---

## Cómo usar los HTMLs

### Para presentar al sponsor / cliente no técnico
1. Abre `index.html` en Chrome.
2. Cmd+P → "Save as PDF" → A4 landscape → 1 página.
3. Adjunta el PDF al email para sponsor / Danna.

### Para la sesión de validación con Danna + Juanma
1. Abre `flujos.html` en Chrome (proyector).
2. Usa la sidebar de la izquierda para navegar las 19 secciones.
3. Sigue la **agenda de 90 minutos** propuesta en la sección 18.
4. Toma notas de correcciones — son los inputs para v1.1.0.

### En vivo (GitHub Pages)
Esta es la versión publicada:
- Resumen ejecutivo: https://naowee-tech.github.io/naowee-ivc/
- Análisis técnico: https://naowee-tech.github.io/naowee-ivc/flujos.html

---

## Stack

- HTML5 standalone (sin build tools)
- CSS embebido — design tokens del **Naowee Design System**
- JS vanilla — IntersectionObserver, smooth scroll, print, accordions, tabs
- **Mermaid** vía CDN para diagramas
- **Inter** vía Google Fonts
- Print stylesheet dedicado (A4 landscape)
- Responsive: breakpoints en 1024px y 768px

---

## Estado del proyecto

| Aspecto | Estado |
|---|---|
| Discovery | ✅ Completado |
| Análisis legal (14 normas mapeadas) | ✅ Completado |
| Confirmaciones Danna (audio 2026-05-21) | ✅ Completado |
| Plantillas oficiales (5 IVC-FR + 7 transversales) | ✅ Recibidas |
| Sesión técnica con Juanma | 🟡 Por agendar |
| Decisión Lane 2 (Actuaciones Administrativas) en E1 | 🟡 Por decidir |
| HU pre-existentes del SITOD | 🔴 Por solicitar |
| Plantilla acto administrativo final | 🔴 Por solicitar |
| Lo-Fi | 🟡 Listo para arrancar |
| Hi-Fi | 🔴 Bloqueado por HU + plantilla acto final |

Detalle completo en [`ACTA-IVC-v1.0.0.md`](./ACTA-IVC-v1.0.0.md).

---

## Política de versionamiento

Adopta el **esquema semver con prefijo de proyecto** validado en el proyecto Naowee Project:

```
ivc-vMAJOR.MINOR.PATCH
```

- **MAJOR** — cambio de scope o reestructuración total del flujo
- **MINOR** — nuevo módulo, nueva sección, nuevo trámite priorizado
- **PATCH** — correcciones de copy, validaciones, ajustes visuales menores

Cada release incluye:
1. Bump en footer de cada HTML (badge `ivc-vX.Y.Z`)
2. Entrada nueva en [`CHANGELOG.md`](./CHANGELOG.md)
3. Commit con formato `release(ivc-vX.Y.Z): snapshot + changelog · descripción`
4. Tag git `ivc-vX.Y.Z`
5. Snapshot del HTML en `/snapshots/ivc-vX.Y.Z/` si es release MAJOR/MINOR

---

## Equipo

| Rol | Persona |
|---|---|
| Head of Product | **Doug Vargas** ([@douguizard](https://github.com/douguizard)) |
| PM Ministerio | Danna Arrieta |
| Tech Lead | Juan Manuel Armero |
| Analista funcional | Juana Isabel Palmera |

---

## Licencia

Privado · Naowee · Ministerio del Deporte de Colombia · 2026

