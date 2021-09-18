"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const evolucion_caja_controllers_1 = require("../controllers/evolucion_caja.controllers");
const router = express_1.default();
// Evolucion de caja por ID
// GET - http://localhost:3000/api/evolucion-caja/:id 
router.get('/:id', validations_1.validaciones.jwt, evolucion_caja_controllers_1.EvolucionCajaController.getEvolucionCaja);
// Evolucion de caja 
// POST - http://localhost:3000/api/evolucion-caja
router.post('/', validations_1.validaciones.jwt, evolucion_caja_controllers_1.EvolucionCajaController.listarEvolucionCaja);
// Nueva evolucion de caja
// POST - http://localhost:3000/api/evolucion-caja
router.post('/', validations_1.validaciones.jwt, evolucion_caja_controllers_1.EvolucionCajaController.nuevaEvolucionCaja);
exports.default = router;
