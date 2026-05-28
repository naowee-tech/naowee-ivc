# Naowee IVC — instrucciones de proyecto

Módulo IVC (Inspección, Vigilancia y Control · Ministerio del Deporte de Colombia).
HTML standalone + CSS/JS, DS Naowee por CDN, sin build. Demo multi-rol.

## Auto-contexto (no preguntar — ya está cargado abajo)

Al trabajar en este módulo, estos patrones YA están en contexto vía import:

@docs/MODULE-KICKOFF-PROMPT.md
@docs/DESIGN-PATTERNS.md
@docs/STARTER-KIT.md

`MODULE-KICKOFF-PROMPT.md` = reglas estrictas + **PRE-FLIGHT obligatorio**: extrae el
CSS fuente del DS (grep `--naowee-` / `.naowee-`) y arma el mapa de componentes ANTES
de escribir UI. Nunca inventes/hardcodees/dupliques. Pasa el AUTO-REVIEW antes de mostrar.

(RFC de promoción al Design System: `docs/DS-PROMOTION-v1.9.0.md`.)

## Reglas

- **Reutiliza** los patrones del catálogo; no los reinventes ni re-derives.
- Mobile-first: probar 400/768/1280px; tablas no desbordan (→ cards).
- Tokens semánticos, Inter, animar solo transform/opacity.
- `shared/`: tokens.css, components.css, shell.css, naowee-footer.{css,js}.
- Versionado: `IVC_VERSION` en `naowee-footer.js` + cache busters `?v=` en los
  11 HTMLs. Commit `type(scope): desc vX.Y.Z`. NUNCA abrir por `file://`
  (usar http-server `-c-1`).
- Skills relevantes: `naowee-ivc`, `naowee-design-system`, `naowee-patterns-ux`,
  `naowee-sidebar-shell`, `ui-ux-pro-max`.

## Estructura
```
prototype/
├── shared/            # tokens, components, shell, footer, logos, ivc-store, data
├── coordinador/       # bandeja, actos, equipo
├── profesional/       # bandeja, workspace
├── director/ juridica/ atu/ git/   # bandejas por rol
└── usuario-externo/   # consultar.html, formulario-fase-1.html (público)
```
