# ACTA · Naowee IVC · ivc-v1.11.0

> Handoff de `ivc-v1.11.0` — Fase 5 del flujo V4: módulo Director (firma electrónica con preset upload), modal post-firma con decisión Electrónica/Oficinas, y portal público con pregunta de renuncia a términos.

## Metadata

| Campo | Valor |
|---|---|
| Versión | `ivc-v1.11.0` |
| Fecha | 2026-05-26 |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |
| Release notes | https://github.com/naowee-tech/releases/tag/ivc-v1.11.0 |
| Tag previo | `ivc-v1.10.5` |

## Resumen ejecutivo

Sprint que entrega el módulo Director IVC con el flujo de firma electrónica completo y la decisión inmediata del medio de notificación al organismo. El portal público gana el estado de "Acto firmado" y la pregunta de renuncia a términos para el caso electrónico. Las 2 mini-bandejas auxiliares (Atención al Usuario, GIT Comunicaciones) y el flujo de recursos van en v1.11.1+.

## State machine

```
En validación
  ↓ veredicto Cumple
PendienteCOO
  ↓ Coord aprueba
PendienteFirma                      ← antes era 'Cumple', ahora explícito
  ↓ Director firma + elige medio
Firmado (transient: ≤1s)
  ↓ medio = electrónica
NotifElectronica                    ← portal público pregunta renuncia
  ↓ organismo renuncia: Sí
Vigente (terminal positivo · D+1)

  ↓ medio = oficinas
NotifOficinas                       ← caution: asistir presencial 5d hábiles
                                    (→ Atención/GIT en v1.11.1)
```

## Cambios técnicos clave

### 🆕 `prototype/director/` (módulo nuevo)

**`perfil.html` — Mi firma electrónica**
- Upload zone con drag-drop + click + preview inline
- Validación: PNG/JPG, máx 2 MB
- Storage: `localStorage['ivc-director-firma']` como `{ dataUrl, name, size, savedAt }`
- Banner contextual: "Sin firma cargada" (caution) / "Firma activa · guardada el [fecha]" (success)
- Acciones: Guardar firma · Reemplazar firma · Eliminar firma
- Helper expuesto: `window.IVCDirectorFirma.has()` para checks cross-page

**`bandeja.html` — Por firmar (LIST + DETAIL)**
- LIST: 3 stat cards (Por firmar · Firmados hoy · Estado firma cargada/no) + tabs canónicos DS dentro del table-card ("Por firmar" / "Firmados") + tabla
- Banner caution arriba si el Director no ha subido su firma preset, con link directo a perfil.html
- DETAIL: hero + grid 2-col (acto en viewport + aside con cadena de aprobación Profesional/Coordinador + Resumen + Trazabilidad scroll)
- Acto preview con **firma stamped** en el footer cuando el estado es Firmado o posterior (imagen del preset + línea + "Director del IVC · Ministerio del Deporte" + fecha/hora)
- Footer integrado del card con CTA "Firmar acto electrónicamente" (verde loud)

**Firma flow:**
1. Click "Firmar acto" → si no hay preset → snackbar + redirect a perfil.html
2. Modal "Confirmar firma" con preview de la firma sobre placeholder de "Director del IVC"
3. Confirmar → `IVCStore.actualizarEstado(id, 'Firmado', …)` + re-render del card con firma stamped
4. Automáticamente abre modal "¿Cómo notificar al organismo?" con 2 opciones tipo card:
   - **Electrónicamente** (chip "Inmediato") → `NotifElectronica`
   - **En oficinas** (chip "5 días hábiles") → `NotifOficinas`
5. Confirmar → snackbar + redirect a bandeja.html?tab=firmados

### 🌐 `consultar.html` — Portal público

Nuevos estados manejados:
- `PendienteFirma` → message caution "PENDIENTE FIRMA DEL DIRECTOR"
- `NotifOficinas` → message caution "DEBE ASISTIR A OFICINAS" (5 días hábiles)

Nuevo bloque renderable:
- `Firmado` / `NotifElectronica` / `Vigente` → variant positive con el acto firmado descargable y la fecha de firma
- **CTA `renuncia-cta`** (azul informative, mirror del subsanar-cta): aparece solo para `NotifElectronica` con 2 botones:
  - "No renuncio · continuar términos" → state vuelve a `NotifElectronica` con observación "NO renunció" (placeholder hasta recursos en v1.11.1)
  - "Sí, renuncio a términos" → `Vigente` (terminal positivo) + snackbar success

### 🔧 Cross-file refactor

- **`coordinador/actos.html`**: `aprobarActo()` ahora escribe `PendienteFirma` (no `Cumple`). El tab "Aprobados" filtra por `PendienteFirma`. Detail view `isReadOnly` se basa en `PendienteFirma`.
- **`coordinador/bandeja.html`**: `badgeForEstadoAsignacion` añade variants para los 6 estados nuevos. Dropdown filter incluye opciones para PendienteFirma, Firmado, NotifElectronica, NotifOficinas, Vigente.
- **`profesional/workspace.html`**: `isTramiteFinalizado()` incluye los 6 estados nuevos como locked (el trámite salió de manos del profesional). Cenefa cfg cubre cada estado con título + descripción específica. `badgeForEstado` consistente.
- **`shared/shell.js`**: nuevo nav del Director con 2 entries ("Por firmar" + "Mi firma") + nuevo icon `firma` (pluma estilizada).

### 🎨 Componentes nuevos

- **`.firma-drop`** — Drop zone con drag-drop, preview inline tras carga, estados is-dragover/is-error
- **`.firma-preview`** — Card con la firma activa + meta (fecha de guardado + tamaño)
- **`.acto-doc__firma-stamp`** — Bloque de firma en el pie del acto, mirror del look formal Word/PDF
- **`.notif-options`** — Grid 2-col de opciones tipo card clickables (selected state con border naranja + bg orange-bg)
- **`.renuncia-cta`** — Banner azul informative con 2 CTAs (mirror visual del subsanar-cta naranja para coherencia)

## Flujo end-to-end probado

```
1. (v1.10.5) Coordinador aprueba acto en /coordinador/actos.html
   → estado = PendienteFirma (era 'Cumple')

2. /director/bandeja.html
   ✓ Trámite aparece en tab "Por firmar"
   ✓ Sin firma → banner caution + link "Cargar mi firma →"

3. /director/perfil.html
   ✓ Upload firma PNG/JPG
   ✓ Preview correcto
   ✓ Guardar → snackbar success + status chip cambia a "Firma activa · ..."

4. Volver a /director/bandeja.html → click trámite
   ✓ Acto preview sin firma (pendiente)
   ✓ CTA "Firmar acto electrónicamente" verde loud
   ✓ Click → modal "Confirmar firma" con preview
   ✓ Confirmar → state = Firmado, firma stamped, modal post-firma abre

5. Modal "¿Cómo notificar?"
   ✓ Opción Electrónicamente → state = NotifElectronica
   ✓ Opción En oficinas → state = NotifOficinas

6. /usuario-externo/consultar.html?rad=IVC-2026-XXX
   ✓ NotifElectronica → message positive "NOTIFICADO ELECTRÓNICAMENTE" + acto firmado descargable + CTA renuncia
   ✓ NotifOficinas → message caution "DEBE ASISTIR A OFICINAS"
   ✓ Sí renuncio → state = Vigente, terminal positivo
   ✓ No renuncio → placeholder hasta recursos v1.11.1

7. Workspace del Profesional (cualquier trámite ya pasó al Director)
   ✓ Cenefa muestra el estado actual (PendienteFirma, Firmado, NotifElectronica, etc.)
   ✓ Workspace queda view-only (lock)
```

## Bloqueantes activos (post-v1.11.0)

- **Atención al Usuario** y **GIT Comunicaciones** (2 roles nuevos) — bandejas para notificación por plantilla / por aviso del flujo de oficinas (`NotifOficinas` está congelado sin handler hasta v1.11.1).
- **Flujo de recursos** — Apelación / Reposición + remisión a Jurídica + nuevo trámite con FK padre.
- **Estados de vigencia diferenciada** — D+1 (Vigente con renuncia) vs D+11 (Vigente sin renuncia, sin recursos).
- **Seed data demo** — al menos 1 trámite en cada estado intermedio (PendienteCOO, PendienteFirma, Firmado, NotifElectronica) para que las bandejas tengan datos al primer load.
- **Plantillas reales** del acto firmado (hoy es texto inline con stamp de imagen).

## Próximos pasos comprometidos (v1.11.1+)

1. Mini-bandejas para **Atención al Usuario** + **GIT Comunicaciones** con acción "Marcar como notificado" → al marcar se desbloquea la pregunta de renuncia en el portal.
2. Cuando "No renuncio" en el portal → state `EnRecursos` + modal de selección (Apelación → Jurídica · Reposición → nuevo trámite con FK).
3. Diferenciación D+1 (renuncia) vs D+11 (no renuncia, sin recursos).
4. Seed data con trámites pre-poblados en cada estado.

---

**Firma de entrega:** Doug Vargas · Head of Product · 2026-05-26 · `ivc-v1.11.0`
