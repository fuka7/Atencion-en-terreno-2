document.addEventListener("DOMContentLoaded", function () {

// ================= ALERTA PERSONALIZADA (reemplazo de alert() nativo) =================
// Muestra un toast con el estilo visual de la app en vez del alert() del
// navegador. Uso: mostrarAlerta('mensaje') o mostrarAlerta('mensaje', 'warning'|'success').

const ICONOS_TOAST = {
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L22 20 L2 20 Z"></path><line x1="12" y1="9" x2="12" y2="14"></line><line x1="12" y1="17" x2="12" y2="17.01"></line></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};

const TITULOS_TOAST = {
    error: 'Falta completar',
    warning: 'Atención',
    success: 'Listo'
};

function obtenerCapaToast() {
    let capa = document.getElementById('appToastLayer');
    if (!capa) {
        capa = document.createElement('div');
        capa.id = 'appToastLayer';
        capa.className = 'app-toast-layer';
        document.body.appendChild(capa);
    }
    return capa;
}

window.mostrarAlerta = function (mensaje, tipo) {
    tipo = tipo === 'warning' || tipo === 'success' ? tipo : 'error';
    const capa = obtenerCapaToast();

    const toast = document.createElement('div');
    toast.className = 'app-toast app-toast--' + tipo;
    toast.innerHTML =
        '<div class="app-toast-icon">' + ICONOS_TOAST[tipo] + '</div>' +
        '<div class="app-toast-body">' +
            '<div class="app-toast-title">' + TITULOS_TOAST[tipo] + '</div>' +
            '<div class="app-toast-message"></div>' +
        '</div>' +
        '<button type="button" class="app-toast-close" aria-label="Cerrar">×</button>';
    toast.querySelector('.app-toast-message').textContent = mensaje;

    capa.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('app-toast--show'));

    let cerrado = false;
    const cerrar = () => {
        if (cerrado) return;
        cerrado = true;
        toast.classList.remove('app-toast--show');
        toast.classList.add('app-toast--hide');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.app-toast-close').addEventListener('click', cerrar);
    setTimeout(cerrar, 6000);
};

// ================= UNIDADES / DEPARTAMENTOS =================

const unidadesSalud = [
    "Urgencia",
    "Urgencia Pediátrica",
    "Unidad de Cuidados Intensivos (UCI)",
    "Unidad de Cuidados Intermedios (UCIM)",
    "Hospitalización General",
    "Hospitalización Pediátrica",
    "Maternidad",
    "Cirugía",
    "Medicina Interna",
    "Cardiología",
    "Neurología",
    "Oftalmología",
    "Otorrinolaringología",
    "Pediatría",
    "Ginecología",
    "Urología",
    "Traumatología",
    "Oncología",
    "Psiquiatría",
    "Farmacia",
    "Laboratorio",
    "Imagenología",
    "Central de Esterilización",
    "Administración",
    "Dirección",
    "Recursos Humanos",
    "Finanzas",
    "Informática / TI",
    "Mantenimiento"
];

const unidadSelect = document.getElementById("unidad");

// Limpiar TODAS las opciones y empezar de cero
unidadSelect.innerHTML = '';

// Agregar opción placeholder
const optionPlaceholder = document.createElement("option");
optionPlaceholder.value = '';
optionPlaceholder.textContent = 'Seleccione Unidad / Depto';
optionPlaceholder.disabled = false;
unidadSelect.appendChild(optionPlaceholder);

// Inicializar unidades al cargar (SIN sort para mantener orden lógico)
unidadesSalud.forEach(unidad => {
    const option = document.createElement("option");
    option.value = unidad;
    option.textContent = unidad;
    unidadSelect.appendChild(option);
});

const organismoSelect = document.getElementById("organismo");
const regionSelect    = document.getElementById("region");
const ciudadSelect    = document.getElementById("ciudad");

Object.keys(regionesComunas).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
});

regionSelect.addEventListener("change", function () {
    ciudadSelect.innerHTML = '<option value="">Seleccione Comuna / Ciudad</option>';
    const comunas = regionesComunas[this.value];
    if (comunas) {
        comunas.forEach(comuna => {
            const option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            ciudadSelect.appendChild(option);
        });
    }
});

serviciosSalud.sort();
seremisSalud.sort();

const grupoMinsal = document.createElement("optgroup");
grupoMinsal.label = "MINSAL";
minsalCentral.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    grupoMinsal.appendChild(option);
});

const grupoServicios = document.createElement("optgroup");
grupoServicios.label = "Servicios de Salud";
serviciosSalud.forEach(servicio => {
    const option = document.createElement("option");
    option.value = servicio;
    option.textContent = servicio;
    grupoServicios.appendChild(option);
});

const grupoSeremi = document.createElement("optgroup");
grupoSeremi.label = "SEREMI de Salud";
seremisSalud.forEach(seremi => {
    const option = document.createElement("option");
    option.value = seremi;
    option.textContent = seremi;
    grupoSeremi.appendChild(option);
});

organismoSelect.appendChild(grupoMinsal);
organismoSelect.appendChild(grupoServicios);
organismoSelect.appendChild(grupoSeremi);

organismoSelect.addEventListener("change", function () {
    const region = organismoRegionMap[this.value];
    if (region) {
        regionSelect.value = region;
        regionSelect.disabled = true;
        regionSelect.style.opacity = '0.65';
        regionSelect.style.cursor = 'not-allowed';
        regionSelect.dispatchEvent(new Event("change"));
        ciudadSelect.value = "";
    } else {
        regionSelect.disabled = false;
        regionSelect.style.opacity = '';
        regionSelect.style.cursor = '';
    }
});


// ================= TIPO DE ATENCIÓN → HABILITA/DESHABILITA GRUPO A =================

const tipoSoporte = document.getElementById("tipoSoporte");
const tipoSCO     = document.getElementById("tipoSCO");
const grupoA      = document.getElementById("grupoA");

function actualizarGrupoA() {
    const esSoporte = tipoSoporte.checked;
    grupoA.classList.toggle('disabled-group', esSoporte);
    const radiosA = grupoA.querySelectorAll('input[type="radio"]');
    radiosA.forEach(r => { r.disabled = esSoporte; });
    
    if (esSoporte) {
        // Si es SOPORTE: marcar NA en todos los items
        ['A1','A2','A3','A4','A5'].forEach(codigo => {
            const na = grupoA.querySelector(`input[name="item_${codigo}"][value="NA"]`);
            if (na && !na.checked) {
                na.checked = true;
                grupoA.querySelectorAll(`input[name="item_${codigo}"]`).forEach(r => {
                    r.dataset.eraChecked = (r === na) ? 'true' : 'false';
                });
                eliminarPendientePorCodigoItem(codigo);
            }
        });
    } else {
        // Si es SCO: desmarcar NA (dejar sin seleccionar)
        ['A1','A2','A3','A4','A5'].forEach(codigo => {
            grupoA.querySelectorAll(`input[name="item_${codigo}"]`).forEach(r => {
                r.checked = false;
                r.disabled = false;
            });
        });
    }
}
tipoSoporte.addEventListener('change', actualizarGrupoA);
tipoSCO.addEventListener('change', actualizarGrupoA);

// Inicializar estado al cargar (por si Chrome restaura el radio "Soporte" marcado tras F5 sin disparar 'change')
actualizarGrupoA();


// ================= RESUELVE → HABILITA CAMPOS DE DERIVACIÓN =================

const resuelveMDA    = document.getElementById("resuelveMDA");
const resuelveMinsal = document.getElementById("resuelveMinsal");
const resolutorNombre = document.getElementById("resolutorNombre");
const resolutorHora   = document.getElementById("resolutorHora");

function actualizarResuelve() {
    const derivaMinsal = resuelveMinsal.checked;
    resolutorNombre.disabled = !derivaMinsal;
    resolutorHora.disabled   = !derivaMinsal;
    if (!derivaMinsal) { resolutorNombre.value = ''; resolutorHora.value = ''; }
}
resuelveMDA.addEventListener('change', actualizarResuelve);
resuelveMinsal.addEventListener('change', actualizarResuelve);


// ================= DEV-03: ROL DEL FIRMANTE Y VISIBILIDAD ENCADENADA =================
// El selector de rol (quienFirmaBox) aparece con SCO; el motivo aparece solo
// si además el rol elegido es "referente" (el usuario dueño del equipo no
// firmó y alguien más lo hizo en su lugar).

const esSCO = () => {
    const el = document.querySelector('input[name="tipoAtencion"]:checked');
    return !!el && el.value === 'Cambio de equipo (SCO)';
};

const getQuienFirma = () => {
    const el = document.querySelector('input[name="quienFirma"]:checked');
    return el ? el.value : '';
};

function actualizarVisibilidadMotivo() {
    const sco = esSCO();
    document.getElementById('quienFirmaBox').style.display = sco ? 'flex' : 'none';

    const mostrarMotivo = sco && getQuienFirma() === 'referente';
    document.getElementById('motivoExcepcionBox').style.display = mostrarMotivo ? 'block' : 'none';
    if (!mostrarMotivo) document.getElementById('motivoFirma').value = '';

    if (!sco) {
        document.querySelectorAll('input[name="quienFirma"]').forEach(r => r.checked = false);
    }
}
document.querySelectorAll('input[name="tipoAtencion"], input[name="quienFirma"]')
    .forEach(r => r.addEventListener('change', actualizarVisibilidadMotivo));

// Inicializar estado al cargar
actualizarVisibilidadMotivo();


// ================= DEV-03: VALIDACIÓN ÚNICA DE FIRMA SCO =================
// Reutilizable en los dos puntos de control (Ticket cerrado y Generar PDF),
// para que la regla de negocio viva en un único lugar.
// Devuelve null si está OK; si no, { foco, mensaje }.
function validarFirmaSCO() {
    if (!esSCO()) return null; // Soporte sin cambio de equipo: sin restricción

    const quien = getQuienFirma();
    if (!quien) {
        return {
            foco: 'quienFirmaBox',
            mensaje: 'Cambio de Equipo (SCO): indique quién firma el acta, ' +
                     'el usuario dueño del equipo o el referente del establecimiento.'
        };
    }
    if (capturarFirma('firmaReferente') === '') {
        return {
            foco: 'firmaReferente',
            mensaje: 'Cambio de Equipo (SCO): falta la firma de conformidad.'
        };
    }
    if (quien === 'referente' && !document.getElementById('motivoFirma').value.trim()) {
        return {
            foco: 'motivoExcepcionBox',
            mensaje: 'Cambio de Equipo (SCO): si el referente firma en lugar ' +
                     'del usuario dueño del equipo, debe indicar el motivo.'
        };
    }
    return null;
}

// Punto de control 1: al marcar "Ticket cerrado" (bloqueo duro, mismo patrón
// ya usado en el resto del formulario: alert + scrollIntoView + revertir).
document.getElementById('ticketCerrado').addEventListener('change', function () {
    if (!this.checked) return;
    const falla = validarFirmaSCO();
    if (falla) {
        this.checked = false;
        mostrarAlerta(falla.mensaje);
        document.getElementById(falla.foco).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});


// ================= DEV-ADICIONAL: MOSTRAR/OCULTAR SERIES SEGÚN TIPO ATENCIÓN =================

function actualizarVisibilidadSeries() {
    const tipoAtencionEl = document.querySelector('input[name="tipoAtencion"]:checked');
    const seriesSoporteDiv = document.getElementById('seriesSoporte');
    const seriesSCODiv = document.getElementById('seriesSCO');
    
    if (tipoAtencionEl && tipoAtencionEl.value === 'Soporte sin cambio de equipo') {
        // Mostrar solo serie de Soporte
        seriesSoporteDiv.style.display = 'grid';
        seriesSCODiv.style.display = 'none';
        // Limpiar valores de SCO
        document.getElementById('serieEntrante').value = '';
        document.getElementById('serieSaliente').value = '';
        document.getElementById('modeloEquipo').value = '';
    } else if (tipoAtencionEl && tipoAtencionEl.value === 'Cambio de equipo (SCO)') {
        // Mostrar ambas series (SCO)
        seriesSoporteDiv.style.display = 'none';
        seriesSCODiv.style.display = 'grid';
        // Limpiar valor de Soporte
        document.getElementById('serieSoporteEquipo').value = '';
        document.getElementById('modeloEquipoSoporte').value = '';
    } else {
        // Por defecto, mostrar SCO (como está ahora)
        seriesSoporteDiv.style.display = 'none';
        seriesSCODiv.style.display = 'grid';
    }
}

// Listeners para cambios en tipo de atención
tipoSoporte.addEventListener('change', actualizarVisibilidadSeries);
tipoSCO.addEventListener('change', actualizarVisibilidadSeries);

// Inicializar estado al cargar
actualizarVisibilidadSeries();


// ================= TABLA DE PENDIENTES Y DERIVACIONES =================

const pendientesBody  = document.getElementById("pendientesBody");
const pendientesVacio = document.getElementById("pendientesVacio");

function actualizarVisibilidadPendientes() {
    pendientesVacio.style.display = pendientesBody.children.length ? 'none' : 'block';
}

// Elimina (si existe) la fila de la tabla de pendientes asociada a un código de ítem (ej. "E1")
function eliminarPendientePorCodigoItem(codigo) {
    if (!codigo) return;
    const fila = Array.from(pendientesBody.querySelectorAll('tr')).find(tr => {
        const val = tr.querySelector('.pend-item')?.value.trim().toUpperCase();
        return val === codigo;
    });
    if (fila) {
        fila.remove();
        actualizarVisibilidadPendientes();
    }
}

// Desmarca (si está marcado) el radio "P" de un ítem del checklist (sección 4)
function desmarcarRadioP(codigo) {
    if (!codigo) return;
    const radioP = document.querySelector(`input[name="item_${codigo}"][value="P"]`);
    if (radioP && radioP.checked) {
        radioP.checked = false;
        radioP.dataset.eraChecked = 'false';
    }
}

function agregarPendiente(itemPrefill) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="col-item"><input type="text" class="pend-item" value="${itemPrefill || ''}" placeholder="Ítem"></td>
        <td class="col-clasificacion">
            <div class="clasif-select" data-value="">
                <button type="button" class="clasif-btn clasif-btn-placeholder">Seleccione</button>
                <div class="clasif-menu">
                    <div class="clasif-option" data-value="Usuario no disponible / se retiró">Usuario no disponible / se retiró</div>
                    <div class="clasif-option" data-value="Establecimiento cerrado">Establecimiento cerrado</div>
                    <div class="clasif-option" data-value="Falta de stock (HP)">Falta de stock (HP)</div>
                    <div class="clasif-option" data-value="Falla de enlace / red MINSAL">Falla de enlace / red MINSAL</div>
                    <div class="clasif-option" data-value="Otro">Otro (usar texto libre)</div>
                </div>
            </div>
        </td>
        <td><textarea class="pend-causa" rows="1" placeholder="Causa exacta"></textarea></td>
        <td><textarea class="pend-informado" rows="1" placeholder="Informado por / derivado a"></textarea></td>
        <td class="col-hora"><input type="time" class="pend-hora"></td>
        <td class="col-remove"><button type="button" class="btn-remove-row" title="Eliminar fila">✕</button></td>
    `;
    row.querySelector('.btn-remove-row').addEventListener('click', () => {
        const codigoItem = row.querySelector('.pend-item')?.value.trim().toUpperCase();
        desmarcarRadioP(codigoItem);
        row.remove();
        actualizarVisibilidadPendientes();
    });
    pendientesBody.appendChild(row);
    actualizarVisibilidadPendientes();
    return row;
}

document.getElementById("btnAddPendiente").addEventListener('click', () => agregarPendiente(''));

// ===== Menú desplegable propio de "Clasificación" (permite texto en varias líneas) =====
// Se posiciona con "position: fixed" calculado por JS (no "absolute" dentro de la tabla),
// para que no quede atrapado por el scroll interno de .pendientes-table-wrap.
function posicionarMenuClasif(wrapper) {
    const btn  = wrapper.querySelector('.clasif-btn');
    const menu = wrapper.querySelector('.clasif-menu');
    const rect = btn.getBoundingClientRect();
    const anchoMenu = Math.max(rect.width, 210);
    menu.style.left  = rect.left + 'px';
    menu.style.width = anchoMenu + 'px';

    const espacioAbajo = window.innerHeight - rect.bottom;
    const espacioArriba = rect.top;
    if (espacioAbajo < 160 && espacioArriba > espacioAbajo) {
        // No cabe hacia abajo: se despliega hacia arriba del campo
        menu.style.top = 'auto';
        menu.style.bottom = (window.innerHeight - rect.top + 2) + 'px';
    } else {
        menu.style.bottom = 'auto';
        menu.style.top = (rect.bottom + 2) + 'px';
    }
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.clasif-btn');
    if (btn) {
        const wrapper = btn.closest('.clasif-select');
        const yaAbierto = wrapper.classList.contains('open');
        document.querySelectorAll('.clasif-select.open').forEach(w => w.classList.remove('open'));
        if (!yaAbierto) {
            posicionarMenuClasif(wrapper);
            wrapper.classList.add('open');
        }
        return;
    }
    const opcion = e.target.closest('.clasif-option');
    if (opcion) {
        const wrapper = opcion.closest('.clasif-select');
        const boton = wrapper.querySelector('.clasif-btn');
        wrapper.dataset.value = opcion.dataset.value;
        boton.textContent = opcion.textContent;
        boton.classList.remove('clasif-btn-placeholder');
        wrapper.classList.remove('open');

        // Placeholder de referencia para el caso recurrente de activación de Office.
        const fila = wrapper.closest('tr');
        const causaTextarea = fila ? fila.querySelector('.pend-causa') : null;
        if (causaTextarea) {
            causaTextarea.placeholder = (opcion.dataset.value === 'Usuario no disponible / se retiró')
                ? 'Ej: Usuario se retiró antes de completar activación de Office; debe finalizarla con su técnico interno.'
                : 'Causa exacta';
        }
        return;
    }
    document.querySelectorAll('.clasif-select.open').forEach(w => w.classList.remove('open'));
});

// Cierra el menú si la página o la tabla se desplazan, para no dejarlo mal posicionado
document.addEventListener('scroll', function () {
    document.querySelectorAll('.clasif-select.open').forEach(w => w.classList.remove('open'));
}, true);
window.addEventListener('resize', function () {
    document.querySelectorAll('.clasif-select.open').forEach(w => w.classList.remove('open'));
});

// Al marcar "P" en cualquier ítem del checklist, se agrega automáticamente una fila
// de pendiente con el código del ítem prellenado (si aún no existe una fila para ese ítem).
// Además: permite desmarcar C/P/NA volviendo a hacer clic en la opción ya marcada, y si
// se cambia de P a C/NA, elimina automáticamente la fila de pendientes asociada.
document.querySelectorAll('.exec-row').forEach(row => {
    const codigo = row.getAttribute('data-item');
    const radios = row.querySelectorAll(`input[name="item_${codigo}"]`);

    radios.forEach(radio => {
        // Click: si el radio ya estaba marcado, se desmarca (toggle off)
        radio.addEventListener('click', function () {
            if (this.dataset.eraChecked === 'true') {
                this.checked = false;
                this.dataset.eraChecked = 'false';
                if (this.value === 'P') {
                    eliminarPendientePorCodigoItem(codigo);
                }
            }
        });

        // Change: se dispara solo cuando realmente cambió la selección del grupo
        radio.addEventListener('change', function () {
            radios.forEach(r => { r.dataset.eraChecked = (r === this) ? 'true' : 'false'; });

            if (this.value === 'P') {
                const yaExiste = Array.from(pendientesBody.querySelectorAll('.pend-item'))
                    .some(inp => inp.value.trim().toUpperCase() === codigo);
                if (!yaExiste) {
                    const nuevaFila = agregarPendiente(codigo);
                    const clasifBtn = nuevaFila.querySelector('.clasif-btn');
                    if (clasifBtn) {
                        // Pequeño delay para asegurar que la fila ya esté renderizada.
                        // Ya no se abre el menú automáticamente (se veía mal montado sobre
                        // el contenido); en vez de eso se hace scroll hasta la fila y se
                        // deja el botón resaltado (ver .clasif-btn-placeholder en el CSS)
                        // para que quede claro que hay que hacer clic para elegir.
                        setTimeout(() => {
                            nuevaFila.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            clasifBtn.focus();
                        }, 50);
                    }
                }
            } else {
                // Se cambió a C o NA: si había una fila de pendiente para este ítem, se elimina
                eliminarPendientePorCodigoItem(codigo);
            }
        });
    });
});

actualizarVisibilidadPendientes();


// ================= FIRMA DIGITAL (doble: técnico y referente) =================

const firmasState = {};

function inicializarFirma(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    firmasState[canvasId] = { drawing: false, hasSignature: false, ctx };

    function applyCtxStyles() {
        ctx.lineWidth   = 2.5;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.strokeStyle = "#1e2d3d";
    }

    // Guardamos el último tamaño real (CSS) del canvas para poder detectar
    // si un evento "resize" corresponde a un cambio de tamaño genuino
    // (ej. rotar el celular) o es "ruido" causado por el teclado virtual
    // (que en muchos navegadores móviles dispara "resize" en la ventana
    // cada vez que aparece/desaparece, aunque el canvas no cambie de tamaño).
    let lastCanvasWidth  = 0;
    let lastCanvasHeight = 0;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();

        // Si el tamaño visual del canvas no cambió, no hacemos nada.
        // Esto evita que el teclado del celular (al enfocar CUALQUIER
        // campo del formulario, no solo la firma) borre la firma ya
        // dibujada, ya que reasignar canvas.width/height SIEMPRE borra
        // el contenido del canvas, aunque sea al mismo valor.
        if (rect.width === lastCanvasWidth && rect.height === lastCanvasHeight) {
            return;
        }

        // Si el tamaño sí cambió de verdad (ej. rotación de pantalla),
        // guardamos el dibujo actual para restaurarlo después, en vez
        // de perder la firma del usuario.
        const state = firmasState[canvasId];
        const dataUrlPrevio = (state && state.hasSignature) ? canvas.toDataURL() : null;

        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width  = rect.width  * ratio;
        canvas.height = rect.height * ratio;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
        applyCtxStyles();

        lastCanvasWidth  = rect.width;
        lastCanvasHeight = rect.height;

        if (dataUrlPrevio) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
            img.src = dataUrlPrevio;
        }
    }

    window.addEventListener("resize", resizeCanvas);
    requestAnimationFrame(() => requestAnimationFrame(resizeCanvas));

    function getPosition(event) {
        const rect   = canvas.getBoundingClientRect();
        const scaleX = canvas.width  / rect.width  / (window.devicePixelRatio || 1);
        const scaleY = canvas.height / rect.height / (window.devicePixelRatio || 1);
        if (event.touches) {
            return {
                x: (event.touches[0].clientX - rect.left) * scaleX,
                y: (event.touches[0].clientY - rect.top)  * scaleY
            };
        }
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top)  * scaleY
        };
    }

    function startDraw(e) {
        e.preventDefault();
        firmasState[canvasId].drawing = true;
        const pos = getPosition(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        const ph = document.getElementById(canvasId + 'Placeholder');
        if (ph) ph.style.opacity = '0';
    }

    function draw(e) {
        if (!firmasState[canvasId].drawing) return;
        e.preventDefault();
        const pos = getPosition(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        firmasState[canvasId].hasSignature = true;
    }

    function endDraw() { firmasState[canvasId].drawing = false; }

    canvas.addEventListener("mousedown",  startDraw);
    canvas.addEventListener("mousemove",  draw);
    canvas.addEventListener("mouseup",    endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove",  draw,      { passive: false });
    canvas.addEventListener("touchend",   endDraw);
}

window.limpiarFirma = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    const state  = firmasState[canvasId];
    if (!canvas || !state) return;
    state.ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById(canvasId + 'Base64').value = '';
    const ph = document.getElementById(canvasId + 'Placeholder');
    if (ph) ph.style.opacity = '1';
    state.hasSignature = false;
};

function capturarFirma(canvasId) {
    const canvas = document.getElementById(canvasId);
    const state  = firmasState[canvasId];
    if (!canvas || !state || !state.hasSignature) return '';
    return canvas.toDataURL("image/png");
}

inicializarFirma('firmaTecnico');
inicializarFirma('firmaReferente');


// ================= NOMBRE DE ARCHIVO PDF =================

function slugify(texto) {
    return (texto || '')
        .toString()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .trim();
}

function construirNombreArchivo(data) {
    const partes = [];
    if (data.ticket) partes.push('Ticket', slugify(data.ticket));
    if (data.organismo) partes.push(slugify(data.organismo));
    if (partes.length === 0) partes.push('Atencion_en_Terreno');
    return partes.filter(Boolean).join('_') + '.pdf';
}

function esperarImagenes(container) {
    const imgs = Array.from(container.querySelectorAll('img'));
    return Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    }));
}


// ================= BOTÓN "CREAR OTRO REGISTRO" =================

function mostrarBotonNuevaAtencion() {
    const btn = document.getElementById('btnNuevaAtencion');
    if (!btn) return;
    btn.style.display = 'inline-flex';
    btn.onclick = function () {
        resetFormAtencion();
        btn.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetFormAtencion() {
    const form = document.getElementById('registroForm');
    if (form) form.reset();
    pendientesBody.innerHTML = '';
    actualizarVisibilidadPendientes();
    ['firmaTecnico','firmaReferente'].forEach(id => window.limpiarFirma(id));
    actualizarGrupoA();
    actualizarResuelve();
    actualizarVisibilidadMotivo(); // corrige H-4: si venía de un SCO, oculta rol/motivo tras el reset
    Array.from(document.querySelectorAll('#registroForm .input-error, #registroForm .input-valid'))
        .forEach(el => el.classList.remove('input-error', 'input-valid'));
    ['errorRutResponsable','errorEmailUsuario','errorTelefono','errorTecnicoRut','errorReferenteRut']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.textContent = ''; }
        });
}


// ================= GENERAR PDF =================

window.generarPDFAtencion = async function () {
    const g = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
    const checked = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

    const tipoAtencionEl = document.querySelector('input[name="tipoAtencion"]:checked');
    const resuelveEl     = document.querySelector('input[name="resuelve"]:checked');

    // ========== VALIDACIÓN DEV-03: Firma condicionada a tipo de atención ==========
    // Defensa por si se marca "Ticket cerrado" antes de completar los datos:
    // misma regla que valida el checkbox, vía la función única validarFirmaSCO().
    {
        const falla = validarFirmaSCO();
        if (falla) {
            mostrarAlerta(falla.mensaje);
            document.getElementById(falla.foco).scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    }

    // Capturar series según tipo de atención
    let serieEquipo = '';
    let modeloEquipo = '';
    let serieEntrante = '';
    let serieSaliente = '';
    
    if (tipoAtencionEl && tipoAtencionEl.value === 'Soporte sin cambio de equipo') {
        // Soporte: una sola serie
        serieEquipo = g('serieSoporteEquipo');
        modeloEquipo = g('modeloEquipoSoporte');
        serieEntrante = '';
        serieSaliente = '';
    } else {
        // SCO: dos series
        serieEquipo = '';
        modeloEquipo = g('modeloEquipo');
        serieEntrante = g('serieEntrante');
        serieSaliente = g('serieSaliente');
    }
    const origenSelect = document.getElementById('origen');
    const origenValor = origenSelect?.value || '';
    const origenOption = origenSelect?.options[origenSelect.selectedIndex];
    const origenConSla = origenOption?.dataset.sla === 'true' ? true : false;
    
    // Mapeo de valores internos a etiquetas legibles para PDF
    const origenLabels = {
      'equipo_hardware': 'Equipo / hardware',
      'periferico_accesorios': 'Periféricos (teclado, mouse, transformador)',
      'sistema_operativo': 'Sistema operativo',
      'antivirus_software': 'Antivirus / software propio del contrato',
      'red': 'Red',
      'servidor': 'Servidor',
      'aplicaciones_terceros': 'Aplicaciones de terceros',
      'drivers_terceros': 'Drivers de terceros incompatibles'
    };
    
    const origenTexto = origenLabels[origenValor] || '';

    const items = {};
    ['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5','C1','D1','D3','E1','E2','E3','E4','E5','E6'].forEach(codigo => {
        const marcado = document.querySelector(`input[name="item_${codigo}"]:checked`);
        items[codigo] = marcado ? marcado.value : '';
    });

    const pendientes = Array.from(pendientesBody.querySelectorAll('tr')).map(row => ({
        item:           row.querySelector('.pend-item')?.value || '',
        clasificacion:  row.querySelector('.clasif-select')?.dataset.value || '',
        causa:          row.querySelector('.pend-causa')?.value || '',
        informado:      row.querySelector('.pend-informado')?.value || '',
        hora:           row.querySelector('.pend-hora')?.value || '',
    }));

    const data = {
        ticket: g('ticket'),
        fecha: g('fecha') ? new Date(g('fecha') + 'T12:00:00').toLocaleDateString('es-CL') : '',
        organismo: g('organismo'),
        establecimiento: g('establecimiento'),
        unidad: g('unidad'),
        direccion: g('direccion'),
        region: g('region'),
        ciudad: g('ciudad'),
        telefono: g('telefono'),
        responsable: g('responsable'),
        rutResponsable: g('rutResponsable'),
        cargoUsuario: g('cargoUsuario'),
        emailUsuario: g('emailUsuario'),
        tipoAtencion: tipoAtencionEl ? tipoAtencionEl.value : '',
        serieEquipo: serieEquipo,         // Para Soporte
        serieSoporteEquipo: g('serieSoporteEquipo'),  // Para captura Soporte
        serieEntrante: serieEntrante,     // Para SCO
        serieSaliente: serieSaliente,     // Para SCO
        modeloEquipo: modeloEquipo,       // Actualizado según tipo
        modeloEquipoSoporte: g('modeloEquipoSoporte'),  // Para captura Soporte
        horaLlegada: g('horaLlegada'),
        horaInicio: g('horaInicio'),
        horaSolucion: g('horaSolucion'),
        fallaDiagnostico: g('fallaDiagnostico'),
        origen: origenTexto,
        origenValor: origenValor,
        conSla: origenConSla,
        resuelve: resuelveEl ? resuelveEl.value : '',
        resolutorNombre: g('resolutorNombre'),
        resolutorHora: g('resolutorHora'),
        items,
        pendientes,
        observacionesTecnico: g('observacionesTecnico'),
        ticketCerrado: checked('ticketCerrado'),
        reporteAdjunto: checked('reporteAdjunto'),
        tecnicoNombre: g('tecnicoNombre'),
        tecnicoRut: g('tecnicoRut'),
        firmaTecnico: capturarFirma('firmaTecnico'),
        referenteNombre: g('referenteNombre'),
        referenteRut: g('referenteRut'),
        referenteCargo: g('referenteCargo'),
        firmaReferente: capturarFirma('firmaReferente'),
        quienFirma: getQuienFirma(), // 'usuario' | 'referente' | '' (DEV-03)
        motivoFirma: g('motivoFirma'),  // ← NUEVO (DEV-03): Motivo si referente firma en SCO
    };

    const contenido = generarContenidoAtencion(data);

    // IMPORTANTE: html2pdf.js clona el elemento que se le pasa (tempDiv) y lo
    // inserta dentro de SU PROPIO contenedor interno oculto para capturarlo.
    // Si tempDiv tiene "position: fixed/absolute" en su propio estilo, esa
    // propiedad se copia al clon, y dentro del contenedor de html2pdf el
    // contenido "se sale" del flujo normal y no le da tamaño real a ese
    // contenedor -> html2canvas captura un lienzo vacío (PDF en blanco),
    // sin lanzar ningún error. Por eso el posicionamiento "fixed" para
    // ocultarlo de la vista va en un WRAPPER externo (que nunca se clona),
    // y tempDiv (lo que sí se clona) se deja con posición normal (static).
    // ANCHO DEL CONTENIDO: debe coincidir con el ancho IMPRIMIBLE de la
    // página (ancho de página A4 menos los márgenes que se configuran más
    // abajo en jsPDF), no con el ancho total de la hoja. html2pdf.js arma
    // internamente un contenedor oculto exactamente de ese ancho imprimible
    // y lo recorta (overflow:hidden) — si nuestro contenido es más ancho
    // (ej. usábamos 210mm, el ancho TOTAL de la hoja, en vez del imprimible),
    // el sobrante de la derecha se recorta silenciosamente. Por eso se
    // calcula aquí a partir del mismo valor de margen usado en el PDF.
    const anchoPaginaMM  = 210; // A4 portrait
    const margenPdfMM    = 8;
    const anchoImprimibleMM = anchoPaginaMM - (margenPdfMM * 2); // 194mm

    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        background: 'white',
        width: anchoImprimibleMM + 'mm',   // mismo ancho que tempDiv: evita que el "auto"
        maxWidth: 'none'                   // se achique en ventanas/pantallas angostas y recorte el contenido
    });

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML        = contenido;
    tempDiv.style.width      = anchoImprimibleMM + "mm";
    tempDiv.style.background = "white";
    tempDiv.style.padding    = "10px";

    wrapper.appendChild(tempDiv);
    document.body.appendChild(wrapper);

    const overlay = document.createElement('div');
    overlay.id = 'pdfOverlay';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        background: 'rgba(255,255,255,0.98)',
        zIndex: '10000', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
    });
    overlay.innerHTML = '<div style="background:#fff;padding:16px 24px;border-radius:8px;font-family:Arial;border:1px solid #ddd;box-shadow:0 2px 10px rgba(0,0,0,0.15)">Generando PDF, por favor espere...</div>';
    document.body.appendChild(overlay);

    await new Promise(resolve => setTimeout(resolve, 300));
    await esperarImagenes(tempDiv);
    await new Promise(resolve => setTimeout(resolve, 200));

    // html2canvas clona la página completa dentro de un iframe oculto cuyo
    // tamaño usa por defecto el viewport actual del navegador (window.innerWidth
    // / innerHeight). Si esa ventana es más angosta/baja que el contenido real
    // del formulario (muy común en notebooks o con la ventana no maximizada),
    // el contenido se recorta por la derecha y por abajo al capturarlo.
    // Por eso se fuerza explícitamente el tamaño de la "ventana" de captura al
    // tamaño real del contenido, con margen de sobra.
    const anchoCaptura = Math.ceil(wrapper.scrollWidth) + 2;
    const altoCaptura   = Math.ceil(wrapper.scrollHeight) + 2;

    try {
        await html2pdf().set({
            margin: 8,
            filename: construirNombreArchivo(data),
            html2canvas: {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: anchoCaptura,
                windowHeight: altoCaptura
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
            pagebreak: { mode: ['css', 'legacy'] }
        }).from(tempDiv).save();
        mostrarBotonNuevaAtencion();
    } catch (err) {
        console.error('Error creando PDF:', err);
        mostrarAlerta('Ocurrió un problema generando el PDF. Intente nuevamente.');
    } finally {
        try { if (document.body.contains(wrapper)) document.body.removeChild(wrapper); } catch(e){}
        try { if (document.body.contains(overlay)) document.body.removeChild(overlay); } catch(e){}
    }
};


// ================= VALIDACIONES (reutiliza validaciones.js) =================

activarValidacionRut("rutResponsable", "errorRutResponsable");
activarValidacionEmail("emailUsuario", "errorEmailUsuario");
activarValidacionTelefono("telefono", "errorTelefono");
activarValidacionRut("tecnicoRut", "errorTecnicoRut");
activarValidacionRut("referenteRut", "errorReferenteRut");
// COMENTADO: Ya tenemos un select normal para unidad, no autocomplete
// activarAutocompleteUnidad("unidad");

});