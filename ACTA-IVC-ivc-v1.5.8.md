# ACTA · Naowee IVC · ivc-v1.5.8

> Handoff de la versión `ivc-v1.5.8` — Sweep exhaustivo del matriz XLSX oficial (F1+F2+F3) + bandeja Coordinador refactor + workspace fixes + tono formal + bug auto-scroll.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.5.8` |
| Fecha | 2026-05-25 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Fuente de verdad | `formulario otorgamiento v2.xlsx` (matriz oficial) |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.5.8 |

## Cambios principales

### 📋 Sweep matriz XLSX oficial (F1+F2+F3)

Análisis exhaustivo del archivo "formulario otorgamiento v2.xlsx" con 3 pestañas (F1 Ligas, F2 Asociaciones Juveniles o Recreativas, F3 Federaciones Deportivas Nacionales). Se identificaron 30+ gaps entre el formulario implementado y el matriz oficial. Todos cerrados en esta versión.

**Naming oficial de organismos** (de feedback explícito):
- Liga → "**Ligas o asociaciones deportivas**"
- Asociación → "**Asociaciones juveniles o recreativas**"
- Federación → "**Federaciones deportivas**"

**Trámites por organismo según matriz**:
- F1 (Ligas): Otorgamiento + Negación + Renovación + Actualización (4 opciones)
- F2 (Asociaciones): solo Otorgamiento + Renovación (sin Actualización)
- F3 (Federaciones): solo Otorgamiento de Personería Jurídica (FR-047, único trámite)

**Campos nuevos agregados** (cerrando gaps del matriz):
- F1: secciones 2.6/2.7/2.8 (RD anterior cond), 2.9 (inscripción miembros), 6b.1/6b.2 (antecedentes + discapacidad), 6g.5 (fecha asamblea paradeporte), 7 (cierre completo).
- F2: 2.5/2.5a (inscripción miembros), 0.1 sub-tipo, sección 4 cierre.
- F3: 2.x (constitución 3 campos), 3.x (asamblea constitución), 4.x (asistentes + RF), 5b.x/5c.x/5d.x (estructura extendida), 6.x (3 certificaciones + cierre).

**Mocks incorrectos corregidos**:
- F3-5b OA: tabla extendida de 4 a 6 columnas (agregados `tiene_capacitacion`, `nombrado_por`).
- F3-5c RF: tabla extendida de 5 a 7 columnas (agregados `antecedentes_disciplinarios`, `firma_revisoria`).
- F3-6.1 label: "determinación de la modalidad deportiva" → "determinación técnica".
- F3-6.3 label: "no cursar investigaciones" → "no cursar investigación disciplinaria o penal contra los dignatarios".
- F1-3b columna "Antelación": TEXT input → DATE canónico (`fecha_antelacion_estatutos`).
- F2: municipio ya no se requiere (matriz no lo incluye).
- NIT: ya condicional solo para Liga (matriz).

### 🎨 Tono formal en todo el formulario (feedback Doug)

Pase completo de copy de tuteo informal → tratamiento formal con "usted" o impersonal:
- "Estás radicando" → "Trámite a radicar para"
- "Recibirás" → "Recibirá"
- "Tu solicitud" → "Su solicitud"
- "Selecciona" → "Seleccione" (todos los placeholders)
- "Carga cada documento" → "Cargue cada documento"
- "Haz clic o arrastra" → "Cargar archivo (clic o arrastrar)"
- "¿Qué tipo de organismo eres?" → "¿Cuál es el tipo de organismo?"
- 14 cadenas modificadas en total.

### 🐛 Bug crítico: auto-scroll al diligenciar radio button

`window.scrollTo({ top: 0 })` se ejecutaba en CADA llamada a `render()` — incluso cuando un radio button condicionaba la visibilidad de un sub-campo. El usuario perdía contexto cada vez que diligenciaba.

**Solución**: tracking del `__lastRenderedStep`; solo se hace scroll-to-top cuando CAMBIA el paso, no en re-renders intra-step.

### 🗂️ Coordinador · Bandeja

- **Sidebar limpio**: removidas entradas vacías "Trámites en validación" + "Histórico".
- **Modal Histórico**: alto fijo 70vh + scroll interno + datos reales (helper `normalizeEvento` tolerante a 2 shapes — antes mostraba `undefined`).
- **Modal Asignación Individual**: try/catch defensivo (modal cierra siempre + snackbar de error).

### 🖥️ Profesional · Workspace

- Page width 1280 → 1480px.
- Modales de decisión con `max-height: 85vh` + scroll interno + footer fijo.
- Removido botón "Cancelar" en los 3 modales.
- Textarea canónico DS en modales.
- Botón "Confirmar acto cumplimiento": verde → naranja `--loud` canónico.
- Botón "Finalizar revisión": glow del box-shadow matchea el color del fondo (verde/naranja/rojo).
- Divider del footer full-width.
- Section titles internos a 11px / `--text-secondary` (consistencia con tab Datos).

## Bloqueantes activos (sin cambio desde v1.5.7)

- Plantillas Word/PDF de actos administrativos.
- Lista cerrada y final de roles.
- HUs faltantes pasos 7-12.

## Próximos pasos comprometidos

1. Cola de revisión del Coordinador IVC (Fase 4).
2. Vista del Director IVC con firma electrónica.
3. Validar el patrón de "renuncia a términos" con UX de firma.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-25 · `ivc-v1.5.8`
