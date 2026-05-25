# ACTA · Naowee IVC · ivc-v1.5.0

> Arquitectura end-to-end: store compartido + bandeja conectada al formulario.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.0` |
| Fecha | 2026-05-25 |
| Tipo | Minor — feature (arquitectura) |
| Base | `ivc-v1.4.9` |

## Cambios principales

### Store compartido (`prototype/shared/ivc-store.js`)
- localStorage namespaced `ivc:` como source of truth
- Schema: trámites, profesionales, contador de radicados
- API: `crearTramite`, `asignar`, `actualizarEstado`, `getTramites`, `misAsignaciones`, `getProfesionales`
- Event emitter para reactividad cross-tab
- Seed inicial: 12 trámites + 4 profesionales

### Bandeja conectada
- Lee del store en lugar de mock hardcoded
- Asignaciones (individual + masiva) persisten
- Re-renderiza ante eventos (`tramite:creado`, `tramite:asignado`, `store:changed-external`)

### Formulario Fase 1 conectado
- Al confirmar paso 6 → `IVCStore.crearTramite(...)`
- ID consecutivo desde contador del store
- Histórico inicial automático

### Ancho de bandeja
- `.page-inner { max-width: 1480px }` (vs 1200px canónico)
- Stat-grid 2-cols intermedio en tablet (901-1200px)

## Flujo end-to-end verificable

1. Abrir `prototype/usuario-externo/formulario-fase-1.html`
2. Completar wizard → confirmar
3. Abrir `prototype/coordinador/bandeja.html` (misma origin file://)
4. El nuevo trámite aparece al inicio de la lista con estado "En remisión"
5. Asignar al profesional X
6. (v1.5.1) Abrir workspace Profesional X → aparece el trámite asignado

## Importante para local

Ambos archivos deben abrirse desde el mismo path raíz (`prototype/`) para que compartan localStorage. El demo aislado en `/Users/dvargas/Desktop/IVC/` queda como referencia visual.

## Pendiente

- v1.5.1 — Workspace Profesional + store
- v1.5.2 — Responsive audit completo
- v1.5.3 — Botón Reset demo

## URLs

- Formulario: https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html
- Bandeja: https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html

---

**Firma:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.0`
