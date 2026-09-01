// ================= FORMATO ACTA "ATENCIÓN EN TERRENO" PDF =================

function generarContenidoAtencion(data) {

  const val = (v) => (v && String(v).trim()) ? v : '';

  // Caja de check simple (Sí/No) para "Origen" y "Conformidad"
  const box = (activo) => activo
    ? '<span class="at-chk-box at-chk-checked">✓</span>'
    : '<span class="at-chk-box"></span>';

  // Celda C / P / NA para la tabla de Ejecución
  const cell = (valorItem, letra) => (valorItem === letra)
    ? '<span class="at-chk-box at-chk-checked">✓</span>'
    : '<span class="at-chk-box"></span>';

  const execRow = (codigo, texto, valorItem) => `
    <tr>
      <td class="at-code">${codigo}</td>
      <td>${texto}</td>
      <td class="at-c">${cell(valorItem, 'C')}</td>
      <td class="at-c">${cell(valorItem, 'P')}</td>
      <td class="at-c">${cell(valorItem, 'NA')}</td>
    </tr>`;

  const FILAS_MIN_PENDIENTES = 6;

  const filaPendienteVacia = () => `
      <tr class="at-pend-row">
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>`;

  const filasConDatos = (Array.isArray(data.pendientes) ? data.pendientes : [])
    .map(p => `
      <tr class="at-pend-row">
        <td>${val(p.item)}</td>
        <td>${val(p.clasificacion)}</td>
        <td>${val(p.causa)}</td>
        <td>${val(p.informado)}</td>
        <td>${val(p.hora)}</td>
      </tr>`).join('');

  const filasFaltantes = Math.max(0, FILAS_MIN_PENDIENTES - (Array.isArray(data.pendientes) ? data.pendientes.length : 0));
  const pendientesRows = filasConDatos + Array.from({ length: filasFaltantes }, filaPendienteVacia).join('');

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .at-body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #111; line-height: 1.4; background: white; }
      .at-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; padding-bottom: 10px; }
      .at-logo-block { font-size: 10px; color: #444; line-height: 1.35; min-width: 120px; }
      .at-logo-block strong { display:block; font-size: 11px; color:#111; }
      .at-title-block { text-align: center; flex: 1; padding: 0 20px; }
      .at-title-block h1 { font-size: 18px; font-weight: bold; color: #111; margin-bottom: 4px; }
      .at-side-block { font-size: 9.5px; color: #444; text-align:right; line-height:1.4; min-width:120px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 0; font-size: 11px; }
      table td, table th { padding: 4px 7px; border: 1px solid #ccc; vertical-align: top; }
      table th { background: #f0f0f0; font-weight: bold; font-size: 11px; }
      .section-header td { background: #555; color:#fff; font-weight: bold; font-size: 11px; padding: 4px 7px; }
      .lc { color: #333; width: 18%; white-space: nowrap; }
      .spacer { height: 10px; }
      .at-note { font-size: 9.5px; color: #555; font-style: italic; margin: 4px 0 8px; }

      .at-chk-box {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 1px solid #333;
        background: #fff;
        color: #111;
        line-height: 10px;
        font-size: 9px;
        font-weight: bold;
        text-align: center;
      }
      .at-chk-box.at-chk-checked { background: #eef6ee; }

      .at-exec-table td.at-code { width: 26px; font-weight: bold; text-align:center; }
      .at-exec-table td.at-c { width: 30px; text-align: center; }
      .at-exec-table .group-title td { background: #e8e8e8; font-weight: bold; font-style: italic; }

      .at-legend { font-size: 10px; color: #333; margin: 6px 0; }
      .at-legend b { margin-right: 4px; }

      .at-pend-row td {
        height: 32px;
        font-size: 11px;
        vertical-align: top;
      }

      .at-horas-row td {
        height: 46px;
        font-size: 13px;
        text-align: center;
        vertical-align: middle;
      }

      .firma-area { height: 70px; padding: 4px 7px; vertical-align: middle; }
      .firma-area img { width: 150px; height: 55px; object-fit: contain; object-position: left center; display: block; }
      .at-footer { text-align: center; font-size: 10px; color: #888; margin-top: 14px; padding-top: 8px; border-top: 1px solid #ccc; }
      .obs-box { border: 1px solid #ccc; padding: 6px 8px; min-height: 70px; white-space: pre-wrap; font-size: 11px; background: #fafafa; }
      .page-break { page-break-before: always; break-before: page; }
    </style>

    <div class="at-body">

      <!-- CABECERA -->
      <div class="at-top">
        <div class="at-logo-block">
          <img src="data:image/png;base64,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" alt="HP" style="width:34px;height:34px;object-fit:contain;display:block;margin-bottom:4px;">
          <strong>HP Proyecto MINSAL 2026</strong>
          Chile
        </div>
        <div class="at-title-block">
          <h1>Atención en Terreno</h1>
        </div>
        <div class="at-side-block">
          Mesa de Ayuda HP / MINSAL<br>Atención en terreno
        </div>
      </div>

      <!-- 1. DATOS GENERALES -->
      <table>
        <tr class="section-header"><td colspan="4"><strong>1. Datos generales</strong></td></tr>
        <tr>
          <td class="lc">N°Ticket</td>
          <td>${val(data.ticket)}</td>
          <td class="lc">Fecha</td>
          <td>${val(data.fecha)}</td>
        </tr>
        <tr>
          <td class="lc">Organismo</td>
          <td colspan="3"><strong>${val(data.organismo)}</strong></td>
        </tr>
        <tr>
          <td class="lc">Establecimiento</td>
          <td>${val(data.establecimiento)}</td>
          <td class="lc">Unidad o Depto</td>
          <td>${val(data.unidad)}</td>
        </tr>
        <tr>
          <td class="lc">Dirección</td>
          <td>${val(data.direccion)}</td>
          <td class="lc">Comuna / Ciudad</td>
          <td>${val(data.ciudad)}</td>
        </tr>
        <tr>
          <td class="lc">Región</td>
          <td>${val(data.region)}</td>
          <td class="lc">Teléfono</td>
          <td>${val(data.telefono)}</td>
        </tr>
        <tr>
          <td class="lc">Responsable</td>
          <td>${val(data.responsable)}</td>
          <td class="lc">RUT</td>
          <td>${val(data.rutResponsable)}</td>
        </tr>
        <tr>
          <td class="lc">Cargo usuario</td>
          <td>${val(data.cargoUsuario)}</td>
          <td class="lc">Email usuario</td>
          <td>${val(data.emailUsuario)}</td>
        </tr>
        <tr>
          <td class="lc">Tipo de atención</td>
          <td colspan="3">
            ${box(data.tipoAtencion === 'Soporte sin cambio de equipo')} Soporte sin cambio de equipo
            &nbsp;&nbsp;&nbsp;
            ${box(data.tipoAtencion === 'Cambio de equipo (SCO)')} Cambio de equipo (SCO)
          </td>
        </tr>
        <tr>
          <td class="lc">Serie del equipo / entrante</td>
          <td>${val(data.serieEntrante)}</td>
          <td class="lc">Serie saliente</td>
          <td>${val(data.serieSaliente)}</td>
        </tr>
        <tr>
          <td class="lc">Modelo del equipo</td>
          <td colspan="3">${val(data.modeloEquipo)}</td>
        </tr>
      </table>

      <div class="spacer"></div>

      <!-- 2. HORAS -->
      <table>
        <tr class="section-header"><td colspan="3"><strong>2. Horas</strong> · se anotan en el momento, no al final</td></tr>
        <tr>
          <th>Llegada</th>
          <th>Inicio de trabajos</th>
          <th>Solución definitiva</th>
        </tr>
        <tr class="at-horas-row">
          <td>${val(data.horaLlegada)}</td>
          <td>${val(data.horaInicio)}</td>
          <td>${val(data.horaSolucion)}</td>
        </tr>
      </table>

      <div class="spacer"></div>

      <!-- 3. DIAGNÓSTICO Y ALCANCE -->
      <table>
        <tr class="section-header"><td colspan="2"><strong>3. Diagnóstico y alcance</strong> · se define en sitio, con el usuario presente</td></tr>
        <tr>
          <td class="lc">Falla y diagnóstico</td>
          <td>${val(data.fallaDiagnostico)}</td>
        </tr>
        <tr>
          <td class="lc">Origen</td>
          <td>
            ${val(data.origen)} ${data.origen ? `<span style="font-size:11px;color:#666;">(${data.conSla ? 'Con SLA' : 'Sin SLA'})</span>` : ''}
          </td>
        </tr>
        <tr>
          <td class="lc">Resuelve</td>
          <td>
            ${box(data.resuelve === 'MDA')} MDA &nbsp;&nbsp;
            ${box(data.resuelve === 'Se deriva a MINSAL')} Se deriva a MINSAL — resolutor: ${val(data.resolutorNombre)} &nbsp; hora: ${val(data.resolutorHora)}
          </td>
        </tr>
      </table>
      <div class="at-legend">
        <b>C</b> Conforme, el usuario lo verificó &nbsp;&nbsp; <b>P</b> Pendiente por el cliente, se detalla en el punto 5 &nbsp;&nbsp; <b>NA</b> No aplica a esta atención
      </div>
      <div class="at-note">Ninguna casilla queda en blanco. Un ítem sin marcar se lee después como «no se hizo».</div>

      <div class="spacer"></div>

      <!-- 4. EJECUCIÓN -->
      <table class="at-exec-table">
        <tr class="section-header"><td colspan="5"><strong>4. Ejecución</strong> · marca cada línea al momento de hacerla</td></tr>
        <tr><th>Ítem</th><th>Actividad</th><th>C</th><th>P</th><th>NA</th></tr>
        <tr class="group-title"><td colspan="5">A · Instalación física — solo si hay cambio de equipo</td></tr>
        ${execRow('A1', 'Desembalaje, revisión e instalación física del equipo', data.items.A1)}
        ${execRow('A2', 'Instalación de PC y conexión de componentes básicos (mouse, teclado y torre)', data.items.A2)}
        ${execRow('A3', 'Verificación de conexión adecuada a la toma de corriente', data.items.A3)}
        ${execRow('A4', 'Instalación y configuración de periféricos adicionales (escáner, impresora, etc.)', data.items.A4)}
        ${execRow('A5', 'Verificación de Etiqueta de rotulado: ID del equipo y contacto de mesa de ayuda', data.items.A5)}
        <tr class="group-title"><td colspan="5">B · Configuración — según corresponda a la atención</td></tr>
        ${execRow('B1', 'Configuración y conexión a red de datos', data.items.B1)}
        ${execRow('B2', 'Configuración IP del equipo (en caso de IP estática)', data.items.B2)}
        ${execRow('B3', 'Definición y configuración del servicio de impresión', data.items.B3)}
        ${execRow('B4', 'Configuración de correo electrónico del usuario', data.items.B4)}
        ${execRow('B5', 'Habilitación cuenta Office 365', data.items.B5)}
        <tr class="group-title"><td colspan="5">C · Seguridad — toda atención, sin excepción</td></tr>
        ${execRow('C1', 'Verificación de agente EDR en línea con mesa de ayuda', data.items.C1)}
        <tr class="group-title"><td colspan="5">D · Usuario — toda atención</td></tr>
        ${execRow('D1', 'Demostración de operación de hardware y software instalados', data.items.D1)}
        ${execRow('D3', 'El usuario probó y confirmó que el problema quedó resuelto', data.items.D3)}
        <tr class="group-title"><td colspan="5">E · Validación — se deja registrado en el reporte de diagnóstico</td></tr>
        ${execRow('E1', 'Número de identificación del equipo', data.items.E1)}
        ${execRow('E2', 'Características de configuración', data.items.E2)}
        ${execRow('E3', 'Detalle de diagnósticos realizados', data.items.E3)}
        ${execRow('E4', 'Niveles de BIOS y firmware', data.items.E4)}
        ${execRow('E5', 'Revisión del sistema operativo y software instalados', data.items.E5)}
        ${execRow('E6', 'Modelos y números de serie de equipo', data.items.E6)}
      </table>

      <div class="spacer"></div>

      <!-- 5. PENDIENTES Y DERIVACIONES -->
      <table>
        <tr class="section-header"><td colspan="5"><strong>5. Pendientes y derivaciones</strong> · toda línea marcada P se detalla aquí</td></tr>
        <tr><th>Ítem</th><th>Clasificación</th><th>Causa exacta</th><th>Informado por / derivado a</th><th>Hora</th></tr>
        ${pendientesRows}
      </table>
      <div class="at-note">Ejemplo: «B5 · Office 365 no habilitable: la cuenta no tiene licencia asignada por MINSAL · informado por [nombre, cargo] · 11:40».</div>

      <div class="spacer"></div>

      <!-- 6. OBSERVACIONES DEL TÉCNICO -->
      <table>
        <tr class="section-header"><td><strong>6. Observaciones del técnico</strong></td></tr>
        <tr><td><div class="obs-box">${val(data.observacionesTecnico)}</div></td></tr>
      </table>

      <div class="spacer"></div>

      <!-- 7. CONFORMIDAD -->
      <table>
        <tr class="section-header"><td colspan="2"><strong>7. Conformidad</strong></td></tr>
        <tr>
          <td colspan="2">
            ${box(data.ticketCerrado)} Ticket cerrado &nbsp;&nbsp;&nbsp;
            ${box(data.reporteAdjunto)} Reporte de diagnóstico adjunto al ticket.
          </td>
        </tr>
      </table>

      <div class="spacer"></div>

      <table>
        <tr class="section-header"><td colspan="2"><strong>Técnico</strong></td><td class="section-header" colspan="2"><strong>Usuario o referente</strong></td></tr>
        <tr>
          <td class="lc">Nombre</td>
          <td>${val(data.tecnicoNombre)}</td>
          <td class="lc">Nombre</td>
          <td>${val(data.referenteNombre)}</td>
        </tr>
        <tr>
          <td class="lc">RUT</td>
          <td>${val(data.tecnicoRut)}</td>
          <td class="lc">RUT</td>
          <td>${val(data.referenteRut)}</td>
        </tr>
        <tr>
          <td class="lc">&nbsp;</td>
          <td>&nbsp;</td>
          <td class="lc">Cargo</td>
          <td>${val(data.referenteCargo)}</td>
        </tr>
        <tr>
          <td class="lc">Firma</td>
          <td class="firma-area">${data.firmaTecnico ? `<img src="${data.firmaTecnico}" alt="firma técnico">` : ''}</td>
          <td class="lc">Firma</td>
          <td class="firma-area">${data.firmaReferente ? `<img src="${data.firmaReferente}" alt="firma referente">` : ''}</td>
        </tr>
      </table>
      
      ${data.motivoFirma ? `
      <div style="margin-top:12px; padding:12px; background-color:#fff8e1; border:1px solid #ffc107; border-radius:4px;">
        <strong>Motivo por el que firma el referente (SCO):</strong>
        <p style="margin:8px 0 0 0; line-height:1.5;">${val(data.motivoFirma)}</p>
      </div>
      ` : ''}
      
      <div class="at-note">El técnico no se retira sin firma y timbre. Si el usuario no firma, se anota el motivo y firma el referente del establecimiento como testigo.</div>

      <!-- PIE -->
      <div class="at-footer">
        Ministerio de Salud — Chile &nbsp;|&nbsp; Proyecto MINSAL 2026 &nbsp;|&nbsp; Mesa de Ayuda HP / MINSAL
      </div>

    </div><!-- /at-body -->
    `;
}