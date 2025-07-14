//Importar dependencias 
import { Sequelize, DataTypes } from "sequelize";

//Importar la base de datos
import DB from "../config/database.js";

export const Tareas = DB.define('tareas', {
    nombre: DataTypes.STRING,
    estado: DataTypes.TINYINT,
    proyecto_id: DataTypes.INTEGER
});