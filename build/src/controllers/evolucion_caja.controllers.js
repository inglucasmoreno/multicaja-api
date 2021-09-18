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
exports.EvolucionCajaController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const evolucion_caja_model_1 = __importDefault(require("../models/evolucion_caja.model"));
class EvolucionCaja {
    // Nueva evolucion de caja
    nuevaEvolucionCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evolucionCaja = new evolucion_caja_model_1.default(req.body);
                yield evolucionCaja.save();
                response_1.respuesta.success(res, { evolucion: evolucionCaja });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Evolucion de caja por ID
    getEvolucionCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const evolucionCaja = yield evolucion_caja_model_1.default.findById(id);
                response_1.respuesta.success(res, { evolucion: evolucionCaja });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar evolucion de caja
    listarEvolucionCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [];
                pipeline.push({ $match: {} });
                const evolucion = yield evolucion_caja_model_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { evolucion });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.EvolucionCajaController = new EvolucionCaja();
