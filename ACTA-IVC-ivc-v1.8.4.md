# ACTA · Naowee IVC · ivc-v1.8.4

> Handoff de `ivc-v1.8.4` — Cierre del flujo end-to-end Coordinador ⇄ Profesional ⇄ Organismo externo + redesign exhaustivo del modal "Ver detalle del trámite" con componentes canónicos del DS Naowee.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.8.4` |
| Fecha | 2026-05-26 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.8.4 |

## Resumen ejecutivo

Sesión intensa de iteración (15+ rondas) que cerró el ciclo de validación. Tres hitos:

1. **Lock del workspace** post-veredicto → trámite queda view-only hasta subsanación.
2. **Pantalla pública INS-014** (`consultar.html?rad=…`) → organismo consulta estado, descarga acto admin y radica subsanación sin login.
3. **Modal "Ver detalle" rediseñado** con `.naowee-message`, `.naowee-accordion`, file links minimal y tabs DS canónicos (mirror del playground).

## Flujo end-to-end probado

```
1. Organismo radica trámite                            → estado: No asignada
2. Coordinador asigna a Profesional                    → estado: Asignada
3. Profesional inicia validación                       → estado: En validación
4. Profesional marca docs cumples/no-cumples + obs
5. Profesional finaliza → No Cumple                    → estado: NoCumple
   • Workspace bloqueado (toggles + finalizar disabled)
   • Banner rojo + "Ver portal del organismo →" + "Reabrir (mock)"
6. Organismo abre /consultar.html?rad=IVC-2026-003
   • Ve veredicto NO CUMPLE (.naowee-message --negative)
   • Descarga acta administrativa PDF
   • Ve lista de docs no cumplidos + observaciones del profesional
7. Organismo click "Radicar subsanación"
   • Modal con docs failed (lista filtrada)
   • Upload por doc (mock) + comentarios
   • Click "Radicar" → IVCStore.actualizarEstado(t.id, 'En validación', …)
8. Cross-tab sync vía localStorage 'storage' event
   • Workspace del Profesional escucha → applyLockState() → lock removido
   • Banner desaparece, toggles re-habilitados
   • Bandeja del Coordinador → tabla refresca a "En validación"
9. Profesional re-valida documentación subsanada
10. (Loop hasta Cumple o reincidencia de NoCumple)
```

## Cambios técnicos clave

### 🌐 Pantalla pública INS-014 (`prototype/usuario-externo/consultar.html`)

Archivo nuevo, 700+ líneas. Renderiza dinámicamente según `?rad=`:

- **Landing**: input grande con sample radicados ("IVC-2026-003", "IVC-2026-012") + hint sobre el documento de radicación.
- **Hero del trámite**: radicado mono + nombre del organismo + tipo organismo + tipo trámite + fecha radicación + plazo restante (badge color-coded).
- **Resultado de la validación** (solo si terminal): `.naowee-message` canónico + actor pill profesional + fecha + acto admin descargable + lista de docs failed.
- **Estado en proceso** (No asignada / Asignada / En validación): `.naowee-message --informative` o `--caution`.
- **Subsanación CTA + Modal**: solo cuando state es NoCumple/Parcial. Modal con upload por doc + textarea + Radicar.
- **Histórico timeline** completa de eventos del trámite.

Componentes DS usados: `.naowee-message` (4 variants), `.naowee-modal-overlay/header/body/footer/dismiss/title-group`, `.naowee-btn --accent/--outline`.

### 🔒 Workspace Lock (`prototype/profesional/workspace.html`)

```js
function isTramiteFinalizado() {
  var e = state.tramite && state.tramite.estado;
  return e === 'Cumple' || e === 'NoCumple' || e === 'Parcial';
}
function applyLockState() {
  document.body.classList.toggle('ivc-tramite-locked', isTramiteFinalizado());
  renderLockBanner();
}
```

Llamado en:
- Load inicial (si abre un trámite ya terminal)
- Después de `confirm{Cumple|Parcial|NoCumple}()` (lock inmediato sin recargar)
- `store:changed-external` (otra tab modificó el estado — ej. organismo radicó subsanación)

CSS:
```css
.ivc-tramite-locked .ivc-ra-toggle__btn { pointer-events: none; opacity: 0.4; }
.ivc-tramite-locked [data-obs] { pointer-events: none; background: var(--bg-soft); }
.ivc-tramite-locked .ivc-finalizar-row { display: none !important; }
```

### 🎨 Tabs DS canónicos (mirror del playground)

El playground en `naowee-design-system/playground.html` usa:

```html
<div class="naowee-tabs" style="width:100%">
  <button class="naowee-tab naowee-tab--selected">Label</button>
  <button class="naowee-tab">Label</button>
</div>
```

15 iteraciones de tabs (v1.7.0 → v1.7.9) hasta llegar a esto. **Causa raíz** del comportamiento "no canónico" anterior: `shared/components.css` línea 159 tenía una definición vieja del patrón pill-segmented con `padding: 4px` + `background: var(--bg)` + `border-radius` + `gap: 2px`, todo heredado sobre nuestros tabs nuevos. Solución: override completo en el scope local del workspace y del modal del coordinador.

### 🪟 Modal "Ver detalle" — Stack tecnológico

| Capa | Componente DS | Override scoped |
|---|---|---|
| Tabs | `.naowee-tabs` (simple, no `--animated`) | padding interno 12px 24px 0 + border-bottom edge-to-edge + `::after { border-radius: 0 }` |
| Veredicto banner | `.naowee-message --positive/caution/negative` | margin: 4px 0 24px |
| Acordeón | `.naowee-accordion` | `__action`: color naranja accent · `__chevron`: color accent · `__body max-height: 4000px` (default 500 recortaba tablas) |
| File links | custom `.ivc-file-link` | minimal — name + size + download icon naranja + `title="Descargar"` |
| Modal | `.naowee-modal` + `width: 95vw; max-width: 1100px` (inline) | `height: auto; min-height: 280px; max-height: 70vh` para el body |

### 📊 Datos mock completos

`_mockDatos(tipoOrg, organismo, nit)` en `ivc-store.js` con factory por tipo de organismo. Cubre 100% de los campos obligatorios del matriz oficial XLSX. `SEED_VERSION: 1 → 2` fuerza reset del localStorage para regenerar trámites con data completa.

## Bug crítico solucionado

**Tooltip "Ver detalle" colgado al abrir modal**: el portal-tooltip movía `.naowee-tooltip__content` al body en `mouseover`. Al clickear el ojo + abrir modal, el overlay tapaba el trigger antes que `mouseout` disparara → tooltip pegado en el body con `opacity: 1`. Fix:

```js
document.addEventListener('click', function(ev) {
  if (ev.target.closest('.naowee-tooltip')) hideActive();
}, true);   // capture phase → corre ANTES del click handler del botón
```

## Bloqueantes activos

- **Plantillas Word/PDF reales** de actos administrativos (hoy son archivos mock con nombre generado).
- **Magic link por correo** para reemplazar la consulta pública INS-014 (que tiene riesgo de privacidad conocido — cualquiera con el número de radicado ve los datos).
- **Lista cerrada y final de roles** internos del IVC.
- **HUs faltantes pasos 7-12** del flujo V4.

## Próximos pasos comprometidos

1. Vista del Director IVC con firma electrónica del acto administrativo.
2. Implementar magic link por correo (cierre del riesgo INS-014).
3. Cola de revisión del Coordinador IVC con priorización por plazo.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-26 · `ivc-v1.8.4`
