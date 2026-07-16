# Patrón: Footer flotante Naowee

> **Origen del patrón:** [Naowee Project v2.0.3](https://github.com/naowee-tech/naowee-test-digitacion) — `shared/shell.{css,js}` líneas 544+
>
> **Adopción en IVC:** desde `ivc-v1.4.9` (2026-05-23)
>
> **Por qué importa:** consistencia visual cross-módulo del ecosistema Naowee. Cualquier pantalla nueva del módulo IVC DEBE incluir este footer para mantener paridad con Project, Incentivos, Escenarios y Digitación.

---

## Anatomía visual

```
[Logo Naowee] | Todos los derechos reservados © 2026 | IVC v1.4.9 ↗
```

- **Posición:** esquina inferior derecha (`position: fixed; bottom: 14px; right: 20px`).
- **Background:** blanco, border radius full (pill), border sutil + sombra.
- **Comportamiento:** se oculta al scroll-DOWN y reaparece al scroll-UP (clase `.is-hidden`).
- **Hover en el badge de versión:** background naranja claro + accent.
- **Click en el badge:** abre release notes del tag en GitHub.

## Reglas inviolables

1. **NO competir con el demo-switcher** (que vive bottom-center vía `shell.js`). Reservar bottom-right SOLO para el footer.
2. **NO inventar clases `.naowee-*` nuevas.** Usar las canónicas:
   - `.naowee-floating-footer`
   - `.naowee-floating-footer__logo`
   - `.naowee-floating-footer__sep`
   - `.naowee-floating-footer__text`
   - `.naowee-floating-footer__version`
   - `.is-hidden`
3. **Año copyright dinámico** (no hardcodeado: `new Date().getFullYear()`).
4. **Logo en SVG** (carga desde `shared/logos/naowee.svg` con fallback `onerror` por si falla).

## Cómo aplicarlo a una pantalla nueva

### Opción A: pantalla bajo `prototype/<role>/`

```html
<head>
  <!-- después del DS y shell.css -->
  <link rel="stylesheet" href="../shared/naowee-footer.css">
</head>
<body>
  <!-- ... contenido ... -->
  <script src="../shared/naowee-footer.js" defer></script>
</body>
```

### Opción B: HTML standalone (sin acceso a `shared/`)

Copiar el IIFE completo de `shared/naowee-footer.js` dentro de un `<script>` inline + inyectar el CSS de `naowee-footer.css` en un `<style>` inline (o `document.createElement('style')`).

Ejemplo aplicado: `demo-fase-1-formulario.html`.

## Personalización por módulo

Variables del IIFE:

```js
var IVC_VERSION = 'v1.4.9';                       // bumpear en cada release
var REPO = 'naowee-tech/naowee-ivc';              // repo del módulo
var MODULE_NAME = 'IVC';                          // texto del badge
```

Para otros módulos (Project, Incentivos, etc.), cambiar a:
```js
var MODULE_NAME = 'Project';  // o 'Incentivos', 'Escenarios', 'Digitación'
```

## URL del release

El badge linkea automáticamente a:
```
https://github.com/<REPO>/releases/tag/ivc-<IVC_VERSION>
```

Tag pattern: `ivc-vMAJOR.MINOR.PATCH` (semver con prefix de módulo).

## Ejemplo en navegador

- Bandeja Coord: https://naowee-tech.github.io/naowee-ivc/prototype/coordinador/bandeja.html
- Formulario Fase 1: https://naowee-tech.github.io/naowee-ivc/prototype/usuario-externo/formulario-fase-1.html

## Diferencia vs Project v2.0.3

| Característica | Project v2.0.3 | IVC v1.4.9 |
|---|---|---|
| Posición | bottom-right | bottom-right |
| Logo Naowee | ✓ | ✓ |
| Texto "Todos los derechos reservados © 2026" | ✓ | ✓ |
| Badge módulo + versión | ✓ | ✓ |
| Version switcher dropdown (fetch GitHub releases) | ✓ | ✗ (link simple) |
| Scroll-hide animado | ✓ | ✓ |
| Year dinámico | hardcoded 2026 | `new Date().getFullYear()` (mejora) |

La versión de IVC es **más liviana** (no fetch externo a GitHub API), apropiada para un prototipo en demo. Si se quiere migrar al switcher completo en v2+, ver `naowee-test-digitacion/project/v2.0.3/shared/shell.js` líneas 590-720.

## Patrón antifragilidad

Si el archivo `shared/logos/naowee.svg` falta o falla por path issue, el `onerror` del `<img>` lo oculta — el footer sigue visible con texto + badge, sin layout broken.

---

**Autor del patrón:** Doug Vargas · Head of Product
**Última actualización:** 2026-05-23 · `ivc-v1.4.9`
