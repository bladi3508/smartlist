import { nuevaTarea, obtenerTareas, guardarCambios, eliminarRegistro } from "./API.js";
import { mostrarAlerta, obtenerProyecto } from "./funciones.js";

(function(){
    consultarTareas();
    //Instanciar el modal de bootstrap
    const modal = new bootstrap.Modal('#modal', {});

    //Selectores 
    const btnModal = document.querySelector('#btnAgregar');
    
    btnModal?.addEventListener('click', function(){
        mostrarFormulario();
    });

    let tareas = [];

    async function consultarTareas(){
        //Obtener la url del proyecto para poder consultar en la BD
        const url = obtenerProyecto();

        try {
            //Realizar la consulta en la API
            const resultado = await obtenerTareas(url);
            //Enviar los resultados para mostrarlos en pantall
            tareas = resultado.tareas;
            mostrarTareas();

        } catch (error) {
            console.log('Error al obtener las tareas', error);
        }
    }

    function mostrarTareas(){
        limpiarHTML();
        //Selectores principales
        const divTareas = document.querySelector('#tareasDiv');
        const listadoTareas = document.createElement('UL');
        listadoTareas.classList.add('list-group', 'list-group-flush');

        //Validar si hay tareas registradas
        if(tareas.length === 0){
            const textoTareas = document.createElement('h4');
            textoTareas.classList.add('lead', 'mt-3', 'text-center');
            textoTareas.textContent = 'No hay tareas registradas';

            divTareas.appendChild(textoTareas);
            return;
        }

        //Definir los estados y sus clases
        const estados = {
            0: 'Pendiente',
            1: 'Completada'
        }

        const claseEstado = {
            0: 'warning',
            1: 'success'
        }

        tareas.forEach(tarea => {
            const { id, nombre, estado } = tarea;
            const lista = document.createElement('LI');
            lista.classList.add('list-group-item', 'd-flex', 'flex-sm-column', 'flex-md-row', 'justify-content-between', 
                                'align-items-md-center');

            const nombreTarea = document.createElement('P');
            nombreTarea.classList.add('h6', 'nombre-tarea');
            nombreTarea.innerHTML = `${nombre} <i class="bi bi-pencil-square"></i>`;
            nombreTarea.ondblclick = function(){
                mostrarFormulario(true, {...tarea});
            }

            const divOpciones = document.createElement('DIV');
            divOpciones.classList.add('hstack', 'gap-2');

            const btnEstado = document.createElement('BUTTON');
            btnEstado.classList.add('btn', `btn-${claseEstado[estado]}`, 'btn-sm', 'rounded');
            btnEstado.textContent = `${estados[estado]}`;
            btnEstado.ondblclick = function(){
                cambiarEstadoTarea({...tarea});
            }

            const btnEliminar = document.createElement('BUTTON');
            btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'rounded');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.ondblclick = function(){
                confirmarEliminacion({...tarea});
            }

            divOpciones.appendChild(btnEstado);
            divOpciones.appendChild(btnEliminar);

            lista.appendChild(nombreTarea);
            lista.appendChild(divOpciones);

            listadoTareas.appendChild(lista);
        });

        divTareas.appendChild(listadoTareas);
    }

    function mostrarFormulario(editar = false, tarea = {}){
        //Seleccionar el modal body
        const modalTitle = document.querySelector('#modal .modal-header #titulo');
        const modalBody = document.querySelector('#modal .modal-body');

        //Titulo del modal
        modalTitle.innerHTML = `${editar ? 'Editar nombre de la tarea' : 'Agrega una tarea a realizar'}`;

        modalBody.innerHTML = `
            <form id="formulario">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Nombre tarea ejem..." value="${ tarea.nombre ? tarea.nombre : '' }">
                    <label for="nombre">Nombre de la tarea</label>
                </div>

                <div class="hstack gap-2">
                    <button type="button" class="btn btn-secondary w-50" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary w-50">${editar ? 'Guardar cambios' : 'Guardar Tarea'}</button>
                </div>
            </form>
        `;

        //Agregar evento al formulario
        const formulario = document.querySelector('#formulario');

        formulario.addEventListener('submit', function(e){
            e.preventDefault();

            //Validar campo
            const nombre = document.querySelector('#nombre').value;

            if(nombre.trim() === ''){
                mostrarAlerta('Favor de ingresar el nombre del proyecto.');
                return;
            }

            if(editar){
                tarea.nombre = nombre;
                actualizarTarea(tarea);
            }else{
                guardarTarea(nombre);
            }
        });
        

        modal.show();
    }

    async function guardarTarea(nombre){
        //Obtener url del proyecto
        const url = obtenerProyecto();

        try {
           const resultado = await nuevaTarea(nombre, url);
           modal.hide();
           //Crear un bojeto con el resultado
           const tareaObj = {
                id: String(resultado.tarea.id),
                nombre: resultado.tarea.nombre,
                estado: "0",
                proyecto_id: resultado.tarea.proyecto_id
           }

           //Agregar el objeto al arreglo global de tareas para mostrarlo sin recargar la pagina
           tareas = [...tareas, tareaObj];
           mostrarTareas()

           Swal.fire("Tarea registrada correctamente"); 
           
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al registrar la tarea",
            });
        }
        
    }

    function cambiarEstadoTarea(tarea){
        //Cambiar el estado de la tarea
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";
        tarea.estado = nuevoEstado;
        //Enviamos el cambio para actualizar tarea
        actualizarTarea(tarea);
    }

    async function actualizarTarea(tarea){
        //Extraer los datos de la tarea
        const { estado, id, nombre} = tarea;
        const url = obtenerProyecto();

        try {
            //Guardamos los cambios
            const resultado = await guardarCambios(id, nombre, estado, url);

            //Se busca la tarea modificada en el arreglo principal
            tareas = tareas.map(tareaMemoria => {
                //Mediante el arreglo copia (tareaMemoria) se compara con el id que tenemos
                if(tareaMemoria.id === id){
                    tareaMemoria.estado = estado,
                    tareaMemoria.nombre = nombre
                }

                return tareaMemoria;
            });

            if(modal){
                modal.hide();
            }

            Swal.fire("Se ha actualizado correctamente"); 

            //Se vuelve a llamar el metodo para mostrar las tareas
            mostrarTareas();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al actualizar la tarea",
            });
        }
    }

    function confirmarEliminacion(tarea){
        Swal.fire({
            text: "¿Estas seguro de querer eliminar el registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea);
                Swal.fire({
                text: "Se ha eliminado el registro con éxito",
                icon: "success"
                });
            }
        });
    }

    async function eliminarTarea(tarea){
        const { id } = tarea

        try {
            const resultado = await eliminarRegistro(id);

            //filtrar las tareas
            tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
            mostrarTareas();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al actualizar la tarea",
            });
        }
    }

    function limpiarHTML(){
        const divTareas = document.querySelector('#tareasDiv');
        while(divTareas.firstChild){
            divTareas.removeChild(divTareas.firstChild);
        }
    }


})();