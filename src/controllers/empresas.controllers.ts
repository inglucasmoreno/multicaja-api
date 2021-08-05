import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import EmpresaModel, { I_Empresa } from '../models/empresas.model';

class Empresa {
    
    // Nueva empresa
    public async nuevaEmpresa(req: Request, res: Response){
        try{
            
            const data: any = {};
            const {razon_social, cuit, telefono, direccion} = req.body;

            data.razon_social = razon_social;
            cuit.trim() !== '' ? data.cuit = cuit : null;
            telefono.trim() !== '' ? data.telefono = telefono : null;
            direccion.trim() !== '' ? data.direccion = direccion : null;

            // Creacion de nueva empresa y respuesta
            const nuevaEmpresa = new EmpresaModel(data);
            const empresa = await nuevaEmpresa.save();
            respuesta.success(res, { empresa });
     
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500)
        }
    }

    // Empresa por ID
    public async getEmpresa(req: Request, res: Response){
        try{
        
            const id = req.params.id;
            
            // Existe la empresa a actualizar?
            const empresaExiste = await EmpresaModel.findById(id);
            if(!empresaExiste) return respuesta.error(res, 400, 'La empresa no existe');
            
            // Creacion de empresa y generacion de respuesta
            const empresa = await EmpresaModel.findById(id);
            respuesta.success(res, { empresa });
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Listar empresas
    public async listarEmpresas(req: Request, res: Response){
        try{
            
            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'razon_social', direccion || 1];

            // Ejecucion de consulta
            const [empresas, total] = await Promise.all([
                EmpresaModel.find().sort([ordenar]),
                EmpresaModel.find().countDocuments()                
            ]); 
             
            // Respuesta
            respuesta.success(res, { empresas, total });

        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }

    // Actualizar empresa
    public async actualizarEmpresa(req: Request, res: Response){
        try{
        
            const id = req.params.id;
            
            // Existe la empresa a actualizar?
            const empresaExiste = await EmpresaModel.findById(id);
            if(!empresaExiste) return respuesta.error(res, 400, 'La empresa no existe');
      
            // El nuevo CUIT ya esta registrado?
            // const cuitExiste = await EmpresaModel.findOne({ cuit: req.body.cuit });
            // if(cuitExiste) return respuesta.error(res, 400, 'El cuit ya esta registrado')

            // Actualizacion y Respuesta
            const empresa = await EmpresaModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { empresa });
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

}

export const EmpresaController = new Empresa();