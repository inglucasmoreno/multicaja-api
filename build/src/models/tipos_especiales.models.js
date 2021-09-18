"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Saldo
const tipoMovimientoSchema = new mongoose_1.Schema({
    tipo: {
        type: String,
        trim: true,
        required: 'El tipo es un campo obligatorio'
    },
    clave: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La clave es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'tipo_movimiento' });
exports.default = mongoose_1.model('tipo_movimiento', tipoMovimientoSchema);
