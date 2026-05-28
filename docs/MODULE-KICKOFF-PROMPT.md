# Naowee — Prompt de arranque de módulo (REGLAS ESTRICTAS)

> Pégalo al inicio de cualquier chat nuevo para crear/extender un módulo Naowee.
> (También se auto-aplica: `naowee-ivc/CLAUDE.md` lo importa vía `@docs/`.)
>
> **Por qué existe:** sin esto, el asistente arranca de cero, **inventa componentes,
> hardcodea valores y NO revisa el CSS fuente del Design System** → Doug termina
> re-iterando las mismas capas de refinamiento una y otra vez. Este protocolo lo evita.

---

## Principio rector
Estás **EXTENDIENDO un design system maduro, NO empezando de cero.** Reusar > reinventar.
Casi todo componente, color, espaciado y animación que necesitas **YA existe**. Tu trabajo
es **ENSAMBLAR con piezas canónicas**, no fabricar nuevas ni hardcodear.

---

## PRE-FLIGHT OBLIGATORIO — antes de escribir UNA línea de código

> Si no hiciste esto, NO empieces a codear. "Extrae antes de escribir."

1. **Extrae el CSS fuente del Design System Naowee** (la "base de datos" del diseño):
   - URL: `https://cdn.jsdelivr.net/gh/naowee-tech/naowee-design-system@<versión>/dist/design-system.css`
     (versión actual en uso: **v1.8.0**).
   - Fetchéalo (WebFetch / ctx_fetch_and_index / curl) y **grep**:
     - `--naowee-` → enumera TODOS los tokens (colores, spacing, radii, shadows, tipografía).
     - `\.naowee-` → enumera TODAS las clases de componentes disponibles.
   - Componentes esperados (verifícalos en el CSS, no asumas): `.naowee-btn` (+variantes
     --loud/--mute/--quiet/--icon/--small/--large), `-textfield`, `-dropdown`,
     `-checkbox`, `-message`, `-stepper`, `-table-card`, `-modal`, `-badge`, `-tabs`,
     `-accordion`, `-datepicker`, `-snackbar`, `-empty-state`.
2. **Lee el conocimiento refinado** (en `naowee-ivc/docs/`):
   - `DESIGN-PATTERNS.md` — patrones refinados con código + versión.
   - `STARTER-KIT.md` — bootstrap + checklist de calidad.
   - `DS-PROMOTION-v1.9.0.md` — qué ya migró/va al DS.
3. **Inventaría el kit `shared/`**: tokens.css, components.css, shell.css, naowee-footer.{css,js}.
4. **Arma un MAPA DE COMPONENTES**: por cada elemento que el módulo necesita, anota qué
   clase/patrón canónico lo cubre. Si **nada** lo cubre → es un gap real (ver final).
5. **No escribas UI hasta tener el mapa.** Si falta info del DS, extráela primero.

---

## REGLAS DURAS (no romper, no negociar)
- ❌ **NUNCA inventes un componente** si existe uno canónico. Revisa el DS primero.
- ❌ **NUNCA hardcodees** color / spacing / radio / sombra / tipografía → usa tokens
  `--naowee-*` o los semánticos del kit (`tokens.css`).
- ❌ **NUNCA inventes SVGs** de iconos / checks / focus → usa los canónicos
  (ej. check de checkbox: `viewBox 24 24, points "20 6 9 17 4 12", stroke white, w3`).
- ❌ **NUNCA dupliques lógica** que ya vive en `shared/` → impórtala/reúsala.
- ❌ **NUNCA entregues sin probar mobile** (400/768/1280). Tablas NO desbordan → cards.
- ✅ **Mobile-first SIEMPRE**: sidebar drawer off-canvas, popovers/datepicker = bottom-sheet,
  tablas → stacked cards, tabs scroll horizontal, modales bottom-sheet.
- ✅ **Animar SOLO** `transform`/`opacity`; honrar `prefers-reduced-motion`.
- ✅ **Estados canónicos**: focus accent + 3px shadow, hover row `#fafbfd`,
  botones hover opacity .88 / active scale(.97), empty-states canónicos.

---

## ORDEN DE TRABAJO
`PRE-FLIGHT → mapa de componentes → ensamblar con canónicos → AUTO-REVIEW → mostrar.`
**NUNCA muestres una primera versión sin pasar el auto-review.** Ahí es donde, antes,
aparecían las capas repetidas de refinamiento.

---

## AUTO-REVIEW (antes de declarar "listo" — verifica cada punto)
- [ ] ¿Extraje y revisé el CSS fuente del DS **antes** de codear?
- [ ] ¿Cada componente usado es canónico (o un gap justificado y marcado)?
- [ ] ¿**Cero** hex/px hardcodeados que deberían ser tokens?
- [ ] ¿Reusé `shared/` en vez de reescribir?
- [ ] ¿Mobile probado (tablas→cards, popovers bottom-sheet, sin overflow horizontal)?
- [ ] ¿Focus / hover / empty-states canónicos?
- [ ] ¿Animaciones solo transform/opacity?
- [ ] ¿Tipografía Inter (mono solo en radicados/NIT/fechas técnicas)?

Si alguna respuesta es **"no" → corrígela ANTES de mostrar.**

---

## CUANDO SÍ hay un gap real (ningún canónico lo cubre)
No inventes en silencio. Un gap se **construye bien, se documenta y se promueve**:
1. Constrúyelo siguiendo las convenciones del DS (tokens, naming `.naowee-*`, estados).
2. Aíslalo y documéntalo en `DESIGN-PATTERNS.md`.
3. Márcalo en `DS-PROMOTION-v1.9.0.md` para subirlo al Design System canónico.

---

_Mantener sincronizado con `DESIGN-PATTERNS.md`. Versión del DS en uso: v1.8.0._
