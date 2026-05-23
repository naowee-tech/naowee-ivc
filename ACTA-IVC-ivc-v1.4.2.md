# ACTA · Naowee IVC · ivc-v1.4.2

> Refinamiento UX/UI Pro Max de la pantalla de éxito en Fase 1.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.4.2` |
| Fecha | 2026-05-23 |
| Tipo | Patch visual (Fase 1) |
| Base | `ivc-v1.4.1` |

## Feedback de Doug

> "Quiero refinar algo de la primera fase, cuando llega la pantalla de congrats. Hay un info message que no tiene los estilos del Design System Naowee, aparte mejora la tabla de resumen con tus habilidades de UX/UI Pro Max."

## Diagnóstico

**Issue #1:** `.status-banner` con CSS 100% custom (6 reglas) duplicando funcionalidad del DS.

**Issue #2:** Comprobante con 3 redundancias y baja jerarquía visual.

## Cambios

### 1. Banner de estado canónico

```diff
- <div class="status-banner">
-   <div class="status-banner__icon">...</div>
-   <div class="status-banner__body">
-     <p class="status-banner__title">Estado actual: Radicado</p>
-     <p class="status-banner__text">...</p>
-   </div>
- </div>

+ <div class="naowee-message naowee-message--informative">
+   <div class="naowee-message__header">
+     <span class="naowee-message__icon">...</span>
+     <span class="naowee-message__title">Estado actual: Radicado</span>
+   </div>
+   <div class="naowee-message__text">...</div>
+ </div>
```

Eliminadas 6 reglas CSS custom. El componente ahora hereda colores azules semánticos del DS.

### 2. Refactor del comprobante (UX/UI Pro Max)

**Eliminado (3 redundancias):**
- Row "Organismo" → ya está en `.receipt__person-meta`
- Row "NIT" → ya está en `.receipt__person-meta`
- Row "Estado actual" duplicado → ahora único como badge en row consolidado

**Estructura nueva:** grid `[40px icon] [content] [aside]` por row.

| Row | Icono | Tratamiento especial |
|---|---|---|
| Trámite | 📄 Documento | — |
| Fecha de radicación | 📅 Calendario | — |
| **Plazo de respuesta** | 🕐 Reloj naranja | `.kv-row--highlight` + value naranja 15px + hint con fecha de vencimiento |
| Estado actual | ✓ Check | Badge `.naowee-badge--informative --quiet --small` en aside |
| Notificaciones | 📧 Email | (info nueva consolidada) |

**Detalles UI Pro:**
- Labels: `uppercase` + `letter-spacing: .4px` + 12px → diferenciación clara de valores
- Padding del row: `14px 0` (antes 6px) → mejor respiración
- Border: `solid 1px` (antes `dashed`) → más limpio
- Icono wrapper: 40x40, `border-radius: 10px`, `background: #f5f6fa` → patrón Incentivos
- Variante `--highlight`: bg naranja en icono + texto value naranja 15px

## Cross-módulo

El comprobante ahora comparte el patrón visual con `naowee-test-incentivos/incentivo-11-asignar-exito.html`. Consistencia entre módulos del ecosistema Naowee.

## URL pública

`https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html`

---

**Firma:** Doug Vargas · Head of Product · 2026-05-23 · `ivc-v1.4.2`
