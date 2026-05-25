# ACTA · Naowee IVC · ivc-v1.5.4

> Handoff de la versión `ivc-v1.5.4` — NIT condicional al organismo (solo Liga) en el formulario público de Fase 1.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.4` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Feedback origen | Juan Manuel (Juanma) |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.5.4 |

## Cambios principales

### 🪪 NIT condicional al tipo de organismo (`formulario-fase-1.html`)

Solo las **Ligas Deportivas Departamentales** manejan NIT en el trámite de Otorgamiento de Reconocimiento Deportivo. Asociaciones y Federaciones no — el campo NIT ya no aparece para ellos.

Aplicado en 4 lugares y replicado en las dos copias del formulario (`prototype/usuario-externo/formulario-fase-1.html` del repo + `IVC/demo-fase-1-formulario.html` standalone):

1. **Paso 1 · render**: `STATE.tipoOrganismo === 'liga'` controla si se renderiza el grid de 2 columnas (NIT + Teléfono) o solo el teléfono full-width.
2. **Validación `validateStep1()`**: `nit` se agrega al array de campos requeridos solo cuando es Liga.
3. **Paso final · Revisión**: la fila NIT del summary se omite si no es Liga.
4. **Pantalla de éxito · Comprobante**: la meta `NIT XXX · LabelOrganismo` se reduce a `LabelOrganismo` si no es Liga.

## Bloqueantes activos (sin cambio desde v1.5.3)

- Plantillas Word/PDF de actos administrativos.
- Matriz Excel completa de catálogo de trámites.
- Lista cerrada y final de roles.
- HUs faltantes pasos 7-12.
- Acceso a HU-26.x / 27.x / 28.x del XLSX SUID.

## Próximos pasos comprometidos

Sin cambio respecto a v1.5.3 (cola Coord IVC, vista Director, catálogo de estados, flujo Apelación → Jurídica, patrón de "renuncia a términos").

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.4`
