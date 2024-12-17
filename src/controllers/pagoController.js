const Pago = require('../models/pagoModel');


// Crear un nuevo pago
exports.crearPago = async (req, res) => {
    try {
        const nuevoPago = await Pago.create(req.body);
        res.status(201).json({ message: 'Pago creado exitosamente', id: nuevoPago.id });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pago', error });
    }
};

// Obtener todos los pagos
exports.obtenerPagos = async (req, res) => {
    try {
        const pagos = await Pago.obtenerPagos();
        console.log('pagos', pagos)
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos', error });
    }
};

// Obtener un pago por su ID
exports.obtenerPagoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const pago = await Pago.obtenerPagoPorId(id);

        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado obtenerPagoPorId' });
        }

        res.status(200).json(pago);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el pago', error });
    }
};

// Actualizar pago
exports.actualizarPago = async (req, res) => {
    const { id } = req.params;

    try {
        const pago = await Pago.actualizarPago(id);

        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado actualizarPago' });
        }

        await pago.update(req.body);
        res.status(200).json({ message: 'Pago actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pago', error });
    }
};

// Eliminar pago
exports.eliminarPago = async (req, res) => {
    const { id } = req.params;

    try {
        const pago = await Pago.eliminarPago(id);

        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado eliminarPago' });
        }

        await pago.destroy();
        res.status(200).json({ message: 'Pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pago', error });
    }
};

// Obtener total de pagos realizados
exports.obtenerTotalPagos = async (req, res) => {
    try {
        const totalPagos = await Pago.obtenerTotalPagos();
        res.status(200).json({ totalPagos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el total de pagos', error });
    }
};

// Obtener pagos por cliente
exports.obtenerPagosPorCliente = async (req, res) => {
    const { clienteId } = req.params;

    try {
        const pagos = await Pago.findAll({
            where: { cliente_id: clienteId }
        });

        if (!pagos.length) {
            return res.status(404).json({ message: 'No se encontraron pagos para este cliente' });
        }

        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos del cliente', error });
    }
};

// Obtener total pagado en un día específico
exports.obtenerTotalPagadoPorDia = async (req, res) => {
    const { fecha } = req.params;

    try {
        const totalPorDia = await Pago.sum('cuota', {
            where: { fecha_pago: fecha }
        });

        if (totalPorDia === null) {
            return res.status(404).json({ message: 'No se encontraron pagos en esta fecha' });
        }

        res.status(200).json({ totalPorDia });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el total pagado en esta fecha', error });
    }
};

// Obtener pagos atrasados
exports.obtenerPagosAtrasados = async (req, res) => {
    try {
        const pagosAtrasados = await Pago.findAll({
            where: { estado: 'Atrasado' }
        });

        if (!pagosAtrasados.length) {
            return res.status(404).json({ message: 'No hay pagos atrasados' });
        }

        res.status(200).json(pagosAtrasados);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos atrasados', error });
    }
};

// Obtener cliente más cumplido e incumplido
exports.obtenerClientesCumplimiento = async (req, res) => {
    try {
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

        res.status(200).json({
            clienteMasCumplido,
            clienteMasIncumplido,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes más cumplidos e incumplidos', error });
    }
};
