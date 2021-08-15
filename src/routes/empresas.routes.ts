import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { EmpresaController } from '../controllers/empresas.controllers';

const router = Router();

// Empresa por ID
// GET - http://localhost:3000/api/empresas 
router.get('/:id', validaciones.jwt, EmpresaController.getEmpresa);

// Saldos por ID
// GET - http://localhost:3000/api/empresas/saldos/:id 
router.get('/saldos/:id', validaciones.jwt, EmpresaController.getSaldo);

// Listar empresas
// GET - http://localhost:3000/api/empresas 
router.get('/', validaciones.jwt, EmpresaController.listarEmpresas);

// Listar saldos por Empresa
// GET - http://localhost:3000/api/empresas/saldos/:empresa 
router.get('/saldos/lista/:empresa', validaciones.jwt, EmpresaController.listarSaldos);

// Nueva empresa
// POST - http://localhost:3000/api/empresas 
router.post('/', [
    validaciones.jwt,
    check('razon_social', 'La razon social es obligatoria').not().isEmpty()
], EmpresaController.nuevaEmpresa);

// Nuevo saldo
// post - http://localhost:3000/api/empresas/saldos 
router.post('/saldos', [
    validaciones.jwt,
    check('empresa', 'La empresa es un campo obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('monto', 'El monto es obligatorio').not().isEmpty()
], EmpresaController.nuevoSaldo);

// Actualizar empresa
// PUT - http://localhost:3000/api/empresas/:id
router.put('/:id', validaciones.jwt, EmpresaController.actualizarEmpresa);

// Actualizar saldo
// GET - http://localhost:3000/api/empresas/saldos/:id 
router.put('/saldos/:id', validaciones.jwt, EmpresaController.actualizarSaldo);


export default router;
