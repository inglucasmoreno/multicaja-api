import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import MovimientoModel from '../models/movimientos.model';
import ChequeModel from '../models/cheque.model';
import mongoose from 'mongoose';

class Reportes {

    // Reportes de movimientos
    public async movimientos(req: Request, res: Response) {
        try{
            const {fechaDesde , fechaHasta, tipo_movimiento, origen, destino} = req.body;
              
            let pipeline = [];

            pipeline.push({$match: {}});

            // Fecha de creacion de movimiento
            if(fechaDesde) pipeline.push({ $match: { createdAt: { $gte: new Date(fechaDesde) } } });
            if(fechaHasta) pipeline.push({ $match: { createdAt: { $lte: new Date(fechaHasta) } } });

            // Tipo de movimiento
            if(tipo_movimiento) pipeline.push({$match: { tipo_movimiento: mongoose.Types.ObjectId(tipo_movimiento) }});     

            // Origen
            if(origen) pipeline.push({$match: { origen: mongoose.Types.ObjectId(origen) }});     
    
            // Destino
            if(destino) pipeline.push({$match: { destino: mongoose.Types.ObjectId(destino) }});     
            
            const movimientos = await MovimientoModel.aggregate(pipeline);
            
            respuesta.success(res, { movimientos });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    // Reportes de cheques emitidos
    public async chequesEmitidos(req: any, res: Response) {
        try{

            const {cliente , destino, fechaDesde, fechaHasta} = req.body;

            let pipeline = [];
            
            pipeline.push({$match: { estado: 'Emitido' }});

            // Fecha de emision
            if(fechaDesde) pipeline.push({ $match: { fecha_emision: { $gte: new Date(fechaDesde) } } });
            if(fechaHasta) pipeline.push({ $match: { fecha_emision: { $lte: new Date(fechaHasta) } } });

            // Cliente
            if(cliente) pipeline.push({$match: { cliente: mongoose.Types.ObjectId(cliente) }});     

            // Destino
            if(destino) pipeline.push({$match: { destino: mongoose.Types.ObjectId(destino) }});   
            
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }

            const cheques = await ChequeModel.aggregate(pipeline);
            
            respuesta.success(res, { cheques });

        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }


}

export const ReportesController = new Reportes();

