const Pago = require('./Pago');
// const db = require('../config/db');



// Crear un nuevo pago
exports.crearPago = async (datos) => {
    const nuevoPago = await Pago.create(datos);
    return nuevoPago;
};

// Obtener todos los pagos
exports.obtenerPagos = async () => {
    const pagos = await Pago.findAll();
    return pagos;
};

// Obtener pago por ID
exports.obtenerPagoPorId = async (id) => {
    const pago = await Pago.findByPk(id); // findByPk busca por llave primaria
    return pago;
};

// Actualizar pago
exports.actualizarPago = async (id, datos) => {
    const pago = await Pago.findByPk(id);
    if (!pago) return null;

    await pago.update(datos);
    return pago;
};

// Eliminar pago
exports.eliminarPago = async (id) => {
    const pago = await Pago.findByPk(id);
    if (!pago) return null;

    await pago.destroy();
    return pago;
};






// Obtener total de pagos realizados
exports.obtenerTotalPagos = async () => {
    const totalPagos = await Pago.count(); 
    return totalPagos;
};

//total en cartera
// exports.obtenerTotalCartera = async () => {
//     try {
//         const [resultados] = await db.query(`
//             SELECT cliente_id, 
//                    MAX(fecha_pago) AS fecha_reciente, 
//                    saldo 
//             FROM pagos 
//             GROUP BY cliente_id
//         `);

//         // Calcular el total sumando los saldos recientes
//         const totalCartera = resultados.reduce((total, cliente) => {
//             return total + parseFloat(cliente.saldo || 0);
//         }, 0);

//         return { totalCartera, detalle: resultados };
//     } catch (error) {
//         console.error('Error al calcular el total en cartera:', error);
//         throw new Error('Error al calcular el total en cartera');
//     }
// };


// Obtener pagos por cliente
exports.obtenerPagosPorCliente = async (clienteId) => {
    console.log('Cliente ID recibido:', clienteId, 'Tipo:', typeof clienteId);
    let id;
    if (typeof clienteId === 'object' && clienteId !== null) {
        id = clienteId.where?.cliente_id || clienteId.cliente_id || null;
    } else {
        id = clienteId;
    }
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
        console.error('Error: clienteId no es válido:', id);
        throw new Error('El clienteId debe ser un número o string válido');
    }
    const pagos = await Pago.findAll({
        where: { cliente_id: id },
    });
    return pagos;
};

// Obtener el total pagado en un día específico
exports.obtenerTotalPagadoPorDia = async (fecha) => {
    console.log('esta es la fecha que llega al modelo',fecha)
    const totalPorDia = await Pago.sum('cuota', {
        where: {
            fecha_pago: fecha // Asegúrate de que 'fecha_pago' es el campo correcto
        }
    });
    return totalPorDia;
};

// Obtener pagos atrasados
exports.obtenerPagosAtrasados = async () => {
    const pagosAtrasados = await Pago.findAll({
        where: { estado: 'retrasado' }, // Filtra por el estado 'Atrasado'
    });
    return pagosAtrasados;
};

// Obtener cliente más cumplido e incumplido
// En el modelo Pago
exports.obtenerClientesCumplimiento = async () => {
    try {
        // Obtener los pagos de clientes
        return await Pago.findAll({
            attributes: ['cliente_id', 'estado'],
            raw: true, // Esto hace que se obtengan los resultados como un arreglo de objetos simples
        });
    } catch (error) {
        console.error('Error al obtener los pagos de los clientes:', error);
        throw error;
    }
};

