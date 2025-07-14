import express from "express"; //Importar Express
import multer from "multer";

//Metodos para mostrar las paginas del login
import { loginPagina, autenticarUsuario, registroPagina, guardarUsuario, olvidePagina, enviarInstrucciones,
        cambioPagina, cambiarContraseña, exitoPagina, confirmacionPagina, cerrarSesion} from "../controllers/loginController.js";

//Metodos para mostrar las paginas de los proyectos
import { inicioPagina, proyectoPagina, tareasPagina, guardarProycto, eliminarProyecto } from "../controllers/proyectosController.js"; 

//Metodos de la API
import { agregarTarea, mostrarTareas, actualizarTarea, eliminarTarea } from "../controllers/tareasController.js";

//Metodos para la información de usuario
import { informacionUsuario, cambiarInfoPagian, cambiarUserName, cambiarPasswordPagina, cambiarPassword } from "../controllers/usuarioController.js";

//Middleware para la proteccion de rutas
import { usuarioAutenticado } from "../middleware/auth.js";

const router = express.Router();
const upload = multer();

//Rutas del Login para el usuario
router.get('/', loginPagina);
router.post('/', autenticarUsuario);
router.get('/logout', cerrarSesion);

//Rutas para el registro de usuario y confirmación de cuenta
router.get('/registro', registroPagina);
router.post('/registro', guardarUsuario);
router.get('/exito', exitoPagina);
router.get('/confirmacion-cuenta', confirmacionPagina);

//Rutas para enviar instrucciones de restaurar contraseña
router.get('/olvide', olvidePagina);
router.post('/olvide', enviarInstrucciones);

//Rutas para el restablecimiento de contraseña
router.get('/restablecer', cambioPagina);
router.post('/restablecer', cambiarContraseña);

//Rutas para las vistas de los proyectos
router.get('/inicio', usuarioAutenticado, inicioPagina);
router.get('/proyecto-crear', usuarioAutenticado, proyectoPagina);
router.post('/proyecto-crear', usuarioAutenticado, guardarProycto);
router.get('/eliminar-proyecto', usuarioAutenticado, eliminarProyecto);
router.get('/proyecto-tareas', usuarioAutenticado, tareasPagina);


//Rutas para la API
router.post('/registrar-tarea', usuarioAutenticado, upload.none(), agregarTarea);
router.get('/tareas', usuarioAutenticado, mostrarTareas);
router.post('/actualizar-tarea', usuarioAutenticado, upload.none(), actualizarTarea);
router.post('/eliminar-tarea', usuarioAutenticado, upload.none(), eliminarTarea);

//Rutas para la información del usuario
router.get('/perfil', usuarioAutenticado, informacionUsuario);
router.get('/editar-perfil', usuarioAutenticado, cambiarInfoPagian);
router.post('/editar-perfil', usuarioAutenticado, cambiarUserName);
router.get('/cambiar-password', usuarioAutenticado, cambiarPasswordPagina);
router.post('/cambiar-password', usuarioAutenticado, cambiarPassword)

export default router;