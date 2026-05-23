# ACTA · Naowee IVC · ivc-v1.3.1

> Handoff de la versión ivc-v1.3.1 — Iteración Fase 1 con feedback de Juan Manuel Armero.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.3.1` |
| Fecha | 2026-05-23 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Audiencia handoff | Juan Manuel Armero (Tech Lead) · Danna Arrieta (PM Ministerio) · Diego (Analítica) |
| Base | `ivc-v1.3.0` (demo Fase 1 con DS canónico) |

## Origen de la iteración

Juan Manuel revisó la demo `ivc-v1.3.0` y dejó 3 puntos de feedback + 1 verificación:

1. ✅ Cambiar radios de "Tipo de organismo" por un selector (preparar escalabilidad a más organismos).
2. ✅ Los trámites deben cambiar según el organismo seleccionado (preparar escalabilidad a los 18 trámites del catálogo).
3. ✅ Quitar "Guardar borrador" — la demo es pública, no hay sesión a quien guardarle.
4. ✅ Verificar que los campos cambien dinámicamente según organización (F1/F2/F3).

## Cambios principales

### 1. `ORGANISMOS` — Array escalable de tipos de organismo

```js
const ORGANISMOS = [
  { id: 'liga',          label: 'Liga Deportiva Departamental',     desc: 'F1 · ...' },
  { id: 'asociacion',    label: 'Asociación Deportiva',             desc: 'F2 · ...' },
  { id: 'federacion',    label: 'Federación Deportiva Nacional',    desc: 'F3 · ...' },
  // Ejemplos comentados para mostrar extensibilidad a Juanma:
  // { id: 'club',                  label: 'Club Deportivo',                    desc: 'F4 ...' },
  // { id: 'club_profesional',      label: 'Club Deportivo Profesional',        desc: 'F5 ...' },
  // { id: 'comite_paralimpico',    label: 'Comité Paralímpico Colombiano',     desc: 'F6 ...' },
  // { id: 'comision_nacional',     label: 'Comisión Nacional del Deporte ...', desc: 'F7 ...' },
  // { id: 'ente_departamental',    label: 'Ente Departamental del Deporte',    desc: 'F8 ...' },
];
```

Para activar un nuevo organismo: descomentar la entrada + crear `renderStep2_FN/FN/FN`.

### 2. `TRAMITES_POR_ORGANISMO` — Mapping escalable a los 18 trámites

```js
const TRAMITES_POR_ORGANISMO = {
  liga: [
    { id: 'otorgamiento',   ..., enabled: true  },
    { id: 'renovacion',     ..., enabled: false },
    { id: 'actualizacion',  ..., enabled: false },
  ],
  asociacion:  [ /* otorgamiento + renovacion (disabled) */ ],
  federacion:  [ /* otorgamiento + renovacion + actualizacion + impugnacion (todos disabled excepto otorgamiento) */ ],
  // Resto de organismos cuando se activen.
};
```

Las opciones disabled usan la clase canónica `.naowee-dropdown__option--disabled` (línea 2499 del DS).

### 3. Eliminado "Guardar borrador"

- Botón `<button class="wz-save-draft" id="btnDraft">` removido del footer del wizard.
- CSS `.wz-save-draft` + `:hover` + `:active` removido.
- Función `saveDraft()` + event listener removidos.
- Layout del footer reajustado: solo "← Anterior" + "Continuar →".

### 4. Helper `dd()` extendido

- Soporte para `option.disabled: true` (sin inventar clases — usa `.naowee-dropdown__option--disabled` canónica).
- Controlador `setupNaoweeDropdownController` ignora clicks en opciones disabled.

## Verificación lógica F1/F2/F3

| Paso del wizard | Liga (F1) | Asociación (F2) | Federación (F3) |
|---|---|---|---|
| 2. Datos generales | renderStep2_F1 (38 campos) | renderStep2_F2 (22 campos) | renderStep2_F3 (25 campos) |
| 3. Asamblea | renderStep3_F1 | renderSkipView (no aplica) | renderStep3_F3 |
| 4. Estructura | renderStep4_F1 (7 tablas) | renderStep4_F2 (1 tabla) | renderStep4_F3 (4 tablas) |

✅ Confirmadas las 3 ramificaciones intactas tras los cambios.

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html`

## Bloqueantes activos

Mismos que `ivc-v1.3.0`:

- Plantillas del acto administrativo de Diego (Analítica) — pendiente para trámites distintos de Otorgamiento.
- 8 bloqueantes Diego/Danna: FR-037, FR-038, pre-registro, borradores, F2-Municipio, F3-estatutos, ENUM extension, organismo→área mapping.
- HU-26.3, HU-27, HU-28, HU-001, HU-005, HU-006 pendientes de compartir por Danna.

## Próximos pasos comprometidos

1. Compartir esta URL con Juanma para 2da pasada de feedback.
2. Si pasa: empezar a activar los organismos comentados (Club, Comité Paralímpico, etc.) — necesita especificación de Diego.
3. Activar los trámites disabled (Renovación, Actualización, Impugnación) — necesita plantillas de Diego.
4. Workshop de 90 min Doug + Juanma + Danna para validar state machine de 7 estados macro.

## Tamaño

- Demo: 1,987 líneas / 85.8 KB (antes: 1,927 / 84.8 KB → +60 líneas / +1 KB por catálogos).

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-23 · `ivc-v1.3.1`
