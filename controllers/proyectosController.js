//Importar el modelo
import { Proyecto } from "../models/Proyecto.js";
import { User } from "../models/Usuario.js";

import { generarToken } from "../helpers/funciones.js";
import { where } from "sequelize";

//Metodos
const inicioPagina = async (req, res) => {
    try {
        const usuarioID = req.user.id;
        
        const proyectos = await Proyecto.findAll({
            include:{
                model: User,
                required: true
            },
            where: {
                propietario: usuarioID
            }
        });

        //Validar que el usuario autenticado coincida con el propietario de los proyectos
        const proyectosInvalidos = proyectos.some(proyecto => proyecto.propietario !== usuarioID);
        if(proyectosInvalidos){
            const mensaje = 'Haz intentado obtener registros que no estan asociados a tu cuenta, por favor desista';

            return res.render('proyectos/inicio', {
                titulo: 'Pagina de proyectos',
                usuario: req.user,
                mensaje
            });
        }

        //Validar que haya registros asociados con el usuario
        if(proyectos.length === 0){
            const mensaje = 'Aún no hay proyectos registrados';

            return res.render('proyectos/inicio', {
                titulo: 'Pagina de proyectos',
                usuario: req.user,
                mensaje
            });
        }


        return res.render('proyectos/inicio', {
            titulo: 'Pagina de proyectos',
            usuario: req.user,
            proyectos
        });

    } catch (error) {
        console.log('Error al cargar los proyectos', error)
    }
}
    
//Metodos para registrar proyectos
const proyectoPagina = (req, res) => {
    res.render('proyectos/proyecto-crear', {
        titulo: 'Crear proyecto',
        usuario: req.user
    });
}

const guardarProycto = async (req, res) => {
    console.log(req.body);

    const { proyecto } = req.body;

    //Alertas
    const alertas = [];

    //Validar campo
    if(proyecto.trim() === ''){
        alertas.push({ tipo: 'danger', mensaje: 'Favor de colocar el nombre de tu proyecto'});

        return res.render('proyectos/proyecto-crear', {
            titulo: 'Crear proyecto',
            usuario: req.user,
            alertas
        });
    }

    //Obtener variables
    const idUsuario = req.user.id;
    const url = generarToken();

    try {
        //Guardar al usuario
        await Proyecto.create({ proyecto, url, propietario: idUsuario });

        res.redirect('/inicio');
        
    } catch (error) {
        console.log('Error al registrar el usuario', error);
    }
}

const tareasPagina = async (req, res) => {
    //Obtener url
    const url = req.query.url;

    //Obtener los datos del proyecto
    try {
        const proyecto = await Proyecto.findOne({ where: { url: url }});

        return res.render('proyectos/tareas', {
            titulo: proyecto.proyecto,
            usuario: req.user,
            proyecto
        });

    } catch (error) {
        console.log('Error al obtener los datos del proyecto', error);
    }
}

const eliminarProyecto = async (req, res) => {
    //Obtener id de la url
    const id = req.query.id;

    try {
        await Proyecto.destroy({ where: { id: id }});

        return res.redirect('/inicio');

    } catch (error) {
        console.log('Error al eliminar el proyecto', error);
    }
}

export {
    inicioPagina,
    proyectoPagina,
    guardarProycto,
    tareasPagina,
    eliminarProyecto
}