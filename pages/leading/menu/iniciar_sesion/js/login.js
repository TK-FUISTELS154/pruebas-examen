const userInput = document.getElementById('login-username');
const passInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-confirm');
const salirBtn = document.getElementById('login-salir');

// URL raw de GitHub para el archivo JSON de usuarios
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/TK-FUISTELS154/pruebas-examen/dev/assets/dataBase/user.json";

// Cargar users desde GitHub JSON
let users = [];

async function cargarUsers() {
    try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error('No se pudo cargar usuarios desde GitHub');
        users = await response.json();
        console.log('users cargados correctamente desde GitHub:', users);
        return true;
    } catch (error) {
        console.error('Error al cargar users desde GitHub:', error);
        // Usar datos de prueba como fallback
        users = [
            { username: "admin", password: "admin", rol: "admin" },
            { username: "user", password: "user", rol: "user" },
            { username: "user2", password: "user2", rol: "user" }
        ];
        console.log('Usando datos de prueba:', users);
        return false;
    }
}

function ejecutarLogin() {
    const usernameInput = userInput.value;
    const passwordInput = passInput.value;

    // Usar los datos cargados desde MockAPI
    if (typeof users !== 'undefined' && users.length > 0) {
        const usuarioEncontrado = users.find(user =>
            user.username === usernameInput && user.password === passwordInput
        );

        if (usuarioEncontrado) {
            localStorage.setItem('usuarioNombre', usuarioEncontrado.username);
            localStorage.setItem('usuarioRol', usuarioEncontrado.rol);
            
            // Enviar mensaje al padre para cerrar el modal
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'login-success', username: usuarioEncontrado.username }, '*');
            } else {
                // Si no está en iframe, redirigir normalmente
                window.location.href = `./pages/${road.loginToGFPICTPREVUE}/`;
            }
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } else {
        console.error('Error: users no está definido o está vacío');
        alert("Error: No se pudo cargar la base de datos de usuarios");
    }
}

function salir() {
    if (window.parent !== window) {
        window.parent.postMessage({ type: 'close-modal' }, '*');
    } else {
        window.close();
    }
}

userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        passInput.focus();
    }
});

passInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        ejecutarLogin();
    }
});

loginBtn.addEventListener('click', ejecutarLogin);

if (salirBtn) {
    salirBtn.addEventListener('click', salir);
}

// Cargar users al iniciar la página
cargarUsers();
