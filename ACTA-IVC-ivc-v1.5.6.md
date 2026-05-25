# ACTA · Naowee IVC · ivc-v1.5.6

> Handoff de la versión `ivc-v1.5.6` — Asociación Deportiva (F2): uploaders condicionales + 2 campos de Inscripción de Miembros que faltaban.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.6` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Feedback origen | Juan Manuel (Juanma) |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.5.6 |

## Cambios principales

### 📎 Uploaders condicionales en F2 (Asociación Deportiva)

Cuando el organismo declara que **sí** tiene inventario de bienes o documentos de afiliación internacional, ahora aparece el componente canónico `uploadField` para cargar el archivo. Antes el radio se quedaba en "Sí" sin posibilidad de adjuntar — bug bloqueante para cumplir el requisito documental.

- **¿Cuenta con inventario de bienes? → Sí** → uploader "Cargar inventario de bienes"
- **¿Cuenta con documentos de afiliación internacional? → Sí** → uploader "Cargar documento de afiliación internacional"
- **No** y **No aplica** → no requieren archivo (sin cambio)

### ➕ Sección "Inscripción de Miembros" agregada

Entre "Constitución / Elección del Órgano de Administración" y "Inventario y afiliación internacional" se agrega una nueva sección con 2 campos del XLSX oficial:

| ID XLSX | Campo | Tipo |
|---|---|---|
| F2-2.5 | N° Resolución de Inscripción de Miembros | Texto libre |
| F2-2.5a | Radicado de la Resolución de Inscripción de Miembros en IVC | Texto libre |

### 🔧 `STATE.data.f2` ampliado

Cuatro campos nuevos en el shape del estado:
- `no_inscripcion_miembros: ''`
- `radicado_inscripcion_miembros: ''`
- `archivo_inventario: null`
- `archivo_afiliacion: null`

## Implementación

- Render condicional con ternarios sobre `f2.tiene_inventario === 'si'` y `f2.tiene_afiliacion === 'si'`.
- Reutilización del componente canónico `uploadField({ stateKey })` ya existente (mismo que F3 Asamblea).
- Aplicado en ambas copias del formulario (`prototype/usuario-externo/formulario-fase-1.html` + `IVC/demo-fase-1-formulario.html`).

## Bloqueantes activos (sin cambio)

Igual que v1.5.5.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.6`
