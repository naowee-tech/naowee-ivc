# Changelog · Naowee IVC

Historial de versiones del módulo IVC (Inspección, Vigilancia y Control) — Ministerio del Deporte de Colombia.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) + esquema semver con prefijo de proyecto adoptado del Naowee Project: `ivc-vMAJOR.MINOR.PATCH`.

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
