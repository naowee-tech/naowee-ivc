# ACTA · Naowee IVC · ivc-v1.10.5

> Handoff de `ivc-v1.10.5` — Aprobación COO del acto administrativo: nuevo estado `PendienteCOO`, página dedicada para el Coordinador (`actos.html`) con loop INS-004, lógica de subsanación corregida (NoCumple terminal, solo Parcial subsanable), y refinamiento exhaustivo del DS Naowee en los 3 roles (Coordinador / Profesional / Organismo externo).

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.10.5` |
| Fecha | 2026-05-26 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Release notes | https://github.com/naowee-tech/naowee-ivc/releases/tag/ivc-v1.10.5 |
| Tag previo | `ivc-v1.8.4` |
| Versiones intermedias | v1.8.5 → v1.10.5 (21 iteraciones, sin tag intermedio) |

## Resumen ejecutivo

Sprint enfocado en cerrar el flujo de aprobación COO (Coordinación de Operaciones) del acto administrativo, que estaba ausente del prototipo. Tres hitos:

1. **Nuevo estado `PendienteCOO`** en el state machine: el profesional ya no salta directo de "En validación" a "Cumple" — el acto pasa primero por el Coordinador.
2. **Página dedicada `actos.html`** para el Coordinador con 2 tabs (Por aprobar / Aprobados), vista detalle con acto en viewport, y CTAs de aprobar/devolver.
3. **Loop INS-004 cerrado**: si Coordinador devuelve para corrección, trámite vuelve a "En validación" con causales en historico, profesional desbloqueado, genera v2 del acto, el ciclo se repite.

## State machine final

```
No asignada
   ↓ (Coordinador asigna)
Asignada
   ↓ (Profesional inicia validación)
En validación
   ↓ (Profesional veredict)
   ├── Cumple    → PendienteCOO                   ← NUEVO
   │                  ↓ (Coordinador decide)
   │                  ├── Aprueba → Cumple        (terminal positivo: pendiente firma Director)
   │                  └── Devuelve → En validación + v++ (loop INS-004)
   ├── Parcial   → Parcial (terminal subsanable)
   │                  ↓ (Organismo radica subsanación)
   │                  → En validación
   └── NoCumple  → NoCumple (terminal definitivo, no subsanable)
```

**Reglas clave:**
- `NoCumple` es terminal en firme. No admite subsanación (al menos un doc rechazado por el profesional).
- `Parcial` es el único estado que admite subsanación (docs con observaciones, ningún No Cumple).
- `PendienteCOO` bloquea el workspace del profesional como view-only hasta que el Coordinador decida.

## Cambios técnicos clave

### 🆕 `prototype/coordinador/actos.html` (archivo nuevo, 1300+ líneas)

Single-file con 2 vistas por URL:

**LIST view (`actos.html` y `actos.html?tab=aprobados`)**
- Page title "Actos" + subtitle dinámico por tab
- 3 stat cards: Pendientes COO · En segunda revisión · Aprobados hoy
- Tabs canónicos DS DENTRO del table-card: "Por aprobar (N)" / "Aprobados (N)" con count pills
- Tabla con columnas: Radicado · Tipo · Organismo · Profesional · Fecha · Versión (pill v1/v2 bumped) · Plazo|Estado · Acciones
- Empty state contextual por tab

**DETAIL view (`actos.html?id=IVC-XXX`)**
- Back link canónico DS (sin underline, sin background, chevron animado en hover)
- Hero: radicado + organismo + meta + plazo
- Grid 2-col responsive:
  - **Izquierda (1.8fr)**: Acto administrativo en viewport (look formal Times New Roman) + Descargar PDF canónico (`naowee-btn--quiet`) + footer integrado en la card con CTAs
  - **Derecha (1fr sticky)**: 3 cards apiladas — Profesional · Resumen validación · Trazabilidad (alto fijo 240px + scroll + toggle "Ver más/menos")

**Acciones del Coordinador:**
- **Aprobar y enviar a firma del Director** (CTA verde loud) → `Cumple`
- **Devolver para corrección** (CTA mute) → modal con causales (gate ≥10 chars) → `En validación` + v++

### 🔄 Cambios cross-file por estado nuevo

**`shared/shell.js`**: ícono `approval` + nav item `actos-coord` para el sidebar del Coordinador (sin badge dinámico — el conteo real vive en el store).

**`profesional/workspace.html`**:
- `confirmCumple()` ahora escribe `PendienteCOO` (no `Cumple` directo)
- `isTramiteFinalizado()` incluye `PendienteCOO` → workspace lock activo
- Cenefa nueva variant para `PendienteCOO`: "Acto en revisión del Coordinador IVC" (caution)
- Cross-tab sync: si Coord devuelve → workspace se desbloquea automáticamente vía `store:changed-external`

**`coordinador/bandeja.html`**:
- `badgeForEstadoAsignacion` maneja `PendienteCOO` → "En aprobación COO"
- Dropdown filter de estado incluye la opción
- Modal "Detalle del trámite" tab Cierre: el message verde ahora incluye CTA contextual
  - PendienteCOO → "Revisar y aprobar acto →" (`--loud`, acción requerida)
  - Cumple → "Ver acto administrativo →" (`--mute`, read-only)
- Mensaje del modal Generar acto (Cumple) refleja flujo COO real: "El acto pasará primero al Coordinador IVC para su revisión..."

**`usuario-externo/consultar.html`**:
- `canSubsanar = (estado === 'Parcial')` (antes incluía NoCumple)
- Copy de NoCumple actualizado: "El trámite quedó cerrado en firme. No admite subsanación. Si desea continuar, puede presentar un nuevo trámite."
- Label de la lista contextual: "Documentos no aprobados" (NoCumple) vs "Documentos a subsanar" (Parcial)
- Nuevo mensaje para `PendienteCOO`: "EN APROBACIÓN COO — Su acto administrativo fue generado por el profesional IVC y está en revisión del Coordinador"

### 🎨 Refinamientos del DS Naowee (v1.8.5 → v1.10.5)

**Cenefa workspace (post-veredicto)**:
- 15+ iteraciones del patrón `.convo-status-cenefa` para mirror exacto del módulo Project v2.0.3
- Lock banner sticky al header, edge-to-edge via negative margins escapando del `.page-inner`
- DOM relocation: JS mueve `lockBannerHost` fuera del `.page-inner` (max-width 1480) hacia `.page` para true edge-to-edge
- Variants positive/caution/negative + `--top` modifier
- Iteración final: simplificada (sin actor pill ni dropdown causales — las causales viven per-doc en el panel del workspace y en el portal público)

**Modal subsanación (consultar.html)**:
- 7 iteraciones de UX
- CTA `--large --loud` disabled por default, gate por upload válido (≥1 file con `is-filled`)
- Toast canónico `--success` con check verde (mirror del snackbar del módulo Project)
- File-uploader `.ivc-file-drop` con validación 10 MB + `.naowee-helper--negative` para errores
- Layout: obs del doc movida BAJO la caja de upload (no en el header del item)
- Fix bug `[hidden]` no respetado por la cascada `display: flex` → regla `.naowee-helper[hidden] { display: none !important }`

**Iteración fina v1.10.x**:
- Tabs canónicos DENTRO del table-card (no separados arriba) para coherencia visual
- Row hover canónico `#fafbfd` (mirror exacto de `components.css` L762) — antes era `--bg-soft` (`#f5f6fa`), demasiado oscuro
- ACCIONES header + CTAs `text-align: center` para alinear visualmente
- "Descargar PDF" usa `.naowee-btn--quiet` canónico + override defensivo `text-decoration: none !important` (5 estados: base, hover, visited, focus, active) para blindar contra underlines del browser/DS
- Back link canónico: sin background, sin underline, hover por color shift + chevron `translateX(-2px)`
- "Corregir acto" renombrado a **"Devolver para corrección"** — el Coordinador no corrige, devuelve. Icono cambió de pencil ✏️ a arrow-back ↩️
- Trazabilidad con alto fijo 240px + scroll interno custom + fade edge inferior + toggle "Ver más/menos" (smart: solo aparece si hay overflow real)

### 📊 Métricas del release

- **+1 archivo nuevo**: `prototype/coordinador/actos.html` (43 KB, 33 KB de JS inline)
- **6 archivos modificados**: workspace.html, bandeja.html, consultar.html, ivc-store.js, shell.js, naowee-footer.js
- **+809 inserciones / -283 deleciones**
- **21 iteraciones** entre v1.8.5 y v1.10.5

## Flujo end-to-end probado

```
1. Organismo radica trámite IVC-2026-009                → No asignada
2. Coordinador asigna a Profesional Carlos Pérez        → Asignada
3. Profesional inicia validación                        → En validación
4. Profesional marca todos los docs como Cumple
5. Profesional finaliza → "Confirmar y generar acto"    → PendienteCOO ✨ NUEVO
   • Workspace bloqueado (cenefa caution amarilla)
   • Trámite aparece en /coordinador/actos.html → tab "Por aprobar"
6. Coordinador abre /coordinador/actos.html
   • Ve el trámite en el tab "Por aprobar"
   • Click → vista detalle con acto administrativo en viewport
7a. Coordinador click "Aprobar y enviar a firma del Director"
    → estado = Cumple (terminal positivo)
    → trámite pasa al tab "Aprobados" en actos.html
    → portal público muestra "CUMPLE · Pendiente firma del Director IVC"
7b. Coordinador click "Devolver para corrección"
    → modal con textarea (gate ≥10 chars) → "Devolver al profesional"
    → estado = En validación + v++ en historico
    → workspace del profesional se desbloquea (cross-tab sync via 'storage' event)
    → profesional ve causales en historico, ajusta y re-finaliza → genera v2 del acto
    → loop COO INS-004 hasta aprobación final
```

## Bloqueantes activos

- **Vista del Director IVC con firma electrónica** del acto administrativo aprobado.
- **Magic link por correo** para reemplazar la consulta pública INS-014 (riesgo de privacidad conocido).
- **Lista cerrada y final de roles** internos del IVC.
- **HUs faltantes pasos 7-12** del flujo V4.
- **Plantillas Word/PDF reales** de actos administrativos (hoy son archivos mock con nombre generado).
- **Mock de seed data**: actualmente todos los trámites del seed arrancan en "No asignada" — sería útil tener algunos en `PendienteCOO` para que `actos.html` muestre datos al primer load.

## Próximos pasos comprometidos

1. **Vista del Director IVC** con firma electrónica del acto.
2. **Seed data** que pueble `actos.html` con al menos 1 trámite en `PendienteCOO` y 1 en `Cumple` para demo limpia.
3. **Magic link** por correo (cierre del riesgo INS-014).
4. **Badge dinámico** del sidebar item `actos-coord` (count real de trámites en PendienteCOO desde el store).

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-26 · `ivc-v1.10.5`
