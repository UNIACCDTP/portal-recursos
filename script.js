const botonesCategoria = document.querySelectorAll('.categoria-btn');

const botonesRecursos = document.querySelectorAll(
    '.boton-cuadrado[data-categoria]'
);

botonesCategoria.forEach(boton => {
    boton.addEventListener('click', () => {
        const filtro = boton.dataset.filtro;

        botonesCategoria.forEach(btn => {
            btn.classList.remove('activo');
        });

        boton.classList.add('activo');

        botonesRecursos.forEach(recurso => {
            const categoria = recurso.dataset.categoria;

            if (filtro === 'todos' || categoria === filtro) {
                recurso.classList.remove('oculto');
            } else {
                recurso.classList.add('oculto');
            }
        });
    });
});