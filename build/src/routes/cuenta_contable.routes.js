"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const cuenta_contable_controllers_1 = require("../controllers/cuenta_contable.controllers");
const router = express_1.default();
// Cuenta contable por ID
// GET - http://localhost:3000/api/cuenta-contable/:id 
router.get('/:id', validations_1.validaciones.jwt, cuenta_contable_controllers_1.CuentaContableController.getCuentaContable);
// Listar cuentas contables
// GET - http://localhost:3000/api/cuenta-contable
router.get('/', validations_1.validaciones.jwt, cuenta_contable_controllers_1.CuentaContableController.listarCuentaContable);
// Nueva cuenta contable
// POST - http://localhost:3000/api/cuenta-contable
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], cuenta_contable_controllers_1.CuentaContableController.nuevaCuentaContable);
// Actualizar cuenta contable
// PUT - http://localhost:3000/api/cuenta-contable/:id
router.put('/:id', validations_1.validaciones.jwt, cuenta_contable_controllers_1.CuentaContableController.actualizarCuentaContable);
exports.default = router;
