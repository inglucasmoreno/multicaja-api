"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const tipo_movimiento_controllers_1 = require("../controllers/tipo_movimiento.controllers");
const router = express_1.default();
// tipo por ID
// GET - http://localhost:3000/api/tipo-movimientos/:id 
router.get('/:id', validations_1.validaciones.jwt, tipo_movimiento_controllers_1.TipoMovimientoController.getTipo);
// Listar tipos
// GET - http://localhost:3000/api/tipo-movimientos
router.get('/', validations_1.validaciones.jwt, tipo_movimiento_controllers_1.TipoMovimientoController.listarTipos);
// Nuevo tipo
// POST - http://localhost:3000/api/tipo-movimientos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], tipo_movimiento_controllers_1.TipoMovimientoController.nuevoTipo);
// Actualizar tipo
// PUT - http://localhost:3000/api/tipo-movimiento/:id
router.put('/:id', validations_1.validaciones.jwt, tipo_movimiento_controllers_1.TipoMovimientoController.actualizarTipo);
exports.default = router;
