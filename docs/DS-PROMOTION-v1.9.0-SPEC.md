# DS v1.9.0 — Spec de reconciliación de componentes (IVC ↔ Project v2.0.3)

> Plan de **merge sin pérdida** para los componentes que IVC y Project v2.0.3
> construyeron por separado (ver corroboración en `DS-PROMOTION-v1.9.0.md`).
> Objetivo: subir **UN** canónico al repo `naowee-design-system` que sea **superset
> de ambos** → los dos prototipos migran a él y borran su override local.
>
> **Principio:** esta spec **no reescribe ni pisa** trabajo de ningún prototipo.
> Documenta ambas fuentes *verbatim*, propone el canónico, y marca las decisiones
> que requieren visto bueno humano (no las toma en silencio).
>
> Fuentes — IVC: `prototype/shared/{components,shell}.css` · Project v2.0.3:
> `shared/{shell,pages}.css` (deploy GitHub Pages) · DS base: CDN `@v1.8.0`.

## Convención
Por componente: **(A)** versión IVC · **(B)** versión Project · **(C)** divergencia ·
**(D)** canónico propuesto · **(E)** migración de cada prototipo · **(F)** riesgo/decisión.

## Tokenización (regla transversal antes de subir al DS)
Los prototipos usan alias semánticos locales (`--green`, `--accent`, `--text-primary`,
`--radius-full`, `--radius-sm`). Al promover, **mapear a tokens `--naowee-*`** del DS
(p. ej. `--text-primary` → `--naowee-color-text-default`, `--radius-full` →
`--naowee-border-radius-full`). El canónico no debe depender de alias de prototipo.

---

## 1. SLA / Plazo — `.naowee-sla`   ·   riesgo BAJO · additive

**(A) IVC** (`.row-plazo`, solo color de texto):
```css
.row-plazo            { font-size:13px; font-weight:600; font-feature-settings:'tnum'; }
.row-plazo--positive  { color:var(--green,#1f8923); }
.row-plazo--caution   { color:var(--accent,#d74009); }
.row-plazo--negative  { color:#c0392b; }
```

**(B) Project** (`.naowee-sla`, pill completo con icono + num + label):
```css
.naowee-sla        { display:inline-flex; align-items:center; gap:6px; padding:4px 10px;
                     border:1px solid currentColor; border-radius:var(--radius-full,9999px);
                     background:transparent; font-size:12px; font-weight:500; line-height:1;
                     white-space:nowrap; font-variant-numeric:tabular-nums; }
.naowee-sla__icon  { width:12px; height:12px; flex-shrink:0; opacity:.85; }
.naowee-sla__num   { font-weight:700; }
.naowee-sla__label { font-weight:500; opacity:.92; }
.naowee-sla--ok      { color:var(--green,#15803d);  border-color:rgba(31,137,35,.32); }
.naowee-sla--warn    { color:#b45309;                border-color:rgba(180,83,9,.32); }
.naowee-sla--vencido { color:#b42318;                border-color:rgba(180,35,24,.32); }
.naowee-sla--bare    { border:0; padding:0; background:transparent; }
```

**(C) Divergencia:** mismo concepto, distinto alcance. Project es el **superset**:
su variante `--bare` (sin borde ni padding) **equivale** al comportamiento solo-texto
de IVC `.row-plazo`. Naming de variantes difiere: IVC `--positive/--caution/--negative`
(consistente con `.naowee-message--*`/`.naowee-badge--*` del DS) vs Project
`--ok/--warn/--vencido`.

**(D) Canónico propuesto:** estructura de Project + **naming de variantes de IVC**
(alineado al DS): `.naowee-sla` con `--positive` / `--caution` / `--negative` + `--bare`.
Sub-elementos `__icon` / `__num` / `__label`. Umbrales (de IVC v1.13.5, doc):
`>5 días → positive · 3–5 → caution · ≤2 o vencido → negative`.

**(E) Migración:** Project renombra `--ok/--warn/--vencido` → `--positive/--caution/--negative`.
IVC reemplaza `.row-plazo` por `.naowee-sla--bare` (solo-texto) o adopta el pill. **Sin pérdida.**

**(F) Decisión:** ¿naming `--positive/--caution/--negative` (recomendado, DS-consistente)
o conservar `--ok/--warn/--vencido`? Recomiendo el primero.

---

## 2. Toast / Snackbar — `.naowee-toaster` + `.naowee-toast-item`   ·   riesgo MEDIO · decisión UX

**(A) IVC** (`.naowee-snackbar`: único, centrado-abajo, fondo azul oscuro):
```css
.naowee-snackbar { position:fixed; bottom:80px; left:50%;
  transform:translateX(-50%) translateY(20px); opacity:0; z-index:var(--z-snackbar);
  background:var(--azul,#002B5B); color:#fff; border-radius:12px; padding:16px;
  box-shadow:0 8px 12px 0 rgba(40,40,52,.1); display:flex; align-items:flex-start;
  gap:16px; width:600px; }
.naowee-snackbar.is-visible { transform:translateX(-50%) translateY(0); opacity:1; }
.naowee-snackbar__badge { width:20px; height:20px; border-radius:9999px;
  background:var(--blue-info,#006AFF); /* +variantes --success/--info/--caution/--negative */ }
/* mobile: left/right 12px, bottom 16px, edge-to-edge */
```

**(B) Project** (`.naowee-toaster` stack abajo-derecha; cada item reusa `.naowee-message` del DS):
```css
.naowee-toaster { position:fixed; bottom:20px; right:20px; z-index:1200;
  display:flex; flex-direction:column; gap:10px; pointer-events:none; max-width:420px; }
.naowee-toast-item { pointer-events:auto; min-width:320px; margin:0!important;
  position:relative; overflow:hidden;
  box-shadow:0 12px 32px -8px rgba(15,17,35,.25), 0 0 0 1px rgba(15,17,35,.04);
  transform:translateX(110%); opacity:0;
  transition:transform .32s cubic-bezier(.16,1,.3,1), opacity .22s ease; }
.naowee-toast-item.is-visible  { transform:translateX(0); opacity:1; }
.naowee-toast-item.is-leaving  { transform:translateX(110%); opacity:0; }
.naowee-toast-item__dismiss    { /* botón cerrar 24px, esquina */ }
.naowee-toast-item__progress   { position:absolute; bottom:0; left:0; right:0; height:3px;
  background:currentColor; opacity:.25; transform-origin:left;
  animation:toastProgress var(--toast-dur,4200ms) linear forwards; }
/* color de progress por .naowee-message--positive/--caution/--negative/--informative */
```

**(C) Divergencia:** UX genuinamente distinta. IVC = un snackbar oscuro centrado.
Project = **stack** abajo-derecha, **reusa el `.naowee-message` del DS**, soporta
**múltiples toasts apilados** + barra de progreso de autodismiss + botón cerrar.

**(D) Canónico propuesto:** **el de Project** — es composicional (no reinventa el
mensaje, lo envuelve), apila y trae progress/dismiss. Más DS-aligned.

**(E) Migración:** IVC reemplaza `.naowee-snackbar` por `.naowee-toaster` + items
`.naowee-message` (cambia de centrado-oscuro a stack-derecha). **Cambio visible de UX.**

**(F) DECISIÓN — RESUELTA (Doug, 28/05/2026): opción (a).** El toaster de Project es el
**único** sistema de notificación canónico; IVC migra y deja de tener snackbar propio.
Motivo: la barra centrada de IVC fue **duplicación accidental** (su propio CSS dice
"paridad con Project v2.0.3"), no un patrón diferenciado.

**Secuencia segura de migración (no se salta el orden):**
1. **Promover** `.naowee-toaster`/`.naowee-toast-item` al DS `@v1.9.0` (additive; IVC
   sigue intacto con su snackbar mientras tanto).
2. Reescribir **solo** `shared/shell.js` → `showSnackbar(text, variant)` para emitir el
   markup del toaster (`.naowee-toaster` + items `.naowee-message--<variant>` + dismiss
   + progress). **Mantener la firma idéntica** `(text, variant)` → las **55 call sites
   no cambian**. Mapear variantes: `success→positive`, `info→informative`, `caution`, `negative`.
3. Actualizar los ~3 builders de respaldo (director/bandeja, director/perfil, consultar)
   o hacer que solo deleguen a `IVCShell.showSnackbar`.
4. Añadir regla **mobile** del toaster (edge-to-edge ≤640px) y verificar **z-index > overlay
   de modales**. Test a 400/768/1280 con un modal abierto.
5. **Borrar `.naowee-snackbar` de IVC `components.css` SOLO al final**, tras verificar.
   Reversible hasta ese punto (revertir 1 función y el snackbar viejo sigue ahí).

> Si en el test una confirmación fuerte (asignación masiva) pierde prominencia como toast
> de esquina, resolver con el affordance correcto (mensaje inline de éxito o modal), **no**
> con un componente snackbar paralelo.

---

## 3. Tooltip — 3 piezas separadas   ·   riesgo BAJO

**3a. `.naowee-tip-portal`** (Project) — tooltip genérico porteado a `<body>`
(`position:fixed`, evita clipping por `overflow`). **No existe en el DS.** IVC resuelve
lo mismo con el `.naowee-tooltip` del DS. → **Promover como componente nuevo** (additive).
```css
.naowee-tip-portal { position:fixed; background:#282834; color:#fff; padding:6px 10px;
  border-radius:var(--radius-md,8px); font-size:11.5px; font-weight:500; line-height:1.3;
  white-space:nowrap; box-shadow:0 6px 18px rgba(40,40,52,.18); opacity:0;
  pointer-events:none; z-index:9999; transform:translate(-50%,calc(-100% - 4px));
  transition:opacity .15s, transform .15s; }
.naowee-tip-portal.is-visible { opacity:1; transform:translate(-50%,calc(-100% - 8px)); }
.naowee-tip-portal::after { /* flecha hacia abajo, border-top-color:#282834 */ }
```

**3b. `.nav-tooltip`** (IVC **y** Project, mismo nombre y enfoque) — tooltip del sidebar
colapsado, `position:fixed` a la derecha del sidebar, flecha `::before`. **Convergente.**
→ Promover **junto con el shell** (pertenece al patrón `naowee-sidebar-shell`).

**3c. Gap del `.naowee-tooltip` del DS** — IVC overridea `bottom:calc(100% + 4px)`
(6px → 4px). → Candidato a **ajustar el default del DS** (bloque A del RFC). **Decisión:**
¿el DS adopta 4px? Si sí, IVC borra el override.

---

## Orden de PRs sugerido (al repo `naowee-design-system`)
1. **PR v1.9.0-a (additive, bajo riesgo):** `.naowee-sla` + `.naowee-tip-portal`.
   No rompen nada (clases nuevas). Tokenizar a `--naowee-*`. Doc en playground.
2. **PR v1.9.0-b:** `.naowee-toaster`/`.naowee-toast-item` — tras decisión (F) del §2.
3. **PR v1.9.x (shell):** `.nav-tooltip` con el patrón sidebar + gap tooltip (§3b/3c).

## Criterios de aceptación (heredados del RFC)
- Sin breaking changes en componentes existentes del DS.
- Tokens `--naowee-*` (no alias de prototipo). Animar solo `transform`/`opacity`.
- Documentar cada componente en el playground del DS.
- Tras promover: **borrar el override equivalente** en IVC **y** en Project, y bumpear
  el CDN consumido (`@v1.9.0`). Recién ahí desaparece la duplicación.

## Estado
- [x] Extracción + diff IVC ↔ Project v2.0.3 (este doc)
- [x] Decisión UX toast (§2-F) → **(a): toaster único canónico, IVC migra**
- [ ] PR v1.9.0-a (`.naowee-sla`, `.naowee-tip-portal`)
- [ ] PR v1.9.0-b (toaster) → luego migrar IVC (secuencia §2-F)
- [ ] PR shell (`.nav-tooltip`, gap tooltip)
