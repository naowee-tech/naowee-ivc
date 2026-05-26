# ACTA · Naowee IVC · ivc-v1.6.9

> Handoff de `ivc-v1.6.9` — Modal "Ver detalle del trámite" del Coordinador iterado a fondo. Consolida 9 iteraciones (v1.6.1 → v1.6.9) durante una sesión de feedback iterativo intenso.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.6.9` |
| Fecha | 2026-05-26 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Release notes | https://github.com/naowee-tech/releases/tag/ivc-v1.6.9 |

## Resumen ejecutivo

Sesión de 9 iteraciones consecutivas sobre el modal "Ver detalle del trámite" en `coordinador/bandeja.html` con feedback en vivo (screenshots + inspección DevTools). Cada iteración resolvió un sub-problema:

| Iter | Foco |
|---|---|
| v1.6.1 | Padding tabs 24→20px + divider edge-to-edge + body height 52vh |
| v1.6.2 | Kill hover bg cream del DS sobre tabs no seleccionados |
| v1.6.3 | Mirror EXACTO del CSS de tabs de `workspace.html` |
| v1.6.4 | Padding aún más generoso (40px tabs, 56px bottom body) |
| v1.6.5 | Altura **flexible** (`min-height: 280px; max-height: 70vh`) + mensaje correcto Asamblea Liga vacía |
| v1.6.6 | **Causa raíz** del "modal narrow": `.naowee-modal` necesitaba `width: 95vw` además de `max-width` |
| v1.6.7 | Secciones colapsables con chevron + 3 cols compactas + hover tab sutil + titles más claros + sin divider |
| v1.6.8 | Modal cap 1100px + grid 3 cols con `1fr` para llenar el ancho (sin hueco a la derecha) |
| v1.6.9 | **Componente DS `.naowee-accordion` canónico** + label "Ver más/menos" naranja + empty states a nivel tab |

## Cambios técnicos clave

### 🪟 Modal width forzado (v1.6.6 — causa raíz)

El DS `.naowee-modal` sólo tenía `max-width: 1320px` inline. Eso es un **techo**, no un ancho real. Sin `width: 95vw`, el modal se sizeaba al contenido (~480px). DevTools confirmó:

```
div.ivc-detalle-tabs-wrap       → clientWidth: 480
div.naowee-tabs--animated       → 551.3 × 56  ← overflow horizontal
```

Fix: `<div class="naowee-modal" style="width: 95vw; max-width: 1100px;">` → modal ~1100px en pantalla normal.

### 🎚️ Componente DS `.naowee-accordion` canónico (v1.6.9)

Encontré el componente oficial en `design-system.css` línea 4276. Tiene exactamente lo que el usuario pidió:

```html
<div class="naowee-accordion__item naowee-accordion__item--open">
  <div class="naowee-accordion__header" role="button" tabindex="0">
    <span class="naowee-accordion__title">A. Fundadores</span>
    <span class="naowee-accordion__action">Ver menos</span>   ← naranja
    <svg class="naowee-accordion__chevron">…</svg>            ← naranja
  </div>
  <div class="naowee-accordion__body">
    <div class="naowee-accordion__content">…</div>
  </div>
</div>
```

**Overrides scoped a `#modalDetalleBody`** (solo color, no estructura inventada):

- `__action`: `color: var(--accent)` en lugar de `--text-link-idle`
- `__chevron`: `color: var(--accent)` en lugar de `--icon-secondary` gris
- `__title`: 11px gris claro `#9a9db0` letterspaced (override del 14px default)
- `__body max-height` en open: 4000px (default era 500px — recortaba tablas grandes)

JS toggle handler:

```js
function _toggleAccordionItem(header) {
  var item = header.closest('.naowee-accordion__item');
  item.classList.toggle('naowee-accordion__item--open');
  var isOpen = item.classList.contains('naowee-accordion__item--open');
  var action = header.querySelector('.naowee-accordion__action');
  if (action) action.textContent = isOpen ? 'Ver menos' : 'Ver más';
}
```

**Default: primer bloque de cada tab expandido**, el resto colapsado.

### 📦 Estructura tab refactorizada

Antes: un solo `<section>` con 7 sub-bloques anidados.
Ahora: 7-8 accordions independientes por organismo.

- F1 Liga: 8 accordions (A. Fundadores, B. Miembros OA, B. Datos extra OA, C. Revisor Fiscal, D. Comisión Disciplinaria, E. Comisión Técnica, F. Comisión de Juzgamiento, G. Paradeporte)
- F2 Asociación: 1 accordion (Entidades seccionales)
- F3 Federación: 7 accordions (A. Afiliados, B. Miembros OA, B. Datos extra OA, C. Revisor Fiscal, C. Datos extra OC, D. Comisión Disciplinaria)

### 🟢 Empty states a nivel tab

Antes con tab vacía: 6-7 accordions cada uno con "No se diligenció ninguna fila." (ruido visual).
Ahora si TODO el tab está vacío: un solo mensaje centrado.

Helper `_hasRows(arr)` para detectar arrays con al menos una fila no-vacía:

```js
function _hasRows(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.some(function(r){
    if (!r || typeof r !== 'object') return !!r;
    return Object.keys(r).some(function(k){
      return r[k] !== undefined && r[k] !== null && r[k] !== '';
    });
  });
}
```

### 🐛 Bug del tooltip que quedaba colgado

Patrón portal-tooltip movía `.naowee-tooltip__content` al body en mouseover. Al click + modal abre, el overlay tapaba el trigger antes que `mouseout` disparara → tooltip pegado con `opacity: 1`.

Fix: click handler en **fase de captura** sobre cualquier `.naowee-tooltip` → `hideActive()` antes que el handler del botón abra el modal.

```js
document.addEventListener('click', function(ev){
  if (ev.target.closest('.naowee-tooltip')) hideActive();
}, true);  // capture phase
```

### 🗂️ Cache busters

Los 8 includes de `../shared/*.css|*.js` ahora llevan `?v=1.6.9`. Cada bump cambia URL automáticamente → browsers re-fetchean assets compartidos en lugar de servir versiones cacheadas. Resolvió varias confusiones donde el usuario veía el modal viejo aunque el archivo en disco estaba actualizado.

## Lecciones aprendidas

1. **`max-width` ≠ `width`**: si el contenedor no tiene `width` explícito y solo `max-width`, hace fit-content y no llena el viewport. El DS `.naowee-modal` necesitaba `width: 95vw` complementario.
2. **DS canonical primero**: invertí 4 iteraciones (v1.6.1-1.6.4) intentando "limpiar" los tabs con overrides agresivos antes de simplemente mirror exacto del CSS de `workspace.html` (v1.6.3). Workspace ya tenía el patrón firmado.
3. **Componentes DS primero, overrides después**: en v1.6.7 implementé un chevron-only collapse hecho a mano. v1.6.9 lo migré al componente `.naowee-accordion` canónico del DS — menos código, más consistente, mejor accesibilidad.
4. **Cache busters en assets compartidos** ahorran mucho debugging cuando el usuario carga via `file://`.

## Bloqueantes activos (sin cambio)

- Plantillas Word/PDF de actos administrativos.
- Lista cerrada y final de roles.
- HUs faltantes pasos 7-12.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-26 · `ivc-v1.6.9`
