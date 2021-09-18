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
exports.ChequeController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const cheque_model_1 = __importDefault(require("../models/cheque.model"));
const empresas_model_1 = __importDefault(require("../models/empresas.model"));
const externos_model_1 = __importDefault(require("../models/externos.model"));
const saldos_models_1 = __importDefault(require("../models/saldos.models"));
const evolucion_caja_model_1 = __importDefault(require("../models/evolucion_caja.model"));
const movimientos_model_1 = __importDefault(require("../models/movimientos.model"));
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
class Cheque {
    // Nuevo cheque
    nuevoCheque(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuevoCheque = new cheque_model_1.default(req.body);
                const cheque = yield nuevoCheque.save();
                response_1.respuesta.success(res, { cheque });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Nuevo cheque desde cartera
    nuevoChequeDesdeCartera(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cheque, movimiento } = req.body;
                // AJUSTE DE FECHAS
                cheque.fecha_emision = date_fns_1.add(new Date(cheque.fecha_emision), { hours: 3 });
                cheque.fecha_cobro = date_fns_1.add(new Date(cheque.fecha_cobro), { hours: 3 });
                // DATOS DE CLIENTE
                const cliente = yield externos_model_1.default.findById(cheque.cliente);
                // CREACION DE NUEVO CHEQUE
                cheque.cliente_descripcion = cliente.descripcion;
                const nuevoCheque = new cheque_model_1.default(cheque);
                const nuevoChequeDB = yield nuevoCheque.save();
                // CREACION DE MOVIMIENTO
                // 1) - Se completan datos
                movimiento.cheque = nuevoChequeDB._id;
                movimiento.origen_descripcion = cliente.descripcion;
                movimiento.origen_saldo = null;
                movimiento.origen_saldo_descripcion = '';
                // 2) - Se obtienen y actualizan los saldos
                // Origen - Externo
                movimiento.origen_monto_anterior = null;
                movimiento.origen_monto_nuevo = null;
                // Destino - Interno
                const saldo = yield saldos_models_1.default.findById(movimiento.destino_saldo);
                movimiento.destino_monto_anterior = saldo.monto;
                movimiento.destino_monto_nuevo = saldo.monto + movimiento.monto;
                yield saldos_models_1.default.findByIdAndUpdate(movimiento.destino_saldo, { monto: movimiento.destino_monto_nuevo });
                // 3) - Se crea el movimiento
                const nuevoMovimiento = new movimientos_model_1.default(movimiento);
                const movimientoDB = yield nuevoMovimiento.save();
                // ----- EVOLUCION DE SALDO -----
                const dataEvolucion = {
                    empresa: movimiento.destino,
                    empresa_descripcion: movimiento.destino_descripcion,
                    saldo: movimiento.destino_saldo,
                    saldo_descripcion: movimiento.destino_saldo_descripcion,
                    monto_anterior: movimiento.destino_monto_anterior,
                    monto_actual: movimiento.destino_monto_nuevo,
                    movimiento: movimientoDB._id
                };
                const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                yield nuevaEvolucion.save();
                response_1.respuesta.success(res, 'Todo correcto');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Emitir cheque
    emitirCheque(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cheque, movimiento } = req.body;
                // AJUSTE DE FECHAS
                cheque.fecha_emision = date_fns_1.add(new Date(cheque.fecha_emision), { hours: 3 });
                if (cheque.fecha_cobro !== '')
                    cheque.fecha_cobro = date_fns_1.add(new Date(cheque.fecha_cobro), { hours: 3 });
                else
                    cheque.fecha_cobro = date_fns_1.add(new Date('1970-01-01'), { hours: 3 });
                // --------- DATOS DE CHEQUE ----------
                // BANCO (SALDO) - DESCRIPCION
                const saldo = yield saldos_models_1.default.findById(cheque.banco_id);
                cheque.banco = saldo.descripcion;
                movimiento.origen_saldo_descripcion = saldo.descripcion;
                let destinoDB = {};
                // DESTINO - DESCRIPCION
                if (movimiento.tipo_destino === 'Interno') {
                    destinoDB = yield empresas_model_1.default.findById(cheque.destino);
                    cheque.destino_descripcion = destinoDB.razon_social;
                    movimiento.destino_descripcion = destinoDB.razon_social;
                }
                else {
                    destinoDB = yield externos_model_1.default.findById(cheque.destino);
                    cheque.destino_descripcion = destinoDB.descripcion;
                    movimiento.destino_descripcion = destinoDB.descripcion;
                }
                // MONTOS - ORIGEN
                movimiento.origen_monto_anterior = saldo.monto;
                movimiento.origen_monto_nuevo = saldo.monto;
                // MONTOS - DESTINO
                if (movimiento.tipo_destino === 'Interno') {
                    movimiento.destino_saldo = destinoDB.saldos_especiales.cheques;
                    movimiento.destino_saldo_descripcion = 'CHEQUES';
                    const saldoDestino = yield saldos_models_1.default.findById(destinoDB.saldos_especiales.cheques);
                    movimiento.destino_monto_anterior = saldoDestino.monto;
                    const nuevoSaldoDestino = saldoDestino.monto + cheque.importe;
                    movimiento.destino_monto_nuevo = nuevoSaldoDestino;
                    yield saldos_models_1.default.findByIdAndUpdate(destinoDB.saldos_especiales.cheques, { monto: nuevoSaldoDestino });
                }
                else {
                    movimiento.destino_saldo = null;
                    movimiento.destino_saldo_descripcion = null;
                    movimiento.destino_monto_anterior = null;
                    movimiento.destino_monto_nuevo = null;
                }
                // ESTADO DE CHEQUE
                cheque.estado = 'Emitido';
                // CREACION DE CHEQUES
                const nuevoCheque = new cheque_model_1.default(cheque);
                const nuevoChequeDB = yield nuevoCheque.save();
                if (movimiento.tipo_destino === 'Interno') {
                    cheque.estado = 'Activo';
                    const nuevoChequeParaInterno = new cheque_model_1.default(cheque);
                    yield nuevoChequeParaInterno.save();
                }
                // COMPLETANDO DATOS DE MOVIMIENTO
                movimiento.cheque = nuevoChequeDB._id;
                // CREAR MOVIMIENTO
                const nuevoMovimiento = new movimientos_model_1.default(movimiento);
                const movimientoDB = yield nuevoMovimiento.save();
                // EVOLUCION DE SALDO
                // Destino
                const dataEvolucion = {
                    empresa: movimiento.destino,
                    empresa_descripcion: movimiento.destino_descripcion,
                    saldo: movimiento.destino_saldo,
                    saldo_descripcion: movimiento.destino_saldo_descripcion,
                    monto_anterior: movimiento.destino_monto_anterior,
                    monto_actual: movimiento.destino_monto_nuevo,
                    movimiento: movimientoDB._id
                };
                const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                yield nuevaEvolucion.save();
                response_1.respuesta.success(res, 'Todo correcto');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Cheque por ID
    getCheque(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const cheque = yield cheque_model_1.default.findById(id);
                response_1.respuesta.success(res, { cheque });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar cheques por Empresa
    listarChequesPorEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recepcion de parametros
                const { columna, direccion } = req.query;
                const id = req.params.id;
                const pipeline = [];
                pipeline.push({ $match: {} });
                // Filtrado por activo/inactivo
                if (req.query.activo !== '') {
                    if (req.query.activo === 'true') {
                        pipeline.push({ $match: { activo: true } });
                    }
                    else {
                        pipeline.push({ $match: { activo: false } });
                    }
                }
                // Filtrado por estado
                if (req.query.estado !== '') {
                    if (req.query.estado === 'Activo') {
                        pipeline.push({ $match: { estado: 'Activo' } });
                    }
                    else if (req.query.estado === 'Cobrado') {
                        pipeline.push({ $match: { estado: 'Cobrado' } });
                    }
                    else if (req.query.estado === 'Transferido') {
                        pipeline.push({ $match: { estado: 'Transferido' } });
                    }
                }
                // Filtrado por empresa
                pipeline.push({ $match: { destino: mongoose_1.default.Types.ObjectId(id) } });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[String(columna)] = Number(direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const cheques = yield cheque_model_1.default.aggregate(pipeline);
                // Respuesta
                response_1.respuesta.success(res, { cheques });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar cheques por Empresa EMITIDOS
    listarChequesPorEmpresaEmitidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recepcion de parametros
                const { columna, direccion } = req.query;
                const id = req.params.id;
                const pipeline = [];
                pipeline.push({ $match: {} });
                // Filtrado por activo/inactivo
                if (req.query.activo !== '') {
                    if (req.query.activo === 'true') {
                        pipeline.push({ $match: { activo: true } });
                    }
                    else {
                        pipeline.push({ $match: { activo: false } });
                    }
                }
                // Filtrado por estado
                if (req.query.estado !== '') {
                    if (req.query.estado === 'Emitido') {
                        pipeline.push({ $match: { estado: 'Emitido' } });
                    }
                }
                // Filtrado por empresa
                pipeline.push({ $match: { cliente: mongoose_1.default.Types.ObjectId(id) } });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[String(columna)] = Number(direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const cheques = yield cheque_model_1.default.aggregate(pipeline);
                // Respuesta
                response_1.respuesta.success(res, { cheques });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Cheque emitido cobrado
    emitidoCobrado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cheque, movimiento } = req.body;
                // FECHAS
                const fecha_cobrado = date_fns_1.add(new Date(cheque.fecha_cobrado), { hours: 3 });
                // SALDOS
                const saldo = yield saldos_models_1.default.findById(cheque.banco_id);
                movimiento.origen_saldo_descripcion = saldo.descripcion;
                movimiento.destino_saldo_descripcion = saldo.descripcion;
                movimiento.origen_monto_anterior = saldo.monto;
                movimiento.origen_monto_nuevo = saldo.monto;
                movimiento.destino_monto_anterior = saldo.monto;
                const nuevoMonto = saldo.monto - cheque.importe;
                movimiento.destino_monto_nuevo = nuevoMonto;
                yield saldos_models_1.default.findByIdAndUpdate(cheque.banco_id, { monto: nuevoMonto });
                // ACTUALIZACION DE CHEQUE
                yield cheque_model_1.default.findByIdAndUpdate(cheque.cheque_id, { fecha_cobrado, activo: false });
                // NUEVO MOVIMIENTO
                const nuevoMovimiento = new movimientos_model_1.default(movimiento);
                const movimientoDB = yield nuevoMovimiento.save();
                // EVOLUCION DE SALDO
                // Origen
                const dataEvolucion = {
                    empresa: movimiento.destino,
                    empresa_descripcion: movimiento.destino_descripcion,
                    saldo: movimiento.destino_saldo,
                    saldo_descripcion: movimiento.destino_saldo_descripcion,
                    monto_anterior: movimiento.destino_monto_anterior,
                    monto_actual: movimiento.destino_monto_nuevo,
                    movimiento: movimientoDB._id
                };
                const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                yield nuevaEvolucion.save();
                response_1.respuesta.success(res, 'Actualizacion correcta');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Actualizar cheque
    actualizarCheque(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const cheque = yield cheque_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { cheque });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.ChequeController = new Cheque();
