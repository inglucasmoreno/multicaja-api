"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Saldo
const saldoSchema = new mongoose_1.Schema({
    empresa: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'empresa',
        required: 'La empresa es un campo obligatorio'
    },
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un campo obligatorio'
    },
    monto: {
        type: Number,
        required: 'El monto es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('saldo', saldoSchema);
