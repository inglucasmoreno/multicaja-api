import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { CuentaContableController } from '../controllers/cuenta_contable.controllers';

const router = Router();

// Cuenta contable por ID
// GET - http://localhost:3000/api/cuenta-contable/:id 
router.get('/:id', validaciones.jwt, CuentaContableController.getCuentaContable);

// Listar cuentas contables
// GET - http://localhost:3000/api/cuenta-contable
router.get('/', validaciones.jwt, CuentaContableController.listarCuentaContable);

// Nueva cuenta contable
// POST - http://localhost:3000/api/cuenta-contable
router.post('/', [
    validaciones.jwt,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], CuentaContableController.nuevaCuentaContable);

// Actualizar cuenta contable
// PUT - http://localhost:3000/api/cuenta-contable/:id
router.put('/:id', validaciones.jwt, CuentaContableController.actualizarCuentaContable);

export default router;
