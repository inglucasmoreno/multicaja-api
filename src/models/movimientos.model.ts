import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Movimiento
export interface I_Movimiento extends mongoose.Document {
    monto: Number,
    cheque: String,
    tipo_origen: String,
    tipo_destino: String,
    tipo_movimiento: Schema.Types.ObjectId,
    cuenta_contable: Schema.Types.ObjectId,
    centro_costos: Schema.Types.ObjectId,
    comprobantes: String,
    concepto: String,
    origen: String,
    destino: String,
    origen_saldo: Schema.Types.ObjectId,
    destino_saldo: Schema.Types.ObjectId,
    origen_descripcion: String,
    destino_descripcion: String, 
    origen_saldo_descripcion: String,
    destino_saldo_descripcion: String,   
    origen_monto_anterior: Number,
    destino_monto_anterior: Number,
    origen_monto_nuevo: Number,
    destino_monto_nuevo: Number,
    activo: Boolean
}

// Modelo - Movimiento
const movimientoSchema = new Schema({
    monto: {
        type: Number,
        required: 'El monto es un campo obligatorio'
    },
    cheque: {
        type: String,
        default: null
    },
    tipo_origen: {
        type: String,
        required: 'El tipo de origen es un campo obligatorio'
    },
    tipo_destino: {
        type: String,
        required: 'El tipo de destino es un campo obligatorio'
    },
    tipo_movimiento: {
        type: Schema.Types.ObjectId,
        ref: 'tipo_movimiento',
        required: 'El tipo de movimiento es un campo obligatorio'
    },
    cuenta_contable: {
        type: Schema.Types.ObjectId,
        ref: 'cuenta_contable',
        required: 'La cuenta contable es un campo obligatorio'
    },
    centro_costos: {
        type: Schema.Types.ObjectId,
        ref: 'centro_costos',
        required: 'El centro de costos es un campo obligatorio'
    },
    comprobante: {                        
        type: String,
        uppercase: true,
        default: ''
    },
    concepto: {                          
        type: String,
        uppercase: true,
        default: ''
    },
    origen: {             // ID de empresa origen              
        type: String,
        required: 'El origen es un campo obligatorio'
    },
    destino: {            // ID de empresa destino   
        type: String,
        required: 'El destino es un campo obligatorio'
    },
    origen_saldo: {       // ID saldo origen - null en caso de que sea externo
        type: Schema.Types.ObjectId,
        ref: 'saldo',
        default: null
    },
    destino_saldo: {      // ID saldo destino - null en caso de que sea externo
        type: Schema.Types.ObjectId,
        ref: 'saldo',
        required: null
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
    origen_saldo_descripcion: {
        type: String,
        uppercase: true,
        default: null
    },
    destino_saldo_descripcion: {
        type: String,
        uppercase: true,
        default: null
    },
    origen_monto_anterior: {
        type: Number,
        default: null
    },
    destino_monto_anterior: {
        type: Number,
        default: null
    },
    origen_monto_nuevo: {
        type: Number,
        default: null
    },
    destino_monto_nuevo: {
        type: Number,
        default: null
    },
    activo: {
        type: Boolean,
        default: true
    },
}, { timestamps: true } );



export default model('movimiento', movimientoSchema);