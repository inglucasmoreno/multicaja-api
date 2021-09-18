"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Empresa
const empresaSchema = new mongoose_1.Schema({
    razon_social: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    cuit: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    direccion: {
        type: String,
        uppercase: true,
        default: ''
    },
    telefono: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    saldos_especiales: {
        caja: {
            type: String,
            default: null
        },
        cheques: {
            type: String,
            default: null
        }
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('empresa', empresaSchema);
