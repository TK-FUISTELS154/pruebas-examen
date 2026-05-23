// Script para que los botones salir cierren el modal del padre
function setupSalirButton() {
    const salirBtn = document.querySelector('.btn-salir');
    if (salirBtn) {
        salirBtn.addEventListener('click', () => {
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'close-modal' }, '*');
            } else {
                window.close();
            }
        });
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSalirButton);
} else {
    setupSalirButton();
}
