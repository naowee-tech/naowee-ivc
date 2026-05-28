# Naowee IVC — Catálogo de Patrones de Diseño

> Fuente de verdad de los patrones refinados en el prototipo IVC (v1.3 → v1.13.59).
> Objetivo: **reutilizarlos en futuros proyectos Naowee** sin re-descubrirlos.
>
> **Dónde viven hoy:**
> - Tokens y base → `prototype/shared/tokens.css`
> - Componentes transversales → `prototype/shared/components.css`
> - Layout / shell / responsive → `prototype/shared/shell.css`
> - Footer flotante → `prototype/shared/naowee-footer.{css,js}`
> - Patrones específicos del formulario público → `prototype/usuario-externo/formulario-fase-1.html`
> - Base canónica (CDN) → `naowee-design-system@v1.8.0`
>
> **Plan de durabilidad (3 capas):** este catálogo (Capa 1) → kit starter clonable (Capa 2) → promoción al Design System v1.9.0 (Capa 3, ver `DS-PROMOTION-v1.9.0.md`).

---

## 0. Cómo usar este catálogo

Cada patrón documenta: **Cuándo usarlo · Código/selector · Notas · Versión**. Copia el snippet o referencia el archivo. Lo "maduro" (marcado ⭐) es candidato a promover al Design System.

---

## 1. Tokens semánticos

### 1.1 Colores
| Token | Valor | Uso |
|---|---|---|
| `--accent` | `#d74009` | Acción primaria, focus, links, CTA, estado activo |
| `--orange-bg` | `#fff3e6` | Fondo accent suave, estado pendiente, hover de opciones |
| `--text-primary` | `#282834` | Texto principal |
| `--text-secondary` | `#646587` | Texto secundario, labels, hints |
| `--text-muted` | `#9ca3af` | Placeholders, deshabilitado, "—" |
| `--border` | `#e7e9f3` | Bordes suaves, dividers |
| `--border-dark` | `#d0d4e6` | Bordes de inputs/controles |
| `--green` / `--green-bg` | `#1f8923` / `#e6f4e7` | Éxito, "cumple", estado vigente |
| `--blue-info` / `--blue-bg` | `#1f78d1` / `#eef5ff` | Informativo, "en validación" |
| `--purple` | `#7c3aed` | Trazabilidad / reposición (relación padre→hijo) |
| `--azul` | `#002B5B` | Marca institucional (Ministerio) |
| `--naranja` | `#FF7500` | Marca Naowee (imagotipo) |
| negativo | `#c0392b` / `#c01818` | Error, vencido, "no cumple", destructivo |

### 1.2 Semáforo de plazo (texto con color, NO badge)
- Positivo (`--green`) · Caution (`--accent`) · Negativo (`#c0392b`) · "Vencido".
- Patrón: `.row-plazo--positive | --caution | --negative` con `font-weight:600` + `font-feature-settings:'tnum'`.

### 1.3 Avatares determinísticos por persona ⭐
Paleta de 8 colores pastel asignados por hash del ID → la misma persona conserva su color en toda vista (tabla, dropdown, áreas).
```
p1 #fff3e6/#d74009  p2 #fce4f0/#db2777  p3 #fef3c7/#b45309  p4 #f0e6ff/#7c3aed
p5 #e6effa/#1f78d1  p6 #d8f3ee/#0d9488  p7 #e0f4ff/#0284c7  p8 #e6f4e7/#1f8923
```
(ver `.persona-avatar--p1..p8` en `coordinador/equipo.html`)

### 1.4 Radios / Sombras / Tipografía
- Radios: `--radius-md 8px` (inputs/botones) · `--radius-lg 12px` (cards/dropdowns) · `--radius-xl 20px` (cards grandes/modales) · `--radius-full 9999px` (pills/badges/avatares). **Cards en mobile: 14px.**
- Sombras: `sm 0 1px 4px rgba(0,0,0,.08)` · `md 0 4px 16px rgba(0,0,0,.12)` · sheet `0 -8px 40px rgba(40,40,52,.22)`.
- Tipografía: **Inter** (400-800). Mono (`ui-monospace`/JetBrains Mono) SOLO para radicados/NIT/fechas técnicas. Labels de tabla siempre Inter.

---

## 2. Responsive (mobile-first)

**Breakpoints:** `≤639px` mobile · `640–1023px` tablet · `≥1024px` desktop. (Footer/algunos popovers usan `≤640px`.)

### 2.1 Sidebar drawer off-canvas ⭐ (`shell.css`)
- `<1024px`: sidebar `position:fixed; transform:translateX(-100%)`; `.is-mobile-open` → `translateX(0)`.
- Trigger hamburguesa flotante `.mobile-drawer-trigger` (top-left). Backdrop: `body.has-mobile-drawer-open::after`.
- En drawer mode el sidebar muestra labels completos (override de `.is-collapsed` con `html body` para vencer al DS).

### 2.2 Cards edge-to-edge ⭐ (`components.css`)
- `.page-inner` padding lateral 0; cada bloque controla su aire. Title block 16px, stat-grid 12px.
- `.naowee-table-card` full-bleed: `border-radius:0; border-left/right:0`.

### 2.3 Tabla → stacked cards ⭐ (DOS variantes)
- **Listados** (`.naowee-table-card`): `thead` oculto, cada `tr` → card vertical; primera celda bold (radicado). Acciones top-right.
- **Captura de datos repeatable** (`.ivc-repeatable`, ver §3.7): cada fila → card "REGISTRO N" con campos full-width etiquetados. Contenedor sin caja (evita box-in-box).

### 2.4 Tabs scroll horizontal ⭐
`.naowee-tabs / .equipo-tabs-wrap / .actos-tabs-wrap` → `overflow-x:auto; flex-wrap:nowrap; white-space:nowrap`; scrollbar oculto; tabs `flex-shrink:0`.

### 2.5 Bottom-sheet de popovers ⭐ (`formulario-fase-1.html`)
Dropdowns y datepicker (portaleados a `<body>`) en `≤640px` emergen **de abajo hacia arriba**:
```css
.naowee-dropdown__menu, .naowee-datepicker--popover {
  top:auto!important; bottom:0!important; left:0!important; right:0!important;
  width:100%!important; max-height:95vh!important; overflow-y:auto!important;
  border-radius:18px 18px 0 0!important;
  transform:translateY(100%)!important;
  transition:transform .32s cubic-bezier(.32,.72,0,1)!important;
}
/* abierto: dropdown via inline visibility, datepicker via --open */
.naowee-dropdown__menu[style*="visible"],
.naowee-datepicker--popover.naowee-datepicker--open { transform:translateY(0)!important; }
```
Backdrop CSS-only: `body:has(.naowee-dropdown--open)::before`. Content-sized hasta 95vh, scroll interno, `safe-area-inset-bottom`.

### 2.6 Modales → bottom-sheet (`components.css`)
`≤639px`: `.naowee-modal` full-width, `border-radius:16px 16px 0 0`, anim `ivcMobileSheetIn` (translateY 100%→0).

---

## 3. Componentes

### 3.1 Textfield ⭐
Focus canónico: `.naowee-textfield__input-wrap:focus-within { border-color:#d74009; box-shadow:0 0 0 3px rgba(215,64,9,.15); }`. (scope `.wz-card/.ivc-modal` para vencer overrides + color concreto, no `var`).

### 3.2 Checkbox ⭐
`.naowee-checkbox` + `.naowee-checkbox__box` + svg check **canónico** `viewBox 24 24, points "20 6 9 17 4 12", stroke white, width 3`. Estado `--checked`. NO inventar el svg.

### 3.3 Dropdown
`.naowee-dropdown` + `__trigger` + `__menu` (portaleado a body, `position:fixed`, posicionado por JS). Menu transitions via inline opacity/visibility/transform. Opción seleccionada: `--orange-bg + accent`.

### 3.4 Table-card (listados) ⭐
`.naowee-table-card` (border, radius-xl, sin shadow). Header = **barra gris flotante** con las 4 esquinas redondeadas y **sin divider inferior** (`border-collapse:separate`, radius en th first/last, sin `th border-bottom`; respiro con `tbody tr:first-child td padding-top`). Hover row `#fafbfd`.

### 3.5 Message / info ⭐
Gap title↔content reducido (el DS trae `__content{gap:16px}` → bajar a `3px`). `.naowee-message__content{gap:3px}`. Transversal.

### 3.6 Stepper dinámico + skeleton ⭐ (`formulario-fase-1.html`)
- Pasos definidos por tipo de organismo (`STEPS_POR_ORGANISMO`); `pasosAplicables()` itera solo los aplicables. Índice visual continuo.
- Antes de elegir organismo: solo "Pre-selección" + **skeleton** de 5 ghost dots grises (`.naowee-stepper__step--skeleton`) con la línea del recorrido → sugiere "vienen más pasos" sin comprometer el número.

### 3.7 Repeatable → cards etiquetadas ⭐ (universal)
`labelRepeatableCells(container)` copia el label de cada columna del `.ivc-repeatable__head` a cada celda del row como `data-label`. En `≤640px`: head oculto, cada fila = card independiente "REGISTRO N" (counter), campos full-width, label via `[data-label]::before` (divs); inputs usan placeholder. Botón eliminar → esquina sup-derecha. Inputs a 46px.

### 3.8 Footer pill de versionamiento ⭐ (`naowee-footer.js`)
Pill flotante esquina inf-derecha (logo + © + `IVC vX.Y.Z` link a release). **Scroll-hide**: escucha en **capture phase** sobre `document` (scroll NO bubblea; el host real es `.page`, creado dinámico). Scroll down>60px → `.is-hidden` (translateY 140%); scroll up → reaparece. Mobile: separar 16px de bordes.

### 3.9 Timeline / histórico ⭐ (`components.css`)
`.ivc-timeline` con dots semánticos (`--positive` verde / `--negative` rojo / `--info` azul / `--muted` gris). Cada item: título + meta (fecha·hora·actor mono).

### 3.10 Trazabilidad padre↔hijo ⭐ (`coordinador/bandeja.html`)
- Tabla: chip "Hijo de IVC-XXXX" **debajo** del radicado — texto morado + flecha ↳ (corner-down-right), Inter, sin container, una línea (`white-space:nowrap`).
- Modal detalle: tab "Trazabilidad" (solo hijos). **Árbol vertical**: radicado + badge lado a lado → flecha ↓ → hijo. Datos + aprobaciones (extraídas del histórico del padre) + timeline completo + CTA "Ver detalle del origen".

### 3.11 Empty states ⭐
Icono inbox 32px gris + título + descripción centrados. `.naowee-empty-state` / `filter-empty` canónico.

### 3.12 Máscaras de input
Cédula colombiana (números + puntos, preserva cursor), NIT, numéricas. Bloqueo de no-dígitos en keydown.

---

## 4. Animaciones (catálogo)
| Nombre | Efecto | Duración / Easing | Uso |
|---|---|---|---|
| `ivcMobileSheetIn` | translateY 100%→0 | .28s cubic-bezier(.32,.72,0,1) | Modal bottom-sheet mobile |
| bottom-sheet popover | translateY 100%→0 | .32s cubic-bezier(.32,.72,0,1) | Dropdowns/datepicker mobile |
| `drawerBackdropIn` / sheet backdrop | opacity 0→1 | .2–.25s ease | Backdrop drawer/sheet |
| sidebar drawer | transform translateX | .3s cubic-bezier(.32,.72,0,1) | Off-canvas |
| `wzStepperPulse` | box-shadow pulse | 2s infinite | Step activo |
| `fadeInUp` / `fadeIn` / `scaleIn` | entrada de contenido | .2–.4s | Cards/modales |

Regla: animar SOLO `transform` y `opacity`. `prefers-reduced-motion` → desactivar.

---

## 5. Interacciones / estados
- Hover row tablas: `#fafbfd` (gris muy suave, no azulado).
- Focus inputs: borde accent + 3px shadow accent.
- Botones: hover opacity .88 / active scale(.97).
- Accordion DS (`.naowee-accordion`) con "Ver más/menos" + chevron rota 180°.
- Outside-click cierra dropdowns/datepicker; backdrop captura el click.

---

## 6. Convenciones
- **Versionado**: `IVC_VERSION` en `naowee-footer.js` + cache busters `?v=X.Y.Z` en los 11 HTMLs. Commit `type(scope): desc vX.Y.Z` + tag `ivc-vX.Y.Z`.
- **Overrides del DS**: usar `html body` o scope (`.wz-card`) + `!important` solo cuando el DS CDN gana por especificidad/orden. Documentar el motivo.
- **CSS**: animar transform/opacity; tokens, no hardcode; archivos <800 líneas.

---

_Última actualización: v1.13.59 · Mantener al promover patrones al DS (Capa 3)._
