# Changelog · Naowee IVC

Historial de versiones del módulo IVC (Inspección, Vigilancia y Control) — Ministerio del Deporte de Colombia.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) + esquema semver con prefijo de proyecto adoptado del Naowee Project: `ivc-vMAJOR.MINOR.PATCH`.

---

## [ivc-v1.5.7] — 2026-05-25

> 🎛️ **Refinamiento profundo de Fase 1: stepper dinámico, máscaras de entrada, modal de Dirección estructurado, alineación 100% con DS Naowee.**

### Added — Modal de Dirección estructurado (feedback Juanma)

Patrón inspirado en el SUID. El textfield "Dirección" libre se reemplaza por un **trigger** (botón con estilo de textfield) que abre un modal con campos separados:

- **Tipo de vía** (dropdown · Calle, Carrera, Diagonal, Avenida, Transversal, Autopista) — requerido
- **Número** (mask numeric, maxLength 5) — requerido
- **Letra** (dropdown · Ninguna, A–Z incluyendo Ñ)
- **BIS** (checkbox canónico DS)
- **Número de cruce** (mask numeric)
- **Letra de cruce** (dropdown)
- **Número de casa** (mask numeric)
- **Información adicional** (texto libre, maxLength 60)

El botón **Guardar** se mantiene disabled hasta tener `tipoVia + numero`. Al guardar, formatea automáticamente a string display (ej. `"Calle 50B Bis # 20-30, Apto 301"`) y persiste en `STATE.data.direccion` + estructurado en `STATE.data.direccionEstructurada`. Dismiss canónico DS (`.naowee-modal__dismiss`). Sin botón Cancelar redundante.

### Added — Sistema de máscaras de entrada (feedback Juanma)

Nuevo helper `applyMask(maskType, raw)` en el helper `tf()`. Soporta:

| Mask | Comportamiento |
|---|---|
| `tel` | Solo dígitos, `+`, `-`, `()`, espacios |
| `numeric` | Solo dígitos |
| `money` | Solo dígitos (display con miles a futuro) |
| `email` | Sin espacios, forzado lowercase |
| `alpha` | Sin números |

Aplicado a:
- **NIT** → `mask:'tel'`, maxLength 13
- **Teléfono** → `mask:'tel'`, maxLength 18
- **Correo** → `mask:'email'`, maxLength 80
- **Todos los campos numéricos del modal Dirección** → `mask:'numeric'`

`inputmode` también se setea para teclados mobile correctos (tel / numeric / email).

### Added — Stepper dinámico según tipo de organismo (feedback Juanma)

Antes el stepper mostraba siempre 7 pasos y la lógica de `next()/prev()` "saltaba" el paso de Asamblea para Asociaciones, generando el salto visual 3 → 5 que confundía al usuario. Ahora:

| Organismo | Pasos visibles | Total |
|---|---|---|
| Liga Deportiva Departamental | 1-7 completos | 7 |
| **Asociación Deportiva** | **1-6 (sin Asamblea)** | **6** |
| Federación Deportiva Nacional | 1-7 completos | 7 |

Implementación: nuevo mapa `STEPS_POR_ORGANISMO` + helpers `pasosAplicables()` e `indiceVisual()`. `STATE.step` sigue siendo el índice absoluto del array `STEPS` (no rompe lógica interna). Solo cambia la presentación. Escalable: para nuevos organismos basta editar el mapa.

### Fixed — Textfield + dropdown ahora idénticos visualmente (feedback Doug)

El DS Naowee tiene inconsistencia interna: `.naowee-textfield__input-wrap` usa `--naowee-color-gray-600 (#8788AB)` para el borde, mientras `.naowee-dropdown__trigger` usa `--naowee-color-gray-300 (#D0D4E6)`. Override scoped en `.wz-card` y `.ivc-modal` para que ambos usen el borde lighter del dropdown. También se igualó el color y peso del placeholder.

### Fixed — Bordes "rotos" del repeatable (feedback Doug)

Los wrappers `.ivc-repeatable__head` y `.ivc-repeatable__add` tenían background distinto al del wrapper exterior pero sin matchear el `border-radius`. Se agregaron `border-top-left/right-radius: 12px` al head y `border-bottom-left/right-radius: 12px` al add.

### Fixed — Mini-inputs alineados al DS canónico (feedback Doug)

| Atributo | Antes | Ahora |
|---|---|---|
| `border-radius` | 6px | **8px** (`--radius-md`) |
| `height` | 36px | **40px** |
| `padding` | 0 10px | **0 12px** |
| `font-size` | 13px | **14px** (`--text-base`) |
| `placeholder color/weight` | — | `--text-secondary` / 400 |

Mismo ajuste para el datepicker `--small` dentro de filas repeatable (40px / radius 8 / padding 12).

### Fixed — File uploader más sutil (feedback Doug)

| Atributo | Antes | Ahora |
|---|---|---|
| Icono | 32×32, stroke 2 | **20×20, stroke 1.5** |
| Padding | 24×18 | **18×18** |
| Title | 13.5px | **13px** |
| Hint | 12px | **11.5px** |

Aplica en todas las pantallas que usan el componente `uploadField()`.

### Changed — Botón "Anterior" y "+ Agregar fila" → ghost real (feedback Doug)

`.naowee-btn--quiet` (fill crema accent) pasa a `.naowee-btn--mute` (transparent idle + hover sutil). Aplica al btn `← Anterior` del wizard footer y a los `+ Agregar fila` / `+ Agregar tipo de reunión` de los repeatables. Override scoped del `--mute` dentro de `.ivc-repeatable__add` para hover con `--accent-bg` y padding-left animado.

### Changed — Checkbox canónico DS (feedback Doug)

Reemplazado el markup inventado (`__indicator` + `__input`) por el canónico DS Naowee:
- `<label class="naowee-checkbox">`
- `<input type="checkbox" visually-hidden>`
- `<span class="naowee-checkbox__box">` con SVG dentro
- `<span class="naowee-checkbox__label">`

El modifier `--checked` se toggle en el wrapper vía JS al cambiar el input. Hereda todos los estados canónicos: hover, checked, checked+hover, active scale.

---

## [ivc-v1.5.6] — 2026-05-25

> 📎 **Asociación Deportiva (F2): uploaders condicionales de inventario / afiliación + 2 campos faltantes de Inscripción de Miembros (feedback Juanma).**

### Added — Nueva sección "Inscripción de Miembros" (F2-2.5 + F2-2.5a)

En el paso 2 del flujo de Asociación Deportiva, entre "Constitución / Elección del OA" e "Inventario y afiliación internacional":

- **N° Resolución de Inscripción de Miembros** (texto libre, requerido) — `F2-2.5`.
- **Radicado de la Resolución de Inscripción de Miembros en IVC** (texto libre, requerido) — `F2-2.5a`.

Ambos provienen del XLSX MÓDULO IVC oficial y faltaban en el formulario.

### Fixed — File uploaders condicionales para inventario y afiliación

Al responder **"Sí"** en cada uno de los radios:

- **¿Cuenta con inventario de bienes?** → ahora aparece el `uploadField` para cargar el inventario.
- **¿Cuenta con documentos de afiliación internacional?** → ahora aparece el `uploadField` para cargar el documento. "No" y "No aplica" no requieren archivo (sin cambio).

Antes el radio se quedaba en "Sí" sin posibilidad de adjuntar nada — el organismo no podía cumplir el requisito documental. Se reutiliza el componente canónico `uploadField()` (mismo que ya usaba `f3_archivo_cert` en F3 Asamblea).

### Changed — `STATE.data.f2`

Cuatro campos nuevos:
- `no_inscripcion_miembros` (string)
- `radicado_inscripcion_miembros` (string)
- `archivo_inventario` (file object | null)
- `archivo_afiliacion` (file object | null)

Aplicado en las dos copias del formulario (`prototype/usuario-externo/formulario-fase-1.html` del repo + `IVC/demo-fase-1-formulario.html` standalone).

---

## [ivc-v1.5.5] — 2026-05-25

> 🪪 **Nombre y NIT del organismo se autopopulan con un ejemplo realista del tipo elegido (Liga / Asociación / Federación).**

### Fixed — Bug crítico de demo: el paso 2 mostraba siempre "Liga de Atletismo de Antioquia"

El seed de `STATE.data.nombre` tenía hardcoded `'Liga de Atletismo de Antioquia'`, así que aunque el usuario eligiera Federación o Asociación en el paso 0, el paso 1 (Identificación) precargaba siempre el nombre de una liga. Lo mismo con el NIT (`'800123456-7'`).

### Changed — `formulario-fase-1.html` (radicación pública)

- **Nuevo catálogo `EJEMPLOS_POR_ORGANISMO`** con nombre + NIT realistas para cada tipo:
  - **Liga** → "Liga de Atletismo de Antioquia" + NIT `800123456-7`
  - **Asociación** → "Asociación de Tenis de Cundinamarca" + sin NIT
  - **Federación** → "Federación Colombiana de Fútbol" + sin NIT
- **Seed inicial vacío** (`nombre: ''`, `nit: ''`) — el ejemplo se aplica solo cuando el usuario elige el tipo en el paso 0.
- **Helper `aplicarEjemploOrganismo(orgId)`**: aplica el ejemplo cuando el usuario cambia el tipo, pero **solo pisa el valor previo si está vacío o si coincide con otro ejemplo canónico**. Si el usuario ya tipeó algo a mano, no se lo borra.
- **Placeholder dinámico** del campo "Nombre del organismo" en el paso 1: cambia según el tipo elegido.

Aplicado en las dos copias del formulario (`prototype/usuario-externo/formulario-fase-1.html` del repo + `IVC/demo-fase-1-formulario.html` standalone).

---

## [ivc-v1.5.4] — 2026-05-25

> 🪪 **NIT condicional: solo se muestra/valida cuando el organismo es Liga (feedback Juanma).**

### Changed — `formulario-fase-1.html` (radicación pública)

Aplicado en las **dos copias** del formulario (`prototype/usuario-externo/formulario-fase-1.html` del repo + `IVC/demo-fase-1-formulario.html` standalone):

- **Paso 1 · Identificación**: el campo NIT solo se renderiza cuando `STATE.tipoOrganismo === 'liga'`. Para Asociación y Federación, el teléfono pasa a renderizarse a ancho completo (sin grid de 2 columnas vacía).
- **Validación**: NIT se agrega al array de `required` solo si el organismo es Liga. Para Asociación/Federación ya no bloquea el envío del paso 1.
- **Paso final · Revisión**: la fila "NIT" del summary se omite cuando no es Liga.
- **Pantalla de éxito · Comprobante de radicación**: la meta del organismo omite `NIT XXX · ` cuando no es Liga (queda solo el label del tipo de organismo).

**Por qué:** Juanma confirmó que solo las Ligas Deportivas Departamentales tienen NIT como persona jurídica con esa figura tributaria. Asociaciones y Federaciones no manejan NIT en el trámite de Otorgamiento de Reconocimiento Deportivo. Antes el campo aparecía para los 3 organismos y bloqueaba el envío si quedaba vacío.

---

## [ivc-v1.5.3] — 2026-05-25

> 🧩 **Profesional end-to-end (bandeja + workspace canónico) + modal asignación masiva refactor + limpieza de perfiles.**

### Added — Nueva pantalla `prototype/profesional/bandeja.html` (~800 líneas)
- Lista de trámites asignados al profesional logueado (default `cp-001`), leída en vivo de `IVCStore.misAsignaciones(profId)`.
- **3 stat cards** en la cabecera: "Pendientes de validar", "En validación", "Cumplidos hoy" — usan tokens `--green` / `--orange-bg` / `--blue-bg` y se recalculan a cada render.
- Tabla con columnas: Radicado, Tipo (con badge `--tipo-tramite-bg`), Organismo, Radicado en, Plazo (semáforo verde >5d / naranja 1-5d / rojo vencido), Estado, Asignado por, Acciones.
- Empty state canónico DS (`.naowee-empty-state`) cuando no hay asignaciones.
- Filtros por estado + buscador + footer flotante (patrón Project v2.0.3).
- Reactividad: listeners de `tramite:asignado` y `store:mode-changed` re-renderan automáticamente.

### Added — Reescritura completa de `prototype/profesional/workspace.html` (~1300 líneas, patrón `proyecto-detalle.html` v2.0.3)
- **Hero card** sin shadow/elevation (override DS), header con `Volver a la bandeja` justificado a la izquierda + metadatos del trámite (radicado, organismo, tipo, plazo restante).
- **Tabs container** con indicator naranja canónico DS (`.naowee-tabs__indicator`), divider de borde a borde (no recortado), padding lateral en los tabs + hover gris suave en no-seleccionados.
- **Tab "Documentos"** con patrón `.ra-item + .ra-toggle` portado verbatim de `revisar-area.html` v2.0.3:
  - Tri-state por documento (`cumple` / `parcial` / `no cumple`) con tooltips canónicos en cada acción.
  - CTA "Descargar documento" ghost button (label naranja + hover naranja claro), reemplaza al previo "Ver documento".
  - Barra de progreso semáforo (rojo→naranja→verde) con porcentaje X de Y validados.
- **Tab "Datos"** con grid 2-col, labels uppercase 10px letterspaced gris claro (`--text-muted`).
- **Tab "Historial"** con timeline vertical + colores semánticos por tipo de evento (positive / caution / negative / info), portado de Project v2.0.3.
- **CTA único "Finalizar revisión"** inline (sin sticky footer): infiere resultado del checklist y cambia label + color + handler dinámicamente (`cumple` verde, `parcial` naranja, `no cumple` rojo).
- **Tooltip portal pattern** (`overflow: visible !important` en padres + `z-index: 9999`) — los tooltips ya no se recortan dentro de cards con overflow.
- **Indicator z-index trick**: `bottom: -1px; z-index: 2` para cubrir el `border-top` gris del panel y cerrar el hueco visual entre tab activo y borde.

### Changed — Modal asignación masiva (`coordinador/bandeja.html`)
- **2 estrategias finales** (eliminada la opción "manual" — confusa y redundante):
  1. **Mismo profesional para todos** — grid de cards de profesionales con avatar + scroll horizontal (cabe N sin romper el layout).
  2. **Distribuir manualmente** — `.naowee-dropdown` canónico por fila (reemplaza el `<select>` nativo que se había colado).
- **Summary unificado**: un solo `.naowee-message` con `variant` dinámico (`caution` cuando hay validación pendiente, `informative` cuando todo está OK).
- **Section titles uppercase letterspaced** consistentes con el resto del DS.
- **X canónico** (`.naowee-modal__dismiss`) gris claro con hover gris medio en el header.
- **Dividers** vía `border-bottom` / `border-top` en header y footer (no en el contenedor).
- **Tooltips portaled** en las cards de profesionales — antes se recortaban por el `overflow: hidden` del grid.

### Changed — Limpieza del switcher de perfiles
- **Eliminado el perfil "usuario-externo"** de `shared/data.js` y `shared/shell.js` (no aporta a la demo del módulo IVC — el flujo del solicitante vive en el formulario standalone).
- Default perfil cambiado a `coordinador`.
- Card destacado en `prototype/index.html` ahora es **Coordinadora** ("Iniciar como Coordinadora de Deporte" → `coordinador/bandeja.html`).
- **Item de navegación acortado**: "Bandeja de trámites" → **"Bandeja"** (más limpio en el sidebar colapsado).
- `NAV_ITEMS['profesional']` agrega `bandeja-prof` → `profesional/bandeja.html`.

### Fixed — Segmented control "Modo demo" no respondía
- **Causa**: los `<button>` se renderizaban después de que `wireModeSwitch()` registrara el listener individual por botón, así que los nuevos no escuchaban click.
- **Solución**: event delegation sobre el contenedor del segmented (`.demo-role-switcher__mode-switch`), idéntico al patrón de Project v2.0.3.

### Fixed — Snackbar quedaba detrás del demo-switcher
- **Causa**: `--z-snackbar: 900` < `--z-demo-switcher: 1200`.
- **Solución**: subido a `--z-snackbar: 1300` en `shared/tokens.css`.

### Fixed — `TIPO` mostraba `undefined` en la bandeja del coordinador
- **Causa**: el store persiste como `tipoTramite` pero la tabla leía `t.tipo`.
- **Solución**: fallback `(t.tipoTramite || t.tipo || '—')` en el render.

### Fixed — Toast no aparecía tras `confirmMasivo`
- **Causa**: race condition entre el cierre del modal, el re-render de la tabla y el snackbar dentro del mismo tick.
- **Solución**: cerrar modal primero, luego `setTimeout(220ms)` con `try/catch` separados para `asignar()`, `refresh()` y `snackbar()`.

### Fixed — Bug crítico de `IVCStore` (silent failure)
- **Causa**: `SEED.profesionales` era accedido durante la creación del literal de `SEED` → `undefined` durante la inicialización → IIFE crashea → `window.IVCStore` nunca se asigna → todos los botones del demo-switcher fallaban en silencio.
- **Solución**: extraída constante `PROFESIONALES` + factory `buildSeed()` que se invoca después.

### Fixed — Workspace: múltiples rondas de pulido visual
- Divider de borde a borde de los tabs (movido a `.ivc-tab-panel { border-top }` porque `.naowee-tabs` tenía `overflow-x: auto` que recortaba el `::after`).
- Tabs con background transparente (`!important`) — el DS aplicaba `--naowee-color-interactive-fill-mute-idle` (crema) que chocaba con el indicator naranja.
- Botón "Volver a la bandeja" sin estilo `textlink` (sin underline, sin color accent — ahora es ghost).
- Quitada la barra fixed inferior con leyenda "no cumple / parcial / cumple" — los botones por documento ya son auto-explicativos.

### Changed — Snackbar a markup canónico DS v1.8.0
- `<div class="naowee-snackbar naowee-snackbar--{variant}">` con `.naowee-snackbar__icon` + `.naowee-snackbar__content` + `.naowee-snackbar__action` opcional.
- Variants: `positive` (verde), `informative` (azul), `caution` (naranja), `negative` (rojo).
- Aplicado en `shared/shell.js` (helper `Snackbar.show()`) — todas las páginas heredan el patrón.

### Changed — Pill de versionamiento y logo Naowee en footers
- `shared/naowee-footer.js` bumpea a `v1.5.3`.
- Logo Naowee SVG real (no placeholder) en los footers flotantes del formulario Fase 1 y de la bandeja.

---

## [ivc-v1.4.8] — 2026-05-23

> 🏷️ **Pill de versionamiento + fix tooltips bandeja + limpieza paso 1 Fase 1.**

### Added — Pill de versionamiento (patrón Project v2.0.3)
- `prototype/shared/version-pill.css` y `prototype/shared/version-pill.js` (componente compartido). Pill flotante esquina inferior derecha con `IVC v1.4.8` → link a release notes en GitHub.
- Patrón inspirado en `naowee-test-digitacion/project/v2.0.3/shared/shell.js` L556+ (version switcher con dropdown). Simplificado para IVC: solo muestra versión + link, sin dropdown de historial (puede sumarse en v1.5+).
- Aplicado a `prototype/coordinador/bandeja.html` (vía `<link>` + `<script>` shared) y a `prototype/usuario-externo/formulario-fase-1.html` (inline porque es standalone).
- Scope `.ivc-*` custom — no override del DS.
- `z-index: 998`, `pointer-events: auto` solo en el botón.

### Fixed — Tooltips de acciones no se mostraban (`coordinador/bandeja.html`)
- Causa: el DS canónico aplica `opacity: 0; pointer-events: none` a `.naowee-tooltip__content` en estado idle, y la regla `:hover` del DS no aplica cuando el `__content` ya está portaled fuera del trigger (en el `<body>`).
- Solución: clase `.is-portaled` ahora fuerza con `!important`: `opacity: 1; pointer-events: none; display: inline-block; visibility: visible`. El JS de `setupTooltipPortal` ya posicionaba correctamente, solo faltaba forzar la visibilidad del CSS canónico.

### Fixed — 2 info messages redundantes eliminados (`usuario-externo/formulario-fase-1.html`)
- Removido `messageInfo('Demo enfocada en Otorgamiento', ...)` (estado post-selección de organismo).
- Removido `messageInfo('Selecciona el tipo de organismo', ...)` (estado vacío del paso 1).
- Razón: el placeholder del dropdown y el sufijo "Próximamente" en las opciones ya cumplen ambas funciones.

---

## [ivc-v1.5.2] — 2026-05-25

> 🎯 **Modo demo movido al panel del demo-switcher (patrón exacto de Project v2.0.3).**

### Changed — Selector de modo demo: ubicación + naming
- **Movido del header del card de bandeja al panel del `demo-role-switcher`** (donde está "Cambiar perfil"). Patrón consistente con Project v2.0.3: el control de modos vive junto al control de perfiles, dentro de un único panel "sandbox".
- **Renaming a paridad con Project:**
  - "Con datos" → **"Libre · con datos"** (12 trámites seed)
  - "Virgen" → **"Guiado · vacío"** (bandeja vacía; el flujo arranca cuando creas un trámite desde el formulario)
- Label "MODO DEMO" en uppercase letterspaced encima del segmented (mismo tipo que "CAMBIAR DE PERFIL (SIMULADO)").
- Snackbar con texto contextual al cambiar modo.

### Added — Estilos canónicos en `shared/shell.css`
- `.demo-role-switcher__mode-section` — divisor sutil + padding.
- `.demo-role-switcher__mode-label` — label uppercase 10px letterspaced.
- `.demo-role-switcher__mode-switch` — segmented pill (mismo lenguaje que `.ivc-mode-switch` previo).
- `.demo-role-switcher__mode-btn[aria-pressed="true"]` — fondo blanco + accent + box-shadow + ring naranja.

### Added — Listener cross-component
- En `bandeja.html`: `IVCStore.on('store:mode-changed', ...)` → cuando el demo-switcher cambia el modo, la bandeja refresca state + render automáticamente.

### Removed
- `.ivc-mode-switch` (CSS) y su markup en el header del card de bandeja (reemplazado por el del demo-switcher).
- `wireModoSwitch()` function en bandeja.html (lógica migrada a `shell.js`).

### Beneficio cross-rol
Cuando se agreguen futuras pantallas (workspace Profesional, cola Coord IVC, etc.) que carguen `shell.js`, **TODAS heredarán automáticamente el control de modo demo** — no hay que replicarlo por pantalla. Patrón exacto de Project v2.0.3.

---

## [ivc-v1.5.1] — 2026-05-25

> 🎛️ **2 modos demo + fix botón asignación masiva.**

### Added — Selector de modo demo (patrón Project v2.0.3)
- Segmented control `.ivc-mode-switch` en el header del card de bandeja con 2 botones:
  - **"Con datos"** → seed de 12 trámites mock + 4 profesionales (modo default).
  - **"Virgen"** → bandeja vacía; los profesionales sí quedan disponibles para asignar trámites creados desde el formulario.
- API store: `IVCStore.getMode()`, `IVCStore.setMode('demo' | 'blank')`. Persiste en `state.mode` dentro del localStorage.
- `reset()` ahora preserva el modo activo en lugar de volver siempre a `demo`.
- Snackbar de confirmación al cambiar modo: "Modo demo: 12 trámites cargados" / "Modo virgen: bandeja vacía".
- Subtitle del card dinámico: "12 trámites — Deporte Aficionado" / "Sin trámites — Deporte Aficionado".

### Fixed — Botón Asignación masiva
- **Disabled si `selectedCount < 2`**: la asignación masiva solo tiene sentido con 2+ trámites; con 1 hay flujo individual. Antes se habilitaba con 1.
- Tooltip dinámico: "Selecciona al menos 2 trámites para asignación masiva" cuando disabled / "Asignar N trámites a un profesional" cuando habilitado.
- **Color del `(0)` corregido**: el span `.bulk-hint` heredaba `var(--text-muted)` (gris) en lugar del color del botón padre. Cambiado a `color: inherit` + `opacity: 0.85` para que se vea blanco dentro del botón naranja (loud).
- Estilos `:disabled`/`[disabled]` page-scoped: `cursor: not-allowed; opacity: 0.5` (paridad con el patrón loud:disabled del DS).

---

## [ivc-v1.5.0] — 2026-05-25

> 🔗 **Arquitectura end-to-end: store compartido + bandeja conectada al formulario.**

### Added — Arquitectura
- **`prototype/shared/ivc-store.js`** — source of truth. localStorage namespaced `ivc:`. API completa: `crearTramite`, `asignar`, `actualizarEstado`, `getTramites(filtros)`, `misAsignaciones(profesionalId)`, `getProfesionales(area)`. Event emitter: `tramite:creado`, `tramite:asignado`, `tramite:estado-cambiado`, `store:changed-external` (cross-tab via storage event). Seed inicial con 12 trámites mock + 4 profesionales.
- **`docs/PLAN-END-TO-END.md`** — plan completo de la arquitectura demo end-to-end: schema, API pública, flujo cross-roles, plan de releases v1.5.x.

### Changed — Bandeja Coord conectada al store
- `bandeja.html` ya no lee de `TRAMITES_BANDEJA` hardcoded; ahora carga de `IVCStore.getTramites({ area: 'aficionado' })` en `loadFromStore()`.
- Asignación individual y masiva persisten al store (`IVCStore.asignar(id, profId, actor)`) — antes solo mutaban el state local.
- Listeners reactivos: `tramite:creado` / `tramite:asignado` / `store:changed-external` → re-renderiza stats + tabla. Si el Usuario Externo crea un trámite en otra tab, el Coordinador lo ve aparecer en vivo (cross-tab).

### Changed — Formulario Fase 1 conectado al store
- Al confirmar el paso 6 (Documentos), en lugar de generar un radicado random, llama `IVCStore.crearTramite({...})` que:
  - Asigna un ID consecutivo (`IVC-2026-NNN`) desde un contador persistido
  - Crea el histórico inicial con 2 entradas (`Radicado` + `Remisión automática a Deporte Aficionado`)
  - Estado inicial: `No asignada`
  - Persiste en localStorage y emite `tramite:creado`
- Fallback: si el store no carga (demo standalone aislado), genera radicado random como antes.

### Changed — Bandeja: ancho aprovechado
- `.page-inner { max-width: 1480px !important }` (override page-scoped del 1200px canónico de `shell.css`). La tabla con 9 columnas respira mejor.
- Stat grid intermedio en tablet (901-1200px): 2 columnas con el primer card span 2.

### Cómo usar localmente
Para ver el flujo end-to-end en `file://`, abrir AMBAS pantallas desde el mismo directorio raíz `/Users/dvargas/Desktop/naowee-ivc/prototype/`:
- Formulario: `prototype/usuario-externo/formulario-fase-1.html`
- Bandeja: `prototype/coordinador/bandeja.html`

Mismo origin = comparten localStorage. El demo standalone en `/Users/dvargas/Desktop/IVC/` queda como prototipo aislado (sin persistencia).

### Pendiente (v1.5.x)
- v1.5.1 — Refactor workspace Profesional: `misAsignaciones(profId)`
- v1.5.2 — Responsive audit cross-pantallas (mobile cards, tablet column hiding)
- v1.5.3 — Botón "Reset demo" en menú admin

---

## [ivc-v1.4.7] — 2026-05-23

> 🎯 **Stepper Fase 1: pulse no se corta + connectors no pisan labels.**

### Fixed — `prototype/usuario-externo/formulario-fase-1.html`

**1. Pulse del paso activo cortado en su tamaño máximo**
- Causa: `.wz-stepper-wrap` y `.naowee-stepper` con `overflow-x: auto` recortaban el `box-shadow: 0 0 0 8px ...` del keyframe `wzStepperPulse` cuando llegaba a su máximo.
- Solución: `overflow: visible` en ambos contenedores + `padding-top: 24px` en el wrap (antes 18px) para dar respiración al pulse hacia arriba.

**2. Líneas de progreso encima de los labels**
- Causa: layout horizontal del step (`[número] gap [label]` con `align-items: center`) hacía que el `__connector` quedara verticalmente alineado con el label, atravesándolo en su trayecto desde el final de un step al inicio del siguiente.
- Solución: layout vertical estándar de stepper:
  - `.naowee-stepper__step { flex-direction: column; align-items: center; gap: 6px; }` → número arriba, label debajo, centrados.
  - `.naowee-stepper__connector { align-self: flex-start; margin-top: 12px; }` → alineado a la altura del centro del círculo (26px / 2 - 2px/2 ≈ 12px), por arriba del label.
  - `.naowee-stepper { align-items: flex-start; }` → preserva la alineación top del nuevo layout vertical.

### Resultado
- Pulse se ve completo en su anillo de 8px sin recortes.
- Connector va de número a número (a la altura del centro), nunca toca el texto del label.
- Patrón canónico de stepper visual (Material/HIG/Fluent) — número arriba, label debajo.

---

## [ivc-v1.4.6] — 2026-05-23

> 🎈 **Tooltip portal + reducción de espacio en header.**

### Fixed — `prototype/coordinador/bandeja.html`

**1. Tooltips de las acciones cortados por overflow del container**
- **Causa raíz:** el `.naowee-tooltip__content` del DS canónico usa `position: absolute`, que se recorta cuando algún padre (en este caso `.naowee-table-card` por su `overflow`) actúa como clip.
- **Solución:** patrón portal al body — al hacer hover sobre `.naowee-tooltip`, el `.naowee-tooltip__content` se mueve a `document.body` con `position: fixed` y coordenadas calculadas desde `getBoundingClientRect()` del trigger. Al `mouseout` vuelve al trigger original (transparente).
- **Edge cases manejados:**
  - Clamp horizontal al viewport (cuando el tooltip se va más allá del borde derecho)
  - Flip-down automático si arriba no cabe
  - `mouseout` hacia hijos del trigger no dispara cierre (`trigger.contains(ev.relatedTarget)`)
  - Scroll del page → cierra tooltips huérfanos y los devuelve al trigger
  - `data-tip-id` / `data-parent-tooltip-id` para resolver el origen del tooltip portaled

**2. Espacio sobra entre el CTA "Asignación masiva" y el divider**
- El `.naowee-table-card__head` canónico (de `shared/components.css` L613) tiene `padding-bottom: 10px`. Combinado con `padding-top: 14px` del toolbar = 24px de espacio entre el CTA y el divider.
- Solución: override page-scoped con selector específico `.naowee-table-card > .naowee-table-card__head { padding-bottom: 4px; }` → ahora 18px en lugar de 24px. Más compacto sin pegar el CTA al divider.

### Patrón cross-componente
El portal pattern ahora se usa en 3 lugares: `.naowee-dropdown__menu`, `.naowee-datepicker--popover`, y `.naowee-tooltip__content`. Todos comparten la misma estrategia: mover al body con `position: fixed` + coordenadas dinámicas desde el trigger.

---

## [ivc-v1.4.5] — 2026-05-23

> 🧹 **4 ajustes finos: limpieza visual + consistencia + modal canónico.**

### Fixed — `prototype/coordinador/bandeja.html`

**1. Eliminado banner `Remisión automática del Sistema`**
El Coordinador ya conoce el comportamiento del sistema — el banner explicativo era ruido visual. Eliminados los 9 líneas de markup `.naowee-message--informative`.

**2. Header spacing simétrico**
Antes: padding del toolbar asimétrico (8px top / 14px bottom) → divider visualmente más cerca del searchbox que del title. Después: `padding: 14px 20px` simétrico → divider centrado entre title/subtitle y searchbox.

**3. Badge "En validación" a bajo contraste**
Antes: `--informative` fuerte (azul saturado, alto contraste) competía con "Asignada" `--informative --quiet` y "En remisión" `--caution --quiet`. Después: `--informative --quiet` consistente. Todos los estados de la fila ahora son bajo contraste con el mismo peso visual.

| Estado | Antes | Después |
|---|---|---|
| En remisión | `--caution --quiet --small` (bajo contraste) | sin cambio |
| Asignada | `--informative --quiet --small` (bajo contraste) | sin cambio |
| En validación | `--informative --small` (**alto contraste**) | `--informative --quiet --small` (bajo contraste) |

**4. Modal histórico al patrón canónico**
- Eliminado botón "Cerrar" del `__footer` (redundante con el X del `__header`)
- Eliminado el `<div class="naowee-modal__footer">` completo
- Removido `--scrollable` (el body solo tiene un timeline corto, no necesita scroll forzado)
- `max-width: 560px` → `480px` (más compacto)
- Botón X migrado de `--quiet` (naranja idle) → `--mute` (Ghost canónico transparent idle)
- Eliminado el event listener del botón Cerrar redundante
- Resultado: modal 30% más bajo, sin espacio desperdiciado, patrón consistente con el resto del DS

---

## [ivc-v1.4.4] — 2026-05-23

> 🪶 **3 ajustes de jerarquía visual en bandeja.**

### Fixed — `prototype/coordinador/bandeja.html`

**1. Plazo como label semántico (no badge) — Estado como único badge en la fila**
- Antes: `Plazo` y `Estado` competían visualmente (ambos eran badges con pill background).
- Después: `Plazo` se convierte en texto plano con color semántico:
  - `.row-plazo--positive` (verde, >5 días)
  - `.row-plazo--caution` (naranja, 1-5 días)
  - `.row-plazo--negative` (rojo, vencido)
- `Estado` conserva el badge canónico `.naowee-badge` como ÚNICO peso visual de la fila.
- Resultado: jerarquía clara — el ojo va primero al badge del estado, después al plazo, después al asignado.

**2. Acciones a Ghost canónico real (`.naowee-btn--mute`, no `--quiet`)**
- Doug corrigió: el "ghost" en el DS canónico es `.naowee-btn--mute`, no `.naowee-btn--quiet`.
- DS L707-709: `Hierarchy: Mute (Ghost/Tertiary)` con `background: var(--naowee-color-interactive-fill-mute-idle)` = `transparent` en idle.
- `.naowee-btn--quiet` tiene `background: orange-100` desde el idle (lo que dejaba esos círculos crema/naranja claro visibles permanentemente en las acciones).
- Migrados los 3 botones (Asignar, Reasignar, Histórico) de `--quiet` → `--mute`:
  - **Idle:** transparente (solo el ícono naranja visible, sin background)
  - **Hover:** background naranja claro + tooltip canónico aparece
- Tooltips ahora usan `.naowee-tooltip--bottom` para no chocar con la fila superior.

**3. Eliminado doble divider en el header del card**
- Antes: `<hr class="naowee-table-card__divider">` + `border-top: 1px solid var(--border)` del toolbar → 2 líneas seguidas.
- Después: eliminado el `<hr>` explícito; el `border-top` del toolbar provee la separación.
- Padding del toolbar ajustado a `8px 20px 14px` para acercar el searchbox al header (espacio total entre texto del header y searchbox: ~18px en lugar de ~32px).

---

## [ivc-v1.4.3] — 2026-05-23

> 🎚️ **5 ajustes finos UI en bandeja (toolbar + columnas + acciones).**

### Fixed — `prototype/coordinador/bandeja.html`

**1. Searchbox menos ancho.** Cambiado de `flex: 1 1 auto; min-width: 200px;` → `flex: 0 1 320px; min-width: 240px; max-width: 360px;`. Ya no crece infinito.

**2. Spacer flexible entre search y filtros.** Nuevo `<div class="bandeja-toolbar__spacer">` con `flex: 1 1 auto` para empujar los filtros a la derecha (patrón Senior UX para toolbars con grupos lógicos separados).

**3. Dropdowns altura uniforme con searchbox.** Agregada la clase canónica `.naowee-dropdown--medium` (DS L2435) a los 2 filtros (Estado, Tipo de trámite). Ahora ambos dropdowns y el searchbox comparten altura de 40px (`--naowee-size-height-inputs-medium`).

**4. Renombre de columnas (más conciso, criterio Senior UX):**
- "Fecha radicación" → **"Radicado en"** (más corto y semánticamente claro como verbo conjugado)
- "Estado asignación" → **"Estado"** (el contexto de la columna ya implica que es de asignación; redundante)
- "Profesional asignado" → **"Asignado"** (el contexto ya implica que es un profesional)

**5. Acciones a icon button ghost + tooltip canónico.**
- "Asignar" (texto) → icono `user-plus` con tooltip "Asignar trámite"
- "Reasignar" (texto) → icono `refresh` (dos flechas circulares) con tooltip "Reasignar a otro profesional"
- Histórico (ya era icon) → ahora con tooltip "Ver histórico"
- Estructura canónica: `<span class="naowee-tooltip"><button class="naowee-btn--quiet --icon --small">...</button><span class="naowee-tooltip__content">...</span></span>` (DS L4347-4376)
- Acciones más compactas → más trámites visibles sin scroll horizontal en pantallas chicas

### Consistencia
Las 3 acciones (Histórico, Asignar/Reasignar, futuras) ahora siguen el mismo patrón ghost-with-tooltip. Patrón escalable: agregar una nueva acción es replicar la estructura, sin reordenar nada.

---

## [ivc-v1.4.2] — 2026-05-23

> ✨ **Refinamiento UX/UI Pro Max de la pantalla de éxito en Fase 1.** Migración del banner de estado a componente canónico + refactor del comprobante de radicación con jerarquía visual + íconos + eliminación de redundancias.

### Fixed — `prototype/usuario-externo/formulario-fase-1.html`

**1. Banner de estado: `.status-banner` custom → `.naowee-message--informative` canónico**
- Eliminadas las 6 reglas CSS custom (`.status-banner`, `__icon`, `__body`, `__title`, `__text`) que duplicaban funcionalidad del DS.
- Reemplazado el markup por estructura canónica del DS: `.naowee-message__header` + `__icon` + `__title` + `__text`.
- El componente ahora hereda automáticamente los colores semánticos azules del DS sin overrides locales.

**2. Comprobante de radicación rediseñado (UX/UI Pro Max)**

**Antes:** 6 rows planos con border-bottom dashed igualitos, sin íconos, sin jerarquía visual + 3 redundancias.

**Después:** 5 rows con grid `[40px icon] [content] [aside]`:

| Row | Tratamiento | Justificación |
|---|---|---|
| Trámite | Icono documento gris + label uppercase letterspaced + value bold 14px | Identifica QUÉ trámite — info más importante después del organismo |
| Fecha de radicación | Icono calendario gris + mismo formato | Timestamp del evento |
| **Plazo de respuesta** | `.kv-row--highlight` icono naranja + value naranja 15px + **hint con fecha de vencimiento exacta** | Dato MÁS accionable para el organismo — destacado intencionalmente |
| Estado actual | Icono check gris + label uppercase + **badge `.naowee-badge--informative --quiet --small` en aside** | Estado como componente canónico, no texto plano azul |
| Notificaciones | Icono email gris + value "Recibirás email en cada cambio de estado" | Información útil reposicionada del párrafo introductorio |

**3. Redundancias eliminadas (3)**
- ❌ Row "Organismo" → ya está en `.receipt__person-meta` del header del comprobante
- ❌ Row "NIT" → ya está en `.receipt__person-meta`
- ❌ Row "Estado actual: Radicado" (texto plano azul) → ya está en el `.naowee-message--informative` arriba + ahora se muestra como badge en el row consolidado

**4. Detalles de tipografía y spacing**
- Labels en `text-transform: uppercase` + `letter-spacing: .4px` + 12px → patrón Senior UI para diferenciarlos de los valores
- Padding del row aumentado a `14px 0` (antes 6px) → mejor respiración entre rows
- `border-bottom` cambiado de `dashed` → `solid 1px` → más limpio y profesional
- Iconos en wrapper 40x40 con `border-radius: 10px` + `background: #f5f6fa` → mismo patrón del módulo Incentivos
- Variante `--highlight` con `background: var(--orange-bg)` en icono + value naranja 15px

### Patrón cross-módulo
El comprobante ahora usa el mismo lenguaje visual que el módulo Incentivos (`incentivo-11-asignar-exito.html`) — `.kv-row` con icon + label + value es ECC-canónico del ecosistema Naowee.

---

## [ivc-v1.4.1] — 2026-05-23

> 🔧 **Fix visual de filtros de bandeja (post-feedback Doug):** layout en single-row + estilos canónicos del menu portaled.

### Fixed — `prototype/coordinador/bandeja.html`

**Layout de toolbar (filtros + searchbox en un solo row horizontal):**
- Removido `flex-wrap: wrap` del `.bandeja-toolbar` y `.bandeja-toolbar__filters` en desktop.
- `.bandeja-toolbar__filters .naowee-dropdown` con `width: 180px` fijo + `flex-shrink: 0` para evitar que el searchbox los empuje.
- `.bandeja-toolbar__search` con `flex: 1 1 auto` + `min-width: 200px` para que crezca y ceda espacio sin wrapear.
- En mobile (`@media max-width: 900px`): se permite wrap y los dropdowns se hacen `flex: 1 1 160px` para adaptarse.

**Estilos del menu del dropdown (options ya no se ven como cajitas grises sueltas):**
- **Causa raíz:** las options del DS canónico están diseñadas asumiendo `<div>` (sin estilos UA-default). En bandeja se habían generado como `<button>`, que traen `background-color: buttonface`, `border` y `padding` de UA → rompía el look del menu canónico (las options aparecían como pills grises sueltas, sin el container blanco con sombra del menu).
- **Solución:** migrados 16 elementos de `<button class="naowee-dropdown__option">` → `<div class="naowee-dropdown__option" role="option">` en los 4 dropdowns de la bandeja (Estado, Tipo de trámite, Asignar profesional individual, Asignar profesional masivo). Patrón consistente con el demo Fase 1.
- **Defensa adicional:** CSS reset `appearance: none; background: transparent; border: 0; width: 100%; text-align: left;` aplicado a `.naowee-dropdown__menu .naowee-dropdown__option` (page-scoped) por si algún `<button>` se cuela en el futuro.
- Reglas `:hover` y `--selected` re-declaradas con tokens del DS (`--naowee-color-background-secondary`, `--naowee-color-interactive-fill-quiet-idle`, `--naowee-color-text-accent`).

### JS compatibility
- El controlador `setupNaoweeDropdownController` no se tocó — los selectores usan `closest('.naowee-dropdown__option')` (por clase, no por tag) → funciona idéntico con `<div>` o `<button>`.

---

## [ivc-v1.4.0] — 2026-05-23

> 🗂️ **Fase 2 del flowchart BPMN: Remisión + Asignación.** Refactor de `coordinador/bandeja.html` al nivel del DS v1.3.3 + alineación con los estados oficiales del flowchart (`En remisión` → `Asignada`) + cobertura completa de HU-3 (trazabilidad, SLA, mensajes del Sistema). Gap report: de 66% alineada → 100%.

### Changed — `prototype/coordinador/bandeja.html`

**ALTO IMPACTO (5 fixes):**
- **Portal pattern para dropdowns.** Portado `setupNaoweeDropdownController` IIFE del demo Fase 1: `.naowee-dropdown__menu` se mueve a `document.body` con `position:fixed` + `data-owned-by`. Coordenadas calculadas desde `getBoundingClientRect()` del trigger. Flip-up cuando no cabe abajo. Resuelve el bug de "menú enmascarado por modal overflow:hidden".
- **Keyboard navigation.** Enter/Space/ArrowDown/Up/Escape con `resolveActiveWrap` para localizar el origen al hacer click en option portaled.
- **Close-on-scroll/resize.** Patrón rAF debounced para cerrar dropdowns suavemente al hacer scroll del body o resize de la ventana.
- **Icon button quiet canónico.** Los 3 botones de cierre de modales (masivo, individual, histórico) + el botón nuevo de "Ver histórico" por fila → migrados a `.naowee-btn .naowee-btn--quiet .naowee-btn--icon .naowee-btn--small` (líneas DS 689, 745, 644). Naranja automático.
- **CSS hover state para futuros datepickers.** Preparado `cursor:pointer` + hover naranja en `.naowee-datepicker-field__input/__icon/__chevron` (aunque bandeja no tenía filtros de fecha, queda listo para v1.4.x).

**MEDIO IMPACTO (3 fixes):**
- **Helper canónico `.naowee-helper--negative`** con badge + texto en modal masivo (cuando no se elige profesional) y en toolbar (cuando intenta masiva con 0 trámites seleccionados).
- **Shake utility `.naowee-shake`** real del DS aplicada con reflow trick + 500ms timeout. Triggers: toolbar, dropdown profesional, modal. Reemplaza animaciones ad-hoc anteriores.
- **`.naowee-message--caution`** con umbral `ALTA_CARGA_UMBRAL=8`. Mapa `PROF_LOAD` mock que muestra carga por profesional; al elegir uno con >= 8 trámites activos, aparece warning antes de confirmar asignación.

**BAJO IMPACTO — alineación con el flowchart Fase 2 (4 fixes):**
- **Badge `En remisión`** (canónico `--caution --quiet --small` naranja) — estado oficial del flowchart entre `Radicado` y `Asignada`. Stat-card "Sin asignar" → "En remisión". Filtro dropdown actualizado. Valor interno de `data.js` conservado ('No asignada') para no requerir migración del mock data.
- **Badge `Asignada`** (canónico `--informative --quiet`) — actualización del estado tras acción del Coordinador.
- **Banner `Remisión automática del Sistema`** con `.naowee-message--informative` al inicio de la página, debajo del header. Aclara al Coordinador que los trámites entran auto-asignados a su área (Deporte Aficionado) sin acción suya.
- **Histórico / trazabilidad HU-3.** Nueva columna y modal con `<ol class="ivc-timeline">` mostrando los 3-4 eventos del trámite (Radicado → En remisión → Asignada → Inicio validación). Cada evento con timestamp + actor (Sistema o usuario). `.ivc-timeline*` es scope custom (DS no tiene componente timeline).
- **SLA / Plazo visible por trámite.** Nueva columna "Plazo" con badge escalonado por color: `--positive` (>5 días), `--caution` (1-5 días), `--negative` ("Vencido"). Mock con valores rotativos [15,12,3,0,18,5,-2,20,2,10,4,-5].

### Lógica funcional preservada
12 trámites mock, filtros estado/tipo/búsqueda, asignación individual (dropdown con conteo), asignación masiva (3 estrategias: mismo / equitativo / manual), stat cards, multi-row con header checkbox, snackbar de confirmación, integración `IVCData`/`IVCShell`/`IVCTour` intacta.

### UX patterns notables
- Botón "Asignación masiva" ahora NO usa `disabled` HTML — siempre clickeable. Si `selectedCount===0`, muestra helper + shake en toolbar (más educativo que disabled silencioso).
- Cuando estrategia masiva es "distribuir"/"manual", se oculta el bloque profesional + el warning de carga (UX coherente).

### Trazabilidad HU oficiales (XLSX MODULO IVC)
| HU | Criterios cubiertos | Componente |
|---|---|---|
| **HU-3 Asignación** | individual + masiva + estados (`En remisión` / `Asignada` / `En validación`) + reasignar + trazabilidad (fecha, hora, usuario) + SLA visible | `coordinador/bandeja.html` (completo) |

### Tamaño
- Bandeja: 1,303 líneas / 60 KB (antes: 746 / 34.2 KB → +557 líneas / +26 KB por portal + datepicker css + timeline + SLA + warnings).

### Pendiente (NO incluido — Sprint siguiente)
- Refactor de `profesional/workspace.html` con el mismo patrón (Fase 3 del flowchart: Validación).
- HU-5 Cumplimiento parcial (modal subsanación + vista organismo devuelto).

---

## [ivc-v1.3.3] — 2026-05-23

> 🎉 **7 fixes UI/UX adicionales + pantalla de éxito con confetti (portada del módulo Incentivos).** Continuación del feedback de Doug sobre v1.3.2. Refinamientos finales para pulir el demo a nivel Senior UX.

### Fixed — `prototype/usuario-externo/formulario-fase-1.html`

**1. Helper "Selecciona primero el tipo de organismo" rediseñado.** Eliminado el cuadro dashed gris. Reemplazado por el componente canónico `.naowee-message--informative` reusando el helper `messageInfo()` existente. Lenguaje visual consistente con los demás mensajes del demo.

**2. Labels del wizard completos (no más abreviaciones).** Removido `max-width:110px` + `text-overflow:ellipsis` de `.naowee-stepper__label`. Font-size 11.5px en pasos no-activos y 13px en activo (en lugar de truncar). Los 7 labels completos ("Pre-selección", "Datos generales", "Personería", "Asamblea", "Estructura", "Documentos", "Confirmación") caben en el ancho del container con conectores `flex:1 1 auto; min-width:8px`.

**3. Datepicker: cursor pointer + ícono naranja en hover.** Agregadas reglas CSS:
   - `.naowee-datepicker-field__input { cursor: pointer; }`
   - `.naowee-datepicker-field__input:hover .naowee-datepicker-field__icon { color: var(--accent); }`
   - `.naowee-datepicker-field__input:hover .naowee-datepicker-field__chevron { color: var(--accent); }`
   - Estado `--active` también naranja
Patrón heredado del Project v2.0.3 (`modal-convocatoria.js` L414).

**4. Radio buttons sin container (Sí/No).** Helper `radioYN()` reescrito. Eliminado wrapper con border/padding/background. Solo queda `.naowee-radio` canónico nativo + `.naowee-radio-group--horizontal` para el flex-row con gap. Aplica a todos los grupos Sí/No del demo.

**5. Datepicker canónico en repeatables (paso 4 Asamblea).** Eliminados los últimos 2 `<input type="date">` HTML5 que quedaban en las celdas compactas del repeatable de Reuniones de Asamblea. Nuevo helper `datepickerInline()` que usa `.naowee-datepicker-field--small` canónico (línea 5414 del DS) para versión compacta. Grid template del repeatable ajustado de `1.3fr 1fr 1fr 1fr 90px 36px` → `1.2fr 1.1fr 1.1fr 0.8fr 80px 32px`. `bindDatepickers()` invocado tras cada `render()` (idempotente, cubre add/remove rows). **Cero `<input type="date">` en todo el demo.**

**6. Iconos "borrar" (caneca) naranja con icon button ghost canónico.** Botones de eliminar fila migrados de gris a `.naowee-btn .naowee-btn--quiet .naowee-btn--icon .naowee-btn--small` (clases DS líneas 689, 745, 644). El `.naowee-btn--quiet svg` aporta `stroke: var(--naowee-color-icon-accent)` (naranja); hover background `var(--naowee-color-interactive-fill-quiet-hover)`. Eliminado el override CSS que volvía gris el ícono. Aplica a las 12 tablas REPEATABLE.

**7. Pantalla de éxito con confetti — portada del módulo Incentivos.** Refactor completo del `renderSuccess()` reusando el patrón de `naowee-test-incentivos/incentivo-11-asignar-exito.html`:
   - **Confetti animado:** 40 partículas con animación `fall` 2.4s linear (rotate 720deg + translateY 280px). Colores DS: `#FF7500`, `#d74009`, `#1f8923`, `#1f78d1`, `#ffbf75`, `#fff`. Función `spawnConfetti()` idempotente.
   - **Success hero:** gradient blanco→gris claro, radial-gradient verde sutil de fondo, círculo de check verde 88px con `linear-gradient(135deg, #25a12a, #1f8923)` + box-shadow + animación `pop` cubic-bezier(.34,1.56,.64,1).
   - **Stamp del radicado:** chip monospace con border full-radius mostrando `Radicado · IVC-2026-NNNNN`.
   - **Status banner:** muestra transición de estado (vacío → Radicado) con badges canónicos.
   - **Comprobante:** card con avatar gradient naranja, datos del organismo (Liga de Atletismo de Antioquia / NIT 800123456-7 / Liga Deportiva Departamental) y `kv-row`s con icon + label + value (Trámite, Fecha radicación, Plazo respuesta, Estado).
   - **Actions:** "Descargar comprobante (PDF)" → `window.print()`, "Ver mis trámites" → reset.
   - Animación `fadeInUp` 0.4s en todo el wrap.

### Notas sobre clases custom (no DS) en success
Las clases `.success-wrap`, `.success-hero`, `.success-check`, `.confetti`, `.receipt`, `.kv-row`, `.status-banner` NO son del DS — son el sistema visual de Incentivos, portado verbatim. Mantienen el mismo naming para consistencia cross-módulo (no se les agregó prefijo `.ivc-*` por decisión de Doug).

### Tamaño
- Demo: 2,962 líneas / 132 KB (antes: 2,632 / 116 KB → +330 líneas / +16 KB por confetti + receipt + datepickerInline).

---

## [ivc-v1.3.2] — 2026-05-23

> 🎨 **7 fixes UI/UX sobre Fase 1.** Demo refinada con criterio Senior UX: títulos duplicados eliminados, dropdowns con portal al body (escapa overflow:hidden), datepicker canónico Naowee con calendario popup (portado del Project v2.0.3), stepper distribuido equitativamente, container plano sin elevation, CTAs de repeatables alineados a la izquierda.

### Fixed — `prototype/usuario-externo/formulario-fase-1.html`

**1. Títulos duplicados en dropdowns de pre-selección.** Eliminados los `<h2 class="wz-section">` "¿Qué tipo de organismo eres?" y "¿Qué trámite quieres realizar?" — el label del dropdown ya cumple ese rol y evita repetición visual. Dropdown ya consumía `width:100%` por default del DS.

**2 + 5. Menús de dropdowns enmascarados por containers padres con `overflow:hidden`.** Patrón portal aplicado al controlador `setupNaoweeDropdownController`: el `.naowee-dropdown__menu` se mueve al `<body>` con `position:fixed` cuando se abre. Coordenadas calculadas desde `getBoundingClientRect()` del trigger con flip-up cuando no cabe abajo. Mismo patrón del datepicker del v2.0.3. Conservados teclado (Enter/Space/Arrows/Escape), `aria-expanded`, y close-on-scroll/resize. Aplica a TODOS los dropdowns del wizard (organismo, trámite, municipio, departamento, etc.).

**3. Elevation del container principal.** `.wz-card` ya no tiene `box-shadow`. Conservado el `border: 1px solid var(--border)` para mantener el contorno. Container queda plano contra el fondo.

**4. Wizard paso 6 se cortaba sin ampliar el container.** Aplicada la clase canónica `.naowee-stepper--distributed` (línea 3830 del DS) que reparte los pasos con `width:100%`. Labels no-activos compactos (`font-size:11.5px`, `max-width:110px`, `text-overflow:ellipsis`), label activo destacado (`font-size:13px`, sin `max-width`). Los 6 pasos caben en el ancho del container sin truncar el label activo.

**6. Datepicker canónico Naowee con calendario popup (reemplaza `<input type="date">` HTML5).** Portadas del Project v2.0.3 (`modal-convocatoria.js`):
   - `datepicker({ label, name, required, placeholder })` — markup del field con `.naowee-datepicker-field` + popover oculto
   - `buildDaysHTML()` + `renderCalendarPortal()` — render del calendario en 3 modos (días → meses → años) con clicks por nivel
   - `setDatepickerValue()` + `formatDateLong()` — formato "16 de Junio de 2025"
   - `bindDatepickers(scope)` — portal del popover al body, posicionamiento con flip-up, click-outside, teclado (Enter/Space abre, Esc cierra), clear button
   - 6 fechas migradas: `fecha_reforma` (F1/F3), `fecha_constancia` (F1/F3), `fecha_estatutos` (F2), `fecha_convocatoria` (F3), `fecha_realizacion` (F3)
   - 61 clases canónicas DS usadas, verificadas contra `design-system.css`. Clases custom IVC solo para `.dp-view--days/months/years` y `.dp-cell` (no existen en DS — son el grid de meses/años scoped al popover, patrón heredado del v2.0.3)

**7. CTAs "Agregar fila" alineados a la izquierda.** `.ivc-repeatable__add` cambiado de `text-align:center` → `text-align:left`. Aplica a las 12 tablas REPEATABLE del demo (Junta Directiva, Comité Disciplinario, Comisión Técnica, Comisión Juzgamiento, Fiscal, Clubes Afiliados, Paradeporte, Seccionales, etc.).

### Pendiente (NO incluido en este release — para próxima iteración si Doug lo decide)
- 2 `<input type="date">` HTML5 quedan en las celdas compactas del repeatable de Asamblea (paso 4) — `f1_reuniones.fechaConv` y `fechaReal`. Migrarlos requiere rediseñar el grid template del repeatable inline (el datepicker portaled no encaja en celdas estrechas con grid-template-columns fija).

### Tamaño
- Demo: 2,632 líneas / 116 KB (antes: 1,987 / 86 KB → +645 líneas / +30 KB por funciones del datepicker + portal logic).

---

## [ivc-v1.3.1] — 2026-05-23

> 🔁 **Iteración con feedback de Juan Manuel Armero (Tech Lead).** Tres ajustes para preparar la escalabilidad a múltiples organismos y a los 18 trámites del catálogo IVC, más limpieza del flujo público.

### Changed — `prototype/usuario-externo/formulario-fase-1.html`
- **Tipo de organismo: radios → dropdown canónico escalable.** Reemplazados los 3 `.naowee-radio` por un `.naowee-dropdown` poblado desde un array `ORGANISMOS` ordenado. Agregado bloque comentado con 5 organismos adicionales (Club, Club Profesional, Comité Paralímpico, Comisión Nacional, Ente Departamental) que se activan agregando su `renderStep2_*/renderStep3_*/renderStep4_*` correspondiente. Patrón visible para que Juanma valide la extensibilidad.
- **Tipo de trámite: filtrado dinámicamente por organismo.** Nuevo `TRAMITES_POR_ORGANISMO` (mapping `organismoId → trámites[]`) con `enabled: true/false` por trámite. El dropdown solo se renderiza cuando hay organismo seleccionado y muestra las opciones "Próximamente" con la clase canónica `.naowee-dropdown__option--disabled` (línea 2499 del DS, no inventada). Demo actual incluye Otorgamiento (activo) + Renovación / Actualización / Impugnación (disabled placeholders) para mostrar el patrón hacia los 18 trámites.
- **Reset automático al cambiar organismo:** `STATE.tipoTramite = ''` al cambiar `STATE.tipoOrganismo` para evitar combinaciones inválidas.

### Removed
- **Botón "Guardar borrador" + CSS `.wz-save-draft` + función `saveDraft()`.** Justificación: la demo es pública (sin autenticación) y no hay sesión a quién persistir el borrador. Patrón vuelve cuando se integre con SUID.

### Helper `dd()` (extendido sin inventar clases)
- Soporte para `option.disabled: true` → aplica `.naowee-dropdown__option--disabled` canónica + `aria-disabled="true"`.
- Controlador `setupNaoweeDropdownController` ahora ignora clicks en opciones disabled (early return antes de disparar `onChange`).

### Verificado intacto
- Lógica F1/F2/F3: `renderStep2_F1/F2/F3` se siguen seleccionando por `STATE.tipoOrganismo` en pasos 2, 3 y 4 — al cambiar organismo, los 38/22/25 campos y las 7/1/4 tablas REPEATABLE varían correctamente.

### Trazabilidad feedback Juanma
| Punto | Feedback original | Resolución |
|---|---|---|
| 1 | "¿no es mejor un selector? Después escalamos a más organismos y a 18 trámites" | Radios → dropdown `ORGANISMOS` extensible |
| 2 | "Los trámites deben cambiar de acuerdo al organismo seleccionado" | `TRAMITES_POR_ORGANISMO` con filtrado dinámico |
| 3 | "Quitar Guardar borrador — como es público no hay sección a quien guardarle el borrador" | Eliminado botón + CSS + función |
| 4 | "¿Los campos están cambiando según organización?" | Confirmado: 3 condicionales preservadas |

---

## [ivc-v1.3.0] — 2026-05-22

> 🧑‍💼 **Fase 1 demo navegable end-to-end (lado Usuario Externo / Organismo).** Formulario de Radicación de Reconocimiento Deportivo (Otorgamiento) con wizard de 7 pasos, 3 form variants por tipo de organismo (F1 Liga / F2 Asociación / F3 Federación), 12 tablas REPEATABLE, 5 grupos de campos condicionales y los 7 documentos del Decreto 1387/1970 Art 2.1.1.2. Toda la UI refactorizada para usar los componentes canónicos del Naowee Design System v1.8.0 cargado vía CDN — cero invención de clases `.naowee-*`.

### Added — `prototype/usuario-externo/`
- `usuario-externo/formulario-fase-1.html` — Demo navegable de Fase 1 (Radicación). Pre-selección Tipo de organización (Ligas / Asociaciones / Federaciones) + Tipo de trámite (Otorgamiento), wizard 7 pasos (Pre-selección → Datos generales → Personería jurídica → Asamblea → Estructura → Documentos → Confirmación), generación de radicado `IVC-2026-NNNNN` y success state con descarga de comprobante.
- `usuario-externo/logos/ministerio.svg`, `naowee.svg`, `suid.png` — Assets del header institucional (Ministerio del Deporte + Naowee + SUID), copiados del proyecto Project v2.0.3.

### Refactored — Demo Fase 1 a DS v1.8.0 canónico
- **Stepper con pulse:** `.naowee-stepper--pulse` + `.naowee-stepper__step--active/--done` (líneas 3736-3839 del design-system.css).
- **Textfields:** `.naowee-textfield` con sub-elementos `__label`, `__label--required`, `__input-wrap`, `__input`, modificador `--error` y `--textarea` (líneas 1671-1900). Helper error `.naowee-helper--negative` con badge + texto.
- **Wiggle de validación:** utility `.naowee-shake` canónica del DS (líneas 3843-3865) — animación 0.45s cubic-bezier al fallar validación.
- **Dropdowns canónicos:** `.naowee-dropdown` con `__trigger`, `__placeholder`, `__value`, `__chevron`, `__menu`, `__option`, `__option--selected` (líneas 2257-2565). Menú flotante con animación max-height + opacity. JS de control: toggle abierto, click fuera, navegación con teclado (Enter/Space/ArrowDown/ArrowUp/Escape). Reemplazó 6 `<select>` nativos (que renderizaban el menú gris del SO).
- **Radio buttons:** `.naowee-radio` + `__circle` + `__label` + `--selected` (línea 3875).
- **Checkboxes:** `.naowee-checkbox` + `__box` + `__label` + `--checked`.
- **Botones:** primary glow naranja = `.naowee-btn--loud .naowee-btn--large`, ghost = `.naowee-btn--quiet .naowee-btn--large`, mini = `.naowee-btn--quiet .naowee-btn--small`.
- **Badges:** `.naowee-badge--brand/negative/neutral/quiet/small`.
- **Messages:** `.naowee-message--informative` con `__header`, `__icon`, `__title`, `__text`.
- **Font:** Inter (400-800) cargado desde Google Fonts; `font-feature-settings: 'case' 1` heredado del DS.

### Funcionalidad del demo
- 3 form variants condicionales:
  - **F1 Liga** ~38 campos + 7 tablas REPEATABLE (Junta Directiva, Comité Disciplinario, Comisión Técnica, Fiscal, Clubes Afiliados, Comisión Juzgamiento, Paradeporte).
  - **F2 Asociación** ~22 campos + 1 tabla.
  - **F3 Federación** ~25 campos + 4 tablas.
- 5 grupos de campos condicionales: Constancia PJ → Fecha, Inventario → upload, Afiliación internacional → upload, Certificación RF → upload, Paradeporte → 3-row table.
- Mock data: `Liga de Atletismo de Antioquia / NIT 800123456-7`.
- Validación bloqueante en paso 1 (Pre-selección) con shake animation real del DS.
- Mock file uploaders con feedback "Archivo cargado".
- Generación de radicado dinámico `IVC-2026-NNNNN`.
- Pantalla de confirmación con success state + opción "Descargar comprobante" + "Volver al dashboard".

### Decisiones de diseño (con prefijo `.ivc-*` cuando no hay equivalente canónico)
- **Tablas REPEATABLE:** scopeadas como `.ivc-repeatable*` (prefix custom IVC) con tokens del DS (`var(--naowee-color-*)`) — el DS no tiene componente "tabla editable con [+ Agregar]/[Eliminar]".
- **Dropdown inline en filas de tabla:** `.ivc-dropdown--inline` (custom IVC, junto a `.naowee-dropdown` canónico) para ajustar width 100% en celdas estrechas — el DS no define variante inline.
- **File uploader:** patrón `.wz-file-drop` heredado del wizard-page canónico v2.0.3 (no del DS pero canónico del ecosistema Naowee project).
- **Datepicker:** `<input type="date">` HTML5 dentro de `.naowee-textfield` — consistente con patrón usado en `modal-convocatoria.js` del v2.0.3.

### URL pública del demo
`https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html`

---

## [ivc-v1.2.0] — 2026-05-21

> 🎨 **Fase 2 Sprint 1: 5 pantallas que cubren HU-3, HU-4, HU-6 oficiales del XLSX MODULO IVC.** Habilitados perfiles Coordinador + Profesional en el demo-switcher. Cero invención de clases `.naowee-*`; todas las clases del DS verificadas contra `naowee-design-system@v1.8.0`.

### Added — `prototype/coordinador/`
- `coordinador/bandeja.html` — Bandeja de asignación (HU-3): tabla `.naowee-table-card` con 12 trámites mock, filtros por estado/tipo, searchbox `.naowee-searchbox--medium`, asignación individual y masiva con reasignación, 3 stat-cards (sin asignar / asignadas / en validación), selección multi-row con `.naowee-checkbox`.
- Modal de Asignación Masiva embebido (HU-3, criterio masivo): `.naowee-modal--scrollable` con resumen de trámites seleccionados, 3 estrategias en `.naowee-radio` (mismo profesional / distribuir equitativo / manual), `.naowee-dropdown` para seleccionar profesional, mensaje informativo dinámico.
- Modal de Asignación Individual embebido: dropdown del profesional con conteo de activos por persona.

### Added — `prototype/profesional/`
- `profesional/workspace.html` — Workspace de validación (HU-4/HU-6): info-card del trámite con 8 datos (radicado, organismo, NIT, disciplina, fechas, plazo), checklist interactivo de los 7 documentos del Decreto 1387 con tri-state (Cumple ✓ / Observación ⚠ / No cumple ✗), barra de progreso, sticky footer con 3 botones de decisión (cumple totalmente / cumplimiento parcial / no cumple).
- Modal "Generar Acto Administrativo" (HU-6): preview tipográfico estilo resolución oficial con membrete del Ministerio, considerandos y resuelve, numeración consecutiva automática (2026-001) + fecha auto, `.naowee-message--informative` aclarando que NO se envía automáticamente.
- Modal "Generar Acto de No Cumplimiento" (HU-4): textarea para causales (`.naowee-textfield--textarea`), lista dinámica de docs marcados como ✗ con sus observaciones, preview del acto de rechazo, numeración 2026-002 + fecha auto, `.naowee-message--caution`.

### Changed
- `shared/shell.js` — Coordinador y Profesional ahora `enabled: true` (NAV_ITEMS extendidos con bandeja-coord/en-validacion/historico-coord para Coordinador y bandeja-prof/revision/historico-prof para Profesional). `SECTION_LABELS` map agrega 'COORDINACIÓN' y 'OPERACIÓN'. Demo-switcher navega a la landing correspondiente por perfil (bandeja.html o workspace.html). Panel-label dinámico (`perfiles.length`) en lugar del hardcoded "14".
- `shared/data.js` — `PERFILES` actualizado: coordinador = Carolina Méndez (Coordinadora · Deporte Aficionado), profesional = Carlos Pérez (Profesional · Deporte Aficionado), ambos `enabled: true`. Agregadas constants `PROFESIONALES_DISPONIBLES` (4 profesionales con conteo de activos) y `TRAMITES_BANDEJA` (12 trámites mock con estados mixtos). Nuevo API `getTramiteFocal()`, `getTramiteFocalState()`, `updateTramiteFocalState()`, `resetTramiteFocal()` para persistir el state del workspace del Profesional separado del trámite del Usuario Externo.
- `shared/demo-tour.js` — Steps 5-8 promovidos de stubs `pages: []` a reactivos con páginas reales: Step 5 (bandeja-coordinador, HU-3) en `coordinador/bandeja.html`, Step 6 (workspace-profesional, HU-4/6) y Step 7 (decision-profesional) en `profesional/workspace.html`, Step 8 (acto-generado) tras decision. `buildState` merges `tramiteFocal` en `s.tramite` para que los applicable checks de Steps 6-8 vean `docsValidados` y `decision`.

### Trazabilidad HU oficiales (XLSX MODULO IVC)
| HU | Criterios cubiertos | Pantalla |
|---|---|---|
| HU-3 Asignación | individual + masiva + estado (No asignada / Asignada / En validación) + reasignar + trazabilidad (fecha, hora, usuario) | `coordinador/bandeja.html` + Modal Masivo + Modal Individual |
| HU-4 No cumple | marcar estado + formulario para Acto + numeración consecutiva automática (2026-002) + fecha auto + notificación al organismo + trazabilidad | `profesional/workspace.html` + Modal No Cumplimiento |
| HU-6 Cumple | marcar estado + Acto auto generado + numeración consecutiva (2026-001) + fecha auto + SIN envío automático (pendiente firma Director) + trazabilidad | `profesional/workspace.html` + Modal Cumple |

### Pendiente Sprint 2 (no en este release)
- HU-5 Cumplimiento parcial (devolución para corrección por organismo + ventana de 5-10 días)
- HU-7 Notificación electrónica (step en wizard)
- HU-8 Notificación en oficinas (pendiente spec de Danna)
- Vista del organismo cuando trámite está devuelto
- Vista del organismo en estado Aprobado/Rechazado tras decisión
- Director: cola "Por firmar" + firma electrónica del acto

### Verificación
- `grep -rE '\.naowee-(input|input-group|input-label|input-helper|badge--tramite|stepper)\b' prototype/coordinador prototype/profesional` → **0 hits** (cero invenciones en archivos nuevos)
- Todas las clases `.naowee-*` usadas en `bandeja.html` y `workspace.html` están en el DS canónico (`design-system.css` v1.8.0) o son IVC-canonical (`.naowee-table-card`, `.naowee-stat-card`).
- Demo-switcher exhibe ahora 3 perfiles habilitados (usuario-externo + coordinador + profesional). Director permanece deshabilitado para Fase 3.

---

## [ivc-v1.1.6] — 2026-05-21

> 🔧 **Fix 4 issues UI del wizard.** Removida otra override fatal de `.naowee-message` que rompía el DS (mismo patrón del bug v1.1.5 con `.naowee-card`). Dropdown nativo de Chrome reemplazado por `.naowee-dropdown` canónico del DS con widget JS open/close + selection.

### Removed
- Override completo de `.naowee-message`, `__header`, `__icon`, `__content`, `__title`, `__text` y variants `--informative/--caution/--error/--success` en `prototype/shared/components.css` (líneas 150-214) — el DS las expone correctamente desde design-system.css 2971-3096; el override las rompía.
- Inline styles `font-size:14px` en `.naowee-message__title` (nuevo-tramite.html × 2, tramite-detalle.html × 1) — el DS ya define la tipografía canónica.
- Inline style `margin-bottom:18px` en message instance (nuevo-tramite.html) — reemplazado por helper `.ivc-message--block`.
- Inline style `margin-bottom:0;flex:1` en docs-section message — reemplazado por helper `.ivc-message--inline`.
- Native `<select class="naowee-textfield__input" id="disciplina">` en nuevo-tramite.html que renderizaba el dropdown nativo de Chrome.
- `<a class="naowee-btn naowee-btn--mute">` para "Cancelar" — el `a:hover { text-decoration: underline }` global lo subrayaba.

### Fixed (Doug feedback 2026-05-21 — round 5)
- **#1** Disciplina deportiva: ahora usa `.naowee-dropdown` canónico del DS (line 2192+) con `__trigger`, `__value`, `__chevron`, `__menu`, `__option`, `__option--selected`. Widget JS minimal para open/close + selection. No más dropdown nativo de Chrome.
- **#2** Title "Nuevo trámite" alineado a la izquierda — agregado `text-align: left` explícito a `.page-title-block` en nuevo-tramite.html (defensa contra herencia).
- **#3** Info messages usan el DS canónico sin override + sin inline styles. El DS expone los variants `--informative/--positive/--caution/--negative` desde design-system.css 3077-3084.
- **#4** Botón Cancelar es ahora `<button type="button" onclick="location.href='dashboard.html'">` — semánticamente correcto (Cancelar es una acción, no navegación) y evita el underline del `a:hover` global de tokens.css.

### Added
- `.ivc-message--block` y `.ivc-message--inline` (helpers IVC-scoped) en nuevo-tramite.html — sustituyen los inline styles de layout sobre `.naowee-message`. No tocan tipografía/padding (eso lo gobierna el DS); solo aportan contexto layout específico de la página.
- Widget JS para `[data-dropdown]` en nuevo-tramite.html — open/close + selection + click-outside. El DS provee solo CSS; el behavior es app-level (canónico-adjacent).

### Changed
- `prototype/shared/components.css`: tamaño 783 → ~730 líneas. Block de message overrides (líneas 150-214, 65 líneas) sustituido por comentario docstring de 7 líneas indicando que el DS lo expone.
- `prototype/usuario-externo/nuevo-tramite.html`: select native → `.naowee-dropdown` widget (+25 líneas HTML, +45 líneas JS). `.page-title-block` con `text-align: left` explícito. Botón Cancelar pasa de `<a>` a `<button onclick>`.
- `prototype/usuario-externo/tramite-detalle.html`: removido inline `style="font-size:14px"` del title del info banner.

### Verification (grep checks)
```
grep -E "^\.naowee-message[__-]" prototype/shared/components.css | wc -l       → 0
grep "select.*disciplina" prototype/usuario-externo/nuevo-tramite.html         → 0
grep -E 'style="(font-size|margin-bottom)' prototype/usuario-externo/nuevo-tramite.html → 0 (en messages)
grep '<a class="naowee-btn naowee-btn--mute"' prototype/usuario-externo/nuevo-tramite.html → 0
```

---

## [ivc-v1.1.5] — 2026-05-21

> 🔧 **Fix crítico: removal del override fatal de `.naowee-card` que rompía toda la UI.** El override de 12 reglas en `components.css` peleaba contra el DS canónico v1.8.0 (que YA expone `.naowee-card` desde la línea 4436). Wizard `nuevo-tramite.html` adopta ahora el patrón canónico del repo `naowee-test-escenarios` (escenario-03/04 — sport scenarios wizard, fuente de verdad oficial del wizard pattern del proyecto v2.1).

### Removed
- 12 reglas override de `.naowee-card`/`__header`/`__title`/`__subtitle`/`__body`/`__footer`/`--interactive` en `prototype/shared/components.css` — el DS YA expone estas clases, el override las rompía.
- Clases inventadas `.naowee-stepper` / `.naowee-stepper__item` / `.naowee-stepper__circle` / `.naowee-stepper__label` renombradas a `.ivc-stepper*`. El DS expone `.naowee-stepper` pero con sub-elementos `__step`/`__number`/`__connector` — los `__item`/`__circle` eran invenciones que no calzaban.

### Added
- `.ivc-card-sectioned` (variant local) — modifier IVC-only que se aplica JUNTO a `.naowee-card` del DS cuando necesitamos card con header/body/footer separados por dividers (patrón project v2.1 para detalle de trámite y wizard). NO sobrescribe el DS; se compone encima.
- `.ivc-stepper*` (renombrado) — stepper IVC custom (3 pasos del wizard de nuevo trámite). Sub-elementos `__item`/`__circle`/`__label` con states `is-active`/`is-complete`.

### Fixed
- Wizard `nuevo-tramite.html` ahora renderiza con la elevación canónica del DS (sin override roto).
- Stepper visible en top del wizard con shape correcta (antes caía a `<ol>` default por falta de CSS efectivo cuando alguien tocaba el override).
- `tramite-detalle.html` cards (Timeline, Acciones, Documentos cargados, Fundamento legal) usan ahora `.naowee-card` del DS + `.ivc-card-sectioned` — antes dependían del override que rompía la card.
- Page title "Nuevo trámite" + subtitle ahora viven en `.page-title-block` antes del stepper (patrón project v2.1, igual que `dashboard.html`).

### Changed
- `prototype/shared/components.css` — removidos 12 overrides de `.naowee-card`; `.naowee-stepper*` renombrado a `.ivc-stepper*`; agregada variant `.ivc-card-sectioned`. Docstring de cabecera actualizada listando todo lo que el DS v1.8.0 ya provee (card, stepper, message, textfield, btn, badge, table, modal). Tamaño: 774 → 783 líneas (delta neto +9: removidos 56 lines de override, agregadas 65 de variant local + docs).
- `prototype/usuario-externo/nuevo-tramite.html` — refactor: stepper a `.ivc-stepper*`, wizard sections usan `.naowee-card.ivc-card-sectioned.wizard-card`, agregado `.page-title-block` antes del stepper, JS `goToStep` actualizado para query `.ivc-stepper__item`.
- `prototype/usuario-externo/tramite-detalle.html` — las 4 `<section class="naowee-card">` ahora son `<section class="naowee-card ivc-card-sectioned">` (timeline + 3 sidebar cards).

### Verification (grep checks)
```
grep -cE "^\.naowee-card[^a-z-]|^\.naowee-card__|^\.naowee-card--" components.css      → 0
grep -rE 'class=.[^"]*naowee-stepper' prototype/**/*.html                              → 0
grep -rE 'class=.[^"]*naowee-(input-group|input-label|input-helper|badge--tramite)' prototype/**/*.html → 0
```

---

## [ivc-v1.1.4] — 2026-05-21

> 🔧 **Refinamiento crítico: adopción real de clases canónicas del DS Naowee.** Los subagents anteriores inventaron `.naowee-input/-group/-label/-helper` y `.naowee-badge--tramite` — NINGUNA existe en el DS. Esta versión refactoriza al patrón canónico real (`.naowee-textfield`).

### Fixed (Doug feedback 2026-05-21 — round 3)
- **#1**: User pill dropdown reducido a identity-only (sin Mi perfil/Notif/Config/Cerrar sesión — para Mid-Fi focused).
- **#2**: Botón "Continuar wizard" ahora `<button class="naowee-btn naowee-btn--quiet naowee-btn--small">` real (era `<a>` con underline heredado de `tokens.css a:hover`). Se añade rule de blindaje `.naowee-table-card .naowee-table tbody a.naowee-btn { text-decoration: none }` para anchors estilizados como botón en columna Acciones.
- **#3**: `.naowee-table-card__head` padding ajustado (`12px 20px 10px` en lugar de `16px 20px`) — subtitle ahora ~8px sobre el divider.
- **#4**: Tour Step 2 fix — Step 2a apunta a `[data-tour="wizard-stepper"]` (visible al cargar wizard step 1). Step 2b nuevo apunta a `[data-tour="docs-decreto-1387"]` (solo cuando `wizardStep >= 2`). Antes el tooltip caía en top-left sin spotlight porque el target estaba oculto.
- **#5**: Refactor completo de `nuevo-tramite.html` al patrón `.naowee-textfield` del DS. Step 1 (Datos generales) usa `.naowee-textfield__label`, `__input-wrap`, `__input`, `__helper` + variants `--readonly`, `--disabled`, `--textarea`. Info message ahora `.naowee-message naowee-message--informative` con `__header`. Badge "Trámite" ahora `.naowee-badge--informative --quiet`.

### Changed
- `prototype/usuario-externo/nuevo-tramite.html` — refactor completo del form usando DS canónico.
- `prototype/usuario-externo/tramite-detalle.html` — badge y banner alineados a `--informative` (era `--tramite` inventado y `--info` no canónico).
- `prototype/usuario-externo/dashboard.html` — anchors de "Continuar wizard" / "Ver detalle" convertidos a `<button>` reales con handlers `data-go-wizard` / `data-go-detalle`.
- `prototype/shared/shell.js` — user pill dropdown reducido a identity-only (clase nueva `profile-dd--identity-only`).
- `prototype/shared/components.css` — `.naowee-message` rediseñado al patrón DS (`__header` outer flex + icon-circle 22px). `.naowee-message--info` → `--informative`. Padding de `__head` tight. Rule anti-underline para botones-link en tabla.
- `prototype/shared/demo-tour.js` — Steps 2 / 2b reactivos a `wizardStep`. `buildState()` ahora lee `IVCData.getWizardStep()`.
- `prototype/shared/data.js` — nuevo state `wizardStep` (storage key `naowee.ivc.wizardStep`, default 1) + getters/setters. Incluido en `fullReset()`.

### Removed
- Clases inventadas eliminadas del codebase: `.naowee-input`, `.naowee-input-group`, `.naowee-input-label`, `.naowee-input-helper`, `.naowee-input-error`, `.naowee-badge--tramite`, `.naowee-message--info`.
- Las variants de badge tipología renombradas a prefijo IVC: `.ivc-badge-tipo-tramite` / `--actuacion` / `--procedimiento` (antes contaminaban el namespace `.naowee-badge--*`).
- 4 action items del user pill dropdown (Mi perfil, Notificaciones, Configuraciones, Cerrar sesión).

### Notes
- DS canónico confirmado: `.naowee-textfield` (líneas 1606-1845), `.naowee-message` con `__header` (líneas 2971-3083), `.naowee-badge` variants `--informative/--brand/--positive/--caution/--negative/--neutral` + modifier `--quiet` (líneas 1006-1058).
- `.naowee-stepper` NO existe en el DS — sigue siendo custom IVC con marcador `data-tour="wizard-stepper"` agregado.
- `.naowee-input-stepper` SÍ existe en el DS (counter component, distinto a inputs de texto) — no se confunde con las clases inventadas.

---

## [ivc-v1.1.3] — 2026-05-21

> 🔧 **Refinamiento UI post-revisión Doug.** 4 fixes específicos siguiendo patrones canónicos del DS Naowee project v2.1.

### Removed
- Sidebar item "Perfil" eliminado (duplicado con el user pill del header)

### Changed (Doug feedback round 2)
- **Stat cards** ahora sin border + con shadow (patrón `.naowee-card` del DS + `box-shadow: var(--shadow-card)` canónico). Acento de color preservado como left-strip 4px vía `::before` (no como `border-left`).
- **Tables** sin elevation, header gris claro con border-radius en 4 esquinas (patrón `.naowee-table-card` portado de project v2.1 + sedes-list).
- **Title/subtitle de tabla** con padding optimizado (16px vertical / 20px horizontal en vez de 22/28).
- **Divider** debajo de title/subtitle ahora full-bleed (`<hr class="naowee-table-card__divider">` con `margin: 0; width: 100%`).
- **Row hover** aclarado a `#fafbfd` (valor canónico de `dash-table` en project v2.1, línea 1884), reemplaza el hover oscuro previo.

### Notes
- Patrón `.naowee-table-card` portado de `naowee-test-sidebar-shell/shared/pages/sedes-list` + `Claude-Doug/.claude/worktrees/funny-leakey-205859/project/shared/pages.css` (proyecto v2.1).
- Acento de color en stat cards mantenido como left-strip 4px (`::before` con `position:absolute; inset:0 auto 0 0; width:4px`), no como `border-left` — esto permite quitar el border real del card sin perder la señal de color.
- Hover canónico del DS oficial `.naowee-table tbody tr:hover` es `var(--naowee-color-fill-secondary)`. Acá usamos `#fafbfd` (más claro) porque es lo que Doug aprobó en project v2.1 para tablas dentro de cards.

---

## [ivc-v1.1.2] — 2026-05-21

> 🔧 **Patch crítico: adopción del DS canónico naowee-design-system@v1.8.0 vía CDN.** Reemplaza reinvenciones con el DS productivo + 7 fixes de UI específicos identificados por Doug en la review del prototipo v1.1.1.

### Changed

- Todas las páginas ahora linkean a `naowee-tech/naowee-design-system@v1.8.0` vía jsdelivr CDN (carga ANTES que `tokens.css` / `components.css` / `shell.css` para que las clases canónicas estén disponibles y los wrappers IVC puedan extenderlas)
- `prototype/shared/components.css` — removidas reinvenciones de `.naowee-btn*`, `.naowee-badge--success/--warning/--info/--error/--neutral` y `.naowee-table*` (provistos ahora por el DS). KEPT: tipología badges (`--tramite/--actuacion/--procedimiento`), cards, inputs primitives, status-pill con dot animado, message banners, tabs, stepper, snackbar, stat-card, empty, doc-upload-card, timeline vertical
- `prototype/usuario-externo/dashboard.html` — `badgeForEstado()` mapea ahora a variants DS (`--positive/--informative/--caution/--neutral` con `--quiet` para tints suaves)
- `prototype/shared/shell.js` — `renderHeader()` ya no acepta breadcrumb (Doug fix #2); si `title` es null/undefined renderiza solo spacer + user-chip

### Fixed (Doug feedback 2026-05-21 review v1.1.1)

- **#1 Header logos** — los logos del Ministerio + pill IVC ya eran canónicos del v1.1.1; ahora confirmado match exacto con `naowee-test-sidebar-shell/perfil.html` (mismo height, misma sb-logo-img--pill, mismo border)
- **#2 Header sin breadcrumb** — `renderHeader()` ya no renderiza la nav.top-header__breadcrumb; las 3 páginas que pasaban `breadcrumb: [...]` ahora pasan solo `activeNav`
- **#3 Title "Mis trámites" en body** — agregado `.page-title-block` con `<h1 class="page-title">` como primer elemento del page-inner en dashboard.html; nuevo-tramite usa el stepper como header visual, detalle usa el hero del radicado
- **#4 Botón primario "Nuevo trámite" naranja DS** — usa `.naowee-btn--loud` que toma color de `--naowee-color-interactive-fill-loud-idle` (`#D74009` = `--naowee-color-orange-700` del DS). El glow en hover sigue intacto (port de `style/btn-glow-and-root-menu`)
- **#5 Tablas estilo DS** — `<table class="naowee-table">` ahora renderiza con las reglas del DS (thead con `__num`/`__cell-primary`, hover en `tbody tr`, sort indicators `data-sort`)
- **#6 Badges DS naowee** — borradores y radicados usan `.naowee-badge--informative`, finalizados `.naowee-badge--positive`, en validación/subsanación `.naowee-badge--caution`. Tipologías (trámite/actuación/procedimiento) preservan su outline IVC-específico
- **#7 Icono colapsado del menú Notificaciones centrado** — en `.sidebar.is-collapsed` se zeroan margins de `.nav-row .icon` Y de `.nav-row__badge` (también `padding/width/min-width: 0`) para que `justify-content: center` quede limpio

### Notes

- Color real del naranja primario del DS: `--naowee-color-orange-700 = #D74009`. El IVC token local `--accent: #d74009` ya coincide 1:1, así que las animaciones, glows y dot pulses siguen alineados sin reinvención
- Los archivos `tokens.css` quedan (NO vaciados) porque el DS provee tokens `--naowee-color-*` distintos y separados; el IVC usa tokens domain-specific (tipología, sidebar dims, durations IVC) que no entran en el DS. Coexisten sin colisión
- Cambio de contrato: `IVCShell.init({ title, activeNav })` — la prop `breadcrumb` queda ignorada (compat backwards: si se pasa, no rompe pero no se renderiza)

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
