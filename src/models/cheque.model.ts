import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Cheque
export interface I_Cheque extends mongoose.Document {
    nro_cheque: String,
    concepto: String,
    emisor: String,
    cuit: String,
    cliente: Schema.Types.ObjectId,
    destino: Schema.Types.ObjectId,
    importe: Number,
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

    destino: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    importe: {
        type: Number,
        required: true,
    },
    
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model('cheque', chequeSchema);
