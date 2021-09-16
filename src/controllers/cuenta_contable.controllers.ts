import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import CuentaContableModel, { I_CuentaContable } from '../models/cuenta_contable.model';

class CuentaContable {

    // Nueva cuenta contable
    public async nuevaCuentaContable(req: Request, res: Response){
        try{
            const cuentaContable: I_CuentaContable = new CuentaContableModel(req.body);
            await cuentaContable.save();
            respuesta.success(res, { cuentaContable });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Cuenta contable por ID
    public async getCuentaContable(req: Request, res: Response){
        try{
            const id = req.params.id;
            const cuentaContable: I_CuentaContable = await CuentaContableModel.findById(id);
            respuesta.success(res, { cuentaContable });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Listar cuenta contable
    public async listarCuentaContable(req: Request, res: Response){
        try{

            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'descripcion', direccion || 1];

            // Ejecucion de consulta
            const [cuentasContables, total] = await Promise.all([
                CuentaContableModel.find().sort([ordenar]),
                CuentaContableModel.find().countDocuments()                
            ]); 
             
            // Respuesta
            respuesta.success(res, { cuentasContables, total });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Actualizar cuenta contable
    public async actualizarCuentaContable(req: Request, res: Response){
        try{
            const id = req.params.id;
            const cuentaContable: I_CuentaContable = await CuentaContableModel.findByIdAndUpdate(id, req.body, {new: true});
            respuesta.success(res, { cuentaContable });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

}

export const CuentaContableController = new CuentaContable();