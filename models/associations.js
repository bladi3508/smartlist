//Importar modelos
import { User } from "./Usuario.js";
import { Proyecto } from "./Proyecto.js";
import { Tareas } from "./Tarea.js";

export const setupAsUsuarioProyecto = () => {
    User.hasMany(Proyecto, { foreignKey: 'propietario' });
    Proyecto.belongsTo(User, { foreignKey: 'propietario' });

    Proyecto.hasMany(Tareas, { foreignKey: 'proyecto_id' });
    Tareas.belongsTo(Proyecto, { foreignKey: 'proyecto_id' });
    
    console.log('Asociaciones establecidas correctamente');
}