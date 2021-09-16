import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { CentroCostosController } from '../controllers/centro_costos.controllers';

const router = Router();

// Centro de costos por ID
// GET - http://localhost:3000/api/centro-costos/:id 
router.get('/:id', validaciones.jwt, CentroCostosController.getCentroCosto);

// Listar centro de costos
// GET - http://localhost:3000/api/centro-costos
router.get('/', validaciones.jwt, CentroCostosController.listarCentrosCostos);

// Nuevo centro de costos
// POST - http://localhost:3000/api/centro-costos
router.post('/', [
    validaciones.jwt,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], CentroCostosController.nuevoCentroCostos);

// Actualizar centro de costos
// PUT - http://localhost:3000/api/centro-costos/:id
router.put('/:id', validaciones.jwt, CentroCostosController.actualizarCentroCostos);

export default router;
