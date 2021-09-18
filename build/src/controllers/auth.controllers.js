"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
const response_1 = require("../helpers/response");
const jwt_1 = require("../helpers/jwt");
class Auth {
    // Metodo: Login de usuario
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario, password } = req.body;
                // Se verifica si el usuario existe
                const usuarioDB = yield usuarios_model_1.default.findOne({ usuario });
                if (!usuarioDB)
                    return response_1.respuesta.error(res, 400, 'Los datos son incorrectos');
                // Se verifica password
                const validPassword = bcryptjs_1.default.compareSync(password, usuarioDB.password);
                if (!validPassword)
                    return response_1.respuesta.error(res, 400, 'Los datos son incorrectos');
                // Se verifica si el usuario esta activo
                if (!usuarioDB.activo)
                    return response_1.respuesta.error(res, 400, 'Los datos son incorrectos');
                // Se genera el token
                const token = yield jwt_1.jsonwebtoken.generar(usuarioDB._id);
                response_1.respuesta.success(res, { token });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Metodo: Renovacion de token
    renewtoken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.uid; // El uid se obtiene del middleware "validar-jwt"
                const [token, usuario] = yield Promise.all([
                    jwt_1.jsonwebtoken.generar(uid),
                    usuarios_model_1.default.findById(uid, 'usuario apellido nombre email role activo')
                ]);
                response_1.respuesta.success(res, {
                    token,
                    usuario
                });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.AuthController = new Auth;
