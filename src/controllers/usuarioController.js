const Usuario = require('../models/Usuario');

// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (id) => {    
    
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error("Usuario no encontrado...");             
        }
        return usuario;    
};
