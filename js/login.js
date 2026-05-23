const userInput = document.getElementById('login-username');
const passInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-confirm');

// URL de MockAPI para la base de datos de usuarios
const MOCKAPI_URL = "https://6a11aed83e35d0f37ee388a2.mockapi.io/dataBase/user";

// Cargar users desde MockAPI
let users = [];

async function cargarUsers() {
    try {
        const response = await fetch(MOCKAPI_URL);
        if (!response.ok) throw new Error('No se pudo cargar usuarios desde MockAPI');
        users = await response.json();
        console.log('users cargados correctamente desde MockAPI:', users);
        return true;
    } catch (error) {
        console.error('Error al cargar users desde MockAPI:', error);
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

    // Usar la variable 'users' desde MockAPI
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

// Cargar users al iniciar la página
cargarUsers();


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