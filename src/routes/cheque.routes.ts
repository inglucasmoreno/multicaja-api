import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ChequeController } from '../controllers/cheques.controllers';

const router = Router();

// Cheques por ID
// GET - http://localhost:3000/api/cheques/:id 
router.get('/:id', validaciones.jwt, ChequeController.getCheque);

// Listar cheques
// GET - http://localhost:3000/api/cheques/:id
router.get('/cartera/:id', validaciones.jwt, ChequeController.listarChequesPorEmpresa);

// Nuevo cheque
// POST - http://localhost:3000/api/cheques
router.post('/', [
    validaciones.jwt,
], ChequeController.nuevoCheque);

// Nuevo cheque desde cartera
// POST - http://localhost:3000/api/cheques/crear
router.post('/crear', [
    validaciones.jwt,
], ChequeController.nuevoChequeDesdeCartera);

// Actualizar cheque
// PUT - http://localhost:3000/api/cheques/:id
router.put('/:id', validaciones.jwt, ChequeController.actualizarCheque);

export default router;
