/* ═══════════════════════════════════════════════════════════════════
   shell.js — Layout + Perfil switcher + Navigation
   Vanilla JS (no ES modules). Expose: window.IVCShell
  ═══════════════════════════════════════════════════════════════════ */

(function (window, document) {
  'use strict';

  /* ───── Icons (inline SVG, stroke-based) ───── */
  var ICONS = {
    tramites:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
    notif:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    docs:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    perfil:      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    logout:      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    chevron:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    check:       '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    refresh:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    home:        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  };

  /* ───── Nav items por perfil ───── */
  var NAV_ITEMS = {
    'usuario-externo': [
      { id: 'tramites', label: 'Mis trámites', icon: ICONS.tramites, href: 'dashboard.html' },
      { id: 'notif',    label: 'Notificaciones', icon: ICONS.notif, href: '#', badge: '2' },
      { id: 'docs',     label: 'Documentos',   icon: ICONS.docs,    href: '#' },
      { id: 'perfil',   label: 'Perfil',       icon: ICONS.perfil,  href: '#' }
    ],
    'profesional': [
      { id: 'bandeja',  label: 'Bandeja',      icon: ICONS.tramites, href: '#' }
    ],
    'coordinador': [
      { id: 'bandeja',  label: 'Bandeja',      icon: ICONS.tramites, href: '#' }
    ],
    'director': [
      { id: 'firma',    label: 'Por firmar',   icon: ICONS.tramites, href: '#' }
    ]
  };

  /* ───── Helpers ───── */
  function el(html) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
  }

  function findRoot() {
    return document.getElementById('shell-root') || document.body;
  }

  /* ───── Path helpers ───── */
  function inSubdir() {
    /* Detecta si estamos en prototype/usuario-externo/ vs prototype/ */
    return /\/(usuario-externo|profesional|coordinador|director)\//.test(location.pathname);
  }

  function pathPrefix() {
    return inSubdir() ? '../' : '';
  }

  /* ───── Sidebar ───── */
  function renderSidebar(opts) {
    var perfilId = (opts && opts.perfilId) || window.IVCData.getPerfil() || 'usuario-externo';
    var perfil = window.IVCData.PERFILES[perfilId] || window.IVCData.PERFILES['usuario-externo'];
    var items = NAV_ITEMS[perfilId] || NAV_ITEMS['usuario-externo'];
    var activeId = (opts && opts.activeNav) || items[0].id;
    var collapsed = window.IVCData.isSidebarCollapsed();

    var navHtml = items.map(function (it) {
      var isActive = it.id === activeId;
      var href = it.href;
      if (href && href !== '#' && !/^https?:/.test(href)) {
        href = (inSubdir() ? '' : 'usuario-externo/') + href;
      }
      return '<a class="nav-row ' + (isActive ? 'is-active' : '') + '" href="' + href + '"' +
        ' data-nav-id="' + it.id + '">' +
        '<span class="nav-row__icon">' + it.icon + '</span>' +
        '<span class="nav-row__label">' + it.label + '</span>' +
        '</a>';
    }).join('');

    return '<aside class="sidebar' + (collapsed ? ' is-collapsed' : '') + '" id="sidebar">' +
      '<div class="sidebar-logo">' +
        '<a href="' + pathPrefix() + 'index.html" class="sidebar-logo__brand">' +
          '<span>naowee</span><span class="sidebar-logo__suffix">IVC</span>' +
        '</a>' +
      '</div>' +
      '<nav class="sidebar-nav">' +
        '<div class="nav-section">' + (perfilId === 'usuario-externo' ? 'Mi organismo' : 'Operación') + '</div>' +
        navHtml +
      '</nav>' +
      '<div class="sidebar-bottom">' +
        '<a class="nav-row" href="' + pathPrefix() + 'index.html" data-action="logout">' +
          '<span class="nav-row__icon">' + ICONS.logout + '</span>' +
          '<span class="nav-row__label">Cerrar sesión</span>' +
        '</a>' +
      '</div>' +
    '</aside>';
  }

  /* ───── Header ───── */
  function renderHeader(opts) {
    var perfilId = window.IVCData.getPerfil() || 'usuario-externo';
    var perfil = window.IVCData.PERFILES[perfilId];
    var title = (opts && opts.title) || 'Mis trámites';
    var breadcrumb = (opts && opts.breadcrumb) || null;

    var bcHtml = '';
    if (breadcrumb && breadcrumb.length) {
      bcHtml = '<nav class="top-header__breadcrumb">' +
        breadcrumb.map(function (b, i) {
          var sep = i > 0 ? '<span class="top-header__breadcrumb-sep">›</span>' : '';
          var item = b.href
            ? '<a href="' + b.href + '">' + b.label + '</a>'
            : '<span>' + b.label + '</span>';
          return sep + item;
        }).join('') +
        '</nav>';
    }

    return '<header class="top-header">' +
      '<div class="top-header__title-wrap">' +
        bcHtml +
        '<h1 class="top-header__title">' + title + '</h1>' +
      '</div>' +
      '<div class="top-header__right">' +
        '<button class="user-chip" type="button" title="' + perfil.rol + '">' +
          '<span class="user-chip__avatar">' + perfil.avatar + '</span>' +
          '<span class="user-chip__meta">' +
            '<span class="user-chip__name">' + perfil.nombre + '</span>' +
            (perfil.nit ? '<span class="user-chip__nit">NIT ' + perfil.nit + '</span>' :
             perfil.cedula ? '<span class="user-chip__nit">CC ' + perfil.cedula + '</span>' : '') +
          '</span>' +
        '</button>' +
      '</div>' +
    '</header>';
  }

  /* ───── Demo Role Switcher ───── */
  function renderDemoSwitcher() {
    var perfilId = window.IVCData.getPerfil() || 'usuario-externo';
    var perfiles = window.IVCData.getAllPerfiles();
    var currentPerfil = window.IVCData.PERFILES[perfilId];

    var itemsHtml = perfiles.map(function (p) {
      var isActive = p.id === perfilId;
      var disabled = !p.enabled;
      return '<a class="demo-role-switcher__item ' +
        (isActive ? 'is-active' : '') + ' ' +
        (disabled ? 'is-disabled' : '') + '" ' +
        'href="#" data-perfil="' + p.id + '"' +
        (disabled ? ' aria-disabled="true"' : '') + '>' +
        '<span class="demo-role-switcher__item-avatar" style="background:' + p.color + '22;color:' + p.color + '">' + p.avatar + '</span>' +
        '<span class="demo-role-switcher__item-meta">' +
          '<span class="demo-role-switcher__item-name">' + p.nombre + '</span>' +
          '<span class="demo-role-switcher__item-role">' + p.rol + '</span>' +
        '</span>' +
        '<span class="demo-role-switcher__item-stage">' + p.etapa + '</span>' +
        (isActive ? '<span class="demo-role-switcher__check">' + ICONS.check + '</span>' : '') +
      '</a>';
    }).join('');

    return '<div class="demo-role-switcher" id="demoSwitcher">' +
      '<button class="demo-role-switcher__toggle" id="demoSwitcherToggle" type="button" aria-haspopup="true">' +
        '<span class="demo-role-switcher__badge">DEMO</span>' +
        '<span class="demo-role-switcher__avatar">' + currentPerfil.avatar + '</span>' +
        '<span>Cambiar perfil</span>' +
        '<span class="demo-role-switcher__chev">' + ICONS.chevron + '</span>' +
      '</button>' +
      '<div class="demo-role-switcher__panel" id="demoSwitcherPanel" role="menu">' +
        '<div class="demo-role-switcher__panel-label">Cambiar de perfil (simulado)</div>' +
        '<div class="demo-role-switcher__list">' + itemsHtml + '</div>' +
        '<div class="demo-role-switcher__panel-footer">' +
          '<button type="button" class="naowee-btn naowee-btn--mute naowee-btn--small" id="demoRestartTourBtn">' +
            ICONS.refresh +
            '<span>Reiniciar tour</span>' +
          '</button>' +
          '<button type="button" class="naowee-btn naowee-btn--quiet naowee-btn--small" id="demoResetBtn" title="Limpia el state del demo">Reiniciar demo</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ───── Wire events ───── */
  function wireEvents() {
    var sw = document.getElementById('demoSwitcher');
    var toggle = document.getElementById('demoSwitcherToggle');
    var panel = document.getElementById('demoSwitcherPanel');

    if (toggle && sw) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        sw.classList.toggle('is-open');
      });
      document.addEventListener('click', function (e) {
        if (sw.classList.contains('is-open') && !sw.contains(e.target)) {
          sw.classList.remove('is-open');
        }
      });
    }

    /* Cambio de perfil */
    document.querySelectorAll('[data-perfil]').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        if (item.classList.contains('is-disabled')) {
          showSnackbar('El perfil ' + item.querySelector('.demo-role-switcher__item-name').textContent + ' estará disponible en Fase 2.');
          return;
        }
        var next = item.dataset.perfil;
        var current = window.IVCData.getPerfil();
        if (next === current) {
          sw.classList.remove('is-open');
          return;
        }
        window.IVCData.setPerfil(next);
        /* Navega al dashboard del nuevo perfil (Fase 1: solo usuario-externo) */
        if (next === 'usuario-externo') {
          window.location.href = (inSubdir() ? '' : 'usuario-externo/') + 'dashboard.html';
        }
      });
    });

    /* Reiniciar tour */
    var restartBtn = document.getElementById('demoRestartTourBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        window.IVCData.setTourClosed(false);
        window.location.reload();
      });
    }

    /* Reiniciar demo (full reset) */
    var resetBtn = document.getElementById('demoResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.confirm('¿Reiniciar el demo? Se borrarán los datos del trámite y volverás al inicio.')) {
          window.IVCData.fullReset();
          window.location.href = pathPrefix() + 'index.html';
        }
      });
    }

    /* User chip — no-op, solo cosmético */
    document.querySelectorAll('.user-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        showSnackbar('Vista de perfil disponible en Fase 2.');
      });
    });

    /* Logout */
    document.querySelectorAll('[data-action="logout"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = pathPrefix() + 'index.html';
      });
    });
  }

  /* ───── Snackbar (toast) ───── */
  function showSnackbar(text, variant) {
    var existing = document.querySelector('.naowee-snackbar');
    if (existing) existing.remove();
    var snack = el('<div class="naowee-snackbar ' +
      (variant === 'success' ? 'naowee-snackbar--success' : '') +
      '">' + text + '</div>');
    document.body.appendChild(snack);
    requestAnimationFrame(function () {
      snack.classList.add('is-visible');
    });
    setTimeout(function () {
      snack.classList.remove('is-visible');
      setTimeout(function () { snack.remove(); }, 300);
    }, 3000);
  }

  /* ───── Init ───── */
  function init(opts) {
    opts = opts || {};

    /* Asegurar perfil */
    if (!window.IVCData.getPerfil()) {
      window.IVCData.setPerfil('usuario-externo');
    }

    /* Renderizar shell completo si el placeholder existe */
    var shellRoot = document.getElementById('app-shell');
    if (shellRoot) {
      shellRoot.outerHTML =
        '<div class="shell" id="app-shell">' +
          renderSidebar({ activeNav: opts.activeNav, perfilId: opts.perfilId }) +
          '<div class="main">' +
            renderHeader({ title: opts.title, breadcrumb: opts.breadcrumb }) +
            '<main class="page page-fade-in" id="page-main">' +
              shellRoot.innerHTML +
            '</main>' +
          '</div>' +
        '</div>';
    }

    /* Inject demo switcher (siempre) */
    if (!document.getElementById('demoSwitcher')) {
      var switcher = el(renderDemoSwitcher());
      document.body.appendChild(switcher);
    }

    wireEvents();
  }

  window.IVCShell = {
    init: init,
    renderSidebar: renderSidebar,
    renderHeader: renderHeader,
    renderDemoSwitcher: renderDemoSwitcher,
    showSnackbar: showSnackbar,
    ICONS: ICONS,
    pathPrefix: pathPrefix
  };

})(window, document);
