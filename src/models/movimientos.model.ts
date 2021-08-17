import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Movimiento
export interface I_Movimiento extends mongoose.Document {
    descripcion: String,
    monto: Number,
    tipo_origen: String,
    tipo_destino: String,
    origen: String,
    destino: String,
    origen_descripcion: String,
    destino_descripcion: String,
    activo: Boolean
}

// Modelo - Movimiento
const movimientoSchema = new Schema({
    descripcion: {
        type: String,
        uppercase: true,
        required : 'La descripcion es un campo obligatorio'
    },
    monto: {
        type: Number,
        required: 'El monto es un campo obligatorio'
    },
    tipo_origen: {
        type: String,
        required: 'El tipo de origen es un campo obligatorio'
    },
    tipo_destino: {
        type: String,
        required: 'El tipo de destino es un campo obligatorio'
    },
    origen: {
        type: String,
        required: 'El origen es un campo obligatorio'
    },
    destino: {
        type: String,
        required: 'El destino es un campo obligatorio'
    },
    origen_descripcion: {
        type: String,
        uppercase: true,
        required: 'La descripcion del origen es un campo obligatorio'
    },
    destino_descripcion: {
        type: String,
        uppercase: true,
        required: 'La descripcion del destino es un campo obligatorio'
    },
    activo: {
        type: Boolean,
        default: true
    },
}, { timestamps: true } );

export default model('movimiento', movimientoSchema);