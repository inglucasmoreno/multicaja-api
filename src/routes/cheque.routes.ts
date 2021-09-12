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

// Listar cheques EMITIDOS
// GET - http://localhost:3000/api/cartera/:id
router.get('/listar/emitidos/:id', validaciones.jwt, ChequeController.listarChequesPorEmpresaEmitidos);

// Nuevo cheque
// POST - http://localhost:3000/api/cheques
router.post('/', [
    validaciones.jwt,
], ChequeController.nuevoCheque);

// Cheque emitido cobrado
// POST - http://localhost:3000/api/cheques/emitido/cobrado
router.post('/emitido/cobrado', [
    validaciones.jwt,
], ChequeController.emitidoCobrado);

// Nuevo cheque desde cartera
// POST - http://localhost:3000/api/cheques/crear
router.post('/crear', [
    validaciones.jwt,
], ChequeController.nuevoChequeDesdeCartera);

// Emitir cheque
// POST - http://localhost:3000/api/cheques/emitir
router.post('/emitir', [
    validaciones.jwt,
], ChequeController.emitirCheque);

// Actualizar cheque
// PUT - http://localhost:3000/api/cheques/:id
router.put('/:id', validaciones.jwt, ChequeController.actualizarCheque);

export default router;
