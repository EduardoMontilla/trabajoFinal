const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cuota: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    tableName: 'pagos',
    timestamps: false,
});

module.exports = Pago;