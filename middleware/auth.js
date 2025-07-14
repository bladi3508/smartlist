// Importaciones de Dependencias
import passport from 'passport';

const usuarioAutenticado = (req, res, next) => {
    // Verificar si el usuario esta autenticado
    if (req.isAuthenticated()) {
        return next(); // En caso de exito continuar
    }
    
    // Guardar la URL original para redireccionar después del login
    req.session.returnTo = req.originalUrl;
    
    // Redireccionar al login en caso de no estar autenticado
    return res.redirect('/');
};


const datosUsuario = (req, res, next) => {
    // Almacenar los datos del usuario para renderizar en las vistas
    res.locals.usuario = req.user || null;
    res.locals.isAutenticado = req.isAuthenticated();
    next();
};





export {
    usuarioAutenticado,
    datosUsuario
}