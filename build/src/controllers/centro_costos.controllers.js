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
exports.CentroCostosController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const centro_costos_model_1 = __importDefault(require("../models/centro_costos.model"));
class CentroCostos {
    // Nuevo centro de costos
    nuevoCentroCostos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const centroCostos = new centro_costos_model_1.default(req.body);
                yield centroCostos.save();
                response_1.respuesta.success(res, { centro: centroCostos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Centro de costos por ID
    getCentroCosto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const centroCostos = yield centro_costos_model_1.default.findById(id);
                response_1.respuesta.success(res, { centro: centroCostos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar centros de costos
    listarCentrosCostos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recepcion de parametros
                const { columna, direccion } = req.query;
                // Ordenar
                let ordenar = [columna || 'descripcion', direccion || 1];
                // Ejecucion de consulta
                const [centros, total] = yield Promise.all([
                    centro_costos_model_1.default.find().sort([ordenar]),
                    centro_costos_model_1.default.find().countDocuments()
                ]);
                // Respuesta
                response_1.respuesta.success(res, { centros, total });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Actualizar centro de costo
    actualizarCentroCostos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const centroCostos = yield centro_costos_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { centro: centroCostos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.CentroCostosController = new CentroCostos();
