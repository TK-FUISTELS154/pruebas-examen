const userInput = document.getElementById('login-username');
const passInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-confirm');

function ejecutarLogin() {
    const usernameInput = userInput.value;
    const passwordInput = passInput.value;

    // Usar la variable global 'users' desde user.js
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
        alert("Error: No se pudo cargar la base de datos de usuarios");
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