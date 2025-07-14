En este proyecto que originalmente inicio como una aplicación monolítica con:
- Frontend: JavaScript, CSS3 y HTML
- Backend: PHP sin frameworks
- Base de datos: MySQL consultas directas

¿Que fue lo que cambio?
Migré el sistema a un stack mas moderno para mejorar:
Rendimiento:
 - Backend: Node.js y express (API REST)
 - Frontend: CSS3, Renderizador de plantillas PUG y Bootstrap 5 (Diseño responsivo)
 - Base de datos: Sequelize (ORM para MySQL)
 - Login: Passport para el manejo de sesiones
 - Correos: Nodemailer para el manejo de correos de confirmación
Escalavilidad
 - Arquitectura MVC
 - Variables de entorno con dotenv
 - Implementación de ESModules(import/export)

Resultados:
- Tiempo de respuesta reducido en un 40%.  
- Código más mantenible y modular.
