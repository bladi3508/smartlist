export const nuevaTarea = async (nombre, url) => {
    //Construir la petición
    const datos = new FormData();
    datos.append('nombre', nombre);
    datos.append('url', url);

    const URL = '/registrar-tarea';

    try {
        const respuesta = await fetch(URL, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        return resultado;

    } catch (error) {
        console.log('Error al registrar la tarea', error);
    }
}

export const obtenerTareas = async (url) => {
    const URL = `/tareas?url=${url}`;
    try {
        const resultado = await fetch(URL);
        const tareas = resultado.json();
        return tareas;
    } catch (error) {
        console.log('Error al obtener las tareas', error);
    }
}

export const guardarCambios = async (id, nombre, estado, url) => {
    //Construir petición
    const datos = new FormData();
    datos.append('id', id);
    datos.append('nombre', nombre);
    datos.append('estado', estado);
    datos.append('url', url);

    const URL = '/actualizar-tarea';

    try {
        const respuesta = await fetch(URL, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        return resultado;

    } catch (error) {
        console.log('Error al actualizar la tarea')
    }
}

export const eliminarRegistro = async (id) => {
    const datos = new FormData();
    datos.append('id', id);

    const URL = '/eliminar-tarea';

    try {
       const respuesta = await fetch(URL, {
        method: 'POST',
        body: datos
       });

       const resultado = await respuesta.json();
       return resultado;

    } catch (error) {
        console.log('Error al eliminar la tarea', error)
    }
}

