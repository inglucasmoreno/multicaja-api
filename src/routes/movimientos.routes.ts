import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { MovimientoController } from '../controllers/movimientos.controllers';

const router = Router();

// Nuevo movimiento
// POST - http://localhost:3000/api/movimientos
router.post('/', validaciones.jwt, MovimientoController.nuevoMovimiento);

// Listar movimientos
// GET - http://localhost:3000/api/movimientos
router.get('/', validaciones.jwt, MovimientoController.listarMovimientos);

export default router;