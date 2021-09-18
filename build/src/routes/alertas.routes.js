"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const alertas_controllers_1 = require("../controllers/alertas.controllers");
const router = express_1.default();
// Alerta: Cobrar cheques
// GET - http://localhost:3000/api/alertas/cobrar-cheques
router.get('/cobrar-cheques', validations_1.validaciones.jwt, alertas_controllers_1.AlertasController.cobrarCheques);
exports.default = router;
