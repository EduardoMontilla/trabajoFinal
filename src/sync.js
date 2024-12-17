const sequelize = require('./config/db');
// const Cliente = require('./models/Cliente'); 
const Cliente = require('./models/Usuario'); 

const sincronizarBaseDeDatos = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');

        // Sincronizar todos los modelos
        await sequelize.sync(); 
        console.log('Modelos sincronizados correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);        
    }
};

// module.exports = sincronizarBaseDeDatos;
sincronizarBaseDeDatos();
