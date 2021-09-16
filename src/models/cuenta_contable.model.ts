import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Cuenta contable
export interface I_CuentaContable extends mongoose.Document {
    descripcion: String,
    activo: Boolean
}

// Modelo - Cuenta contable
const cuentaContableSchema = new Schema({
    
    descripcion: { 
        type: String,
        trim: true,
        uppercase: true,
        required: 'La descripcion de la cuenta contable es obligatoria'
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'cuenta_contable' } );

export default model('cuenta_contable', cuentaContableSchema);