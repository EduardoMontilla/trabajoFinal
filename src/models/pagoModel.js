const Pago = require('./Pago');
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
    const totalPagos = await Pago.count(); // Suma todas las cuotas de la tabla
    return totalPagos;
};

// Obtener pagos por cliente
exports.obtenerPagosPorCliente = async (clienteId) => {
    const pagos = await Pago.findAll({
        where: { cliente_id: clienteId }, // Filtra por el ID del cliente
    });
    return pagos;
};

// Obtener el total pagado en un día específico
exports.obtenerTotalPagadoPorDia = async (fecha) => {
    const totalPorDia = await Pago.sum('cuota', {
        where: { fecha_pago: fecha },
    });
    return totalPorDia;
};

// Obtener pagos atrasados
exports.obtenerPagosAtrasados = async () => {
    const pagosAtrasados = await Pago.findAll({
        where: { estado: 'Atrasado' }, // Filtra por el estado 'Atrasado'
    });
    return pagosAtrasados;
};

// Obtener cliente más cumplido e incumplido
exports.obtenerClientesCumplimiento = async () => {
    const clientesPagos = await Pago.findAll({
        attributes: ['cliente_id', 'estado'],
        raw: true,
    });

    // Procesar datos para calcular cumplimiento
    const cumplimiento = {};
    clientesPagos.forEach((pago) => {
        const { cliente_id, estado } = pago;
        if (!cumplimiento[cliente_id]) {
            cumplimiento[cliente_id] = { cumplido: 0, incumplido: 0 };
        }
        if (estado === 'Pagado') {
            cumplimiento[cliente_id].cumplido++;
        } else {
            cumplimiento[cliente_id].incumplido++;
        }
    });

    // Identificar más cumplido e incumplido
    let clienteMasCumplido = null;
    let clienteMasIncumplido = null;
    let maxCumplido = -Infinity;
    let maxIncumplido = -Infinity;

    for (const clienteId in cumplimiento) {
        const { cumplido, incumplido } = cumplimiento[clienteId];
        if (cumplido > maxCumplido) {
            maxCumplido = cumplido;
            clienteMasCumplido = clienteId;
        }
        if (incumplido > maxIncumplido) {
            maxIncumplido = incumplido;
            clienteMasIncumplido = clienteId;
        }
    }

    return {
        clienteMasCumplido,
        clienteMasIncumplido,
    };
};