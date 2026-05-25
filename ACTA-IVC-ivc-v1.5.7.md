# ACTA · Naowee IVC · ivc-v1.5.7

> Handoff de la versión `ivc-v1.5.7` — Refinamiento profundo de Fase 1 con feedback iterativo de Juanma y Doug.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.7` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Feedback origen | Juan Manuel + Doug (revisión Fase 1) |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.5.7 |

## Resumen ejecutivo

Esta versión consolida **9 fixes/features** acumulados sobre el formulario público de Fase 1 (Otorgamiento de Reconocimiento Deportivo). El foco está en alineación 100% con el Design System Naowee canónico y UX correcta para 3 tipos de organismo (Liga, Asociación, Federación).

## Cambios principales

### 🧭 Stepper dinámico según tipo de organismo
- Asociación → 6 pasos (sin Asamblea). Liga / Federación → 7 pasos.
- Antes el stepper mostraba 7 fijos con salto visual 3→5 para Asociación.
- Nuevo mapa `STEPS_POR_ORGANISMO`. Escalable para nuevos tipos.

### 📍 Modal de Dirección estructurado (feedback Juanma)
- Patrón SUID: Tipo de vía + Número + Letra + BIS + Cruce + Casa + Info.
- Dropdown canónico DS, máscara numeric en campos numéricos, checkbox BIS canónico DS.
- Dismiss canónico `.naowee-modal__dismiss`. Sin botón Cancelar redundante.
- Formato display automático: `"Calle 50B Bis # 20-30, Apto 301"`.

### 🛡️ Máscaras de entrada (`opts.mask` en `tf()`)
- Soporta `tel` / `numeric` / `money` / `email` / `alpha`.
- Aplicado a NIT, teléfono, correo, todos los campos numéricos.
- `inputmode` correcto para teclados mobile.

### 🎨 Consistencia visual con DS Naowee
- Textfield y dropdown ahora usan el mismo `border-color` (gray-300).
- Mini-inputs del repeatable subidos a radius 8 / height 40 / padding 12 / font 14.
- Botón "Anterior" y "+ Agregar fila" pasan de `--quiet` (crema) a `--mute` (ghost).
- File uploader con icono 20×20 stroke 1.5 (antes 32×32 stroke 2).
- Bordes del repeatable: head/add ahora respetan el border-radius del wrapper.

### ✅ Componentes canónicos
- Checkbox BIS: markup canónico DS (`.naowee-checkbox` + `__box` + `--checked` modifier).
- Dismiss del modal: `.naowee-modal__dismiss` canónico (estados hover del DS).

## Implementación

Aplicado en las **dos copias** del formulario:
- `prototype/usuario-externo/formulario-fase-1.html` (el del repo)
- `IVC/demo-fase-1-formulario.html` (el local standalone)

Solo se tocó el formulario y `shared/naowee-footer.js` (bump de versión).

## Bloqueantes activos (sin cambio)

- Plantillas Word/PDF de actos administrativos
- Matriz Excel completa de catálogo de trámites
- Lista cerrada y final de roles
- HUs faltantes pasos 7-12
- Acceso a HU-26.x / 27.x / 28.x del XLSX SUID

## Próximos pasos comprometidos

1. Cola de revisión del Coordinador IVC (Fase 4).
2. Vista del Director IVC con firma electrónica.
3. Validar el patrón de "renuncia a términos" con UX de firma.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.7`
