import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import ChequeModel, { I_Cheque } from '../models/cheque.model';
import { add, format } from 'date-fns';


class Alertas {

    // Listar cheques para cobrar hoy - EN CARTERA
    public async cobrarCheques(req: any, res: Response){
        try{
            
            const pipeline: any[] = [];
            
            // Se ajusta la fecha
            const fechaComp = add(new Date(format(add(new Date() , {hours: -3}),'yyyy-MM-dd')),{hours: 3});
            
            // Filtrado por estado
            pipeline.push({$match: { estado: 'Activo', activo: true }});

            // Filtrado por fechas
            pipeline.push({$match: { fecha_cobro: { $gte: new Date(1971,10,10), $lte: add(new Date(), { days: 1 }) }}});

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

export const AlertasController = new Alertas();