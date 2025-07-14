//Importar modelo
import { User } from "../models/Usuario.js";

//Importar helpers
import { encriptarPassword, compararPasswords } from "../helpers/funciones.js";
import { where } from "sequelize";


const informacionUsuario = async (req, res) => {

    return res.render('proyectos/perfil', {
        titulo: 'Perfil',
        usuario: req.user
    });
}

const cambiarInfoPagian = async (req, res) => {

    return res.render('proyectos/datos-edit', {
        titulo: 'Cambiar nombre de usuario',
        usuario: req.user
    });
}

const cambiarUserName = async (req, res) => {
    const nuevoNombre = req.body.nombre;
    const alertas = [];

    if(nuevoNombre.trim() === ''){
        alertas.push({ tipo: 'danger', mensaje: 'El nombre de usuario es obligatorio' });

        return res.render('proyectos/datos-edit', {
            titulo: 'Cambiar nombre de usuario',
            usuario: req.user,
            alertas
        });
    }

    try {
        await User.update( { nombre: nuevoNombre}, { where: { id: req.user.id } });

        alertas.push({ tipo: 'success', mensaje: 'Cambio de nombre exitoso' });

        return res.redirect('/perfil');

    } catch (error) {
        alertas.push({ tipo: 'danger', mensaje: 'Error al cambiar el nombre de usuario, intentelo mas tarde' });

        return res.redirect('proyectos/datos-edit', {
            titulo: 'Cambiar nombre de usuario',
            usuario: req.user,
            alertas
        });
    }
}

const cambiarPasswordPagina = (req, res) => {
    res.render('proyectos/cambiar-pass',{
        titulo: 'Cambio de contraseña',
        usuario: req.user,
    })
}

const cambiarPassword = async (req, res) =>{
    const { password, nuevoPass } = req.body;
    const usuario = await User.findOne({ where: { id: req.user.id } });
    const alertas = [];

    //Validar que los campos no esten vacios
    if(password.trim() === ''){
        alertas.push({ tipo: 'danger', mensaje: 'Favor de colocar tu contraseña actual' });
    }

    if(nuevoPass.trim() === ''){
        alertas.push({ tipo: 'danger', mensaje: 'La nueva contraseña es obligatoria' });
    }

    if(nuevoPass.length < 6){
        alertas.push({ tipo: 'danger', mensaje: 'La nueva contraseña debe tener almenos 6 caracteres' });
    }

    if(alertas.length > 0){
        return res.render('proyectos/cambiar-pass',{
            titulo: 'Cambio de contraseña',
            usuario: req.user,
            alertas
        });
    }

    //Comparar la contraseña actual
    const comparacion = await compararPasswords(password, usuario.password);

    if(!comparacion){
        alertas.push({ tipo: 'danger', mensaje: 'Tu contraseña actual no coincide, verifique nuevamente' });

        return res.render('proyectos/cambiar-pass',{
            titulo: 'Cambio de contraseña',
            usuario: req.user,
            alertas
        });
    }

    const nuevaContraseña = await encriptarPassword(nuevoPass);

    try {
        //Actualizar contraseña
        await User.update({ password: nuevaContraseña }, { where: { id: usuario.id } });

        alertas.push({ tipo: 'success', mensaje: 'Se cambio la cotraseña con exito' });

        return res.render('proyectos/perfil', {
            titulo: 'Perfil',
            usuario: req.user,
            alertas
        });

    } catch (error) {
        alertas.push({ tipo: 'danger', mensaje: 'Error al cambiar de contraseña, intentelo mas tarde' });

        console.log(error);

        return res.render('proyectos/cambiar-pass',{
            titulo: 'Cambio de contraseña',
            usuario: req.user,
            alertas
        });

    }
}

export {
    informacionUsuario,
    cambiarInfoPagian,
    cambiarUserName,
    cambiarPasswordPagina,
    cambiarPassword
}