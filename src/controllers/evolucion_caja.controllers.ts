import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import EvolucionCajaModel, { I_EvolucionCaja } from '../models/evolucion_caja.model';

class EvolucionCaja {

    // Nueva evolucion de caja
    public async nuevaEvolucionCaja(req: Request, res: Response){
        try{
            const evolucionCaja: I_EvolucionCaja = new EvolucionCajaModel(req.body);
            await evolucionCaja.save();
            respuesta.success(res, { evolucion: evolucionCaja });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Evolucion de caja por ID
    public async getEvolucionCaja(req: Request, res: Response){
        try{
            const id = req.params.id;
            const evolucionCaja: I_EvolucionCaja = await EvolucionCajaModel.findById(id);
            respuesta.success(res, { evolucion: evolucionCaja });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Listar evolucion de caja
    public async listarEvolucionCaja(req: any, res: Response){
        try{
            
            const pipeline = []; 
            pipeline.push({$match: { }});
        
            const evolucion = await EvolucionCajaModel.aggregate(pipeline);

            respuesta.success(res, { evolucion });
                
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

}

export const EvolucionCajaController = new EvolucionCaja();