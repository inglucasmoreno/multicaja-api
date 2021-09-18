"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const externos_controllers_1 = require("../controllers/externos.controllers");
const router = express_1.default();
// Externo por ID
// GET - http://localhost:3000/api/externos/:id 
router.get('/:id', validations_1.validaciones.jwt, externos_controllers_1.ExternoController.getExterno);
// Listar externos
// GET - http://localhost:3000/api/externos
router.get('/', validations_1.validaciones.jwt, externos_controllers_1.ExternoController.listarExternos);
// Nuevo externo
// POST - http://localhost:3000/api/externos
router.post('/', [
    validations_1.validaciones.jwt,
    express_validator_1.check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
], externos_controllers_1.ExternoController.nuevoExterno);
// Actualizar externo
// PUT - http://localhost:3000/api/externos/:id
router.put('/:id', validations_1.validaciones.jwt, externos_controllers_1.ExternoController.actualizarExterno);
exports.default = router;
