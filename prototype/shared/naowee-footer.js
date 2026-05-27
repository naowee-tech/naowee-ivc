/* ═══════════════════════════════════════════════════════════════════════
   Naowee Floating Footer — Mounter (v1.4.9, 2026-05-23)

   Inyecta el footer flotante canónico en el body. Patrón compartido con
   Naowee Project v2.0.3 (shared/shell.js L544+).

   Uso (en cualquier HTML del prototype):
     <link rel="stylesheet" href="../shared/naowee-footer.css">
     <script src="../shared/naowee-footer.js" defer></script>

   Para HTMLs standalone (sin shared/), inyectarlo inline — copiar este
   IIFE completo dentro de un <script>.

   Para bumpear versión: cambiar IVC_VERSION abajo y rebuild.
   ═══════════════════════════════════════════════════════════════════════ */

(function mountNaoweeFooter() {
  var IVC_VERSION = 'v1.13.12';
  var REPO = 'naowee-tech/naowee-ivc';
  var MODULE_NAME = 'IVC';

  function pathPrefix() {
    /* Computa el prefijo relativo para que el <img src> resuelva tanto en
       file:// como en GitHub Pages. Si estamos en /prototype/<role>/file.html
       el logo vive en /prototype/shared/logos/naowee.svg → 2 niveles arriba. */
    var path = window.location.pathname;
    /* coordinador/, profesional/, usuario-externo/ → ../shared/ */
    if (/\/(coordinador|profesional|usuario-externo|director|juridica|atu|git)\/[^/]*$/.test(path)) {
      return '../shared/';
    }
    /* fallback: si estamos en /prototype/file.html o /shared/file.html */
    if (/\/shared\/[^/]*$/.test(path)) return './';
    return 'prototype/shared/';
  }

  function mount() {
    if (document.querySelector('.naowee-floating-footer')) return;

    var RELEASE_URL = 'https://github.com/' + REPO + '/releases/tag/ivc-' + IVC_VERSION;
    var YEAR = new Date().getFullYear();
    var LOGO_SRC = pathPrefix() + 'logos/naowee.svg';

    var footer = document.createElement('div');
    footer.className = 'naowee-floating-footer';
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Pie de página Naowee');
    footer.innerHTML =
      '<img src="' + LOGO_SRC + '" alt="Naowee" class="naowee-floating-footer__logo" onerror="this.style.display=\'none\'"/>' +
      '<div class="naowee-floating-footer__sep"></div>' +
      '<span class="naowee-floating-footer__text">Todos los derechos reservados <strong>&copy; ' + YEAR + '</strong></span>' +
      '<div class="naowee-floating-footer__sep"></div>' +
      '<a class="naowee-floating-footer__version" ' +
         'href="' + RELEASE_URL + '" target="_blank" rel="noopener" ' +
         'title="' + MODULE_NAME + ' ' + IVC_VERSION + ' — Ver release notes en GitHub" ' +
         'aria-label="Versión del prototipo: ' + IVC_VERSION + '">' +
        MODULE_NAME + ' <strong>' + IVC_VERSION + '</strong>' +
      '</a>';
    document.body.appendChild(footer);
    bindFooterScrollHide(footer);
  }

  /* Patrón scroll-hide del Project v2.0.3 — esconde el footer al scroll
     down y lo vuelve a mostrar al scroll up. */
  function bindFooterScrollHide(footer) {
    var lastY = window.scrollY;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      var dy = y - lastY;
      if (Math.abs(dy) > 4) {
        if (dy > 0 && y > 60) {
          footer.classList.add('is-hidden');
        } else {
          footer.classList.remove('is-hidden');
        }
        lastY = y;
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
