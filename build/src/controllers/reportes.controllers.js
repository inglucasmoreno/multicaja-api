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
exports.ReportesController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const movimientos_model_1 = __importDefault(require("../models/movimientos.model"));
const cheque_model_1 = __importDefault(require("../models/cheque.model"));
const evolucion_caja_model_1 = __importDefault(require("../models/evolucion_caja.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
class Reportes {
    // Reportes de movimientos
    movimientos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { desde, hasta, tipo_movimiento, origen, destino, tipo_origen, tipo_destino } = req.body;
                let pipeline = [];
                pipeline.push({ $match: {} });
                // Fecha de creacion de movimiento
                if (desde !== null && desde !== '') {
                    const desdeNew = date_fns_1.add(new Date(desde), { hours: 3 });
                    pipeline.push({ $match: { createdAt: { $gte: new Date(desdeNew) } } });
                }
                ;
                if (hasta !== null && hasta !== '') {
                    const hastaNew = date_fns_1.add(new Date(hasta), { days: 1, hours: 3 });
                    pipeline.push({ $match: { createdAt: { $lte: new Date(hastaNew) } } });
                }
                // Tipo de movimiento
                if (tipo_movimiento !== null && tipo_movimiento !== '')
                    pipeline.push({ $match: { tipo_movimiento: mongoose_1.default.Types.ObjectId(tipo_movimiento) } });
                // Tipo de origen
                if (tipo_origen !== null && tipo_origen !== '')
                    pipeline.push({ $match: { tipo_origen } });
                // Tipo de destino
                if (tipo_destino !== null && tipo_destino !== '')
                    pipeline.push({ $match: { tipo_destino } });
                // Origen
                if (origen !== null && origen !== '')
                    pipeline.push({ $match: { origen } });
                // Destino
                if (destino !== null && destino !== '')
                    pipeline.push({ $match: { destino } });
                // Join con "Tipo de movimientos"
                pipeline.push({ $lookup: {
                        from: 'tipo_movimiento',
                        localField: 'tipo_movimiento',
                        foreignField: '_id',
                        as: 'tipo_movimiento'
                    } });
                pipeline.push({ $unwind: '$tipo_movimiento' });
                // Join con "Centro de costos"
                pipeline.push({ $lookup: {
                        from: 'centro_costos',
                        localField: 'centro_costos',
                        foreignField: '_id',
                        as: 'centro_costos'
                    } });
                pipeline.push({ $unwind: '$centro_costos' });
                // Join con "Cuenta contable"
                pipeline.push({ $lookup: {
                        from: 'cuenta_contable',
                        localField: 'cuenta_contable',
                        foreignField: '_id',
                        as: 'cuenta_contable'
                    } });
                pipeline.push({ $unwind: '$cuenta_contable' });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const movimientos = yield movimientos_model_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { movimientos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Reportes de cheques emitidos
    chequesEmitidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cliente, destino, fechaDesde, fechaHasta, tipoDestino, estado } = req.body;
                let pipeline = [];
                pipeline.push({ $match: { estado: 'Emitido' } });
                // Fecha de emision
                if (fechaDesde !== null && fechaDesde !== '') {
                    const fechaDesdeNew = date_fns_1.add(new Date(fechaDesde), { hours: 3 });
                    pipeline.push({ $match: { fecha_emision: { $gte: new Date(fechaDesdeNew) } } });
                }
                if (fechaHasta !== null && fechaHasta !== '') {
                    const fechaHastaNew = date_fns_1.add(new Date(fechaHasta), { days: 1, hours: 3 });
                    pipeline.push({ $match: { fecha_emision: { $lte: new Date(fechaHastaNew) } } });
                }
                ;
                // Estado - Cobrado o No cobrado
                if (estado !== '') {
                    if (estado === 'true') {
                        pipeline.push({ $match: { activo: true } });
                    }
                    else {
                        pipeline.push({ $match: { activo: false } });
                    }
                }
                // Tipo de destino
                if (tipoDestino !== null && tipoDestino !== '')
                    pipeline.push({ $match: { tipo_destino: tipoDestino } });
                // Cliente
                if (cliente !== null && cliente !== '')
                    pipeline.push({ $match: { cliente: mongoose_1.default.Types.ObjectId(cliente) } });
                // Destino
                if (destino !== null && destino !== '')
                    pipeline.push({ $match: { destino: mongoose_1.default.Types.ObjectId(destino) } });
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
    // Reportes de evolucion de caja
    evolucionSaldo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaDesde, fechaHasta, saldo } = req.body;
                let pipeline = [];
                pipeline.push({ $match: {} });
                // Filtrado por saldo
                if (saldo !== null && saldo !== '')
                    pipeline.push({ $match: { saldo: mongoose_1.default.Types.ObjectId(saldo) } });
                // Fecha de saldo
                if (fechaDesde !== null && fechaDesde !== '') {
                    const fechaDesdeNew = date_fns_1.add(new Date(fechaDesde), { hours: 3 });
                    pipeline.push({ $match: { createdAt: { $gte: new Date(fechaDesdeNew) } } });
                }
                if (fechaHasta !== null && fechaHasta !== '') {
                    const fechaHastaNew = date_fns_1.add(new Date(fechaHasta), { days: 1, hours: 3 });
                    pipeline.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } });
                }
                ;
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const saldos = yield evolucion_caja_model_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { saldos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.ReportesController = new Reportes();
