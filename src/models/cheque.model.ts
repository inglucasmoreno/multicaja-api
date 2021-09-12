import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Cheque
export interface I_Cheque extends mongoose.Document {
    nro_cheque: String,
    concepto: String,
    banco: String,
    banco_id: String,
    emisor: String,
    cuit: String,
    cliente: Schema.Types.ObjectId,
    destino: Schema.Types.ObjectId,
    cliente_descripcion: String,
    destino_descripcion: String,
    transferencia_destino_descripcion: String,
    transferencia_destino: String,
    importe: Number,
    fecha_emision: Date,
    fecha_cobro: Date,
    fecha_cobrado: Date,
    fecha_transferenca: Date,
    estado: String,
    activo: Boolean
}

// Modelo - Cheque
const chequeSchema = new Schema({
    nro_cheque: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },

    concepto: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },

    banco: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },

    banco_id: {
        type: String,
        trim: true,
        default: ''
    },

    emisor: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN DATO'
    },

    cuit: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'SIN DATO'
    },

    cliente: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    cliente_descripcion: {
        type: String,
        required: 'La descripcion del cliente es obligatorio',
    },

    destino: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    destino_descripcion: {
        type: String,
        required: 'La descripcion del destino es obligatorio',
    },

    transferencia_destino_descripcion: {
        type: String,
        default: null
    },

    transferencia_destino: {
        type: String,
        default: null
    },

    importe: {
        type: Number,
        required: true,
    },

    fecha_emision: {
        type: Date,
        default: Date.now()
    },

    fecha_cobro: {
        type: Date,
        default: Date.now()
    },

    fecha_cobrado: {
        type: Date,
        default: Date.now()
    },

    fecha_transferencia: {
        type: Date,
        default: Date.now()
    },
    
    estado: {
        type: String,
        default: 'Activo'
    },

    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model('cheque', chequeSchema);
