import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Saldo
export interface I_Saldo extends mongoose.Document {
    empresa: Schema.Types.ObjectId,
    descripcion: String,
    monto: Number,
    activo: Boolean
}

// Modelo - Saldo
const saldoSchema = new Schema({
    
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'empresa',
        required : 'La empresa es un campo obligatorio'
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

}, { timestamps: true } );

export default model('saldo', saldoSchema);