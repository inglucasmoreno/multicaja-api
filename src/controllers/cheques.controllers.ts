import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import ChequeModel, { I_Cheque } from '../models/cheque.model';

class Cheque {

    // Nuevo cheque
    public async nuevoCheque(req: Request, res: Response){
        try{
            const cheque: I_Cheque = new ChequeModel(req.body);
            await cheque.save();
            respuesta.success(res, { cheque });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Cheque por ID
    public async getCheque(req: Request, res: Response){
        try{
            const id = req.params.id;
            const cheque: I_Cheque = await ChequeModel.findById(id);
            respuesta.success(res, { cheque });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Listar cheques
    public async listarCheques(req: Request, res: Response){
        try{
            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'descripcion', direccion || 1];

            // Ejecucion de consulta
            const [cheques, total] = await Promise.all([
                ChequeModel.find().sort([ordenar]),
                ChequeModel.find().countDocuments()                
            ]); 
             
            // Respuesta
            respuesta.success(res, { cheques, total });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Actualizar cheque
    public async actualizarCheque(req: Request, res: Response){
        try{
            const id = req.params.id;
            const cheque: I_Cheque = await ChequeModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { cheque });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

}

export const ChequeController = new Cheque();