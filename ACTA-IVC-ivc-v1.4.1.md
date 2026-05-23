# ACTA · Naowee IVC · ivc-v1.4.1

> Patch visual de filtros de bandeja: layout single-row + estilos canónicos del menu portaled.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.4.1` |
| Fecha | 2026-05-23 |
| Tipo | Patch visual |
| Base | `ivc-v1.4.0` |

## Feedback de Doug

> "Los dropdowns filters están mal diagramados — deberían estar en un solo row horizontal de la mano con el searchbox. Además no tienen los estilos del menu (las opciones se ven como cajitas grises sueltas)."

## Diagnóstico

**Issue #1 — Layout:** El `.bandeja-toolbar` tenía `flex-wrap: wrap`, lo que hacía que los filtros se fueran a una segunda fila cuando el searchbox crecía.

**Issue #2 — Estilos del menu:** Las options del `.naowee-dropdown__menu` estaban implementadas como `<button>` en lugar de `<div>` (como en el demo Fase 1). El UA browser aplica `background-color: buttonface` + `border` + `padding` por default a `<button>`, que el DS canónico no resetea — porque asume `<div>`. Resultado visual: cajitas grises sueltas, sin el container blanco del menu.

## Cambios aplicados

### Layout single-row
```css
.bandeja-toolbar { display: flex; align-items: center; gap: 10px; /* sin flex-wrap */ }
.bandeja-toolbar__search { flex: 1 1 auto; min-width: 200px; }
.bandeja-toolbar__filters { display: flex; gap: 8px; flex-shrink: 0; }
.bandeja-toolbar__filters .naowee-dropdown { width: 180px; flex-shrink: 0; }

@media (max-width: 900px) {
  .bandeja-toolbar, .bandeja-toolbar__filters { flex-wrap: wrap; }
  .bandeja-toolbar__filters .naowee-dropdown { width: auto; flex: 1 1 160px; }
}
```

### Markup migration
- 16 `<button class="naowee-dropdown__option">` → `<div class="naowee-dropdown__option" role="option">`
- Aplicado a los 4 dropdowns: `ddEstado`, `ddTipo`, `ddProfesional` (masivo), `ddProfesionalSingle`
- Patrón consistente con el demo Fase 1 (`formulario-fase-1.html` v1.3.3)

### CSS reset defensivo (page-scoped)
```css
.naowee-dropdown__menu .naowee-dropdown__option {
  background: transparent;
  border: 0;
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  text-align: left;
  font: inherit;
  color: var(--naowee-color-text-primary);
}
.naowee-dropdown__menu .naowee-dropdown__option:hover { background: var(--naowee-color-background-secondary); }
.naowee-dropdown__menu .naowee-dropdown__option--selected {
  background: var(--naowee-color-interactive-fill-quiet-idle);
  color: var(--naowee-color-text-accent);
  font-weight: var(--naowee-font-weight-semibold);
}
```

## JS compatibility

El controlador `setupNaoweeDropdownController` usa selectores por clase (`closest('.naowee-dropdown__option')`), no por tag — funciona idéntico con `<div>` o `<button>`. **Cero cambios en JS.**

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html`

---

**Firma:** Doug Vargas · Head of Product · 2026-05-23 · `ivc-v1.4.1`
