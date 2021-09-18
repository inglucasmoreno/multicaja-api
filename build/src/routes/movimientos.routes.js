"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const movimientos_controllers_1 = require("../controllers/movimientos.controllers");
const router = express_1.default();
// Movimiento por ID
// GET - http://localhost:3000/api/movimientos/:id
router.get('/:id', validations_1.validaciones.jwt, movimientos_controllers_1.MovimientoController.getMovimiento);
// Listar movimientos
// GET - http://localhost:3000/api/movimientos
router.get('/', validations_1.validaciones.jwt, movimientos_controllers_1.MovimientoController.listarMovimientos);
// Nuevo movimiento
// POST - http://localhost:3000/api/movimientos
router.post('/', validations_1.validaciones.jwt, movimientos_controllers_1.MovimientoController.nuevoMovimiento);
// Cobrar cheque
// POST - http://localhost:3000/api/movimientos/cobrar-cheque
router.post('/cobrar-cheque', validations_1.validaciones.jwt, movimientos_controllers_1.MovimientoController.cobrarCheque);
// Transferir cheque
// POST - http://localhost:3000/api/movimientos/transferir-cheque
router.post('/transferir-cheque', validations_1.validaciones.jwt, movimientos_controllers_1.MovimientoController.transferirCheque);
exports.default = router;
