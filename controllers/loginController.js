//Importar el modelo
import { User } from "../models/Usuario.js"; //Modelo Usuario
import { confirmacionEmail, instruccionesEmail} from "../models/nodeMailer.js";

//Importar helpers
import { encriptarPassword, generarToken, compararPasswords } from "../helpers/funciones.js";
import { where } from "sequelize";

//Importar Passport para iniciar sesión
import passport from "passport";

//Metodos
//Pagina de Inicio de Sesión
const loginPagina = (req, res) => {
  return res.render("login/login", {
    titulo: "Inicio de Sesión",
    clase: "login",
  });
};

const autenticarUsuario = async (req, res) => {
  //Obtener los valores de los campos en variables
  const { correo, password } = req.body;

  const alertas = [];

  //Validar que los campos no esten vacíos
  if(correo.trim() === ''){
    alertas.push({ tipo: 'danger', mensaje: 'Favor de colocar tu correo electrónico'});
  }

  if(password.trim() === ''){
    alertas.push({ tipo: 'danger', mensaje: 'Favor de ingresar tu contraseña'});
  }

  if(alertas.length > 0){
    return res.render("login/login", {
      titulo: "Inicio de Sesión",
      clase: "login",
      alertas
    });
  }

  
  try {
    //Validar si el usuario existe
    const usuario = await User.findOne({ where: { email: correo }});

    if(!usuario){
      alertas.push({ tipo: 'danger', mensaje: 'El usuario no se encuentra registrado' });

      return res.render("login/login", {
        titulo: "Inicio de Sesión",
        clase: "login",
        alertas
      });
    }

    //Validar la contraseña
    const resultado = await compararPasswords(password, usuario.password);

    if(!resultado ){
      alertas.push({ tipo: 'danger', mensaje: 'La contraseña es incorrecta' });

      return res.render("login/login", {
        titulo: "Inicio de Sesión",
        clase: "login",
        alertas
      });
    }

    //Logear al usuario
    await new Promise((resolve, reject) => {
      req.login(usuario, (err) => {
        if(err){
          console.log('Error al iniciar sesión', err);
          reject(err);
          return;
        }

        console.log('Session iniciada para: ', {
          id: req.user.id,
          nombre: req.user.nombre,
          email: req.user.email
        });

        resolve();
      })
    });

    //Guardar la sesión
    await req.session.save();

    return res.redirect('/inicio');

  } catch (error) {
    console.log('Error al iniciar sesión');
  }

}

//Metodo para cerrar Sesión
const cerrarSesion = (req, res) => {
  //Destruir la sesión que se guarda en passport
  req.logout((err) => {
    if(err){
      console.error('Error al cerrar sesión', err);
      return res.redirect('/inicio');
    }

    //Destruir las cockies de la sesion guardadas en el navegador
    req.session.destroy((err) => {
      if(err){
        console.error('Error al destruir la sesión', err);
        return res.redirect('/inicio');
      }

      //Limpiar cockies
      res.clearCookie('connect.sid');

      //Redirigir al login
      res.redirect('/');

    });
  });
}

//Pagina para el registro de Usuarios
const registroPagina = (req, res) => {
  return res.render("login/registro", {
    titulo: "Registro",
    clase: "login",
  });
};

const guardarUsuario = async (req, res) => {
  const { nombre, email, password, password2 } = req.body;

  //Errores
  const errores = [];

  //Validar que los campos no esten vacios
  if (nombre.trim() === "") {
    errores.push({ tipo: 'danger', mensaje: "El nombre es obligatorio" });
  }

  if (email.trim() === "") {
    errores.push({ tipo: 'danger', mensaje: "El campo de correo es obligatorio" });
  }

  if (password.trim() === "" && password.length < 6) {
    errores.push({ tipo: 'danger', mensaje: "La contraseña es obligatoria" });
  }

  if (password.length < 6) {
    errores.push({ tipo: 'danger', mensaje: "La contraseña debe tener 6 caracteres minimo." });
  }

  //Verificar si el arreglo de errores tiene mensajes
  if (errores.length > 0) {
    //Mostra la vista con errores
    return res.render("login/registro", {
      titulo: "Registro",
      clase: "login",
      nombre,
      email,
      errores,
    });
  }

  //Validar el campo de confirmar contraseña
  if (password2.trim() === "") {
    errores.push({ tipo: 'danger', mensaje: "Favor de confirmar tu contraseña" });

    //Mostra la vista con errores
    return res.render("login/registro", {
      titulo: "Registro",
      clase: "login",
      nombre,
      email,
      errores,
    });
  }

  //Validar que las dos contraseñas coincidan
  if (password !== password2) {
    errores.push({
      tipo: 'danger',
      mensaje: "La contraseña no coincide, verifique por favor.",
    });

    //Mostra la vista con errores
    return res.render("login/registro", {
      titulo: "Registro",
      clase: "login",
      nombre,
      email,
      errores,
    });
  }

  //Se hashea el password
  const passwordHash = await encriptarPassword(password);

  //Validar la existencia del usuario
  const usuarioExiste = await User.findOne({ where: { email: email } });

  if (usuarioExiste) {
    errores.push({ tipo: 'danger', mensaje: "El correo ya se encuentra registrado" });

    //Mostra la vista con errores
    return res.render("login/registro", {
      titulo: "Registro",
      clase: "login",
      nombre,
      email,
      errores,
    });
  }

  //Guardar al usuario
  const token = generarToken(); //Generar Token

  try {
    //Enviar el correo
    await confirmacionEmail(nombre, email, token);

    //Guardar al usuario
    await User.create({ nombre, email, password: passwordHash, token });

    res.redirect("/exito");

  } catch (error) {
    console.log("Falla al registrar al usuario", error);
  }
           
};

//Metodo para mostra la pagina de olvide mi contraseña
const olvidePagina = (req, res) => {
  return res.render("login/olvide", {
    titulo: "Olvide mi contraseña",
    clase: "login",
  });
};

const enviarInstrucciones = async (req, res) => {
  const correo = req.body.correo;

  //Mensajes de errores
  const errores = [];

  //Validar que el campo correo no se encuntre vacío
  if(correo.trim() === ''){
    errores.push({ tipo: 'danger', mensaje: 'Favor de proporcionarnos tu correo electrónico'});

    return res.render("login/olvide", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });
  }

  //Validar si el correo se encuentra registrado
  const correoUsuario = await User.findOne({ where: { email: correo }});

  if(!correoUsuario){
    errores.push({ tipo: 'danger', mensaje: 'El correo no se encuentra registrado'});

    return res.render("login/olvide", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });
  }

  //Generar token
  const token = generarToken();

  //Actualizar Usuario con un token nuevo
  await User.update({ token: token }, { where: { email: correo }});

  //Enviar correo
  instruccionesEmail(correoUsuario.nombre, correo, token);

  errores.push({ tipo: 'success', mensaje: 'Se han enviado las instrucciones a tu correo, favor de revisar'});

  return res.render("login/olvide", {
    titulo: "Olvide mi contraseña",
    clase: "login",
    errores
  });
}

const cambioPagina = async (req, res) => {
  return res.render("login/cambio", {
    titulo: "Olvide mi contraseña",
    clase: "login",
  });
}

const cambiarContraseña = async (req, res) => {
  
  const token = req.query.token;

  //Arreglo de errores
  const errores = [];

  //Obtener las vareables
  const { password, password2 } = req.body;

  //Ubicar al usuario
  const usuario = await User.findOne({ where: { token: token } });

  //console.log(usuario);

  //Validar el campo password y que tenga 6 caracteres
  if(password.trim() === ''){
    errores.push({ tipo: 'danger', mensaje: "La contraseña es obligatoria" });

    return res.render("login/cambio", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });
  }

  if (password.length < 6) {
    errores.push({ tipo: 'danger', mensaje: "La contraseña debe tener 6 caracteres minimo" });

    return res.render("login/cambio", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });
  }

  //Validar que los password coincidan
  if(password !== password2){
    errores.push({ tipo: 'danger', mensaje: "La contraseña no coincide, favor de verificar" });

    return res.render("login/cambio", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });
  }

  //Validar si existe el usuario con el token
  if(!usuario){
    errores.push({ tipo: 'danger', mensaje: "El usuario al que deseas cambiar la contraseña, no existe o no lo ha solicitado" });

    return res.render("login/cambio", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });
  }

  //Encriptar nuevo password
  const passwordNuevo = await encriptarPassword(password);

  try {
    //Actualizar usuario con nuevo password
    await User.update({ password: passwordNuevo, token: null }, { where: { token: token }});

    //Mensaje de exito
    errores.push({ tipo: 'success', mensaje: "La contraseña ha sido cambiada con éxito" });

    return res.render("login/cambio", {
      titulo: "Olvide mi contraseña",
      clase: "login",
      errores
    });

  } catch (error) {
    console.log('Falla al actualizar el password', error)
  }
  
}

//Exito al crear tu cuenta
const exitoPagina = (req, res) => {
  res.render("login/exito-mensaje", {
    titulo: "Cuenta creada",
    clase: "login",
  });
};

const confirmacionPagina = async (req, res) => {
  //Obtener el parametro de la url
  const token = req.query.token;

  //Obtener al usuario mediante el Token
  const usuario = await User.findOne({ where: { token: token }});

  let mensaje

  //Validar si se encontro al usuario con el Token registrado
  if(!usuario){
    mensaje = 'Token no encontrado, al parecer la cuenta ya fue confirmada o no a sido creada,'+
              ' <a href="/" class="alert-link"> Ir a inicio';

    return res.render("login/confirmacion", {
      titulo: "Confirmación de cuenta",
      clase: "login",
      mensaje
    });
  }

  mensaje = 'Tu cuenta ha sido confirmada correctamente, ingresa ahora y comienza a gestionar tus '+ 
              'proyectos <a href="/" class="alert-link">Iniciar Sesión</a>';

  //Actualizar al usuario
  await User.update({ token: null, confirmado: 1 }, { where: { token: token }});

  return res.render("login/confirmacion", {
    titulo: "Confirmación de cuenta",
    clase: "login",
    mensaje
  });

}

//Exportar metodos
export {
  loginPagina,
  autenticarUsuario,
  cerrarSesion,
  registroPagina,
  olvidePagina,
  enviarInstrucciones,
  cambioPagina,
  cambiarContraseña,
  exitoPagina,
  guardarUsuario,
  confirmacionPagina
};
