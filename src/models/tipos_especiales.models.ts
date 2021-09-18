import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Saldo
export interface I_TipoMovimiento extends mongoose.Document {
    tipo: String,
    clave: String,
    activo: Boolean
}

// Modelo - Saldo
const tipoMovimientoSchema = new Schema({
    
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

}, { timestamps: true, collection: 'tipo_movimiento' } );

export default model('tipo_movimiento', tipoMovimientoSchema);