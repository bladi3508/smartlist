export function mostrarAlerta(mensaje){
    const modalBody = document.querySelector('.modal-body');

    const alerta = document.createElement('DIV');
    alerta.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show', 'mt-2', 'mb-0', 'mx-3');
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const alertaPrevia = document.querySelector('.alert-danger');
    alertaPrevia?.remove();

    modalBody.parentElement.insertBefore(alerta, modalBody);
}

export function obtenerProyecto(){
    const proyectoParametros = new URLSearchParams(window.location.search);

    const proyecto = Object.fromEntries(proyectoParametros);

    return proyecto.url;
}