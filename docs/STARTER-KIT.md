# Naowee Starter Kit — arrancar un proyecto nuevo con todo incluido

> Cómo bootstrappear un nuevo prototipo Naowee heredando los patrones refinados
> en IVC, sin re-descubrirlos. Complemento de `DESIGN-PATTERNS.md` (qué) y
> `DS-PROMOTION-v1.9.0.md` (lo que ya migró al DS).

## Qué incluye el kit
Los activos reutilizables viven en `prototype/shared/`:
```
shared/
├── tokens.css          # colores semánticos, radios, sombras, tipografía
├── components.css      # componentes transversales + responsive (cards, tablas,
│                       #   message, timeline, modales bottom-sheet, focus)
├── shell.css           # layout app: sidebar drawer, header, page, breakpoints
├── naowee-footer.css   # pill flotante de versionamiento
├── naowee-footer.js    # mount + scroll-hide (capture phase)
└── logos/              # ministerio.svg, suid.png, naowee.svg, naowee-icon.svg
```
Más, para formularios públicos: el patrón `labelRepeatableCells()` + las reglas
`@media (max-width:640px)` de `formulario-fase-1.html` (cards repeatable, bottom-sheet).

## Nomenclatura del repo — prefijo `design-` (REGLA DURA)
Todo repo de **demo / prototipo / UX** de Naowee lleva el prefijo **`design-`**
(p. ej. `design-naowee-<modulo>`, `design-auth-screens-ui`), para diferenciarlo de
los repos **productivos** de ingeniería (que van sin prefijo). Como la demo se sirve
por GitHub Pages, **la URL pública se deriva del nombre del repo**:
`https://naowee-tech.github.io/design-naowee-<modulo>/`.

> ⚠️ **No renombres un repo con Pages sin barrer sus referencias:** Pages **no redirige**
> la URL vieja tras un rename (queda **404 permanente**). Si renombras, actualiza en el
> mismo acto demos-hub, `INVENTARIO-DEMOS-DESIGN.*`, docs y skills. El **demos-hub /
> inventario es el registro único** de URLs de demo.

## Bootstrap de un proyecto nuevo
1. **Copiar** `shared/` (o referenciar el DS CDN si ya promoviste — ver RFC).
2. **`<head>` canónico** de cada HTML:
   ```html
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/naowee-tech/naowee-design-system@vX.Y.Z/dist/design-system.css">
   <link rel="stylesheet" href="shared/tokens.css?v=INIT">
   <link rel="stylesheet" href="shared/components.css?v=INIT">
   <link rel="stylesheet" href="shared/shell.css?v=INIT">
   <link rel="stylesheet" href="shared/naowee-footer.css?v=INIT">
   <script src="shared/naowee-footer.js?v=INIT" defer></script>
   ```
3. **Versionado**: define `MODULE_NAME` + `IVC_VERSION` en `naowee-footer.js`; usa cache busters `?v=` consistentes en todos los HTMLs.
4. **Servidor local**: `http-server -c-1` (anti-cache) en `.claude/launch.json`. NUNCA abrir por `file://` (rompe localStorage cross-página).

## Checklist de calidad al construir UI nueva
- [ ] Usa tokens, no hex hardcodeado.
- [ ] Mobile-first: prueba 400px, 768px, 1280px. Tablas no desbordan (→ cards).
- [ ] Focus visible (borde accent + 3px shadow) en inputs.
- [ ] Popovers/menus en mobile = bottom-sheet (no flotantes lejos del tap).
- [ ] Animar solo transform/opacity; honra `prefers-reduced-motion`.
- [ ] Empty states canónicos. Hover rows `#fafbfd`.
- [ ] Footer pill presente (CSS + JS).

## Mantenimiento
- Cuando un patrón madura → promuévelo al DS (ver `DS-PROMOTION-v1.9.0.md`) y borra el override local.
- Mantén `DESIGN-PATTERNS.md` como índice vivo al agregar/cambiar patrones.

> Para el futuro: extraer `shared/` + este README a un repo `design-naowee-starter`
> (template de GitHub) → "Use this template" para cada proyecto nuevo.
