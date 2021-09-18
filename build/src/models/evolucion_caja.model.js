"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Evolucion de caja
const evolucionCajaSchema = new mongoose_1.Schema({
    saldo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'saldo',
        required: 'El saldo es un campo obligatorio'
    },
    saldo_descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion del saldo es un campo obligatorio'
    },
    empresa: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'empresa',
        required: 'La empresa es un campo obligatorio'
    },
    empresa_descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion de la empresa es un campo obligatorio'
    },
    movimiento: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'movimiento',
        default: null
    },
    monto_anterior: {
        type: Number,
        required: 'El monto anterior es un campo obligatorio'
    },
    monto_actual: {
        type: Number,
        required: 'El monto actual es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'evolucion_caja' });
exports.default = mongoose_1.model('evolucion_caja', evolucionCajaSchema);
