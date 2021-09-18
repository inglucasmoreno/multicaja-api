"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Externo
const externoSchema = new mongoose_1.Schema({
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    telefono: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    direccion: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    dni_cuit: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('externo', externoSchema);
