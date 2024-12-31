const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { protegerRuta } = require('../middleware/authMiddleware');

// Ruta para crear un pago
router.post('/', pagoController.crearPago);

// Ruta para obtener todos los pagos
router.get('/', pagoController.obtenerPagos);

// Ruta para obtener un pago por su ID
router.get('/id/:id', pagoController.obtenerPagoPorId);

// Ruta para actualizar un pago por su ID
// router.put('/:id', pagoController.actualizarPago);

// Ruta para eliminar un pago por su ID
// router.delete('/:id', pagoController.eliminarPago);

// Ruta para obtener el total de pagos realizados
router.get('/total', pagoController.obtenerTotalPagos);

// router.get('/total/cartera',pagoController.obtenerTotalCartera);

// Ruta para obtener los pagos realizados por un cliente específico
router.get('/cliente/:clienteId', pagoController.obtenerPagosPorCliente);

// Ruta para obtener el total pagado en un día específico
router.get('/totalDia/:fecha', pagoController.obtenerTotalPagadoPorDia);

// Ruta para obtener los pagos atrasados
router.get('/retrasados', pagoController.obtenerPagosAtrasados);

// Ruta para obtener el cliente más cumplido y el más incumplido
router.get('/cumplimiento', pagoController.obtenerClientesCumplimiento);

// Ruta para obtener la cartera total
router.get('/cartera', pagoController.obtenerCartera);

module.exports = router;