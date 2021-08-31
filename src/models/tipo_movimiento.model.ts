import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Saldo
export interface I_TipoMovimiento extends mongoose.Document {
    descripcion: String,
    activo: Boolean
}

// Modelo - Saldo
const tipoMovimientoSchema = new Schema({
    
    descripcion: { 
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion es un campo obligatorio'
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'movimiento' } );

export default model('tipo_movimiento', tipoMovimientoSchema);