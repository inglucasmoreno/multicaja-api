import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ExternoController } from '../controllers/externos.controllers';

const router = Router();

// Externo por ID
// GET - http://localhost:3000/api/externos/:id 
router.get('/:id', validaciones.jwt, ExternoController.getExterno);

// Listar externos
// GET - http://localhost:3000/api/externos
router.get('/', validaciones.jwt, ExternoController.listarExternos);

// Nuevo externo
// POST - http://localhost:3000/api/externos
router.post('/', [
    validaciones.jwt,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], ExternoController.nuevoExterno);

// Actualizar externo
// PUT - http://localhost:3000/api/externos/:id
router.put('/:id', validaciones.jwt, ExternoController.actualizarExterno);

export default router;
