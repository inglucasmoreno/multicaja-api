"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const auth_controllers_1 = require("../controllers/auth.controllers");
const router = express_1.default();
// Actualizacion de token
// GET - http://localhost:3000/api/auth 
router.get('/', validations_1.validaciones.jwt, auth_controllers_1.AuthController.renewtoken);
// Login
// POST - http://localhost:3000/api/auth 
router.post('/', [
    express_validator_1.check('usuario', 'El Usuario es obligatorio').not().isEmpty(),
    express_validator_1.check('password', 'El password es obligatorio').not().isEmpty(),
    validations_1.validaciones.campos
], auth_controllers_1.AuthController.login);
exports.default = router;
