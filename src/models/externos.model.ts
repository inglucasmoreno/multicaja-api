import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Externo
export interface I_Externo extends mongoose.Document {
    descripcion: String,
    telefono: String,
    direccion: String,
    cuit: String,
    activo: Boolean
}

// Modelo - Externo
const externoSchema = new Schema({
    
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

}, { timestamps: true } );

export default model('externo', externoSchema);