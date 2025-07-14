//Importar modelo
import { Tareas } from "../models/Tarea.js";
import { Proyecto } from "../models/Proyecto.js";
import { Model, where } from "sequelize";

const mostrarTareas = async (req, res) => {
    //Obtener url
    const url = req.query.url;

    try {
       //Consultar el proyecto
        const proyecto = await Proyecto.findOne({ where: { url: url } });

        //Hacer la consulta
        const tareas = await Tareas.findAll({
            include:{
                model: Proyecto,
                required: true
            },
            where:{
                proyecto_id: proyecto.id
            }
        });

        console.log(tareas);

        res.json({
            success: true,
            tareas
        });

    } catch (error) {
        console.log('Error al consultar las tareas', error);
    }
    
}

const agregarTarea = async (req, res) => {
    try {
        const { nombre, url } = req.body;

        //Buscar el proyecto
        const proyecto = await Proyecto.findOne({ where: { url: url} });

        const tarea = await Tareas.create({ nombre, estado: 0, proyecto_id: proyecto.id });

        res.json({
            success: true,
            tarea
        });

    } catch (error) {
        console.log('Error al registrar la tarea', error)
    }
}

const actualizarTarea = async (req, res) => {
    //Extraer las variables
    const { id, nombre, estado, url } = req.body;
    const usuarioID = req.user.id;

    try {
        const proyecto = await Proyecto.findOne({ where: { url: url, propietario: usuarioID }});

        if(!proyecto){
            res.json({
                success: false, 
            });
        }

        const tarea = await Tareas.update({ nombre: nombre, estado: estado }, { where: { id: id }});

        res.json({
            success: true,
            tarea
        });

    } catch (error) {
        console.log('Error al actualizar la tarea', error)
    }
}

const eliminarTarea = async (req, res) => {
    console.log(req.body);
    const { id } = req.body;

    try {
        await Tareas.destroy({ where: { id: id } });

        res.json({
            success: true
        });
        
    } catch (error) {
        console.log('error al eliminar la tarea', error)
    }
}
export {
    agregarTarea,
    mostrarTareas,
    actualizarTarea,
    eliminarTarea
}