"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Movimiento
const movimientoSchema = new mongoose_1.Schema({
    monto: {
        type: Number,
        required: 'El monto es un campo obligatorio'
    },
    cheque: {
        type: String,
        default: null
    },
    tipo_origen: {
        type: String,
        required: 'El tipo de origen es un campo obligatorio'
    },
    tipo_destino: {
        type: String,
        required: 'El tipo de destino es un campo obligatorio'
    },
    tipo_movimiento: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'tipo_movimiento',
        required: 'El tipo de movimiento es un campo obligatorio'
    },
    cuenta_contable: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'cuenta_contable',
        required: 'La cuenta contable es un campo obligatorio'
    },
    centro_costos: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'centro_costos',
        required: 'El centro de costos es un campo obligatorio'
    },
    comprobante: {
        type: String,
        uppercase: true,
        default: ''
    },
    concepto: {
        type: String,
        uppercase: true,
        default: ''
    },
    origen: {
        type: String,
        required: 'El origen es un campo obligatorio'
    },
    destino: {
        type: String,
        required: 'El destino es un campo obligatorio'
    },
    origen_saldo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'saldo',
        default: null
    },
    destino_saldo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'saldo',
        required: null
    },
    origen_descripcion: {
        type: String,
        uppercase: true,
        required: 'La descripcion del origen es un campo obligatorio'
    },
    destino_descripcion: {
        type: String,
        uppercase: true,
        required: 'La descripcion del destino es un campo obligatorio'
    },
    origen_saldo_descripcion: {
        type: String,
        uppercase: true,
        default: null
    },
    destino_saldo_descripcion: {
        type: String,
        uppercase: true,
        default: null
    },
    origen_monto_anterior: {
        type: Number,
        default: null
    },
    destino_monto_anterior: {
        type: Number,
        default: null
    },
    origen_monto_nuevo: {
        type: Number,
        default: null
    },
    destino_monto_nuevo: {
        type: Number,
        default: null
    },
    activo: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
exports.default = mongoose_1.model('movimiento', movimientoSchema);
