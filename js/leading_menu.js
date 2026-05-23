const activosFijos = document.getElementById('activos-fijos');
const gruposYAuxiliares = document.getElementById('grupos-y-auxiliares');
const oficinasYResponsables = document.getElementById('oficinas-y-responsables');
const generarReportes = document.getElementById('generar-reportes');
const administradores = document.getElementById('administradores');
const iniciarSesion = document.getElementById('iniciar-sesion');
const respaldosDB = document.getElementById('respaldos-db');
const administrarUnidad = document.getElementById('administrar-unidad');
const localizacionDB = document.getElementById('localizacion-db');

const contentFrame = document.getElementById('content-frame');

const srcContainer = {
    'activosFijos': './activos_fijos/index.html',
    'gruposYAuxiliares': './grupos_y_auxiliares/index.html',
    'oficinasYResponsables': './oficinas_y_responsables/index.html',
    'generarReportes': './generar_reportes/index.html',
    'administradores': './administradores/index.html',
    'iniciarSesion': './iniciar_sesion/index.html',
    'respaldosDB': './respaldos_db/index.html',
    'administrarUnidad': './administrar_unidad/index.html',
    'localizacionDB': './localizacion_db/index.html'

};

activosFijos.addEventListener('click', () => {
    contentFrame.src = srcContainer['activosFijos'];
});

gruposYAuxiliares.addEventListener('click', () => {
    contentFrame.src = srcContainer['gruposYAuxiliares'];
});

oficinasYResponsables.addEventListener('click', () => {
    contentFrame.src = srcContainer['oficinasYResponsables'];
});

generarReportes.addEventListener('click', () => {
    contentFrame.src = srcContainer['generarReportes'];
});

administradores.addEventListener('click', () => {
    contentFrame.src = srcContainer['administradores'];
});

iniciarSesion.addEventListener('click', () => {
    contentFrame.src = srcContainer['iniciarSesion'];
});

respaldosDB.addEventListener('click', () => {
    contentFrame.src = srcContainer['respaldosDB'];
});

administrarUnidad.addEventListener('click', () => {
    contentFrame.src = srcContainer['administrarUnidad'];
});

localizacionDB.addEventListener('click', () => {
    contentFrame.src = srcContainer['localizacionDB'];
});