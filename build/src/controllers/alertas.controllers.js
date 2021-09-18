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
exports.AlertasController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const cheque_model_1 = __importDefault(require("../models/cheque.model"));
const date_fns_1 = require("date-fns");
class Alertas {
    // Listar cheques para cobrar hoy - EN CARTERA
    cobrarCheques(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [];
                // Se ajusta la fecha
                const fechaComp = date_fns_1.add(new Date(date_fns_1.format(date_fns_1.add(new Date(), { hours: -3 }), 'yyyy-MM-dd')), { hours: 3 });
                // Filtrado por estado
                pipeline.push({ $match: { estado: 'Activo', activo: true } });
                // Filtrado por fechas
                pipeline.push({ $match: { fecha_cobro: { $gte: new Date(1971, 10, 10), $lte: date_fns_1.add(new Date(), { days: 1 }) } } });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const cheques = yield cheque_model_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { cheques });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.AlertasController = new Alertas();
