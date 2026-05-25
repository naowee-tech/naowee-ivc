/* ═══════════════════════════════════════════════════════════════════════
   Naowee IVC — Store (v1.5.0)

   Source of truth para el demo end-to-end. Persiste trámites + asignaciones
   en localStorage bajo el namespace 'ivc:'.

   Doc del plan: /docs/PLAN-END-TO-END.md

   Uso:
     <script src="../shared/ivc-store.js"></script>
     IVCStore.init();
     var tramites = IVCStore.getTramites({ area: 'aficionado' });
     IVCStore.asignar('IVC-2026-00001', 'cp-001', 'Carolina Méndez');
     IVCStore.on('tramite:asignado', function(t){ renderTabla(); });

   Cross-tab: escucha el evento `storage` del browser → notifica listeners
   cuando otra tab modifica el store.
   ═══════════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  var KEY = 'ivc:store';
  var SEED_VERSION = 1;            /* bump si cambia el schema del seed */

  /* ─── Seed inicial ─────────────────────────────────────────────────── */
  var SEED = {
    seedVersion: SEED_VERSION,
    ultimoRadicado: 12,
    profesionales: [
      { id: 'cp-001', nombre: 'Carlos Pérez',     area: 'aficionado', activos: 12 },
      { id: 'mg-002', nombre: 'María García',     area: 'aficionado', activos: 8  },
      { id: 'al-003', nombre: 'Andrés López',     area: 'aficionado', activos: 15 },
      { id: 'lr-004', nombre: 'Lucía Ramírez',    area: 'aficionado', activos: 5  }
    ],
    tramites: [
      mkSeed('IVC-2026-001', 'liga',       'Otorgamiento',  'Liga de Atletismo de Bolívar',        '800.245.678-3', '2026-05-21', 15, 'No asignada'),
      mkSeed('IVC-2026-002', 'liga',       'Renovación',    'Liga de Voleibol de Cundinamarca',    '800.456.789-1', '2026-05-20', 12, 'No asignada'),
      mkSeed('IVC-2026-003', 'asociacion', 'Otorgamiento',  'Asociación de Patinaje del Valle',    '901.234.567-2', '2026-05-19',  3, 'Asignada',      'cp-001'),
      mkSeed('IVC-2026-004', 'liga',       'Actualización', 'Liga de Natación del Atlántico',      '800.789.012-4', '2026-05-19', -2, 'No asignada'),
      mkSeed('IVC-2026-005', 'liga',       'Otorgamiento',  'Liga de Tenis de Mesa de Antioquia',  '811.345.678-9', '2026-05-18', 18, 'En validación','mg-002'),
      mkSeed('IVC-2026-006', 'liga',       'Renovación',    'Liga de Ciclismo de Boyacá',          '900.567.890-5', '2026-05-18',  5, 'Asignada',      'al-003'),
      mkSeed('IVC-2026-007', 'asociacion', 'Otorgamiento',  'Asociación de Taekwondo de Caldas',   '901.456.789-3', '2026-05-17', -5, 'No asignada'),
      mkSeed('IVC-2026-008', 'liga',       'Otorgamiento',  'Liga de Fútbol de Sala del Tolima',   '800.234.567-8', '2026-05-17', 20, 'En validación','lr-004'),
      mkSeed('IVC-2026-009', 'liga',       'Renovación',    'Liga de Karate del Quindío',          '900.123.456-7', '2026-05-15',  2, 'Asignada',      'cp-001'),
      mkSeed('IVC-2026-010', 'liga',       'Otorgamiento',  'Liga de Baloncesto de Risaralda',     '800.345.678-2', '2026-05-14', 10, 'No asignada'),
      mkSeed('IVC-2026-011', 'asociacion', 'Otorgamiento',  'Asociación de Esgrima del Meta',      '901.789.012-1', '2026-05-13',  4, 'En validación','mg-002'),
      mkSeed('IVC-2026-012', 'federacion', 'Renovación',    'Federación Colombiana de Atletismo',  '900.987.654-3', '2026-05-12', 25, 'No asignada')
    ]
  };

  function mkSeed(id, tipoOrg, tipoTramite, organismo, nit, fechaIso, plazoDias, estado, profId) {
    var prof = profId && SEED.profesionales.find(function(p){ return p.id === profId; });
    var hist = [
      { fecha: fechaIso, hora: '08:15', actor: 'Liga de Atletismo (demo)', accion: 'Radicado' },
      { fecha: fechaIso, hora: '08:15', actor: 'Sistema', accion: 'Remisión automática a Deporte Aficionado' }
    ];
    if (estado === 'Asignada' || estado === 'En validación') {
      hist.push({ fecha: fechaIso, hora: '10:32', actor: 'Carolina Méndez (Coordinador)', accion: 'Asignada a ' + (prof ? prof.nombre : 'Profesional') });
    }
    if (estado === 'En validación') {
      hist.push({ fecha: fechaIso, hora: '14:18', actor: prof ? prof.nombre + ' (Profesional)' : 'Profesional', accion: 'Inicio de validación' });
    }
    return {
      id: id,
      organismo: organismo,
      nit: nit,
      tipoOrganismo: tipoOrg,
      tipoTramite: tipoTramite,
      area: 'aficionado',
      fechaRadicacion: fechaIso,
      plazoDias: plazoDias,
      estado: estado,
      profesionalId: profId || null,
      profesionalNombre: prof ? prof.nombre : null,
      historico: hist,
      documentos: {},
      datos: {}
    };
  }

  /* ─── Persistencia ─────────────────────────────────────────────────── */
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      /* Si la versión del seed cambió, hacer reset */
      if (parsed.seedVersion !== SEED_VERSION) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function write(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.error('[IVCStore] write failed:', e); }
  }

  /* ─── Event emitter simple ─────────────────────────────────────────── */
  var listeners = {};
  function emit(event, payload) {
    (listeners[event] || []).forEach(function (cb) {
      try { cb(payload); } catch (e) { console.error('[IVCStore] listener error:', e); }
    });
  }

  /* Cross-tab: storage event dispara cuando otra tab modifica localStorage */
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) emit('store:changed-external', null);
    });
  }

  /* ─── API pública ──────────────────────────────────────────────────── */
  var IVCStore = {
    init: function () {
      var s = read();
      if (!s) {
        s = JSON.parse(JSON.stringify(SEED));   /* deep clone */
        s.mode = 'demo';                         /* modo por default */
        write(s);
      }
      if (!s.mode) { s.mode = 'demo'; write(s); }  /* migration */
      return s;
    },

    /* v1.5.1: 2 modos de demo (patrón Project v2.0.3)
       'demo'  — 12 trámites mock seed + 4 profesionales
       'blank' — sin trámites (vacío para que el usuario cree desde formulario) */
    getMode: function () { return this.init().mode || 'demo'; },

    setMode: function (mode) {
      if (mode !== 'demo' && mode !== 'blank') return;
      var s;
      if (mode === 'blank') {
        s = {
          seedVersion: SEED_VERSION,
          ultimoRadicado: 0,
          profesionales: JSON.parse(JSON.stringify(SEED.profesionales)),  /* profesionales sí, los necesita el Coordinador */
          tramites: [],
          mode: 'blank'
        };
      } else {
        s = JSON.parse(JSON.stringify(SEED));
        s.mode = 'demo';
      }
      write(s);
      emit('store:mode-changed', mode);
      emit('store:reset', null);
      return s;
    },

    reset: function () {
      var currentMode = this.getMode();
      return this.setMode(currentMode);   /* reset preserva el modo actual */
    },

    getProfesionales: function (area) {
      var s = this.init();
      return area
        ? s.profesionales.filter(function (p) { return p.area === area; })
        : s.profesionales.slice();
    },

    getTramites: function (filtros) {
      var s = this.init();
      var ts = s.tramites.slice();
      if (!filtros) return ts;
      if (filtros.area)          ts = ts.filter(function (t) { return t.area === filtros.area; });
      if (filtros.estado)        ts = ts.filter(function (t) { return t.estado === filtros.estado; });
      if (filtros.profesionalId) ts = ts.filter(function (t) { return t.profesionalId === filtros.profesionalId; });
      return ts;
    },

    getTramite: function (id) {
      var s = this.init();
      return s.tramites.find(function (t) { return t.id === id; }) || null;
    },

    misAsignaciones: function (profesionalId) {
      return this.getTramites({ profesionalId: profesionalId });
    },

    crearTramite: function (formData) {
      var s = this.init();
      s.ultimoRadicado = (s.ultimoRadicado || 0) + 1;
      var pad = String(s.ultimoRadicado).padStart(3, '0');
      var id = 'IVC-' + new Date().getFullYear() + '-' + pad;
      var now = new Date();
      var iso = now.toISOString().slice(0, 10);
      var hora = now.toTimeString().slice(0, 5);
      var nuevo = {
        id: id,
        organismo: formData.organismo || '—',
        nit: formData.nit || '—',
        tipoOrganismo: formData.tipoOrganismo || 'liga',
        tipoTramite: formData.tipoTramite || 'Otorgamiento',
        area: formData.area || 'aficionado',
        fechaRadicacion: iso,
        plazoDias: 15,
        estado: 'No asignada',
        profesionalId: null,
        profesionalNombre: null,
        historico: [
          { fecha: iso, hora: hora, actor: formData.organismo || 'Usuario externo', accion: 'Radicado' },
          { fecha: iso, hora: hora, actor: 'Sistema', accion: 'Remisión automática a Deporte ' + (formData.area === 'profesional' ? 'Profesional' : 'Aficionado') }
        ],
        documentos: formData.documentos || {},
        datos: formData.datos || {}
      };
      s.tramites.unshift(nuevo);
      write(s);
      emit('tramite:creado', nuevo);
      return nuevo;
    },

    asignar: function (tramiteId, profesionalId, actor) {
      var s = this.init();
      var t = s.tramites.find(function (x) { return x.id === tramiteId; });
      if (!t) return null;
      var prof = s.profesionales.find(function (p) { return p.id === profesionalId; });
      if (!prof) return null;
      var now = new Date();
      t.profesionalId = profesionalId;
      t.profesionalNombre = prof.nombre;
      t.estado = 'Asignada';
      t.historico.push({
        fecha: now.toISOString().slice(0, 10),
        hora: now.toTimeString().slice(0, 5),
        actor: actor || 'Coordinador',
        accion: 'Asignada a ' + prof.nombre
      });
      write(s);
      emit('tramite:asignado', t);
      return t;
    },

    actualizarEstado: function (tramiteId, estado, actor, observacion) {
      var s = this.init();
      var t = s.tramites.find(function (x) { return x.id === tramiteId; });
      if (!t) return null;
      var now = new Date();
      var prev = t.estado;
      t.estado = estado;
      t.historico.push({
        fecha: now.toISOString().slice(0, 10),
        hora: now.toTimeString().slice(0, 5),
        actor: actor || 'Sistema',
        accion: 'Estado: ' + prev + ' → ' + estado + (observacion ? ' · ' + observacion : '')
      });
      write(s);
      emit('tramite:estado-cambiado', t);
      return t;
    },

    on: function (event, cb) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
      return function off() {
        listeners[event] = (listeners[event] || []).filter(function (c) { return c !== cb; });
      };
    },

    /* Debug helper para consola */
    _dump: function () { return this.init(); }
  };

  root.IVCStore = IVCStore;
})(typeof window !== 'undefined' ? window : globalThis);
