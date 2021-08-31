import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import TipoMovimientoModel, { I_TipoMovimiento } from '../models/tipo_movimiento.model';

class TipoMovimiento {

    // Nuevo tipo
    public async nuevoTipo(req: Request, res: Response){
        try{
            const tipo: I_TipoMovimiento = new TipoMovimientoModel(req.body);
            await tipo.save();
            respuesta.success(res, { tipo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Tipo por ID
    public async getTipo(req: Request, res: Response){
        try{
            const id = req.params.id;
            const tipo: I_TipoMovimiento = await TipoMovimientoModel.findById(id);
            respuesta.success(res, { tipo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Listar tipos
    public async listarTipos(req: Request, res: Response){
        try{
            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'descripcion', direccion || 1];

            // Ejecucion de consulta
            const [tipos, total] = await Promise.all([
                TipoMovimientoModel.find().sort([ordenar]),
                TipoMovimientoModel.find().countDocuments()                
            ]); 
             
            // Respuesta
            respuesta.success(res, { tipos, total });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Actualizar tipo
    public async actualizarTipo(req: Request, res: Response){
        try{
            const id = req.params.id;
            const tipo: I_TipoMovimiento = await TipoMovimientoModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { tipo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

}

export const TipoMovimientoController = new TipoMovimiento();