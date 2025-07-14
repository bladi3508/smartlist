//Importar dependencias
import bcrypt from "bcrypt";
import crypto from "crypto";

//Encriptar Password
const encriptarPassword = async (password) => {
    const saltRounds = 10;

    try {
        //Hashear password
        const hash = await bcrypt.hash(password, saltRounds);
        //Retornar password hasheado
        return hash;

    } catch (error) {
        console.log(error)

    }

}

//Comparar contraseñas
const compararPasswords = async (password, userPassword) => {
    //Comparar las contraseñas
    try {
        const coinciden = bcrypt.compare(password, userPassword);

        return coinciden;
    } catch (error) {
        console.log('Error al comparar contraseñas', error);
    }
}

//Generar Token de confirmación
const generarToken = () => {
    return crypto.randomBytes(7).toString('hex');
}


export {
    encriptarPassword,
    compararPasswords,
    generarToken
}