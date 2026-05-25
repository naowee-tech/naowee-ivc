# ACTA · Naowee IVC · ivc-v1.5.9

> Handoff de la versión `ivc-v1.5.9` — Modal "Ver detalle del trámite" en bandeja del Coordinador: tabs canónicos del DS + grid de 3 columnas + modal a 1200px + refactor del render por tab. Tab "Datos" del workspace del Profesional enriquecida con toda la información diligenciada.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.9` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Fuente de verdad | `formulario otorgamiento v2.xlsx` (matriz oficial) |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.5.9 |

## Cambios principales

### 🎛️ Modal "Ver detalle del trámite" — Tabs canónicos DS

El modal del Coordinador que muestra todo lo diligenciado por el organismo se redimensiona a 1200px de ancho, sube el grid de datos de 2 a 3 columnas y refactoriza los tabs para que sean **exactamente** los del DS canónico (mismo tratamiento que `workspace.html`).

**Por qué se veían "raros" antes**: el DS v1.8.0 le pone a `.naowee-tab` un `background-color: var(--naowee-color-interactive-fill-mute-idle)` (pill gris). El override anterior con `background: transparent !important` no era suficiente porque el DS también setea `background-color` por separado y un `box-shadow`. Hacía que cualquier tab sobre el que el mouse pasara se viera como un segundo "seleccionado".

**Reset agresivo aplicado**:

```css
.ivc-detalle-tabs-wrap > .naowee-tabs > .naowee-tab {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0 !important;
}
.ivc-detalle-tabs-wrap > .naowee-tabs > .naowee-tab:hover {
  background-color: transparent !important;
  color: var(--text-primary);  /* solo color, sin pill */
}
```

Resultado: **solo el indicator naranja del tab activo marca jerarquía**, sin pills grises de fondo.

### 🐛 Bug crítico: tabs distintos a "General" mostraban contenido vacío

El refactor previo había dejado el dispatcher `renderDetalleTabContent(t, tabId)` apuntando a 4 funciones que **no existían**:

```javascript
// Dispatcher (ya existía)
if (tabId === 'personeria') return _renderTabPersoneria(t, d);   // ← undefined
if (tabId === 'asamblea')   return _renderTabAsamblea(t, d);     // ← undefined
if (tabId === 'estructura') return _renderTabEstructura(t, d);   // ← undefined
if (tabId === 'cierre')     return _renderTabCierre(t, d);       // ← undefined
```

Solo `_renderTabGeneral` estaba definida (y concentraba TODO el contenido). Resultado: clickear cualquier tab distinto del primero hacía `body.innerHTML = undefined` → modal en blanco.

**Solución**: trim de `_renderTabGeneral` a solo "Identificación + Datos generales" + creación de las 4 funciones faltantes:

| Tab | Función | Contenido |
|---|---|---|
| General | `_renderTabGeneral` | Identificación del trámite + Datos generales del organismo |
| Personería | `_renderTabPersoneria` | F1 (15 campos) / F2 (15 campos) / F3 (5 campos) según organismo |
| Asamblea | `_renderTabAsamblea` | F1 Liga: tema + tabla reuniones + observaciones + convocante + quórum / F3 Federación: constitución + asistentes |
| Estructura | `_renderTabEstructura` | F1: 7 sub-bloques (A-G) / F2: seccionales / F3: estructura completa (6 y 7 cols extendidas) |
| Cierre | `_renderTabCierre` | F1: cert. conjunta / F3: 3 certificaciones (COC + Aval Paralímpico + No investigación) + cierre común |

### 📐 Grid 3 columnas + modal más ancho

- `.ivc-data-grid`: `repeat(2, 1fr)` → `repeat(3, 1fr)`. Responsivo: 2 cols a ≤1100px, 1 col a ≤700px.
- Modal width: 1080 → **1200px** (necesario para que 3 columnas respiren).

### 🖥️ Workspace del Profesional · Tab "Datos" enriquecida

La tab "Datos" del workspace ahora muestra **TODOS** los datos diligenciados por el usuario externo en el formulario Fase 1 — no solo los metadatos del trámite. Feedback Juanma: el profesional necesita ver toda la información recolectada para poder validar contra los documentos cargados.

## Bloqueantes activos (sin cambio desde v1.5.8)

- Plantillas Word/PDF de actos administrativos.
- Lista cerrada y final de roles.
- HUs faltantes pasos 7-12.

## Próximos pasos comprometidos

1. Cola de revisión del Coordinador IVC (Fase 4).
2. Vista del Director IVC con firma electrónica.
3. Validar el patrón de "renuncia a términos" con UX de firma.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.9`
