"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const reportes_controllers_1 = require("../controllers/reportes.controllers");
const router = express_1.default();
// Movimientos
// POST - http://localhost:3000/api/reportes/movimientos
router.post('/movimientos', validations_1.validaciones.jwt, reportes_controllers_1.ReportesController.movimientos);
// Cheques emitidos
// POST - http://localhost:3000/api/reportes/cheques-emitidos
router.post('/cheques-emitidos', validations_1.validaciones.jwt, reportes_controllers_1.ReportesController.chequesEmitidos);
// Saldos
// POST - http://localhost:3000/api/reportes/saldos
router.post('/saldos', validations_1.validaciones.jwt, reportes_controllers_1.ReportesController.evolucionSaldo);
exports.default = router;
