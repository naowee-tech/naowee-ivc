# ACTA · Naowee IVC · ivc-v1.3.2

> Handoff de la versión ivc-v1.3.2 — 7 fixes UI/UX sobre Fase 1.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.3.2` |
| Fecha | 2026-05-23 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Audiencia handoff | Juan Manuel Armero · Danna Arrieta · Diego |
| Base | `ivc-v1.3.1` |

## Cambios principales (7 fixes UI/UX)

| # | Fix | Resolución |
|---|---|---|
| 1 | Título duplicado en dropdowns de pre-selección | Eliminados `<h2 class="wz-section">` redundantes — el label del dropdown ya cumple ese rol |
| 2 | Menú del dropdown de trámite enmascarado | Portal del menú al `<body>` con `position:fixed` + posicionamiento por `getBoundingClientRect()` |
| 3 | Elevation del container principal | Eliminado `box-shadow` de `.wz-card`. Conservado el border de 1px |
| 4 | Wizard paso 6 se cortaba | Aplicada `.naowee-stepper--distributed` canónica + compactación de labels no-activos |
| 5 | Dropdowns paso 2 enmascarados | Mismo patrón portal del fix #2 — aplica a todos los dropdowns del wizard |
| 6 | Datepicker canónico Naowee | Portado del Project v2.0.3 (`modal-convocatoria.js`): markup + render + bind + portal |
| 7 | CTAs "Agregar fila" al medio | `text-align: center` → `left` en `.ivc-repeatable__add` |

## Datepicker — funciones portadas del v2.0.3

```
modal-convocatoria.js  →  demo-fase-1-formulario.html

datepicker()                  líneas 121-180   → genera markup field + popover
buildDaysHTML()               líneas 1621-1671 → grid de 6 semanas × 7 días
renderCalendarPortal()        líneas 1914-1994 → 3 modos (days/months/years)
setDatepickerValue()          líneas 1700-1720 → set value + hidden input + clear
formatDateLong()              líneas 1723-1725 → "16 de Junio de 2025"
bindDatepickers()             líneas 1727-1909 → portal + posicionamiento + teclado
MESES_ES, MESES_ES_CORTO      líneas 1610, 1912
```

Las 6 fechas del demo migradas: `fecha_reforma` (F1/F3), `fecha_constancia` (F1/F3), `fecha_estatutos` (F2), `fecha_convocatoria` (F3), `fecha_realizacion` (F3).

## Portal pattern (dropdowns + datepicker)

Ambos componentes usan el mismo pattern:
1. Cuando se abre, el panel flotante se mueve a `document.body` con `position:fixed`.
2. Coordenadas calculadas desde `getBoundingClientRect()` del trigger.
3. Flip-up automático cuando no cabe debajo del trigger.
4. Cleanup en cada `render()` para evitar fugas de DOM.

Esto soluciona el problema universal de `overflow:hidden` en containers padres recortando popovers.

## Verificación

- Cero `<select>` nativos: ✓
- Cero `box-shadow` en `.wz-card`: ✓
- `.naowee-stepper--distributed` aplicada: ✓
- `function datepicker()` presente: ✓ (7 matches)
- `bindDatepickers()` invocado tras cada render: ✓
- Lógica F1/F2/F3 intacta: ✓

## Pendiente (NO incluido)

- 2 `<input type="date">` HTML5 en celdas compactas del repeatable de Asamblea — migración requiere rediseño del grid template inline. Recomendación: dejarlas como están en esta demo o convertir el repeatable de Asamblea a un layout más amplio (filas en lugar de grid horizontal) si Juanma lo pide.

## Bloqueantes activos

Sin cambios respecto a v1.3.1.

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html`

## Tamaño

- Demo: 2,632 líneas / 116 KB.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-23 · `ivc-v1.3.2`
