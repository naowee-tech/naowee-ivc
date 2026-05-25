/* ═══════════════════════════════════════════════════════════════════════
   Naowee IVC — Version Pill mounter (v1.4.8)

   Inserta el pill de versionamiento en la esquina inferior derecha de
   cualquier pantalla que cargue este script.

   Uso:
     <link rel="stylesheet" href="../shared/version-pill.css">
     <script src="../shared/version-pill.js" defer></script>

   La versión se centraliza acá. Para bumpear: cambiar IVC_VERSION abajo.
   ═══════════════════════════════════════════════════════════════════════ */

(function mountIvcVersionPill() {
  var IVC_VERSION = 'v1.4.8';
  var REPO = 'naowee-tech/naowee-ivc';
  var RELEASE_URL = 'https://github.com/' + REPO + '/releases/tag/ivc-' + IVC_VERSION;

  /* Esperar al DOM ready (script puede cargarse con o sin defer) */
  function mount() {
    if (document.getElementById('ivcVersionPill')) return;  /* idempotente */
    var wrap = document.createElement('div');
    wrap.id = 'ivcVersionPill';
    wrap.className = 'ivc-version-pill';
    wrap.dataset.version = IVC_VERSION;
    wrap.innerHTML =
      '<a class="ivc-version-pill__btn" ' +
         'href="' + RELEASE_URL + '" ' +
         'target="_blank" rel="noopener" ' +
         'title="Naowee IVC — Ver release notes en GitHub" ' +
         'aria-label="Versión del prototipo: ' + IVC_VERSION + '. Ver release notes en GitHub.">' +
        '<span class="ivc-version-pill__brand">IVC</span>' +
        '<strong class="ivc-version-pill__num">' + IVC_VERSION + '</strong>' +
      '</a>';
    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
