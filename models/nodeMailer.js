//Importar Dependencias
import nodemailer from "nodemailer";
import dotenv from "dotenv";

//Instanciar dotenv
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.APP_PASSWORD
  }
});

const confirmacionEmail = async (nombre, correo, token) => {
    try {
        const email = await transport.sendMail({
            from: '"SmartList" appSolutions@smartlist.com',
            to: correo,
            subject: 'Confirma tu cuenta!',
            text: 'Confirma tu cuenta!',
            html: `
                <h1>Confirmación requerida</h1><p>Hola ${nombre} haz clic en el siguiente enlace para confirmar tu cuenta:</p>
                <a href="${process.env.URL_PAGE}confirmacion-cuenta?token=${token}">Confirmar cuenta</a>
                <p>Si no solicitaste este registro, ignora este mensaje.</p>
            `
        });

        console.log('Correo enviado: %s', email.messageId);
    } catch (error) {
        console.log('Error al enviar el correo', error)
    }
}

const instruccionesEmail = async (nombre, correo, token) => {
    try {
        const email = await transport.sendMail({
            from: '"SmartList" appSolutions@smartlist.com',
            to: correo,
            subject: 'Restablecer contraseña!',
            text: 'Restablecer contraseña!',
            html: `
                <h1>Restablece tu contraseña</h1><p>Hola ${nombre} haz clic en el siguiente enlace para generar una nueva contraseña:</p>
                <a href="${process.env.URL_PAGE}restablecer?token=${token}">Restablecer contraseña</a>
                <p>Si no solicitaste este registro, ignora este mensaje.</p>
            `
        });

        console.log('Correo enviado: %s', email.messageId);
    } catch (error) {
        console.log('Error al enviar el correo', error)
    }
}

export {
    confirmacionEmail,
    instruccionesEmail
}
