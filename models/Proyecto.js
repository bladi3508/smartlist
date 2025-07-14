//Importar dependencias
import { Sequelize, DataTypes } from "sequelize";

//Importar la base de datos
import DB from "../config/database.js";

export const Proyecto = DB.define('proyectos', {
    proyecto: DataTypes.STRING,
    url: DataTypes.STRING,
    propietario: DataTypes.INTEGER
});

