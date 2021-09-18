"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const centro_costos_controllers_1 = require("../controllers/centro_costos.controllers");
const router = express_1.default();
// Centro de costos por ID
// GET - http://localhost:3000/api/centro-costos/:id 
router.get('/:id', validations_1.validaciones.jwt, centro_costos_controllers_1.CentroCostosController.getCentroCosto);
// Listar centro de costos
// GET - http://localhost:3000/api/centro-costos
router.get('/', validations_1.validaciones.jwt, centro_costos_controllers_1.CentroCostosController.listarCentrosCostos);
// Nuevo centro de costos
// POST - http://localhost:3000/api/centro-costos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], centro_costos_controllers_1.CentroCostosController.nuevoCentroCostos);
// Actualizar centro de costos
// PUT - http://localhost:3000/api/centro-costos/:id
router.put('/:id', validations_1.validaciones.jwt, centro_costos_controllers_1.CentroCostosController.actualizarCentroCostos);
exports.default = router;
