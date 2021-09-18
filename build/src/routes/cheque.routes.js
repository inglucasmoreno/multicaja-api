"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const cheques_controllers_1 = require("../controllers/cheques.controllers");
const router = express_1.default();
// Cheques por ID
// GET - http://localhost:3000/api/cheques/:id 
router.get('/:id', validations_1.validaciones.jwt, cheques_controllers_1.ChequeController.getCheque);
// Listar cheques
// GET - http://localhost:3000/api/cheques/:id
router.get('/cartera/:id', validations_1.validaciones.jwt, cheques_controllers_1.ChequeController.listarChequesPorEmpresa);
// Listar cheques EMITIDOS
// GET - http://localhost:3000/api/cartera/:id
router.get('/listar/emitidos/:id', validations_1.validaciones.jwt, cheques_controllers_1.ChequeController.listarChequesPorEmpresaEmitidos);
// Nuevo cheque
// POST - http://localhost:3000/api/cheques
router.post('/', [
    validations_1.validaciones.jwt,
], cheques_controllers_1.ChequeController.nuevoCheque);
// Cheque emitido cobrado
// POST - http://localhost:3000/api/cheques/emitido/cobrado
router.post('/emitido/cobrado', [
    validations_1.validaciones.jwt,
], cheques_controllers_1.ChequeController.emitidoCobrado);
// Nuevo cheque desde cartera
// POST - http://localhost:3000/api/cheques/crear
router.post('/crear', [
    validations_1.validaciones.jwt,
], cheques_controllers_1.ChequeController.nuevoChequeDesdeCartera);
// Emitir cheque
// POST - http://localhost:3000/api/cheques/emitir
router.post('/emitir', [
    validations_1.validaciones.jwt,
], cheques_controllers_1.ChequeController.emitirCheque);
// Actualizar cheque
// PUT - http://localhost:3000/api/cheques/:id
router.put('/:id', validations_1.validaciones.jwt, cheques_controllers_1.ChequeController.actualizarCheque);
exports.default = router;
