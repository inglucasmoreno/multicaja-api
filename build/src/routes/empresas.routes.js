"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const empresas_controllers_1 = require("../controllers/empresas.controllers");
const router = express_1.default();
// Empresa por ID
// GET - http://localhost:3000/api/empresas 
router.get('/:id', validations_1.validaciones.jwt, empresas_controllers_1.EmpresaController.getEmpresa);
// Saldos por ID
// GET - http://localhost:3000/api/empresas/saldos/:id 
router.get('/saldos/:id', validations_1.validaciones.jwt, empresas_controllers_1.EmpresaController.getSaldo);
// Listar empresas
// GET - http://localhost:3000/api/empresas 
router.get('/', validations_1.validaciones.jwt, empresas_controllers_1.EmpresaController.listarEmpresas);
// Listar saldos por Empresa
// GET - http://localhost:3000/api/empresas/saldos/:empresa 
router.get('/saldos/lista/:empresa', validations_1.validaciones.jwt, empresas_controllers_1.EmpresaController.listarSaldos);
// Nueva empresa
// POST - http://localhost:3000/api/empresas 
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('razon_social', 'La razon social es obligatoria').not().isEmpty()
], empresas_controllers_1.EmpresaController.nuevaEmpresa);
// Nuevo saldo
// post - http://localhost:3000/api/empresas/saldos 
router.post('/saldos', [
    validations_1.validaciones.jwt,
    express_validator_1.check('empresa', 'La empresa es un campo obligatorio').not().isEmpty(),
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    express_validator_1.check('monto', 'El monto es obligatorio').not().isEmpty()
], empresas_controllers_1.EmpresaController.nuevoSaldo);
// Actualizar empresa
// PUT - http://localhost:3000/api/empresas/:id
router.put('/:id', validations_1.validaciones.jwt, empresas_controllers_1.EmpresaController.actualizarEmpresa);
// Actualizar saldo
// GET - http://localhost:3000/api/empresas/saldos/:id 
router.put('/saldos/:id', validations_1.validaciones.jwt, empresas_controllers_1.EmpresaController.actualizarSaldo);
exports.default = router;
