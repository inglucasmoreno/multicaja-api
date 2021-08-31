import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { TipoMovimientoController } from '../controllers/tipo_movimiento.controllers';

const router = Router();

// tipo por ID
// GET - http://localhost:3000/api/tipo-movimientos/:id 
router.get('/:id', validaciones.jwt, TipoMovimientoController.getTipo);

// Listar tipos
// GET - http://localhost:3000/api/tipo-movimientos
router.get('/', validaciones.jwt, TipoMovimientoController.listarTipos);

// Nuevo tipo
// POST - http://localhost:3000/api/tipo-movimientos
router.post('/', [
    validaciones.jwt,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], TipoMovimientoController.nuevoTipo);

// Actualizar tipo
// PUT - http://localhost:3000/api/tipo-movimiento/:id
router.put('/:id', validaciones.jwt, TipoMovimientoController.actualizarTipo);

export default router;
