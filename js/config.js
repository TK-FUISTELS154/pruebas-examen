const road = {
    login: '/',
    loginToGFPICTPREVUE: 'gfpictprevue',
    GFPICTPREVUEtoLeading: 'leading'
};

const config = {
    dataBase: '../assets/dataBase/user.js',
};

function navegarA(seccion) {
    const rutaReal = `./pages/${seccion}/`; 
    window.location.href = rutaReal;
}

function getDataUser() {
    const name = localStorage.getItem('usuarioNombre');
    const rol = localStorage.getItem('usuarioRol');

    if (!name) {
        window.location.href = '../../';
        return;
    }else{
        return { name, rol };
    }
    
}

function getRoad() {
    const getRoad = window.location.pathname;
    return getRoad;
}

function getUserName() {
    const name = localStorage.getItem('usuarioNombre');
    return name;
}

function getBackupsCount() {
    const backupsCount = localStorage.getItem('backups_count');
    return backupsCount;
}