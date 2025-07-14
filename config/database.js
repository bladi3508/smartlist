//Importar dependencias
import Sequelize from "sequelize"; //Sequelize
import dotenv from "dotenv";

dotenv.config();

//Definir la base de datos
const DB = new Sequelize(process.env.DB_URL, {
    define: {
        timestamps: false
    },
    pool: {
        max: 3,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

//Esportar
export default DB;