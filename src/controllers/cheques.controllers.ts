import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import ChequeModel, { I_Cheque } from '../models/cheque.model';
import mongoose from 'mongoose';

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

    // Listar cheques por Empresa
    public async listarChequesPorEmpresa(req: Request, res: Response){
        try{
            
            // Recepcion de parametros
            const { columna, direccion } = req.query;
            const id = req.params.id;

            const pipeline = [];
            
            pipeline.push({ $match: { } });
                
            // Filtrado por activo/inactivo
            if(req.query.activo !== ''){
                if(req.query.activo === 'true'){
                    pipeline.push({ $match: { activo: true }});
                }else{
                    pipeline.push({ $match: { activo: false }});
                }
            }

            // Filtrado por empresa
            pipeline.push({ $match: { destino: mongoose.Types.ObjectId(id) }});

            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[String(columna)] = Number(direccion); 
                pipeline.push({$sort: ordenar});
            } 
            
            const cheques = await ChequeModel.aggregate(pipeline);
             
            // Respuesta
            respuesta.success(res, { cheques });

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