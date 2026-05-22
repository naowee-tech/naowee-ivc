# ACTA · Naowee IVC · ivc-v1.3.0

> Handoff de la versión ivc-v1.3.0 — Fase 1 demo navegable end-to-end (lado Usuario Externo / Organismo).

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.3.0` |
| Fecha | 2026-05-22 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Audiencia handoff | Juan Manuel Armero (Tech Lead) · Danna Arrieta (PM Ministerio) · Diego (Analítica) |

## Cambios principales

### Demo Fase 1 (Formulario de Radicación) — `prototype/usuario-externo/formulario-fase-1.html`

Demo navegable que cubre el lado del **Usuario Externo (Organismo)** en el flujo de Reconocimiento Deportivo (Otorgamiento) del Ministerio del Deporte.

- Wizard de 7 pasos: Pre-selección → Datos generales → Personería → Asamblea → Estructura → Documentos → Confirmación
- 3 form variants dinámicos por tipo de organización:
  - F1 Liga ~38 campos + 7 tablas REPEATABLE
  - F2 Asociación ~22 campos + 1 tabla
  - F3 Federación ~25 campos + 4 tablas
- 5 grupos de campos condicionales
- Los 7 documentos del Decreto 1387/1970 Art 2.1.1.2
- Generación de radicado `IVC-2026-NNNNN`
- Header institucional con logos Ministerio + Naowee + SUID (copiados del proyecto Project v2.0.3)

### Refactor a Naowee Design System v1.8.0 canónico

Todo el HTML/CSS reescrito para usar **solo** clases canónicas del DS cargado vía CDN (`naowee-tech/naowee-design-system@v1.8.0`):

- `.naowee-stepper--pulse` (stepper con animación pulse en paso activo)
- `.naowee-textfield` + sub-elementos + `--error` + `.naowee-helper--negative` + `.naowee-shake` (wiggle real del DS)
- `.naowee-dropdown` con menú flotante (reemplaza 6 `<select>` nativos que renderizaban menú gris del SO)
- `.naowee-radio`, `.naowee-checkbox`, `.naowee-badge`, `.naowee-message--informative`
- Botones: `.naowee-btn--loud` (primary glow naranja) + `.naowee-btn--quiet` (ghost)
- Fuente Inter via Google Fonts

### Convención de scope custom

Las funcionalidades que el DS no cubre se aislaron con prefijo `.ivc-*` (NO se inventan clases `.naowee-*`):

- `.ivc-repeatable*` — Tablas REPEATABLE editables (DS no tiene este componente)
- `.ivc-dropdown--inline` — Variante de width 100% para celdas estrechas

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html`

## Bloqueantes activos

- **Plantillas del acto administrativo:** Diego de Analítica pendiente entregar plantillas Word de los demás trámites además de Otorgamiento.
- **8 bloqueantes de Diego/Danna:** FR-037, FR-038, pre-registro de organismos, borradores parciales, F2-Municipio, F3-estatutos, extensión de ENUM, mapeo organismo → área aficionado/profesional.
- **23 de 30 trámites** no cubiertos por el formulario v2 actual.
- **HU-26.3, HU-27, HU-28, HU-001, HU-005, HU-006:** pendiente que Danna comparta los .docx originales (viven en Drive del Ministerio según hipótesis Doug).

## Próximos pasos comprometidos

1. Compartir esta URL con Juan Manuel + Danna + Diego para feedback sobre Fase 1 lado Usuario Externo.
2. Confirmar con Juanma el siguiente sprint (Fase 2 Sprint 2 o pulir Fase 1).
3. Resolver bloqueantes con Diego (modelo BD) y Danna (matriz Excel completa de trámites).
4. Coordinar workshop de 90 min con Danna + Juanma para validar state machine de 7 estados macro.

## Verificación

- Cero `<select>` nativos en el demo: ✓
- Cero clases `.naowee-*` inventadas: ✓ (todas existen en `design-system.css` v1.8.0)
- Logos institucionales cargando: ✓ (con `onerror` fallback)
- Wizard funcional con 7 pasos navegables: ✓
- 3 form variants dinámicos: ✓
- 12 tablas REPEATABLE con [+ Agregar] / [Eliminar]: ✓
- Dropdowns canónicos con menú flotante + teclado: ✓
- Validación con shake + helper rojo: ✓
- Mock data precargada: ✓ (`Liga de Atletismo de Antioquia / NIT 800123456-7`)
- Generación radicado `IVC-2026-NNNNN` + success state: ✓

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-22 · `ivc-v1.3.0`
