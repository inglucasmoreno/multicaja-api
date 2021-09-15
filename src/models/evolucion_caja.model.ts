import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Evolucion de caja
export interface I_EvolucionCaja extends mongoose.Document {
    saldo: Schema.Types.ObjectId,
    saldo_descripcion: String,
    empresa: Schema.Types.ObjectId,
    empresa_descripcion: String,
    movimiento: String,
    monto_anterior: Number,
    monto_actual: Number,
    activo: Boolean
}

// Modelo - Evolucion de caja
const evolucionCajaSchema = new Schema({
    
    saldo: {
        type: Schema.Types.ObjectId,
        ref: 'saldo',
        required : 'El saldo es un campo obligatorio'
    },

    saldo_descripcion: { 
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion del saldo es un campo obligatorio'
    },

    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'empresa',
        required : 'La empresa es un campo obligatorio'
    },

    empresa_descripcion: { 
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion de la empresa es un campo obligatorio'
    },

    movimiento: {
        type: Schema.Types.ObjectId,
        ref: 'movimiento',
        default: null
    },

    monto_anterior: {
        type: Number,
        required: 'El monto anterior es un campo obligatorio'
    },

    monto_actual: {
        type: Number,
        required: 'El monto actual es un campo obligatorio'
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'evolucion_caja' } );

export default model('evolucion_caja', evolucionCajaSchema);