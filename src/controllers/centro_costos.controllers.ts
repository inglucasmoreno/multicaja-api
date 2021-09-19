import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import CentroCostosModel, { I_CentroCostos } from '../models/centro_costos.model';

class CentroCostos {

    // Nuevo centro de costos
    public async nuevoCentroCostos(req: Request, res: Response){
        try{
            const centroCostos: I_CentroCostos = new CentroCostosModel(req.body);
            await centroCostos.save();
            respuesta.success(res, { centro: centroCostos });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Centro de costos por ID
    public async getCentroCosto(req: Request, res: Response){
        try{
            const id = req.params.id;
            const centroCostos: I_CentroCostos = await CentroCostosModel.findById(id);
            respuesta.success(res, { centro: centroCostos });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Listar centros de costos
    public async listarCentrosCostos(req: Request, res: Response){
        try{
            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'descripcion', direccion || 1];

            // Ejecucion de consulta
            const [centros, centro_sin_especificar, total] = await Promise.all([
                CentroCostosModel.find().sort([ordenar]),
                CentroCostosModel.findOne({ descripcion: 'SIN ESPECIFICAR' }),
                CentroCostosModel.find().countDocuments()                
            ]); 
             
            // Respuesta
            respuesta.success(res, { centros, centro_sin_especificar, total });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Actualizar centro de costo
    public async actualizarCentroCostos(req: Request, res: Response){
        try{
            const id = req.params.id;
            const centroCostos: I_CentroCostos = await CentroCostosModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { centro: centroCostos });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

}

export const CentroCostosController = new CentroCostos();