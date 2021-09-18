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
exports.MovimientoController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const movimientos_model_1 = __importDefault(require("../models/movimientos.model"));
const cheque_model_1 = __importDefault(require("../models/cheque.model"));
const externos_model_1 = __importDefault(require("../models/externos.model"));
const saldos_models_1 = __importDefault(require("../models/saldos.models"));
const empresas_model_1 = __importDefault(require("../models/empresas.model"));
const evolucion_caja_model_1 = __importDefault(require("../models/evolucion_caja.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
class Movimiento {
    // Movimiento por ID
    getMovimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const movimientoTemp = yield movimientos_model_1.default.findById(id);
                const pipeline = [];
                // 1) - Filtrado por ID
                pipeline.push({ $match: { _id: mongoose_1.default.Types.ObjectId(id) } });
                // 2) - Join con "Tipo de movimientos"
                pipeline.push({ $lookup: {
                        from: 'tipo_movimiento',
                        localField: 'tipo_movimiento',
                        foreignField: '_id',
                        as: 'tipo_movimiento'
                    } });
                pipeline.push({ $unwind: '$tipo_movimiento' });
                // 3) - Join con "Saldo" - Origen | cuando es necesario
                if (movimientoTemp.tipo_origen === 'Interno') {
                    pipeline.push({ $lookup: {
                            from: 'saldos',
                            localField: 'origen_saldo',
                            foreignField: '_id',
                            as: 'origen_saldo'
                        } });
                    pipeline.push({ $unwind: '$origen_saldo' });
                }
                // 4) - Join con "Saldo" - Destino | cuando es necesario
                if (movimientoTemp.tipo_destino === 'Interno') {
                    pipeline.push({ $lookup: {
                            from: 'saldos',
                            localField: 'destino_saldo',
                            foreignField: '_id',
                            as: 'destino_saldo'
                        } });
                    pipeline.push({ $unwind: '$destino_saldo' });
                }
                // 5) - Join con "Centro de costos"
                pipeline.push({ $lookup: {
                        from: 'centro_costos',
                        localField: 'centro_costos',
                        foreignField: '_id',
                        as: 'centro_costos'
                    } });
                pipeline.push({ $unwind: '$centro_costos' });
                // 6) - Join con "Cuenta contable"
                pipeline.push({ $lookup: {
                        from: 'cuenta_contable',
                        localField: 'cuenta_contable',
                        foreignField: '_id',
                        as: 'cuenta_contable'
                    } });
                pipeline.push({ $unwind: '$cuenta_contable' });
                const movimiento = yield movimientos_model_1.default.aggregate(pipeline);
                response_1.respuesta.success(res, { movimiento: movimiento[0] });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Nuevo movimiento
    nuevoMovimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                // ORIGEN
                if (req.body.tipo_origen === 'Interno') { // Origen - Interno
                    const saldo = yield saldos_models_1.default.findById(data.origen_saldo).populate('empresa');
                    // data.origen = data.origen_saldo;
                    data.origen_descripcion = saldo.empresa.razon_social;
                    data.origen_monto_anterior = saldo.monto;
                    data.origen_saldo_descripcion = saldo.descripcion;
                    const nuevoMonto = saldo.monto - data.monto;
                    const nuevoSaldo = yield saldos_models_1.default.findByIdAndUpdate(data.origen_saldo, { monto: nuevoMonto }, { new: true });
                    data.origen_monto_nuevo = nuevoSaldo.monto;
                }
                else { // Origen - Externo
                    const externo = yield externos_model_1.default.findById(data.origen);
                    data.origen_descripcion = externo.descripcion;
                    data.origen_monto_anterior = null;
                    data.origen_monto_nuevo = null;
                    data.origen_saldo = null;
                    data.origen_saldo_descripcion = null;
                }
                // DESTINO
                if (req.body.tipo_destino === 'Interno') { // Destino - Interno
                    const saldo = yield saldos_models_1.default.findById(data.destino_saldo).populate('empresa');
                    // data.destino = data.destino_saldo;
                    data.destino_descripcion = saldo.empresa.razon_social;
                    data.destino_monto_anterior = saldo.monto;
                    data.destino_saldo_descripcion = saldo.descripcion;
                    const nuevoSaldo = yield saldos_models_1.default.findByIdAndUpdate(data.destino_saldo, { $inc: { monto: data.monto } }, { new: true });
                    data.destino_monto_nuevo = nuevoSaldo.monto;
                }
                else { // Destino - Externo
                    const externo = yield externos_model_1.default.findById(data.destino);
                    data.destino_descripcion = externo.descripcion;
                    data.destino_monto_anterior = null;
                    data.destino_monto_nuevo = null;
                    data.destino_saldo = null;
                    data.destino_saldo_descripcion = null;
                }
                const movimiento = new movimientos_model_1.default(data);
                const movimientoDB = yield movimiento.save();
                // ----- EVOLUCION DE SALDO -----
                // Origen
                if (req.body.tipo_origen === 'Interno') {
                    const dataEvolucion = {
                        empresa: data.origen,
                        empresa_descripcion: data.origen_descripcion,
                        saldo: data.origen_saldo,
                        saldo_descripcion: data.origen_saldo_descripcion,
                        monto_anterior: data.origen_monto_anterior,
                        monto_actual: data.origen_monto_nuevo,
                        movimiento: movimientoDB._id
                    };
                    const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                    yield nuevaEvolucion.save();
                }
                // Destino
                if (req.body.tipo_destino === 'Interno') {
                    const dataEvolucion = {
                        empresa: data.destino,
                        empresa_descripcion: data.destino_descripcion,
                        saldo: data.destino_saldo,
                        saldo_descripcion: data.destino_saldo_descripcion,
                        monto_anterior: data.destino_monto_anterior,
                        monto_actual: data.destino_monto_nuevo,
                        movimiento: movimientoDB._id
                    };
                    const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                    yield nuevaEvolucion.save();
                }
                response_1.respuesta.success(res, 'Movimiento creado correctamente');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar movimientos
    listarMovimientos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [];
                pipeline.push({ $match: {} });
                // Ordenar
                // let ordenar = [columna || 'createdAt', direccion || -1];
                // Join con "Tipo de movimientos"
                pipeline.push({ $lookup: {
                        from: 'tipo_movimiento',
                        localField: 'tipo_movimiento',
                        foreignField: '_id',
                        as: 'tipo_movimiento'
                    } });
                pipeline.push({ $unwind: '$tipo_movimiento' });
                // Ordenando datos
                const ordenar = {};
                if (req.query.columna) {
                    ordenar[req.query.columna] = Number(req.query.direccion);
                    pipeline.push({ $sort: ordenar });
                }
                const movimientos = yield movimientos_model_1.default.aggregate(pipeline);
                // Respuesta
                response_1.respuesta.success(res, { movimientos });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Cobrar cheque
    cobrarCheque(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cheque, origen_saldo, destino_saldo, fecha_cobrado } = req.body;
                console.log(req.body);
                // FECHAS
                const fecha_cobrado_adaptada = date_fns_1.add(new Date(fecha_cobrado), { hours: 3 });
                let data = req.body;
                // SE BUSCA LA DESCRIPCION DE SALDO
                const saldoDB = yield saldos_models_1.default.findById(destino_saldo);
                data.destino_saldo_descripcion = saldoDB.descripcion;
                // CALCULO DE MONTOS           
                const origen_monto = yield saldos_models_1.default.findById(origen_saldo);
                data.origen_monto_anterior = origen_monto.monto;
                data.origen_monto_nuevo = data.origen_monto_anterior - data.monto;
                const destino_monto = yield saldos_models_1.default.findById(destino_saldo);
                data.destino_monto_anterior = destino_monto.monto;
                data.destino_monto_nuevo = data.destino_monto_anterior + data.monto;
                // ACTUALIZACION DE MONTOS
                yield saldos_models_1.default.findByIdAndUpdate(origen_saldo, { monto: data.origen_monto_nuevo });
                yield saldos_models_1.default.findByIdAndUpdate(destino_saldo, { monto: data.destino_monto_nuevo });
                // ACTUALIZACION DE ESTADO DE CHEQUE
                yield cheque_model_1.default.findByIdAndUpdate(cheque, { fecha_cobrado: fecha_cobrado_adaptada, estado: 'Cobrado', activo: false }, { new: true });
                // SE CREA EL NUEVO MOVIMIENTO
                const nuevoMovimiento = new movimientos_model_1.default(data);
                const movimientoDB = yield nuevoMovimiento.save();
                // ----- EVOLUCION DE SALDO -----
                // Origen
                const dataEvolucionOrigen = {
                    empresa: data.origen,
                    empresa_descripcion: data.origen_descripcion,
                    saldo: data.origen_saldo,
                    saldo_descripcion: data.origen_saldo_descripcion,
                    monto_anterior: data.origen_monto_anterior,
                    monto_actual: data.origen_monto_nuevo,
                    movimiento: movimientoDB._id
                };
                const nuevaEvolucionOrigen = new evolucion_caja_model_1.default(dataEvolucionOrigen);
                yield nuevaEvolucionOrigen.save();
                // Destino
                const dataEvolucionDestino = {
                    empresa: data.destino,
                    empresa_descripcion: data.destino_descripcion,
                    saldo: data.destino_saldo,
                    saldo_descripcion: data.destino_saldo_descripcion,
                    monto_anterior: data.destino_monto_anterior,
                    monto_actual: data.destino_monto_nuevo,
                    movimiento: movimientoDB._id
                };
                const nuevaEvolucionDestino = new evolucion_caja_model_1.default(dataEvolucionDestino);
                yield nuevaEvolucionDestino.save();
                // RESPUESTA API-REST
                response_1.respuesta.success(res, 'Todo correcto');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Transferir cheque
    transferirCheque(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cheque, origen_saldo, tipo_destino, concepto, destino, fecha_transferencia } = req.body;
                let data = req.body;
                let destinoDB = {};
                // AJUSTE DE FECHAS
                data.fecha_transferencia = date_fns_1.add(new Date(fecha_transferencia), { hours: 3 });
                // SE OBTIENE LA DESCRIPCION DEL DESTINO
                if (tipo_destino === 'Interno') {
                    destinoDB = yield empresas_model_1.default.findById(destino);
                    data.destino_descripcion = destinoDB.razon_social;
                }
                else {
                    destinoDB = yield externos_model_1.default.findById(destino);
                    data.destino_descripcion = destinoDB.descripcion;
                }
                // MONTOS - ORIGEN             
                const origen_monto = yield saldos_models_1.default.findById(origen_saldo);
                data.origen_monto_anterior = origen_monto.monto;
                data.origen_monto_nuevo = data.origen_monto_anterior - data.monto;
                yield saldos_models_1.default.findByIdAndUpdate(origen_saldo, { monto: data.origen_monto_nuevo });
                // MONTOS - DESTINO
                if (tipo_destino === 'Interno') {
                    const empresa = yield empresas_model_1.default.findById(data.destino);
                    console.log(empresa.saldos_especiales.cheques);
                    data.destino_saldo = empresa.saldos_especiales.cheques;
                    data.destino_saldo_descripcion = 'CHEQUES';
                    const destino_monto = yield saldos_models_1.default.findById(data.destino_saldo);
                    data.destino_monto_anterior = destino_monto.monto;
                    data.destino_monto_nuevo = data.destino_monto_anterior + data.monto;
                    yield saldos_models_1.default.findByIdAndUpdate(data.destino_saldo, { monto: data.destino_monto_nuevo });
                }
                else {
                    data.destino_monto_anterior = null;
                    data.destino_monto_nuevo = null;
                    data.destino_saldo = null;
                    data.destino_saldo_descripcion = null;
                }
                // ACTUALIZACION DEL CHEQUE
                const chequeAnterior = yield cheque_model_1.default.findByIdAndUpdate(cheque, {
                    estado: 'Transferido',
                    transferencia_destino_descripcion: data.destino_descripcion,
                    transferencia_destino: data.destino,
                    fecha_transferencia: data.fecha_transferencia,
                    activo: false
                });
                // SE CREA UN NUEVO CHEQUE SI ES NECESARIO
                if (tipo_destino === 'Interno') {
                    const dataCheque = {
                        emisor: chequeAnterior.emisor,
                        cuit: chequeAnterior.cuit,
                        fecha_emision: chequeAnterior.fecha_emision,
                        fecha_cobro: chequeAnterior.fecha_cobro,
                        banco: chequeAnterior.banco,
                        nro_cheque: chequeAnterior.nro_cheque,
                        estado: 'Activo',
                        activo: true,
                        concepto,
                        importe: chequeAnterior.importe,
                        cliente: chequeAnterior.destino,
                        tipo_cliente: data.tipo_origen,
                        cliente_descripcion: chequeAnterior.destino_descripcion,
                        destino,
                        tipo_destino: data.tipo_destino,
                        destino_descripcion: data.destino_descripcion
                    };
                    const nuevoCheque = new cheque_model_1.default(dataCheque);
                    const chequeDB = yield nuevoCheque.save();
                    data.cheque = chequeDB._id;
                }
                // SE CREA EL MOVIMIENTO
                const nuevoMovimiento = new movimientos_model_1.default(data);
                const movimientoDB = yield nuevoMovimiento.save();
                // ----- EVOLUCION DE SALDO -----
                // Origen
                if (req.body.tipo_origen === 'Interno') {
                    const dataEvolucion = {
                        empresa: data.origen,
                        empresa_descripcion: data.origen_descripcion,
                        saldo: data.origen_saldo,
                        saldo_descripcion: data.origen_saldo_descripcion,
                        monto_anterior: data.origen_monto_anterior,
                        monto_actual: data.origen_monto_nuevo,
                        movimiento: movimientoDB._id
                    };
                    const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                    yield nuevaEvolucion.save();
                }
                // Destino
                if (req.body.tipo_destino === 'Interno') {
                    const dataEvolucion = {
                        empresa: data.destino,
                        empresa_descripcion: data.destino_descripcion,
                        saldo: data.destino_saldo,
                        saldo_descripcion: data.destino_saldo_descripcion,
                        monto_anterior: data.destino_monto_anterior,
                        monto_actual: data.destino_monto_nuevo,
                        movimiento: movimientoDB._id
                    };
                    const nuevaEvolucion = new evolucion_caja_model_1.default(dataEvolucion);
                    yield nuevaEvolucion.save();
                }
                // RESPUESTA API-REST
                response_1.respuesta.success(res, 'Todo correcto');
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.MovimientoController = new Movimiento();
