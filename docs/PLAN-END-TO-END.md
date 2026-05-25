# Plan: Demo end-to-end conectada cross-roles

> **Versión:** ivc-v1.5.0+
> **Autor:** Doug Vargas · Head of Product
> **Objetivo:** que el demo IVC funcione end-to-end: lo que el Usuario Externo radique aparece en la bandeja del Coordinador, y lo que el Coordinador asigne aparece en el workspace del Profesional asignado.

---

## Problema a resolver

Hoy cada pantalla tiene **mock data hardcoded independiente**:
- `usuario-externo/formulario-fase-1.html`: genera un radicado pero no lo persiste
- `coordinador/bandeja.html`: lee 12 trámites mock del `shared/data.js`
- `profesional/workspace.html` (v1.2.0): lee 1 trámite focal mock

**Resultado:** no hay continuidad. Doug no puede mostrar el flujo completo a Juanma/Danna.

## Arquitectura propuesta

**localStorage como source of truth** (no hay backend en el demo). Namespace `ivc:` para aislar de otros módulos.

```
localStorage['ivc:store'] = JSON.stringify({
  tramites: [...],
  profesionales: [...],
  ultimoRadicado: 12       // contador para auto-generar IDs
})
```

### Schema `Tramite`

```ts
{
  id: 'IVC-2026-00001',
  organismo: 'Liga de Atletismo de Antioquia',
  nit: '800123456-7',
  tipoOrganismo: 'liga' | 'asociacion' | 'federacion',
  tipoTramite: 'otorgamiento',
  area: 'aficionado' | 'profesional' | 'actuaciones',
  fechaRadicacion: '2026-05-25T14:32:00Z',
  plazoDias: 15,
  estado: 'No asignada' | 'Asignada' | 'En validación' | 'Cumple' | 'Cumplimiento parcial' | 'No cumple',
  profesionalId: null | 'cp-001',
  profesionalNombre: null | 'Carlos Pérez',
  historico: [
    { fecha, hora, actor, accion }
  ],
  documentos: { /* 7 documentos del Decreto 1387 */ },
  datos: { /* datos del formulario completo */ }
}
```

### Schema `Profesional`

```ts
{ id: 'cp-001', nombre: 'Carlos Pérez',  area: 'aficionado', activos: 12 }
```

## API pública del store

```js
// Crear
IVCStore.crearTramite(formData) → tramite (con id, historico inicial, estado 'No asignada')

// Leer
IVCStore.getTramites(filtros?) → tramite[]
IVCStore.getTramite(id) → tramite | null
IVCStore.misAsignaciones(profesionalId) → tramite[]
IVCStore.getProfesionales(area?) → profesional[]

// Mutar
IVCStore.asignar(tramiteId, profesionalId, actor) → tramite (estado → 'Asignada' + historico)
IVCStore.actualizarEstado(tramiteId, estado, actor, observacion?) → tramite
IVCStore.reset() → vacía localStorage (botón demo)

// Eventos
IVCStore.on('tramite:creado', cb)
IVCStore.on('tramite:asignado', cb)
IVCStore.on('tramite:estado-cambiado', cb)
```

## Flujo end-to-end

```
1. USUARIO EXTERNO (formulario-fase-1.html)
   - Completa wizard 7 pasos
   - Submit → IVCStore.crearTramite({...})
   - Genera id = 'IVC-2026-' + (++store.ultimoRadicado).padStart(5,'0')
   - estado = 'No asignada', historico = [{Radicado, fecha, Sistema}, {En remisión, Sistema}]
   - Pantalla success muestra ese id

2. COORDINADOR (bandeja.html)
   - Carga: IVCStore.getTramites({ area: 'aficionado' })
   - Stat cards: cuenta por estado en tiempo real
   - Al asignar (modal individual o masivo):
     IVCStore.asignar(tramiteId, profesionalId, 'Carolina Méndez (Coordinador)')
   - El trámite ya tiene profesionalId + estado: 'Asignada' + nuevo historico item
   - Si el formulario crea uno mientras la bandeja está abierta, IVCStore.on('tramite:creado') → renderTabla()

3. PROFESIONAL (workspace.html, v1.5+)
   - Carga: IVCStore.misAsignaciones('cp-001')
   - Decisión (Cumple / Cumplimiento parcial / No cumple):
     IVCStore.actualizarEstado(id, 'Cumple', 'Carlos Pérez (Profesional)')
   - Coordinador IVC verá el cambio en su cola de revisión de actos (futura pantalla)
```

## Inicialización (seed)

Al primer `IVCStore.init()`:
- Carga los 12 trámites mock que ya existen en `shared/data.js` como seed inicial
- Carga los 4 profesionales mock
- En localStorage si está vacío

## Reset / Demo controls

Botón "Reset demo" (opcional) en algún menú admin que vacíe el store y lo reseede. Útil para sesiones de demo limpias.

## Pantallas pendientes para completar el flow

| Pantalla | Existe | Necesita conexión al store |
|---|---|---|
| Formulario Fase 1 | ✓ v1.4.9 | Sí (crearTramite al confirmar) |
| Bandeja Coord | ✓ v1.4.9 | Sí (reemplazar mock) |
| Workspace Profesional | ✓ v1.2.0 stub | Sí (misAsignaciones) — refactor pendiente v1.5.x |
| Cola Coord IVC (revisar acto) | ❌ | Futura (Fase 4) |
| Vista Director (firma) | ❌ | Futura (Fase 4) |
| Histórico organismo | ❌ | Futura |

## Plan de releases

| Versión | Alcance |
|---|---|
| `v1.5.0` | Store + bandeja conectada + ancho ampliado + plan responsive |
| `v1.5.1` | Formulario Fase 1 → escribir al store al confirmar |
| `v1.5.2` | Workspace Profesional refactor + responsive audit |
| `v1.5.3` | Eventos cross-tab (`storage` event) — si el Coordinador asigna en tab A, el Profesional en tab B ve la actualización en vivo |

## Responsive cross-pantallas (audit pendiente)

| Pantalla | Breakpoints actuales | Acción |
|---|---|---|
| Formulario Fase 1 | mobile (parcial) | Audit completo en v1.5.1 |
| Bandeja Coord | tablet básico (max-width:900px wrap) | Aumentar ancho desktop + mobile cards en v1.5.0 |
| Workspace Prof | sin verificar | Audit en v1.5.2 |

Estándar a aplicar:
- 320 / 480: stack vertical, cards en lugar de tabla
- 768 / 1024: tabla pero columnas no-críticas ocultas
- 1280+: tabla completa
- 1440+: ancho actual

---

**Próximo paso inmediato:** crear `prototype/shared/ivc-store.js` con la API completa + seed inicial.
