# ACTA · Naowee IVC · ivc-v1.4.3

> 5 ajustes finos UI en la bandeja del Coordinador.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.4.3` |
| Fecha | 2026-05-23 |
| Tipo | Patch UI (Fase 2) |
| Base | `ivc-v1.4.2` |

## Feedback de Doug

> "La row donde está el searchbox y los dropdowns: 1) el searchbox no debe estar tan ancho. 2) Los dropdowns deben tener el mismo alto del searchbox. 3) Fecha de radicación → Radicado en. Estado asignación → Estado. Profesional asignado → Asignado. 4) Las acciones pásalos a ghost buttons con tooltip al hacerle hover."

## Cambios

### 1. Searchbox menos ancho
```diff
- .bandeja-toolbar__search { flex: 1 1 auto; min-width: 200px; }
+ .bandeja-toolbar__search { flex: 0 1 320px; min-width: 240px; max-width: 360px; }
```

### 2. Spacer entre search y filtros
Nuevo `<div class="bandeja-toolbar__spacer">` con `flex: 1 1 auto` para empujar los filtros a la derecha (patrón Senior UX para toolbars).

### 3. Dropdowns con altura uniforme
Agregada clase canónica `.naowee-dropdown--medium` (DS L2435) a `#ddEstado` y `#ddTipo`. Altura 40px = `.naowee-searchbox--medium`. Misma línea óptica.

### 4. Renombre de columnas
| Antes | Después | Justificación |
|---|---|---|
| Fecha radicación | **Radicado en** | Verbo conjugado, más corto, semántico |
| Estado asignación | **Estado** | Contexto de la columna ya implica "asignación" |
| Profesional asignado | **Asignado** | Contexto ya implica "profesional" |

### 5. Acciones a icon button ghost + tooltip
Estructura canónica del DS (`.naowee-tooltip` L4347-4376):

```html
<span class="naowee-tooltip">
  <button class="naowee-btn naowee-btn--quiet naowee-btn--icon naowee-btn--small" aria-label="...">
    <svg>...</svg>
  </button>
  <span class="naowee-tooltip__content">Texto del tooltip</span>
</span>
```

Acciones migradas:
- **Asignar** → ícono `user-plus` + tooltip "Asignar trámite"
- **Reasignar** → ícono `refresh` (flechas circulares) + tooltip "Reasignar a otro profesional"
- **Histórico** (ya era icon) → ahora con tooltip "Ver histórico"

Beneficio adicional: la columna "Acciones" ahora es ~50% más compacta, dejando más espacio para las columnas de datos.

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html`

---

**Firma:** Doug Vargas · Head of Product · 2026-05-23 · `ivc-v1.4.3`
