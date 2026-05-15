document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const mainSidebar = document.getElementById('main-sidebar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const loader = document.getElementById('loader-global');
    const vistaGrid = document.getElementById('vista-grid');
    const vistaDetalle = document.getElementById('vista-detalle');
    const seccionesDetalle = document.querySelectorAll('.detalle-recurso');
    
    // Mejora 3: Optimización - Guardar SRC original
    seccionesDetalle.forEach(detalle => {
        const iframes = detalle.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.dataset.originalSrc = iframe.getAttribute('data-src');
            iframe.removeAttribute('data-src');
        });
    });

    // Abrir recurso por ID
    const abrirRecurso = (id) => {
        const recurso = document.getElementById(id);
        if (!recurso) return;

        // Mostrar Loader
        loader.classList.remove('oculto-estricto');

        appContainer.classList.add('collapsed-layout');
        mainSidebar.classList.add('collapsed');
        vistaGrid.classList.add('oculto-estricto');
        vistaDetalle.classList.remove('oculto-estricto');

        seccionesDetalle.forEach(sec => sec.classList.remove('activo'));
        recurso.classList.add('activo');

        // Mejora 3: Cargar Iframes solo al abrir
        const iframes = recurso.querySelectorAll('iframe');
        let loadedCount = 0;
        
        if (iframes.length === 0) {
            loader.classList.add('oculto-estricto');
        }

        iframes.forEach(iframe => {
            iframe.src = iframe.dataset.originalSrc;
            // Mejora 2: Ocultar spinner cuando cargue
            iframe.onload = () => {
                loadedCount++;
                if (loadedCount === iframes.length) {
                    loader.classList.add('oculto-estricto');
                }
            };
        });

        location.hash = id;
        window.scrollTo(0,0);
        mainSidebar.classList.remove('mobile-open');
    };

    // Volver a la grilla
    const volverALaGrilla = () => {
        appContainer.classList.remove('collapsed-layout');
        mainSidebar.classList.remove('collapsed');
        vistaDetalle.classList.add('oculto-estricto');
        vistaGrid.classList.remove('oculto-estricto');
        
        // Mejora 3: Vaciar Iframes al salir (Optimización RAM)
        seccionesDetalle.forEach(detalle => {
            const iframes = detalle.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.src = ""; 
            });
        });

        location.hash = "";
    };

    // Eventos de Tarjetas
    document.querySelectorAll('.boton-cuadrado').forEach(btn => {
        btn.onclick = () => abrirRecurso(btn.dataset.target);
    });

    document.getElementById('btn-volver').onclick = volverALaGrilla;

    // Mejora 4: Móvil Toggle
    mobileToggle.onclick = () => mainSidebar.classList.toggle('mobile-open');

    // Mejora 5: Compartir Link
    document.getElementById('btn-compartir').onclick = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("¡Enlace copiado al portapapeles!");
        });
    };

    // Filtros
    document.querySelectorAll('.categoria-btn').forEach(boton => {
        boton.onclick = () => {
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');
            const filtro = boton.dataset.filtro;

            document.querySelectorAll('.boton-cuadrado').forEach(tarjeta => {
                tarjeta.style.display = (filtro === 'todos' || tarjeta.dataset.categoria === filtro) ? 'flex' : 'none';
            });
            volverALaGrilla();
            mainSidebar.classList.remove('mobile-open');
        };
    });

    // Mejora 5: Cargar por Hash al iniciar
    if (location.hash) {
        const hashId = location.hash.replace('#', '');
        abrirRecurso(hashId);
    }
});