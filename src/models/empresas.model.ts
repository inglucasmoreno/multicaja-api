import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Empresa
export interface I_Empresa extends mongoose.Document {
    razon_social: String,
    cuit: String,
    direccion: String,
    telefono: String,
    saldos_especiales: {
        caja: String,
        cheques: String
    }
    activo: Boolean
}

// Modelo - Empresa
const empresaSchema = new Schema({
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
        default: 'SIN CUIT'
    },
    direccion:{
        type: String,
        uppercase: true,
        default: 'SIN DIRECCION'
    },
    telefono: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN TELEFONO'
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

export default model('empresa', empresaSchema);
