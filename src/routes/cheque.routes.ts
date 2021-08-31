import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ChequeController } from '../controllers/cheques.controllers';

const router = Router();

// Cheques por ID
// GET - http://localhost:3000/api/cheques/:id 
router.get('/:id', validaciones.jwt, ChequeController.getCheque);

// Listar cheques
// GET - http://localhost:3000/api/cheques
router.get('/', validaciones.jwt, ChequeController.listarCheques);

// Nuevo cheque
// POST - http://localhost:3000/api/cheques
router.post('/', [
    validaciones.jwt,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], ChequeController.nuevoCheque);

// Actualizar cheque
// PUT - http://localhost:3000/api/cheques/:id
router.put('/:id', validaciones.jwt, ChequeController.actualizarCheque);

export default router;
