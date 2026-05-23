// URLs de la API
const API_BASE_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com";
const API_GRUPOS = `${API_BASE_URL}/api/objgasto`;

const selectNombre = document.getElementById("select-nombre");
const inputGrupo = document.getElementById("input-grupo");
const inputVidaUtil = document.getElementById("input-vida-util");
const txtObservaciones = document.getElementById("txt-observaciones");
const chkDeprecia = document.getElementById("chk-deprecia");
const chkActualiza = document.getElementById("chk-actualiza");

// Botones
const btnNuevo = document.querySelector(".button-bar button:nth-child(1)");
const btnModificar = document.querySelector(".button-bar button:nth-child(2)");
const btnGuardar = document.querySelector(".button-bar button:nth-child(3)");
const btnEliminar = document.querySelector(".button-bar button:nth-child(4)");
const btnDeshacer = document.querySelector(".button-bar button:nth-child(5)");
const btnSalir = document.querySelector(".button-bar button:nth-child(6)");

let gruposContables = [];
let modoEdicion = false;
let grupoOriginal = null;

// Datos de prueba (fallback si la API no funciona)
const datosPrueba = [
    { idGrupo: 1, nombreGrupo: "EDIFICACIONES", vidaUtil: 40, deprecia: true, actualiza: true, observaciones: "Incluye edificios, construcciones y terrenos" },
    { idGrupo: 2, nombreGrupo: "MUEBLES Y ENSERES DE OFICINA", vidaUtil: 10, deprecia: true, actualiza: true, observaciones: "Escritorios, sillas, archivadores, etc." },
    { idGrupo: 3, nombreGrupo: "MAQUINARIA EN GENERAL", vidaUtil: 8, deprecia: true, actualiza: true, observaciones: "Maquinaria industrial y equipos de producción" },
    { idGrupo: 4, nombreGrupo: "EQUIPO MEDICO Y DE LABORATORIO", vidaUtil: 8, deprecia: true, actualiza: true, observaciones: "Equipos médicos, instrumentos de laboratorio" },
    { idGrupo: 5, nombreGrupo: "EQUIPO DE COMUNICACIONES", vidaUtil: 5, deprecia: true, actualiza: true, observaciones: "Radios, teléfonos, sistemas de comunicación" },
    { idGrupo: 6, nombreGrupo: "EQUIPO EDUCACIONAL Y RECREATIVO", vidaUtil: 8, deprecia: true, actualiza: true, observaciones: "Pizarras, proyectores, equipos deportivos" },
    { idGrupo: 7, nombreGrupo: "VEHICULOS AUTOMOTORES", vidaUtil: 5, deprecia: true, actualiza: true, observaciones: "Automóviles, camiones, motocicletas" },
    { idGrupo: 8, nombreGrupo: "EQUIPO DE COMPUTACION", vidaUtil: 5, deprecia: true, actualiza: true, observaciones: "Computadoras, servidores, periféricos" },
    { idGrupo: 9, nombreGrupo: "HERRAMIENTAS Y UTENSILIOS", vidaUtil: 5, deprecia: true, actualiza: true, observaciones: "Herramientas manuales, eléctricas" },
    { idGrupo: 10, nombreGrupo: "LIBROS Y COLECCIONES", vidaUtil: 10, deprecia: true, actualiza: true, observaciones: "Bibliotecas técnicas, colecciones especializadas" },
    { idGrupo: 11, nombreGrupo: "EQUIPO DE SEGURIDAD", vidaUtil: 5, deprecia: true, actualiza: true, observaciones: "Cámaras, alarmas, sistemas de seguridad" },
    { idGrupo: 12, nombreGrupo: "EQUIPO DE AIRE ACONDICIONADO", vidaUtil: 8, deprecia: true, actualiza: true, observaciones: "Aires acondicionados, sistemas de climatización" },
    { idGrupo: 13, nombreGrupo: "EQUIPO DE COCINA", vidaUtil: 5, deprecia: true, actualiza: true, observaciones: "Refrigeradores, hornos, equipos de cocina" },
    { idGrupo: 14, nombreGrupo: "EQUIPO DE LIMPIEZA", vidaUtil: 3, deprecia: true, actualiza: true, observaciones: "Aspiradoras, lavadoras, equipos de limpieza" },
    { idGrupo: 15, nombreGrupo: "EQUIPO DE SONIDO", vidaUtil: 8, deprecia: true, actualiza: true, observaciones: "Sistemas de sonido, amplificadores, micrófonos" }
];

// Función para cargar los grupos desde la API
async function cargarGrupos() {
    try {
        const response = await fetch(API_GRUPOS);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const rawData = await response.json();
        

        if (rawData.length > 0) {
            gruposContables = rawData.map(item => ({
                idGrupo: item.gestion || item.partida || 1,
                nombreGrupo: item.descrip || "GRUPO CONTABLE",
                vidaUtil: 10,
                deprecia: true,
                actualiza: true,
                observaciones: ""
            }));
        } else {
            // Si el API está vacío, usar datos de prueba
            console.log("API vacía, usando datos de prueba...");
            gruposContables = [...datosPrueba];
        }
        
        inicializarSelector();
    } catch (error) {
        console.error("Error al cargar grupos:", error);
        console.log("Usando datos de prueba...");
        gruposContables = [...datosPrueba];
        inicializarSelector();
    }
}

// Función para cargar los datos en el selector
function inicializarSelector() {
    selectNombre.innerHTML = "";
    gruposContables.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.idGrupo;
        option.textContent = item.nombreGrupo;
        selectNombre.appendChild(option);
    });

    // Seleccionar por defecto el primer grupo
    if (gruposContables.length > 0) {
        selectNombre.value = gruposContables[0].idGrupo;
        actualizarCampos(gruposContables[0].idGrupo);
    }
}

// Función para actualizar Grupo y Vida útil según la selección
function actualizarCampos(idGrupo) {
    const itemSeleccionado = gruposContables.find(item => item.idGrupo == idGrupo);
    if (itemSeleccionado) {
        inputGrupo.value = itemSeleccionado.idGrupo;
        inputVidaUtil.value = itemSeleccionado.vidaUtil;
        txtObservaciones.value = itemSeleccionado.observaciones || "";
        chkDeprecia.checked = itemSeleccionado.deprecia;
        chkActualiza.checked = itemSeleccionado.actualiza;
    }
}

// Función Nuevo
function nuevoGrupo() {
    modoEdicion = true;
    grupoOriginal = null;
    
    // Limpiar campos
    inputGrupo.value = "";
    inputVidaUtil.value = "";
    txtObservaciones.value = "";
    chkDeprecia.checked = true;
    chkActualiza.checked = true;
    
    // Habilitar/deshabilitar botones
    btnNuevo.disabled = true;
    btnModificar.disabled = true;
    btnGuardar.disabled = false;
    btnGuardar.classList.remove("disabled");
    btnEliminar.disabled = true;
    btnDeshacer.disabled = false;
    btnDeshacer.classList.remove("disabled");
    
    // Habilitar inputs para edición
    inputVidaUtil.readOnly = false;
    txtObservaciones.readOnly = false;
}

// Función Modificar
function modificarGrupo() {
    modoEdicion = true;
    const idSeleccionado = parseInt(selectNombre.value);
    grupoOriginal = gruposContables.find(g => g.idGrupo === idSeleccionado);
    
    // Habilitar/deshabilitar botones
    btnNuevo.disabled = true;
    btnModificar.disabled = true;
    btnGuardar.disabled = false;
    btnGuardar.classList.remove("disabled");
    btnEliminar.disabled = true;
    btnDeshacer.disabled = false;
    btnDeshacer.classList.remove("disabled");
    
    // Habilitar inputs para edición
    inputVidaUtil.readOnly = false;
    txtObservaciones.readOnly = false;
}

// Función Guardar
async function guardarGrupo() {
    const idGrupo = inputGrupo.value ? parseInt(inputGrupo.value) : (gruposContables.length > 0 ? Math.max(...gruposContables.map(g => g.idGrupo)) + 1 : 1);
    const nombreGrupo = selectNombre.options[selectNombre.selectedIndex]?.textContent || "NUEVO GRUPO";
    
    // Mapear datos al esquema del API (ObjGasto)
    const apiData = {
        gestion: idGrupo,
        partida: idGrupo.toString(),
        descrip: nombreGrupo
    };
    
    const nuevoGrupo = {
        idGrupo: idGrupo,
        nombreGrupo: nombreGrupo,
        vidaUtil: parseInt(inputVidaUtil.value),
        deprecia: chkDeprecia.checked,
        actualiza: chkActualiza.checked,
        observaciones: txtObservaciones.value
    };

    try {
        if (grupoOriginal) {
            // Actualizar existente (PUT) usando posición
            const posicion = gruposContables.findIndex(g => g.idGrupo === idGrupo);
            if (posicion >= 0) {
                const response = await fetch(`${API_GRUPOS}/${posicion}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(apiData)
                });
                if (!response.ok) throw new Error("Error al actualizar");
            }
        } else {
            // Crear nuevo (POST)
            const response = await fetch(API_GRUPOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData)
            });
            if (!response.ok) throw new Error("Error al crear");
        }
        
        // Actualizar datos locales
        const index = gruposContables.findIndex(g => g.idGrupo === idGrupo);
        if (index >= 0) {
            gruposContables[index] = nuevoGrupo;
        } else {
            gruposContables.push(nuevoGrupo);
        }
        
        inicializarSelector();
        restaurarEstado();
        alert("Guardado exitosamente");
    } catch (error) {
        console.error("Error al guardar:", error);
        // Guardar localmente si falla la API
        const index = gruposContables.findIndex(g => g.idGrupo === idGrupo);
        if (index >= 0) {
            gruposContables[index] = nuevoGrupo;
        } else {
            gruposContables.push(nuevoGrupo);
        }
        inicializarSelector();
        restaurarEstado();
        alert("Guardado localmente (API no disponible)");
    }
}

// Función Eliminar
async function eliminarGrupo() {
    const idSeleccionado = parseInt(selectNombre.value);
    if (!confirm("¿Está seguro de eliminar este grupo?")) return;

    try {
        // Usar posición (índice) en lugar de ID para DELETE
        const posicion = gruposContables.findIndex(g => g.idGrupo === idSeleccionado);
        if (posicion >= 0) {
            const response = await fetch(`${API_GRUPOS}/${posicion}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar");
        }
        
        gruposContables = gruposContables.filter(g => g.idGrupo !== idSeleccionado);
        inicializarSelector();
        alert("Eliminado exitosamente");
    } catch (error) {
        console.error("Error al eliminar:", error);
        gruposContables = gruposContables.filter(g => g.idGrupo !== idSeleccionado);
        inicializarSelector();
        alert("Eliminado localmente (API no disponible)");
    }
}

// Función Deshacer
function deshacer() {
    restaurarEstado();
    if (grupoOriginal) {
        actualizarCampos(grupoOriginal.idGrupo);
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
    grupoOriginal = null;
    
    btnNuevo.disabled = false;
    btnModificar.disabled = false;
    btnGuardar.disabled = true;
    btnGuardar.classList.add("disabled");
    btnEliminar.disabled = false;
    btnDeshacer.disabled = true;
    btnDeshacer.classList.add("disabled");
    
    inputVidaUtil.readOnly = true;
    txtObservaciones.readOnly = true;
}

// Event listeners
selectNombre.addEventListener("change", function() {
    actualizarCampos(this.value);
});

btnNuevo.addEventListener("click", nuevoGrupo);
btnModificar.addEventListener("click", modificarGrupo);
btnGuardar.addEventListener("click", guardarGrupo);
btnEliminar.addEventListener("click", eliminarGrupo);
btnDeshacer.addEventListener("click", deshacer);
btnSalir.addEventListener("click", salir);

// Ejecutar al cargar el documento
document.addEventListener("DOMContentLoaded", cargarGrupos);
