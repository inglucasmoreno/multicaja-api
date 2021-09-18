"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Modelo - Centro de costos
const centroCostosSchema = new mongoose_1.Schema({
    descripcion: {
        type: String,
        trim: true,
        uppercase: true,
        requierd: 'La descripcion es obligatoria'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'centro_costos' });
exports.default = mongoose_1.model('centro_costos', centroCostosSchema);
