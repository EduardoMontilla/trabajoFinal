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

//total en cartera 
// exports.calcularTotalCartera = async (req, res) => {
//     try {
//         const { totalCartera, detalle } = await obtenerTotalCartera();
//         res.status(200).json({ totalCartera, detalle });
//     } catch (error) {
//         console.error('Error al calcular el total en cartera:', error);
//         res.status(500).json({ message: 'Error al calcular el total en cartera', error });
//     }
// };

// Obtener pagos por cliente
exports.obtenerPagosPorCliente = async (req, res) => {
    const { clienteId } = req.params; // Extrae el clienteId de los parámetros
    console.log('Cliente ID recibido en el controlador:', clienteId);

    try {
        const pagos = await Pago.obtenerPagosPorCliente(clienteId);

        if (!pagos.length) {
            return res.status(404).json({ message: 'No se encontraron pagos para este cliente' });
        }
        res.status(200).json(pagos);
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        res.status(500).json({ message: 'Error al obtener los pagos del cliente', error });
    }
};

// Obtener total pagado en un día específico
exports.obtenerTotalPagadoPorDia = async (req, res) => {
    const { fecha } = req.params; // Recibe la fecha desde la URL
    console.log('Fecha recibida:', fecha);

    try {
        // Llama a la función del modelo
        const totalPorDia = await Pago.obtenerTotalPagadoPorDia(fecha);

        if (totalPorDia === null) {
            return res.status(404).json({ message: 'No se encontraron pagos en esta fecha' });
        }
        res.status(200).json({ totalPorDia });
    }
     catch (error) {
        res.status(500).json({ message: 'Error al obtener el total pagado en esta fecha', error });
    }

};


// Obtener pagos atrasados
exports.obtenerPagosAtrasados = async (req, res) => {
    try {
        const pagosAtrasados = await Pago.obtenerPagosAtrasados({
            where: { estado: 'retrasado' }
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
        // Obtener los pagos de los clientes
        const clientesPagos = await Pago.obtenerClientesCumplimiento();
        console.log('Clientes Pagos:', clientesPagos); // Log para revisar los datos obtenidos

        // Verificar si los datos están presentes
        if (!Array.isArray(clientesPagos) || clientesPagos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos de clientes.' });
        }

        const cumplimiento = {};

        // Procesar los pagos y contar los diferentes estados
        clientesPagos.forEach((pago) => {
            const { cliente_id, estado,nombre } = pago;

            if (!cumplimiento[cliente_id]) {
                cumplimiento[cliente_id] = {
                    cumplido: 0,
                    incumplido: 0,
                    nombre,
                    estados: {
                        'a tiempo': 0,
                        'retrasado': 0,
                        'anticipado': 0,
                        'pendiente': 0
                    },
                    // nombre: pago.nombre_cliente  // Asumiendo que el nombre del cliente está en la columna `nombre_cliente` de la tabla `Pago`
                };
            }

            // Actualizar el conteo de los estados
            if (estado === 'a tiempo' || estado === 'anticipado') {
                cumplimiento[cliente_id].cumplido++;
            } else if (estado === 'retrasado' || estado === 'pendiente') {
                cumplimiento[cliente_id].incumplido++;
            }

            // Contar cada estado específico
            if (cumplimiento[cliente_id].estados[estado] !== undefined) {
                cumplimiento[cliente_id].estados[estado]++;
            }
        });

        // Identificar el cliente más cumplido e incumplido
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

        // Resumen solo para el más cumplido y más incumplido
        const resumenClientes = {
            clienteMasCumplido: {
                cliente_id: clienteMasCumplido,
                nombre: cumplimiento[clienteMasCumplido] ? cumplimiento[clienteMasCumplido].nombre : 'No disponible',
                cumplido: cumplimiento[clienteMasCumplido].cumplido,
                incumplido: cumplimiento[clienteMasCumplido].incumplido,
                estados: cumplimiento[clienteMasCumplido].estados
            },
            clienteMasIncumplido: {
                cliente_id: clienteMasIncumplido,
                nombre: cumplimiento[clienteMasIncumplido] ? cumplimiento[clienteMasIncumplido].nombre : 'No disponible',
                cumplido: cumplimiento[clienteMasIncumplido].cumplido,
                incumplido: cumplimiento[clienteMasIncumplido].incumplido,
                estados: cumplimiento[clienteMasIncumplido].estados
            }
        };

        res.status(200).json(resumenClientes);

    } catch (error) {
        console.error('Error al obtener los clientes más cumplidos e incumplidos:', error);
        res.status(500).json({ message: 'Error al obtener los clientes más cumplidos e incumplidos', error: error.message });
    }
};

exports.obtenerCartera = async (req, res) => {
    try {
        const pagos = await Pago.obtenerCartera();
        let total=0;
        pagos.forEach(element => {
            total += parseInt(element.saldo);
        });
        console.log(pagos);
        res.status(200).json(parseInt(total));
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la cartera', error });
    }
};








