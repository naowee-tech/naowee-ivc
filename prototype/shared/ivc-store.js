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
  var SEED_VERSION = 2;            /* v1.7.3: bump por mocks completos (datos.f1/f2/f3 + asamblea + estructura + cierre) */

  /* ─── Seed inicial ───────────────────────────────────────────────────
     v1.5.3 FIX (25/05/2026): bug crítico — antes mkSeed referenciaba
     SEED.profesionales mientras SEED se estaba construyendo, lo que tiraba
     "Cannot read property of undefined" y dejaba IVCStore sin asignar.
     Solución: extraer PROFESIONALES y SEED_TRAMITES_RAW como constantes
     independientes y construir SEED con .map(). */
  var PROFESIONALES = [
    { id: 'cp-001', nombre: 'Carlos Pérez',     area: 'aficionado', activos: 12 },
    { id: 'mg-002', nombre: 'María García',     area: 'aficionado', activos: 8  },
    { id: 'al-003', nombre: 'Andrés López',     area: 'aficionado', activos: 15 },
    { id: 'lr-004', nombre: 'Lucía Ramírez',    area: 'aficionado', activos: 5  }
  ];

  /* v1.7.3 (26/05/2026): factory de datos mock por tipo de organismo.
     Cubre todos los campos obligatorios del matriz oficial XLSX, así el
     modal "Ver detalle del trámite" muestra info completa en lugar de "—".

     Cada tipo (liga/asociacion/federacion) tiene sus secciones obligatorias:
       - generales: nombre, NIT (solo liga), dirección, municipio, teléfono, correo
       - personeria: f1.* / f2.* / f3.* según organismo
       - asamblea: f1_* (liga) / f3_* (federación) — N/A en asociación
       - estructura: f1_* / f2_* / f3_*
       - cierre: certificaciones + radicado + observaciones + archivos */
  function _mockDatos(tipoOrg, organismo, nit) {
    var base = {
      nombre: organismo,
      direccion: 'Carrera 13 # 45-67, Edificio Polideportivo, oficina 502',
      municipio: 'Bogotá D.C.',
      telefono: '+57 601 555 0123',
      correo: 'contacto@' + organismo.toLowerCase().replace(/[^a-z]+/g,'') + '.org.co'
    };
    if (tipoOrg === 'liga') {
      base.nit = nit;
      base.f1 = {
        no_res_personeria:    'Res. 0421-2018',
        radicado_personeria:  'RAD-2018-04-0421',
        fecha_reforma:        '2024-03-15',
        radicado_estatutos:   'RAD-2024-03-0918',
        no_res_estatutos:     'Res. 0918-2024',
        periodo_inicial:      '2020-2024',
        periodo_vigente:      '2024-2028',
        no_res_rd_anterior:   'Res. 0210-2020',
        fecha_notif_rd:       '2020-04-02',
        fecha_firmeza_rd:     '2020-04-18',
        f1_no_acta_miembros:  'Acta 03-2024',
        tiene_constancia:     'si',
        fecha_constancia:     '2024-04-10',
        no_res_minimos:       'Res. 0210-2024',
        n_minimos:            '15'
      };
      base.asamblea = {
        f1_tema:                          'Elección de dignatarios período 2024-2028',
        f1_reuniones: [
          { tipo: 'ORDINARIA',             fechaConv: '2024-03-15', fechaReal: '2024-03-30', antelacion: '2024-03-15', cumple: 'si' },
          { tipo: 'EXTRAORDINARIA',        fechaConv: '2024-02-10', fechaReal: '2024-02-20', antelacion: '2024-02-10', cumple: 'si' }
        ],
        f1_obs_asamblea:                  'Asamblea realizada conforme a los estatutos vigentes. Quórum verificado por Revisor Fiscal.',
        f1_tipo_convocante:               'PRESIDENTE',
        f1_convocante_vigente:            'si',
        f1_no_res_convocante:             'Res. 0210-2020',
        f1_no_acta_designa_presidente:    'Acta 01-2024',
        f1_no_res_comite_provisional:     '',
        f1_vigencia_comite_provisional:   '',
        f1_comite_designado_por_oa:       'no_aplica',
        f1_ente_deportivo:                'Indeportes Bolívar',
        f1_num_afiliados:                 '47',
        f1_num_asistentes:                '38',
        f1_cumplio_quorum:                'si',
        f1_adjunta_cert_rf_fecha:         'si',
        f1_archivo_cert_rf_fecha:         { name: 'cert-rf-fecha-asamblea.pdf', size: '245 KB' },
        f1_adjunta_cert_rf_actual:        'si',
        f1_archivo_cert_rf_actual:        { name: 'cert-rf-actual.pdf', size: '198 KB' },
        f1_obs_asistencia:                'Quórum del 80,8% de los afiliados activos.'
      };
      base.estructura = {
        f1_fundadores: [
          { nombre: 'Club Atlético Cartagena',  no_res_reconocimiento: 'Res. 0112-2015' },
          { nombre: 'Club Deportivo Mompox',    no_res_reconocimiento: 'Res. 0078-2017' },
          { nombre: 'Club Atletismo Magangué',  no_res_reconocimiento: 'Res. 0145-2019' }
        ],
        f1_miembros_oa: [
          { nombre: 'Juan Carlos Hernández',  identificacion: '79.123.456',  cargo: 'Presidente',  capacitacion: 'si', nombrado_por: 'Asamblea',         no_periodos: '1' },
          { nombre: 'María Elena Vargas',     identificacion: '52.234.567',  cargo: 'Vicepresidente', capacitacion: 'si', nombrado_por: 'Asamblea',     no_periodos: '1' },
          { nombre: 'Pedro Antonio Gómez',    identificacion: '80.345.678',  cargo: 'Secretario',  capacitacion: 'si', nombrado_por: 'Asamblea',         no_periodos: '2' },
          { nombre: 'Ana Lucía Rodríguez',    identificacion: '41.456.789',  cargo: 'Tesorero',    capacitacion: 'si', nombrado_por: 'Asamblea',         no_periodos: '1' },
          { nombre: 'Carlos Mario Pérez',     identificacion: '79.567.890',  cargo: 'Vocal',       capacitacion: 'no', nombrado_por: 'Asamblea',         no_periodos: '1' }
        ],
        f1_presidente_antecedentes: 'no',
        f1_persona_discapacidad:    'Pedro Antonio Gómez (discapacidad visual parcial)',
        f1_revisor_fiscal: [
          { display: 'Revisor Fiscal Principal', nombre: 'Luis Fernando Castro',   identificacion: '79.678.901' },
          { display: 'Revisor Fiscal Suplente',  nombre: 'Patricia Eugenia Mejía', identificacion: '52.789.012' }
        ],
        f1_comision_disciplinaria: [
          { display: 'Miembro 1', nombre: 'Jorge Iván Restrepo' },
          { display: 'Miembro 2', nombre: 'Sandra Milena Ortiz' },
          { display: 'Miembro 3', nombre: 'Ricardo Andrés Toro' }
        ],
        f1_comision_tecnica: [
          { display: 'Miembro 1', nombre: 'Diego Alejandro Rojas' },
          { display: 'Miembro 2', nombre: 'Mónica Patricia Salazar' }
        ],
        f1_comision_juzgamiento: [
          { display: 'Miembro 1', nombre: 'Felipe Antonio Cárdenas' },
          { display: 'Miembro 2', nombre: 'Laura Cristina Mejía' }
        ],
        f1_aplica_paradeporte: 'si',
        f1_comision_paradeporte: [
          { display: 'Miembro 1', nombre: 'Roberto Carlos Pinilla' },
          { display: 'Miembro 2', nombre: 'Diana Marcela Ríos' }
        ],
        f1_paradeporte_fecha_asamblea: '2024-04-05'
      };
      base.cierre = {
        f1_adjunta_cert_conjunta:  'si',
        f1_archivo_cert_conjunta:  { name: 'cert-conjunta-estructura.pdf', size: '312 KB' },
        no_radicado_doc:           'RAD-2026-05-' + nit.slice(-4),
        observaciones:             'Documentación completa. Pendiente revisión de plazo de notificación.',
        archivos_adjuntos:         { name: 'expediente-completo.zip', size: '4.2 MB' }
      };
    }
    if (tipoOrg === 'asociacion') {
      base.f2 = {
        sub_tipo:                       'JUVENIL',
        no_personeria:                  'Res. 0512-2019 (15/06/2019)',
        radicado_personeria:            'RAD-2019-06-0512',
        fecha_estatutos:                '2022-08-22',
        radicado_estatutos:             'RAD-2022-08-0712',
        no_acta_sede:                   'Acta 12-2023',
        radicado_acta_sede:             'RAD-2023-09-0112',
        no_acta_constitucion:           'Acta 02-2023',
        radicado_acta_constitucion:     'RAD-2023-02-0078',
        no_inscripcion_miembros:        'Res. 0089-2024',
        radicado_inscripcion_miembros:  'RAD-2024-02-0089',
        tiene_inventario:               'si',
        archivo_inventario:             { name: 'inventario-bienes.pdf', size: '189 KB' },
        tiene_afiliacion:               'no',
        archivo_afiliacion:             null
      };
      base.estructura = {
        f2_seccionales: [
          { nombre_seccional: 'Seccional Cali',      nombre_directivo: 'Andrés Felipe Quintero' },
          { nombre_seccional: 'Seccional Palmira',   nombre_directivo: 'Beatriz Elena Mosquera' },
          { nombre_seccional: 'Seccional Buga',      nombre_directivo: 'Carlos Eduardo Tobón' }
        ]
      };
      base.cierre = {
        no_radicado_doc:    'RAD-2026-05-ASO-' + nit.slice(-4),
        observaciones:      'Documentación de seccionales completa. Falta validar inventario actualizado 2026.',
        archivos_adjuntos:  { name: 'expediente-asociacion.zip', size: '2.8 MB' }
      };
    }
    if (tipoOrg === 'federacion') {
      base.municipio = 'Bogotá D.C.';
      base.f3 = {
        no_res_personeria:                'Res. 0042-1982',
        radicado_personeria:              'RAD-1982-01-0042',
        f3_periodo_estatutario_inicial:   '2020-2024',
        f3_no_res_minimos:                'Res. 0312-2024',
        f3_n_minimos:                     '32'
      };
      base.asamblea = {
        f3_tipo_convocatoria:    'COMITE_PROVISIONAL',
        f3_fecha_convocatoria:   '2024-02-15',
        f3_fecha_realizacion:    '2024-03-15',
        f3_num_afiliados:        '32',
        f3_num_asistentes:       '28',
        f3_cumplio_quorum:       'si',
        f3_adjunta_cert_rf:      'si',
        f3_archivo_cert:         { name: 'cert-rf-federacion.pdf', size: '276 KB' }
      };
      base.estructura = {
        f3_afiliados: [
          { nombre: 'Liga de Atletismo de Antioquia', no_res_reconocimiento: 'Res. 0023-2018' },
          { nombre: 'Liga de Atletismo de Bolívar',   no_res_reconocimiento: 'Res. 0078-2019' },
          { nombre: 'Liga de Atletismo del Valle',    no_res_reconocimiento: 'Res. 0145-2017' },
          { nombre: 'Liga de Atletismo de Caldas',    no_res_reconocimiento: 'Res. 0210-2020' }
        ],
        f3_miembros_oa: [
          { nombre: 'Dr. Ramón Eduardo Velásquez', cargo: 'Presidente',     identificacion: '19.876.543', tiene_capacitacion: 'si', nombrado_por: 'Asamblea', acepta_cargo: 'si' },
          { nombre: 'Dra. Marcela Andrea Robles',  cargo: 'Vicepresidenta', identificacion: '52.987.654', tiene_capacitacion: 'si', nombrado_por: 'Asamblea', acepta_cargo: 'si' },
          { nombre: 'Ing. Hernán Darío Cardona',   cargo: 'Secretario',     identificacion: '70.123.456', tiene_capacitacion: 'si', nombrado_por: 'Asamblea', acepta_cargo: 'si' },
          { nombre: 'Cra. Liliana Marcela Posada', cargo: 'Tesorera',       identificacion: '43.234.567', tiene_capacitacion: 'si', nombrado_por: 'Asamblea', acepta_cargo: 'si' }
        ],
        f3_persona_discapacidad:          'Dr. Ramón Eduardo Velásquez (movilidad reducida)',
        f3_fecha_reunion_electiva_oa:     '2024-03-15',
        f3_fecha_reunion_asignacion:      '2024-03-22',
        f3_acredita_cert_residencia_oa:   'si',
        f3_nombres_cert_residencia_oa:    'Velásquez, Robles, Cardona, Posada',
        f3_archivo_cert_residencia_oa:    { name: 'cert-residencia-oa.pdf', size: '156 KB' },
        f3_revisor_fiscal: [
          { display: 'Revisor Fiscal Principal', nombre: 'CP. Alejandro Rivera',   identificacion: '79.345.678', no_tarjeta_profesional: '152.345-T', acepta_cargo: 'si', antecedentes_disciplinarios: 'no', firma_revisoria: 'si' },
          { display: 'Revisor Fiscal Suplente',  nombre: 'CP. Mónica Patricia Ríos', identificacion: '52.456.789', no_tarjeta_profesional: '167.890-T', acepta_cargo: 'si', antecedentes_disciplinarios: 'no', firma_revisoria: 'si' }
        ],
        f3_acredita_cert_residencia_oc:   'si',
        f3_nombres_cert_residencia_oc:    'Rivera, Ríos',
        f3_archivo_cert_residencia_oc:    { name: 'cert-residencia-oc.pdf', size: '134 KB' },
        f3_comision_disciplinaria: [
          { display: 'Miembro 1', nombre: 'Dr. Iván Mauricio Vargas',  identificacion: '79.456.789', acepta: 'si' },
          { display: 'Miembro 2', nombre: 'Dra. Adriana Lucía Soto',   identificacion: '52.567.890', acepta: 'si' },
          { display: 'Miembro 3', nombre: 'Dr. Javier Andrés Mendoza', identificacion: '80.678.901', acepta: 'si' }
        ],
        f3_fecha_reunion_oa_cd:           '2024-03-28'
      };
      base.cierre = {
        f3_adjunta_cert_coc:                 'si',
        f3_archivo_cert_coc:                 { name: 'cert-coc.pdf', size: '298 KB' },
        f3_adjunta_aval_paralimpico:         'si',
        f3_archivo_aval_paralimpico:         { name: 'aval-cpc.pdf', size: '187 KB' },
        f3_adjunta_cert_conjunta_no_inv:     'si',
        f3_archivo_cert_conjunta_no_inv:     { name: 'cert-no-investigacion.pdf', size: '245 KB' },
        no_radicado_doc:                     'RAD-2026-05-FED-' + nit.slice(-4),
        observaciones:                       'Documentación completa según matriz oficial F3. Trámite priorizado por COC.',
        archivos_adjuntos:                   { name: 'expediente-federacion.zip', size: '6.4 MB' }
      };
    }
    return base;
  }

  function mkSeed(id, tipoOrg, tipoTramite, organismo, nit, fechaIso, plazoDias, estado, profId) {
    var prof = profId && PROFESIONALES.find(function(p){ return p.id === profId; });
    var hist = [
      { fecha: fechaIso, hora: '08:15', actor: organismo + ' (demo)', accion: 'Radicado' },
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
      datos: _mockDatos(tipoOrg, organismo, nit)
    };
  }

  /* SEED construido AFTER mkSeed está definido. Las 12 filas raw como tuplas. */
  var SEED_TRAMITES_RAW = [
    ['IVC-2026-001', 'liga',       'Otorgamiento',  'Liga de Atletismo de Bolívar',        '800.245.678-3', '2026-05-21', 15, 'No asignada'],
    ['IVC-2026-002', 'liga',       'Renovación',    'Liga de Voleibol de Cundinamarca',    '800.456.789-1', '2026-05-20', 12, 'No asignada'],
    ['IVC-2026-003', 'asociacion', 'Otorgamiento',  'Asociación de Patinaje del Valle',    '901.234.567-2', '2026-05-19',  3, 'Asignada',      'cp-001'],
    ['IVC-2026-004', 'liga',       'Actualización', 'Liga de Natación del Atlántico',      '800.789.012-4', '2026-05-19', -2, 'No asignada'],
    ['IVC-2026-005', 'liga',       'Otorgamiento',  'Liga de Tenis de Mesa de Antioquia',  '811.345.678-9', '2026-05-18', 18, 'En validación','mg-002'],
    ['IVC-2026-006', 'liga',       'Renovación',    'Liga de Ciclismo de Boyacá',          '900.567.890-5', '2026-05-18',  5, 'Asignada',      'al-003'],
    ['IVC-2026-007', 'asociacion', 'Otorgamiento',  'Asociación de Taekwondo de Caldas',   '901.456.789-3', '2026-05-17', -5, 'No asignada'],
    ['IVC-2026-008', 'liga',       'Otorgamiento',  'Liga de Fútbol de Sala del Tolima',   '800.234.567-8', '2026-05-17', 20, 'En validación','lr-004'],
    ['IVC-2026-009', 'liga',       'Renovación',    'Liga de Karate del Quindío',          '900.123.456-7', '2026-05-15',  2, 'Asignada',      'cp-001'],
    ['IVC-2026-010', 'liga',       'Otorgamiento',  'Liga de Baloncesto de Risaralda',     '800.345.678-2', '2026-05-14', 10, 'No asignada'],
    ['IVC-2026-011', 'asociacion', 'Otorgamiento',  'Asociación de Esgrima del Meta',      '901.789.012-1', '2026-05-13',  4, 'En validación','mg-002'],
    ['IVC-2026-012', 'federacion', 'Renovación',    'Federación Colombiana de Atletismo',  '900.987.654-3', '2026-05-12', 25, 'No asignada']
  ];

  function buildSeed() {
    return {
      seedVersion: SEED_VERSION,
      ultimoRadicado: 12,
      mode: 'demo',
      profesionales: JSON.parse(JSON.stringify(PROFESIONALES)),
      tramites: SEED_TRAMITES_RAW.map(function (row) { return mkSeed.apply(null, row); })
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
        s = buildSeed();                         /* deep clone construido */
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
          profesionales: JSON.parse(JSON.stringify(PROFESIONALES)),  /* profesionales sí, los necesita el Coordinador */
          tramites: [],
          mode: 'blank'
        };
      } else {
        s = buildSeed();
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
