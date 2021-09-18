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
exports.TipoMovimientoController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const tipo_movimiento_model_1 = __importDefault(require("../models/tipo_movimiento.model"));
class TipoMovimiento {
    // Nuevo tipo
    nuevoTipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tipo = new tipo_movimiento_model_1.default(req.body);
                yield tipo.save();
                response_1.respuesta.success(res, { tipo });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Tipo por ID
    getTipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const tipo = yield tipo_movimiento_model_1.default.findById(id);
                response_1.respuesta.success(res, { tipo });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar tipos
    listarTipos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recepcion de parametros
                const { columna, direccion } = req.query;
                // Ordenar
                let ordenar = [columna || 'descripcion', direccion || 1];
                // Ejecucion de consulta
                const [tipos, total] = yield Promise.all([
                    tipo_movimiento_model_1.default.find().sort([ordenar]),
                    tipo_movimiento_model_1.default.find().countDocuments()
                ]);
                // Respuesta
                response_1.respuesta.success(res, { tipos, total });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Actualizar tipo
    actualizarTipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const tipo = yield tipo_movimiento_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { tipo });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.TipoMovimientoController = new TipoMovimiento();
