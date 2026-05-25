# ACTA · Naowee IVC · ivc-v1.5.3

> Handoff de la versión `ivc-v1.5.3` — Profesional end-to-end (bandeja + workspace canónico) + refactor del modal de asignación masiva + limpieza del switcher de perfiles.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.3` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.5.3 |

## Cambios principales

### 🧩 Profesional end-to-end (pantallas nuevas)

- **`prototype/profesional/bandeja.html`** (nueva, ~800 líneas) — lista de trámites asignados al profesional logueado, alimentada en vivo por `IVCStore.misAsignaciones(profId)`. 3 stat cards (Pendientes / En validación / Cumplidos hoy), tabla con plazo en semáforo, filtros, footer flotante.
- **`prototype/profesional/workspace.html`** (reescritura completa, ~1300 líneas) — siguiendo `proyecto-detalle.html` v2.0.3:
  - Hero card sin shadow + tabs container con indicator canónico DS (`.naowee-tabs__indicator`).
  - Tab Documentos con patrón `.ra-item + .ra-toggle` portado de `revisar-area.html` (tri-state cumple/parcial/no cumple).
  - Tab Datos con grid 2-col + labels uppercase letterspaced.
  - Tab Historial con timeline + colores semánticos por evento.
  - CTA único "Finalizar revisión" inline que infiere resultado del checklist y cambia label + color + handler dinámicamente.
  - Barra de progreso semáforo (rojo→naranja→verde).
  - Tooltip portal pattern (`overflow: visible !important` + `z-index: 9999`).

### 🎛️ Modal asignación masiva (coordinador)

- Reducido a **2 estrategias finales**: "mismo profesional para todos" (grid de cards con avatares, scroll horizontal) y "distribuir manualmente" (`.naowee-dropdown` canónico por fila).
- Summary unificado con un solo `.naowee-message` que cambia entre `caution` e `informative` según validación.
- Section titles uppercase letterspaced, X canónico (`.naowee-modal__dismiss`), dividers via border en header/footer, tooltips portaled en las cards.

### 🧹 Limpieza del switcher de perfiles

- Eliminado perfil `usuario-externo` de `shared/data.js` y `shared/shell.js`. Default perfil → `coordinador`.
- Card destacado en `prototype/index.html` ahora es Coordinadora.
- "Bandeja de trámites" → **"Bandeja"** en el sidebar.
- Añadido `NAV_ITEMS['profesional']` con `bandeja-prof` → `profesional/bandeja.html`.

### 🐛 Fixes

- **`IVCStore` bug crítico**: `SEED.profesionales` se accedía durante la creación del literal → IIFE crashaba en silencio → `window.IVCStore` nunca se asignaba. Fix: factory `buildSeed()` invocada después de definir `PROFESIONALES`.
- **Segmented "Modo demo"** no respondía → event delegation sobre el contenedor (patrón Project v2.0.3).
- **Snackbar detrás del demo-switcher** → `--z-snackbar: 1300` (antes 900).
- **TIPO undefined** en bandeja → fallback `(t.tipoTramite || t.tipo || '—')`.
- **Toast no aparecía tras `confirmMasivo`** → cerrar modal primero + `setTimeout(220ms)` con `try/catch` separados.

### 🎨 Otros

- Snackbar a markup canónico DS v1.8.0 (`naowee-snackbar` con variants).
- Logo Naowee SVG real en los footers flotantes.
- `IVC_VERSION` bumpea a `v1.5.3` en `shared/naowee-footer.js`, `usuario-externo/formulario-fase-1.html` y `IVC/demo-fase-1-formulario.html`.

## Bloqueantes activos

- **Plantillas Word/PDF de actos administrativos** (sin esto no podemos maquetar la vista del acto firmado).
- **Matriz Excel completa** con catálogo de trámites × campos × roles × criterios × plazos × documentos requeridos.
- **Lista cerrada y final de roles** con permisos.
- **HUs faltantes pasos 7-12** (revisión coord, firma, notificación cascada, RND).
- **Acceso a HU-26.x / 27.x / 28.x** referenciadas en el XLSX SUID pero sin .docx adjuntos.

## Próximos pasos comprometidos

1. Cola de revisión del **Coordinador IVC** (Fase 4 — revisión del acto antes de firma).
2. Vista del **Director IVC** (Fase 5 — firma electrónica con preview + confirmación con contraseña).
3. Estados visuales por trámite consolidados en un catálogo cerrado (5.1 del backlog de preguntas).
4. Integración del flujo Apelación → Jurídica (paquete ZIP descargable).
5. Validar el patrón de "renuncia a términos" con UX de firma (CPACA Art. 76).

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.3`
