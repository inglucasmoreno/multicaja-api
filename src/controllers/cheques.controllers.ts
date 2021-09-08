import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import ChequeModel, { I_Cheque } from '../models/cheque.model';
import ExternoModel from '../models/externos.model';
import SaldoModel from '../models/saldos.models';
import MovimientoModel from '../models/movimientos.model';

import { add } from 'date-fns';

import mongoose from 'mongoose';

class Cheque {

    // Nuevo cheque
    public async nuevoCheque(req: Request, res: Response){
        try{
            const nuevoCheque: I_Cheque = new ChequeModel(req.body);
            const cheque = await nuevoCheque.save();
            respuesta.success(res, { cheque });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Nuevo cheque desde cartera
    public async nuevoChequeDesdeCartera(req: Request, res: Response){
        try{
            
            const { cheque, movimiento } = req.body;
            
            // AJUSTE DE FECHAS
            cheque.fecha_emision = add(new Date(cheque.fecha_emision),{hours: 3});      

            // DATOS DE CLIENTE
            const cliente = await ExternoModel.findById(cheque.cliente);
            
            // CREACION DE NUEVO CHEQUE
            cheque.cliente_descripcion = cliente.descripcion;
            const nuevoCheque = new ChequeModel(cheque);
            const nuevoChequeDB = await nuevoCheque.save();

            // CREACION DE MOVIMIENTO
            
            // 1) - Se completan datos
            movimiento.cheque = nuevoChequeDB._id;
            movimiento.origen_descripcion = cliente.descripcion;

            // 2) - Se obtienen y actualizan los saldos
            
            // Origen - Externo
            movimiento.origen_monto_anterior = null;
            movimiento.origen_monto_nuevo = null;

            // Destino - Interno
            const saldo = await SaldoModel.findById(movimiento.destino_saldo);
            movimiento.destino_monto_anterior = saldo.monto;
            movimiento.destino_monto_nuevo = saldo.monto + movimiento.monto;
            await SaldoModel.findByIdAndUpdate(movimiento.destino_saldo, { monto: movimiento.destino_monto_nuevo });

            // 3) - Se crea el movimiento
            const nuevoMovimiento = new MovimientoModel(movimiento);
            await nuevoMovimiento.save();

            console.log(cheque, movimiento);
            respuesta.success(res, 'Todo correcto');
        
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