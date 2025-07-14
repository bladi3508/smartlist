//Importar Dependencias
import { Sequelize, DataTypes } from "sequelize";

//Importar la base de datos
import DB from "../config/database.js";

export const User = DB.define('usuarios', {
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    confirmado: DataTypes.TINYINT
});

