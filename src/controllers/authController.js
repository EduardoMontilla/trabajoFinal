const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const usuarios = require('../models/Usuario');

dotenv.config();

// Iniciar sesión y generar token
exports.login = async (req, res) => {
    const { login, clave } = req.body;

    const usr = await usuarios.findOne({ where: { login: login} });

    if (!usr) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log(usr);

    const isPasswordValid = await bcrypt.compare(clave, usr.clave);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usr.id, login: usr.login, name: usr.nombre }, process.env.JWT_SECRET, {
        expiresIn: '12h',
    });

    res.json({ token });
};
