import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import ExternoModel, { I_Externo } from '../models/externos.model';


class Externo {

    // Nuevo externo
    public async nuevoExterno(req: Request, res: Response){
        try{
            const externo: I_Externo = new ExternoModel(req.body);
            await externo.save();
            respuesta.success(res, { externo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Externo por ID
    public async getExterno(req: Request, res: Response){
        try{
            const id = req.params.id;
            const externo: I_Externo = await ExternoModel.findById(id);
            respuesta.success(res, { externo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Listar externos
    public async listarExternos(req: Request, res: Response){
        try{
            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'descripcion', direccion || 1];

            // Ejecucion de consulta
            const [externos, total] = await Promise.all([
                ExternoModel.find().sort([ordenar]),
                ExternoModel.find().countDocuments()                
            ]); 
             
            // Respuesta
            respuesta.success(res, { externos, total });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Actualizar externo
    public async actualizarExterno(req: Request, res: Response){
        try{
            const id = req.params.id;
            const externo: I_Externo = await ExternoModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { externo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

}

export const ExternoController = new Externo();