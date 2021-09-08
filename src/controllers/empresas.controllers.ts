import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import EmpresaModel, { I_Empresa } from '../models/empresas.model';
import SaldoModel, { I_Saldo } from '../models/saldos.models';

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
            
            console.log(data);

            // Creacion de nueva empresa
            data.saldos_especiales = { caja: null, cheques: null }
            
            const nuevaEmpresa: I_Empresa = new EmpresaModel(data);
            const empresa: I_Empresa = await nuevaEmpresa.save();
            
            // Creacion de tipos especiales (CAJA y CHEQUE)
            let nuevoSaldo = new SaldoModel({ descripcion: 'CAJA', monto: 0, empresa: empresa._id});
            const caja = await nuevoSaldo.save();

            nuevoSaldo = new SaldoModel({ descripcion: 'CHEQUES', monto: 0, empresa: empresa._id});
            const cheque = await nuevoSaldo.save();

            // Se le agegran los tipos especiales a la empresa
            const empresaFinal = await EmpresaModel.findByIdAndUpdate(empresa._id, { saldos_especiales: { caja: caja._id, cheques: cheque._id } })

            respuesta.success(res, { empresa: empresaFinal });
     
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
            const empresaExiste: I_Empresa = await EmpresaModel.findById(id);
            if(!empresaExiste) return respuesta.error(res, 400, 'La empresa no existe');
            
            // Creacion de empresa y generacion de respuesta
            const empresa: I_Empresa = await EmpresaModel.findById(id);
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
            const empresaExiste: I_Empresa = await EmpresaModel.findById(id);
            if(!empresaExiste) return respuesta.error(res, 400, 'La empresa no existe');
      
            // El nuevo CUIT ya esta registrado?
            // const cuitExiste = await EmpresaModel.findOne({ cuit: req.body.cuit });
            // if(cuitExiste) return respuesta.error(res, 400, 'El cuit ya esta registrado')

            // Actualizacion y Respuesta
            const empresa: I_Empresa = await EmpresaModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { empresa });
        
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }

    // --------- SALDOS DE EMPRESAS --------
    
    // Saldo por ID
    public async getSaldo(req: Request, res: Response){
        try{
            const id = req.params.id;
            const saldo: I_Saldo = await SaldoModel.findById(id);
            respuesta.success(res, { saldo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }    

    // Listar saldos por ID de empresa
    public async listarSaldos(req: Request, res: Response){
        try{
            const empresa = req.params.empresa;
        
            // Recepcion de parametros
            const { columna, direccion } = req.query;

            // Ordenar
            let ordenar = [columna || 'descripcion', direccion || 1];

            // Ejecucion de consulta
            const [saldos, total] = await Promise.all([
                SaldoModel.find({ empresa }).sort([ordenar]),
                SaldoModel.find({ empresa }).countDocuments()                
            ]); 
            
            // Respuesta
            respuesta.success(res, { saldos, total });


        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }  
    

    // Nuevo saldo
    public async nuevoSaldo(req: Request, res: Response){
        try{
            const saldo: I_Saldo = new SaldoModel(req.body);
            await saldo.save();
            respuesta.success(res, { saldo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Actualizar saldo
    public async actualizarSaldo(req: Request, res: Response){
        try{
            const id = req.params.id;
            const saldo: I_Saldo = await SaldoModel.findByIdAndUpdate(id, req.body, { new: true });
            respuesta.success(res, { saldo });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }
    

}

export const EmpresaController = new Empresa();