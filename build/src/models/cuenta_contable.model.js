"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Cuenta contable
const cuentaContableSchema = new mongoose_1.Schema({
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es obligatoria'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'cuenta_contable' });
exports.default = mongoose_1.model('cuenta_contable', cuentaContableSchema);
