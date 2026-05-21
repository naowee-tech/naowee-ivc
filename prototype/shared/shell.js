/* ═══════════════════════════════════════════════════════════════════
   shell.js — IVC Naowee layout (port canónico de naowee-test-sidebar-shell)
   ─────────────────────────────────────────────────────────────────────
   Mantiene API pública window.IVCShell.init() que las 4 páginas usan,
   pero ahora emite el markup canónico Naowee:
     - .sidebar > .sidebar-logo (burger + ministerio.svg + sep + pill "IVC")
     - .nav-row con .icon + .lbl + .active-bar (view-transition morph)
     - .top-header > .profile-switcher > .user-chip + .profile-dd
     - .demo-role-switcher (chip flotante bottom-right)
   Vanilla JS (no ES modules) — sirve desde file:// y todos los browsers.
   ═══════════════════════════════════════════════════════════════════ */

(function (window, document) {
  'use strict';

  var COLLAPSED_KEY = 'naowee.ivc.sidebarCollapsed';

  /* ───── Icons (inline SVG, stroke-based, currentColor) ───── */
  var ICONS = {
    burger:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    tramites: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>',
    notif:    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    docs:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    perfil:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    bandeja:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    logout:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    chevron:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    refresh:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    bell:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    gear:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    userIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    logoutSm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
  };

  /* ───── Nav items por perfil ───── */
  var NAV_ITEMS = {
    'usuario-externo': [
      { id: 'tramites', label: 'Mis trámites',   icon: ICONS.tramites, href: 'dashboard.html' },
      { id: 'notif',    label: 'Notificaciones', icon: ICONS.notif,    href: '#', badge: '2' },
      { id: 'docs',     label: 'Documentos',     icon: ICONS.docs,     href: '#' }
      /* "Mi perfil" eliminado (v1.1.3) — duplicaba el access del user-pill del header */
    ],
    /* v1.2.0 — Fase 2 Sprint 1: Coordinador habilitado (HU-3) */
    'coordinador': [
      { id: 'bandeja-coord', label: 'Bandeja de asignación', icon: ICONS.bandeja,  href: 'bandeja.html', badge: '4' },
      { id: 'en-validacion', label: 'Trámites en validación', icon: ICONS.tramites, href: '#' },
      { id: 'historico-coord', label: 'Histórico',           icon: ICONS.docs,     href: '#' }
    ],
    /* v1.2.0 — Fase 2 Sprint 1: Profesional habilitado (HU-4/HU-6) */
    'profesional': [
      { id: 'bandeja-prof', label: 'Mi bandeja',        icon: ICONS.bandeja,  href: 'workspace.html', badge: '3' },
      { id: 'revision',     label: 'En revisión',       icon: ICONS.tramites, href: '#' },
      { id: 'historico-prof', label: 'Histórico',       icon: ICONS.docs,     href: '#' }
    ],
    'director': [
      { id: 'firma',   label: 'Por firmar', icon: ICONS.tramites, href: '#' }
    ]
  };

  /* Section label por perfil */
  var SECTION_LABELS = {
    'usuario-externo': 'MI ORGANISMO',
    'coordinador':     'COORDINACIÓN',
    'profesional':     'OPERACIÓN',
    'director':        'DIRECCIÓN'
  };

  function el(html) {
    var div = document.createElement('div');
    div.innerHTML = String(html).trim();
    return div.firstChild;
  }

  function inSubdir() {
    return /\/(usuario-externo|profesional|coordinador|director)\//.test(location.pathname);
  }
  function pathPrefix() { return inSubdir() ? '../' : ''; }
  function sharedPath() { return pathPrefix() + 'shared/'; }

  function getCollapsed() {
    return localStorage.getItem(COLLAPSED_KEY) === '1';
  }
  function setCollapsed(v) {
    localStorage.setItem(COLLAPSED_KEY, v ? '1' : '0');
  }

  /* ───── Sidebar (canonical markup) ───── */
  function renderSidebar(opts) {
    var perfilId = (opts && opts.perfilId) || (window.IVCData && window.IVCData.getPerfil()) || 'usuario-externo';
    var items = NAV_ITEMS[perfilId] || NAV_ITEMS['usuario-externo'];
    var activeId = (opts && opts.activeNav) || items[0].id;
    var isCollapsed = getCollapsed();
    var sectionLabel = SECTION_LABELS[perfilId] || 'OPERACIÓN';

    /* Determinar subdir base por perfil (para resolver href relativos) */
    var perfilSubdirs = {
      'usuario-externo': 'usuario-externo/',
      'coordinador':     'coordinador/',
      'profesional':     'profesional/',
      'director':        'director/'
    };
    var perfilSubdir = perfilSubdirs[perfilId] || 'usuario-externo/';

    var navHtml = items.map(function (it) {
      var isActive = it.id === activeId;
      var href = it.href;
      if (href && href !== '#' && !/^https?:/.test(href)) {
        href = (inSubdir() ? '' : perfilSubdir) + href;
      }
      var badgeHtml = it.badge ? '<span class="nav-row__badge">' + it.badge + '</span>' : '';
      return '<a class="nav-row ' + (isActive ? 'is-active' : '') + '" ' +
        'href="' + href + '" ' +
        'data-nav-id="' + it.id + '" ' +
        'data-lbl="' + it.label + '">' +
        (isActive ? '<div class="active-bar"></div>' : '') +
        '<div class="icon">' + it.icon + '</div>' +
        '<span class="lbl">' + it.label + '</span>' +
        badgeHtml +
        '</a>';
    }).join('');

    return '<aside class="sidebar ' + (isCollapsed ? 'is-collapsed' : '') + '" id="sidebar">' +
      '<div class="sidebar-logo">' +
        '<button class="burger-btn" id="sidebarToggle" type="button" aria-label="Colapsar menú">' +
          ICONS.burger +
        '</button>' +
        '<img src="' + sharedPath() + 'logos/ministerio.svg" alt="Ministerio del Deporte" class="sb-logo-img"/>' +
        '<div class="logo-sep"></div>' +
        '<span class="sb-logo-img sb-logo-img--pill" title="Inspección, Vigilancia y Control">IVC</span>' +
      '</div>' +
      '<nav class="sidebar-nav" id="sidebarNav" role="navigation" aria-label="Menú principal">' +
        '<div class="nav-section">' + sectionLabel + '</div>' +
        navHtml +
      '</nav>' +
      '<div class="sidebar-bottom">' +
        '<a class="nav-row" href="' + pathPrefix() + 'index.html" data-action="logout" data-lbl="Cerrar sesión">' +
          '<div class="icon">' + ICONS.logout + '</div>' +
          '<span class="lbl">Cerrar sesión</span>' +
        '</a>' +
      '</div>' +
      '</aside>';
  }

  /* ───── Header (canonical: profile-switcher SIN breadcrumb ni title)
     Doug fix #2: NO breadcrumb en header.
     Doug fix #3: el title del page vive en el body de la página
     (page-title-block en dashboard, hero en detalle, stepper en wizard).
     Si opts.title === null o no se pasa, no se renderiza title.
     Si se pasa string, se renderiza por compat con otras vistas. ───── */
  function renderHeader(opts) {
    var perfilId = (window.IVCData && window.IVCData.getPerfil()) || 'usuario-externo';
    var perfil = (window.IVCData && window.IVCData.PERFILES[perfilId]) || {};
    var title = (opts && opts.title) || null;

    var titleHtml = '';
    if (title) {
      titleHtml = '<div class="top-header__title-wrap">' +
        '<h1 class="top-header__title">' + title + '</h1>' +
      '</div>';
    } else {
      /* Spacer flex para empujar el user-chip a la derecha */
      titleHtml = '<div class="top-header__title-wrap"></div>';
    }

    var color = perfil.color || '#002B5B';
    var avatar = perfil.avatar || 'LB';
    var ident = perfil.nit ? ('NIT ' + perfil.nit) : (perfil.cedula ? ('CC ' + perfil.cedula) : '');

    return '<header class="top-header">' +
      titleHtml +
      '<div class="top-header__right">' +
        '<div class="profile-switcher" id="profileSwitcher">' +
          '<div class="user-chip" id="userChipTrigger">' +
            '<div class="ava">' +
              '<div class="ava-ring" style="background:' + color + '22;color:' + color + '">' + avatar + '</div>' +
              '<div class="ava-dot"></div>' +
            '</div>' +
            '<div class="user-info">' +
              '<span class="user-name">' + (perfil.nombre || 'Usuario') + '</span>' +
              '<span class="user-role">' + (perfil.rol || '') + '</span>' +
            '</div>' +
            '<button class="user-chip__chevron" type="button" aria-label="Abrir menú de cuenta">' +
              ICONS.chevron +
            '</button>' +
          '</div>' +
          /* Mid-Fi: solo identity card. Sin acciones (Mi perfil / Notif /
             Configuraciones / Cerrar sesión) para no distraer del flujo IVC.
             Doug feedback v1.1.4 — round 3 #1. */
          '<div class="profile-dd profile-dd--identity-only" role="menu">' +
            '<div class="profile-dd__header">' +
              '<span class="ava-ring" style="width:42px;height:42px;font-size:14px;background:' + color + '22;color:' + color + '">' + avatar + '</span>' +
              '<div class="profile-dd__user">' +
                '<strong>' + (perfil.nombre || 'Usuario') + '</strong>' +
                '<small>' + ident + '</small>' +
                '<span class="profile-dd__current-role" style="color:' + color + '">' +
                  '<span class="profile-dd__check-ico">' + ICONS.check + '</span>' +
                  (perfil.rol || '') +
                '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  /* ───── Demo Role Switcher (chip flotante — solo sandbox) ───── */
  function renderDemoSwitcher() {
    var perfilId = (window.IVCData && window.IVCData.getPerfil()) || 'usuario-externo';
    var perfiles = (window.IVCData && window.IVCData.getAllPerfiles && window.IVCData.getAllPerfiles()) || [];
    var currentPerfil = (window.IVCData && window.IVCData.PERFILES[perfilId]) || {};

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
        '<span class="demo-role-switcher__avatar" style="background:' + (currentPerfil.color || '#002B5B') + '22;color:' + (currentPerfil.color || '#002B5B') + '">' + (currentPerfil.avatar || 'LB') + '</span>' +
        '<span>Cambiar perfil</span>' +
        '<span class="demo-role-switcher__chev">' + ICONS.chevron + '</span>' +
      '</button>' +
      '<div class="demo-role-switcher__panel" id="demoSwitcherPanel" role="menu">' +
        '<div class="demo-role-switcher__panel-label">' + perfiles.length + ' perfiles del demo</div>' +
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

  /* ───── Tooltip para sidebar colapsado ───── */
  var _tooltipEl = null;
  function setupTooltips() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    if (!_tooltipEl) {
      _tooltipEl = document.createElement('div');
      _tooltipEl.className = 'nav-tooltip';
      document.body.appendChild(_tooltipEl);
    }
    function showTooltip(row) {
      if (!sidebar.classList.contains('is-collapsed')) return;
      var lbl = row.getAttribute('data-lbl') || row.querySelector('.lbl')?.textContent || '';
      _tooltipEl.textContent = String(lbl).trim();
      var rect = row.getBoundingClientRect();
      _tooltipEl.style.left = (rect.right + 12) + 'px';
      _tooltipEl.style.top = (rect.top + rect.height / 2) + 'px';
      _tooltipEl.classList.add('is-visible');
    }
    function hideTooltip() {
      if (_tooltipEl) _tooltipEl.classList.remove('is-visible');
    }
    sidebar.querySelectorAll('.nav-row').forEach(function (row) {
      row.addEventListener('mouseenter', function () { showTooltip(row); });
      row.addEventListener('mouseleave', hideTooltip);
    });
    var observer = new MutationObserver(hideTooltip);
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
  }

  /* ───── Wire events ───── */
  function wireEvents() {
    /* Burger toggle */
    var toggle = document.getElementById('sidebarToggle');
    var sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', function () {
        sidebar.classList.toggle('is-collapsed');
        setCollapsed(sidebar.classList.contains('is-collapsed'));
      });
    }

    /* Profile dropdown */
    var switcher = document.getElementById('profileSwitcher');
    var trigger = document.getElementById('userChipTrigger');
    if (switcher && trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        switcher.classList.toggle('is-open');
      });
      document.addEventListener('click', function (e) {
        if (!switcher.contains(e.target)) switcher.classList.remove('is-open');
      });
    }

    /* Demo switcher */
    var sw = document.getElementById('demoSwitcher');
    var swToggle = document.getElementById('demoSwitcherToggle');
    if (swToggle && sw) {
      swToggle.addEventListener('click', function (e) {
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
          var nameEl = item.querySelector('.demo-role-switcher__item-name');
          var nameText = nameEl ? nameEl.textContent : 'Este perfil';
          showSnackbar(nameText + ' estará disponible en Fase 2.');
          return;
        }
        var next = item.getAttribute('data-perfil');
        var current = window.IVCData.getPerfil();
        if (next === current) {
          if (sw) sw.classList.remove('is-open');
          return;
        }
        window.IVCData.setPerfil(next);
        /* v1.2.0 — landing por perfil */
        var landings = {
          'usuario-externo': 'usuario-externo/dashboard.html',
          'coordinador':     'coordinador/bandeja.html',
          'profesional':     'profesional/workspace.html'
        };
        var landing = landings[next];
        if (landing) {
          window.location.href = pathPrefix() + landing;
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

    /* Logout */
    document.querySelectorAll('[data-action="logout"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = pathPrefix() + 'index.html';
      });
    });

    setupTooltips();
  }

  /* ───── Snackbar (toast) ───── */
  function showSnackbar(text, variant) {
    var existing = document.querySelector('.naowee-snackbar');
    if (existing) existing.remove();
    var snack = el('<div class="naowee-snackbar ' +
      (variant === 'success' ? 'naowee-snackbar--success' : '') +
      '">' + text + '</div>');
    document.body.appendChild(snack);
    requestAnimationFrame(function () { snack.classList.add('is-visible'); });
    setTimeout(function () {
      snack.classList.remove('is-visible');
      setTimeout(function () { snack.remove(); }, 300);
    }, 3000);
  }

  /* ───── Init (public API consumed by 4 HTML pages) ───── */
  function init(opts) {
    opts = opts || {};

    if (window.IVCData && !window.IVCData.getPerfil()) {
      window.IVCData.setPerfil('usuario-externo');
    }

    var shellRoot = document.getElementById('app-shell');
    if (shellRoot) {
      /* Las páginas ya inyectan su contenido envuelto en <div class="page-inner">
         desde su <template id="page-content">, así que NO lo re-envolvemos acá. */
      var innerContent = shellRoot.innerHTML;
      shellRoot.outerHTML =
        '<div class="shell" id="app-shell">' +
          renderSidebar({ activeNav: opts.activeNav, perfilId: opts.perfilId }) +
          '<div class="main">' +
            renderHeader({ title: opts.title }) +
            '<main class="page page-fade-in" id="page-main">' +
              innerContent +
            '</main>' +
          '</div>' +
        '</div>';
    }

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
