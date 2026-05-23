const userInput = document.getElementById('login-username');
const passInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-confirm');

function ejecutarLogin() {
    const usernameInput = userInput.value;
    const passwordInput = passInput.value;
    const dataBase = config.dataBase;

    fetch(dataBase)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar la base de datos");
            return response.json();
        })
        .then(data => {
            const usuarioEncontrado = data.users.find(user =>
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
        })
        .catch(error => {
            console.error("Error en el login:", error);
            alert("Error de conexión con la base de datos");
        });
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