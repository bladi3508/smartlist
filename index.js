//Importar dependencias
import express from "express"; //Express
import dotenv from "dotenv";

//Importar Routing
import router from "./routers/routers.js"; //Rutas

//Importar la base de datos
import DB from "./config/database.js"; //Base de datos
import { setupAsUsuarioProyecto } from "./models/associations.js";

//Importar dependencias para sesones de usuarios
import session from "express-session";
import passport from "passport";
import './config/passport.js';

//Importar moddleware para protección de rutas y datos de usuario
import { datosUsuario } from "./middleware/auth.js";

//Instanciar Express
const app = express();

//Intanciar dotenv
dotenv.config();

//Configuración de sesión
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

//Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//Datos globales de usuario con Middleware
app.use(datosUsuario);

//Conectar a la Base de datos
try {
   await DB.authenticate();
   setupAsUsuarioProyecto();
   
   console.log('Conexion a la base de datos exitosa'); 
} catch (error) {
    console.log('Falla al conectar a la base de datos', error);
}

//Definir puerto
const port = process.env.PORT || 4000;

//Definir la carpeta con archivos estaticos
app.use(express.static('public'));

//Definir PUG como motor de vistas
app.set('view engine', 'pug')

//Habilitar el body Parse para leer los datos de los formulariios
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(port, () => {
    console.log(`El servisor esta corriendo en el puerto ${port}`);
})