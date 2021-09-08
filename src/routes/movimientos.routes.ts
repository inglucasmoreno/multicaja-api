import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { MovimientoController } from '../controllers/movimientos.controllers';

const router = Router();

// Movimiento por ID
// GET - http://localhost:3000/api/movimientos/:id
router.get('/:id', validaciones.jwt, MovimientoController.getMovimiento);

// Listar movimientos
// GET - http://localhost:3000/api/movimientos
router.get('/', validaciones.jwt, MovimientoController.listarMovimientos);

// Nuevo movimiento
// POST - http://localhost:3000/api/movimientos
router.post('/', validaciones.jwt, MovimientoController.nuevoMovimiento);

// Cobrar cheque
// POST - http://localhost:3000/api/movimientos/cobrar-cheque
router.post('/cobrar-cheque', validaciones.jwt, MovimientoController.cobrarCheque);

// Transferir cheque
// POST - http://localhost:3000/api/movimientos/transferir-cheque
router.post('/transferir-cheque', validaciones.jwt, MovimientoController.transferirCheque);


export default router;