import mongoose, { Schema, model } from 'mongoose';

// Interfaz - Centro de costos
export interface I_CentroCostos extends mongoose.Document {
    descripcion: String,
    activo: Boolean
}

// Modelo - Centro de costos
const centroCostosSchema = new Schema({
    
    descripcion: { 
        type: String,
        trim: true,
        uppercase: true,
        requierd: 'La descripcion es obligatoria'
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'centro_costos' } );

export default model('centro_costos', centroCostosSchema);