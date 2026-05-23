// URLs de la API
const API_BASE_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com";
const API_OFICINAS = `${API_BASE_URL}/unidadadmin`;
const API_ESTADOS = `${API_BASE_URL}/api/estado`;

const selectOficina = document.getElementById("select-oficina");
const inputId = document.getElementById("input-oficina-id");
const txtObservacion = document.getElementById("txt-observacion");
const statusLabel = document.getElementById("status-label");

// Botones laterales
const btnSideNuevo = document.querySelector(".side-actions button:nth-child(1)");
const btnSideModificar = document.querySelector(".side-actions button:nth-child(2)");
const btnSideActivar = document.querySelector(".side-actions button:nth-child(3)");
const btnSideInactivar = document.querySelector(".side-actions button:nth-child(4)");

// Botones inferiores
const btnFooterActivar = document.querySelector(".action-group-box button:nth-child(1)");
const btnFooterInactivar = document.querySelector(".action-group-box button:nth-child(2)");
const btnFooterNuevo = document.querySelector(".action-group-box button:nth-child(3)");
const btnFooterModificar = document.querySelector(".action-group-box button:nth-child(4)");
const btnFooterGuardar = document.querySelector(".action-group-box button:nth-child(5)");
const btnFooterDeshacer = document.querySelector(".action-group-box button:nth-child(6)");
const btnSalir = document.querySelector(".btn-salir");

let oficinas = [];
let estados = [];
let modoEdicion = false;
let oficinaOriginal = null;

// Datos de prueba (fallback si la API no funciona)
const datosPruebaEstados = [
    { codestado: 1, nomestado: "ACTIVO" },
    { codestado: 2, nomestado: "INACTIVO" }
];

const datosPruebaOficinas = [
    { idOficina: "101", nombreOficina: "DIRECCIÓN ADMINISTRATIVA", observacion: "Oficina central del piso 1", idEstado: 1 },
    { idOficina: "102", nombreOficina: "DEPARTAMENTO DE CONTABILIDAD", observacion: "Área financiera externa", idEstado: 1 },
    { idOficina: "103", nombreOficina: "ALMACÉN GENERAL", observacion: "Depósito de activos fijos e insumos", idEstado: 2 },
    { idOficina: "104", nombreOficina: "RECURSOS HUMANOS", observacion: "", idEstado: 1 }
];

const datosPruebaResponsables = {
    "101": [
        { codResponsable: 1, nombreCompleto: "Juan Pérez", cargo: "Director", ci: "1234567", expedido: "LP", idEstado: 1 }
    ],
    "102": [
        { codResponsable: 2, nombreCompleto: "María López", cargo: "Contadora", ci: "2345678", expedido: "CB", idEstado: 1 }
    ],
    "103": [],
    "104": [
        { codResponsable: 3, nombreCompleto: "Carlos Ruiz", cargo: "Jefe RRHH", ci: "3456789", expedido: "SC", idEstado: 1 }
    ]
};

// Función para cargar los estados desde la API
async function cargarEstados() {
    try {
        const response = await fetch(API_ESTADOS);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        estados = await response.json();
    } catch (error) {
        console.error("Error al cargar estados:", error);
        console.log("Usando datos de prueba de estados...");
        estados = [...datosPruebaEstados];
    }
}

// Función para cargar las oficinas desde la API
async function cargarOficinas() {
    try {
        await cargarEstados();
        const response = await fetch(API_OFICINAS);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const rawData = await response.json();
        
        // Mapear datos del nuevo API a la estructura esperada
        oficinas = rawData.map(item => ({
            idOficina: item.unidad.toString(),
            nombreOficina: item.descrip || "UNIDAD ADMINISTRATIVA",
            observacion: item.ciudad || "",
            idEstado: 1 // Por defecto activo
        }));
        
        inicializarSelector();
    } catch (error) {
        console.error("Error al cargar oficinas:", error);
        console.log("Usando datos de prueba de oficinas...");
        oficinas = [...datosPruebaOficinas];
        inicializarSelector();
    }
}

// Función para obtener el nombre del estado por ID
function getNombreEstado(idEstado) {
    const estado = estados.find(e => e.codestado === idEstado);
    return estado ? estado.nomestado : "DESCONOCIDO";
}

// Función para obtener el ID del estado por nombre
function getIdEstado(nombreEstado) {
    const estado = estados.find(e => e.nomestado === nombreEstado);
    return estado ? estado.codestado : 1;
}

// Inicializar opciones en el combobox
function inicializarSelector() {
    selectOficina.innerHTML = "";
    oficinas.forEach((oficina) => {
        let opt = document.createElement("option");
        opt.value = oficina.idOficina;
        opt.textContent = oficina.nombreOficina;
        selectOficina.appendChild(opt);
    });

    // Seleccionar la primera oficina por defecto
    if (oficinas.length > 0) {
        selectOficina.value = oficinas[0].idOficina;
        renderizarDatosOficina(oficinas[0].idOficina);
    }
}

// Renderizar datos en cascada
function renderizarDatosOficina(idOficina) {
    const data = oficinas.find(o => o.idOficina == idOficina);
    if (data) {
        inputId.value = data.idOficina;
        txtObservacion.value = data.observacion || "";
        const nombreEstado = getNombreEstado(data.idEstado);
        statusLabel.textContent = nombreEstado;
        
        // Cambio dinámico visual de la etiqueta de estado
        actualizarEstiloEstado(nombreEstado);

        // Cargar responsables de esta oficina
        cargarResponsables(idOficina);
    }
}

// Actualizar estilo visual del estado
function actualizarEstiloEstado(nombreEstado) {
    if(nombreEstado === "INACTIVO") {
        statusLabel.style.color = "#b22222"; // Rojo para inactivo
        statusLabel.style.fontWeight = "bold";
        btnSideActivar.disabled = false;
        btnSideInactivar.disabled = true;
        btnFooterActivar.disabled = false;
        btnFooterInactivar.disabled = true;
        btnFooterActivar.classList.remove("disabled");
        btnFooterInactivar.classList.add("disabled");
    } else {
        statusLabel.style.color = "#008000"; // Verde para activo
        statusLabel.style.fontWeight = "bold";
        btnSideActivar.disabled = true;
        btnSideInactivar.disabled = false;
        btnFooterActivar.disabled = true;
        btnFooterInactivar.disabled = false;
        btnFooterActivar.classList.add("disabled");
        btnFooterInactivar.classList.remove("disabled");
    }
}

// Función para cargar los responsables de una oficina
async function cargarResponsables(idOficina) {
    try {
        const response = await fetch(`${API_OFICINAS}/${idOficina}/responsables`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const responsables = await response.json();
        renderizarTablaResponsables(responsables);
    } catch (error) {
        console.error("Error al cargar responsables:", error);
        console.log("Usando datos de prueba de responsables...");
        const responsables = datosPruebaResponsables[idOficina] || [];
        renderizarTablaResponsables(responsables);
    }
}

// Función para renderizar la tabla de responsables
function renderizarTablaResponsables(responsables) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    
    if (responsables.length === 0) {
        // Llenar con filas vacías si no hay responsables
        for (let i = 0; i < 9; i++) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td></td><td></td><td></td><td></td><td></td><td></td>`;
            tbody.appendChild(tr);
        }
        return;
    }

    responsables.forEach(resp => {
        const tr = document.createElement("tr");
        const nombreEstado = getNombreEstado(resp.idEstado);
        tr.innerHTML = `
            <td class="center">${resp.codResponsable}</td>
            <td>${resp.nombreCompleto}</td>
            <td>${resp.cargo}</td>
            <td>${resp.ci}</td>
            <td>${resp.expedido}</td>
            <td class="center">${nombreEstado}</td>
        `;
        tbody.appendChild(tr);
    });

    // Llenar el resto con filas vacías
    const filasVacias = 9 - responsables.length;
    for (let i = 0; i < filasVacias; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td></td><td></td><td></td><td></td><td></td><td></td>`;
        tbody.appendChild(tr);
    }
}

// Función Nuevo
function nuevoOficina() {
    modoEdicion = true;
    oficinaOriginal = null;
    
    // Limpiar campos
    inputId.value = "";
    txtObservacion.value = "";
    statusLabel.textContent = "ACTIVO";
    actualizarEstiloEstado("ACTIVO");
    
    // Habilitar/deshabilitar botones
    btnSideNuevo.disabled = true;
    btnSideModificar.disabled = true;
    btnFooterNuevo.disabled = true;
    btnFooterModificar.disabled = true;
    btnFooterGuardar.disabled = false;
    btnFooterGuardar.classList.remove("disabled");
    btnFooterDeshacer.disabled = false;
    btnFooterDeshacer.classList.remove("disabled");
    
    // Habilitar inputs para edición
    txtObservacion.readOnly = false;
}

// Función Modificar
function modificarOficina() {
    modoEdicion = true;
    const idSeleccionado = selectOficina.value;
    oficinaOriginal = oficinas.find(o => o.idOficina === idSeleccionado);
    
    // Habilitar/deshabilitar botones
    btnSideNuevo.disabled = true;
    btnSideModificar.disabled = true;
    btnFooterNuevo.disabled = true;
    btnFooterModificar.disabled = true;
    btnFooterGuardar.disabled = false;
    btnFooterGuardar.classList.remove("disabled");
    btnFooterDeshacer.disabled = false;
    btnFooterDeshacer.classList.remove("disabled");
    
    // Habilitar inputs para edición
    txtObservacion.readOnly = false;
}

// Función Guardar
async function guardarOficina() {
    const idOficina = inputId.value || (oficinas.length > 0 ? (parseInt(oficinas[oficinas.length - 1].idOficina) + 1).toString() : "101");
    const nombreOficina = prompt("Ingrese el nombre de la oficina:", "NUEVA OFICINA") || "NUEVA OFICINA";
    const nombreEstado = statusLabel.textContent;
    
    const nuevaOficina = {
        idOficina: idOficina,
        nombreOficina: nombreOficina,
        observacion: txtObservacion.value,
        idEstado: getIdEstado(nombreEstado)
    };

    try {
        if (oficinaOriginal) {
            // Actualizar existente (PUT)
            const response = await fetch(`${API_OFICINAS}/${idOficina}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaOficina)
            });
            if (!response.ok) throw new Error("Error al actualizar");
        } else {
            // Crear nuevo (POST)
            const response = await fetch(API_OFICINAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaOficina)
            });
            if (!response.ok) throw new Error("Error al crear");
        }
        
        // Actualizar datos locales
        const index = oficinas.findIndex(o => o.idOficina === idOficina);
        if (index >= 0) {
            oficinas[index] = nuevaOficina;
        } else {
            oficinas.push(nuevaOficina);
        }
        
        inicializarSelector();
        restaurarEstado();
        alert("Guardado exitosamente");
    } catch (error) {
        console.error("Error al guardar:", error);
        // Guardar localmente si falla la API
        const index = oficinas.findIndex(o => o.idOficina === idOficina);
        if (index >= 0) {
            oficinas[index] = nuevaOficina;
        } else {
            oficinas.push(nuevaOficina);
        }
        inicializarSelector();
        restaurarEstado();
        alert("Guardado localmente (API no disponible)");
    }
}

// Función Activar
async function activarOficina() {
    const idSeleccionado = selectOficina.value;
    try {
        const response = await fetch(`${API_OFICINAS}/${idSeleccionado}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idEstado: getIdEstado("ACTIVO") })
        });
        if (!response.ok) throw new Error("Error al activar");
        
        const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
        if (index >= 0) {
            oficinas[index].idEstado = getIdEstado("ACTIVO");
        }
        renderizarDatosOficina(idSeleccionado);
        alert("Activado exitosamente");
    } catch (error) {
        console.error("Error al activar:", error);
        const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
        if (index >= 0) {
            oficinas[index].idEstado = getIdEstado("ACTIVO");
        }
        renderizarDatosOficina(idSeleccionado);
        alert("Activado localmente (API no disponible)");
    }
}

// Función Inactivar
async function inactivarOficina() {
    const idSeleccionado = selectOficina.value;
    if (!confirm("¿Está seguro de inactivar esta oficina?")) return;

    try {
        const response = await fetch(`${API_OFICINAS}/${idSeleccionado}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idEstado: getIdEstado("INACTIVO") })
        });
        if (!response.ok) throw new Error("Error al inactivar");
        
        const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
        if (index >= 0) {
            oficinas[index].idEstado = getIdEstado("INACTIVO");
        }
        renderizarDatosOficina(idSeleccionado);
        alert("Inactivado exitosamente");
    } catch (error) {
        console.error("Error al inactivar:", error);
        const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
        if (index >= 0) {
            oficinas[index].idEstado = getIdEstado("INACTIVO");
        }
        renderizarDatosOficina(idSeleccionado);
        alert("Inactivado localmente (API no disponible)");
    }
}

// Función Deshacer
function deshacer() {
    restaurarEstado();
    if (oficinaOriginal) {
        renderizarDatosOficina(oficinaOriginal.idOficina);
    }
}

// Función Salir
function salir() {
    if (modoEdicion) {
        if (confirm("Hay cambios sin guardar. ¿Desea salir?")) {
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'close-modal' }, '*');
            } else {
                window.close();
            }
        }
    } else {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'close-modal' }, '*');
        } else {
            window.close();
        }
    }
}

// Restaurar estado normal de botones
function restaurarEstado() {
    modoEdicion = false;
    oficinaOriginal = null;
    
    btnSideNuevo.disabled = false;
    btnSideModificar.disabled = false;
    btnFooterNuevo.disabled = false;
    btnFooterModificar.disabled = false;
    btnFooterGuardar.disabled = true;
    btnFooterGuardar.classList.add("disabled");
    btnFooterDeshacer.disabled = true;
    btnFooterDeshacer.classList.add("disabled");
    
    txtObservacion.readOnly = true;
    
    // Restaurar estado de botones de activar/inactivar
    const nombreEstado = statusLabel.textContent;
    actualizarEstiloEstado(nombreEstado);
}

// Event listeners
selectOficina.addEventListener("change", function() {
    renderizarDatosOficina(this.value);
});

btnSideNuevo.addEventListener("click", nuevoOficina);
btnSideModificar.addEventListener("click", modificarOficina);
btnSideActivar.addEventListener("click", activarOficina);
btnSideInactivar.addEventListener("click", inactivarOficina);
btnFooterActivar.addEventListener("click", activarOficina);
btnFooterInactivar.addEventListener("click", inactivarOficina);
btnFooterNuevo.addEventListener("click", nuevoOficina);
btnFooterModificar.addEventListener("click", modificarOficina);
btnFooterGuardar.addEventListener("click", guardarOficina);
btnFooterDeshacer.addEventListener("click", deshacer);
btnSalir.addEventListener("click", salir);

document.addEventListener("DOMContentLoaded", cargarOficinas);
