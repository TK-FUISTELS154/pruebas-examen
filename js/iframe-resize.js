// Script para que las páginas en iframe notifiquen su tamaño al padre
function notifyParentSize() {
    if (window.parent !== window) {
        const body = document.body;
        const html = document.documentElement;
        
        // Calcular el ancho del contenido real
        const width = Math.max(
            body.scrollWidth,
            html.scrollWidth,
            body.offsetWidth,
            html.offsetWidth
        );
        
        // Calcular el alto del contenido real
        const height = Math.max(
            body.scrollHeight,
            html.scrollHeight,
            body.offsetHeight,
            html.offsetHeight
        );
        
        window.parent.postMessage({
            type: 'resize-iframe',
            width: width,
            height: height
        }, '*');
    }
}

// Notificar al cargar
window.addEventListener('load', notifyParentSize);

// Notificar cuando cambie el tamaño
window.addEventListener('resize', notifyParentSize);

// Notificar periódicamente por si hay cambios dinámicos
setInterval(notifyParentSize, 500);

// Notificar después de un pequeño delay para asegurar que todo cargó
setTimeout(notifyParentSize, 100);
setTimeout(notifyParentSize, 500);
