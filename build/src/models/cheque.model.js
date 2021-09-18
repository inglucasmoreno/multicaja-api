"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Cheque
const chequeSchema = new mongoose_1.Schema({
    nro_cheque: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    concepto: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    banco: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    banco_id: {
        type: String,
        trim: true,
        default: ''
    },
    emisor: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN DATO'
    },
    cuit: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN DATO'
    },
    cliente: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    cliente_descripcion: {
        type: String,
        required: 'La descripcion del cliente es obligatorio',
    },
    tipo_cliente: {
        type: String,
        default: 'Interno'
    },
    destino: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    destino_descripcion: {
        type: String,
        required: 'La descripcion del destino es obligatorio',
    },
    tipo_destino: {
        type: String,
        default: 'Interno'
    },
    transferencia_destino_descripcion: {
        type: String,
        default: null
    },
    transferencia_destino: {
        type: String,
        default: null
    },
    importe: {
        type: Number,
        required: true,
    },
    fecha_emision: {
        type: Date,
        default: Date.now()
    },
    fecha_cobro: {
        type: Date,
        default: Date.now()
    },
    fecha_cobrado: {
        type: Date,
        default: Date.now()
    },
    fecha_transferencia: {
        type: Date,
        default: Date.now()
    },
    estado: {
        type: String,
        default: 'Activo'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('cheque', chequeSchema);
