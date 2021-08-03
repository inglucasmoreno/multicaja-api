import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { EmpresaController } from '../controllers/empresas.controllers';

const router = Router();

// getEmpresa
router.get('/:id', validaciones.jwt, EmpresaController.getEmpresa);

// Listar empresas
router.get('/', validaciones.jwt, EmpresaController.listarEmpresas);

// Nueva empresa
router.post('/', [
    validaciones.jwt,
    check('razon_social', 'La razon social es obligatoria').not().isEmpty(),
    check('cuit', 'El CUIT es obligatorio').not().isEmpty(),
], EmpresaController.nuevaEmpresa);

// Actualizar empresa
router.put('/:id', validaciones.jwt, EmpresaController.actualizarEmpresa);

export default router;
