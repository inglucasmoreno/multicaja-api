import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import ChequeModel, { I_Cheque } from '../models/cheque.model';
import EmpresasModel from '../models/empresas.model';
import ExternoModel from '../models/externos.model';
import SaldoModel from '../models/saldos.models';
import EvolucionCajaModel from '../models/evolucion_caja.model';
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
            cheque.fecha_cobro = add(new Date(cheque.fecha_cobro),{hours: 3});      

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
            movimiento.origen_saldo = null;
            movimiento.origen_saldo_descripcion = '';

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
            const movimientoDB = await nuevoMovimiento.save();

            // ----- EVOLUCION DE SALDO -----
            
            const dataEvolucion = {
                empresa: movimiento.destino,
                empresa_descripcion: movimiento.destino_descripcion,
                saldo: movimiento.destino_saldo,
                saldo_descripcion: movimiento.destino_saldo_descripcion,
                monto_anterior: movimiento.destino_monto_anterior,
                monto_actual: movimiento.destino_monto_nuevo,
                movimiento: movimientoDB._id 
            }

            const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
            await nuevaEvolucion.save();

            respuesta.success(res, 'Todo correcto');
        
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        } 
    }

    // Emitir cheque
    public async emitirCheque(req: Request, res: Response) {
        try{

            const { cheque, movimiento } = req.body;

            // AJUSTE DE FECHAS
            cheque.fecha_emision = add(new Date(cheque.fecha_emision),{hours: 3});
            if(cheque.fecha_cobro !== '') cheque.fecha_cobro = add(new Date(cheque.fecha_cobro),{hours: 3});
            else cheque.fecha_cobro = add(new Date('1970-01-01'),{hours: 3});
                
            // --------- DATOS DE CHEQUE ----------

            // BANCO (SALDO) - DESCRIPCION
            const saldo = await SaldoModel.findById(cheque.banco_id);
            cheque.banco = saldo.descripcion;
            movimiento.origen_saldo_descripcion = saldo.descripcion; 

            let destinoDB: any = {};

            // DESTINO - DESCRIPCION
            if(movimiento.tipo_destino === 'Interno'){
                destinoDB = await EmpresasModel.findById(cheque.destino);
                cheque.destino_descripcion = destinoDB.razon_social;
                movimiento.destino_descripcion = destinoDB.razon_social;
            }else{
                destinoDB = await ExternoModel.findById(cheque.destino);
                cheque.destino_descripcion = destinoDB.descripcion;
                movimiento.destino_descripcion = destinoDB.descripcion;
            }
              
            // MONTOS - ORIGEN
            movimiento.origen_monto_anterior = saldo.monto;
            movimiento.origen_monto_nuevo = saldo.monto;

            // MONTOS - DESTINO
            if(movimiento.tipo_destino === 'Interno'){
                movimiento.destino_saldo = destinoDB.saldos_especiales.cheques;
                movimiento.destino_saldo_descripcion = 'CHEQUES';
                const saldoDestino = await SaldoModel.findById(destinoDB.saldos_especiales.cheques);
                movimiento.destino_monto_anterior = saldoDestino.monto;
                const nuevoSaldoDestino = saldoDestino.monto + cheque.importe;
                movimiento.destino_monto_nuevo = nuevoSaldoDestino;       
                await SaldoModel.findByIdAndUpdate(destinoDB.saldos_especiales.cheques,{ monto: nuevoSaldoDestino }); 
            }else{
                movimiento.destino_saldo = null;
                movimiento.destino_saldo_descripcion = null;
                movimiento.destino_monto_anterior = null;
                movimiento.destino_monto_nuevo = null;
            }

            // ESTADO DE CHEQUE
            cheque.estado = 'Emitido';

            // CREACION DE CHEQUES
            const nuevoCheque = new ChequeModel(cheque);
            const nuevoChequeDB = await nuevoCheque.save();

            if(movimiento.tipo_destino === 'Interno'){
                cheque.estado = 'Activo';
                const nuevoChequeParaInterno = new ChequeModel(cheque);
                await nuevoChequeParaInterno.save();
            }
            
            // COMPLETANDO DATOS DE MOVIMIENTO
            movimiento.cheque = nuevoChequeDB._id;
            
            console.log(movimiento);
            console.log(cheque);

            // CREAR MOVIMIENTO
            const nuevoMovimiento = new MovimientoModel(movimiento);
            const movimientoDB = await nuevoMovimiento.save();
            
            // ---- EVOLUCION DE SALDO ----
            
            if(movimiento.tipo_destino === 'Interno'){

                // Destino
                const dataEvolucion = {
                    empresa: movimiento.destino,
                    empresa_descripcion: movimiento.destino_descripcion,
                    saldo: movimiento.destino_saldo,
                    saldo_descripcion: movimiento.destino_saldo_descripcion,
                    monto_anterior: movimiento.destino_monto_anterior,
                    monto_actual: movimiento.destino_monto_nuevo,
                    movimiento: movimientoDB._id 
                }
    
                const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
                await nuevaEvolucion.save();

            }

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

            // Filtrado por estado
            if(req.query.estado !== ''){
                if(req.query.estado === 'Activo'){
                    pipeline.push({ $match: { estado: 'Activo' }});
                }else if(req.query.estado === 'Cobrado'){
                    pipeline.push({ $match: { estado: 'Cobrado' }});
                }else if(req.query.estado === 'Transferido'){
                    pipeline.push({ $match: { estado: 'Transferido' }});
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

    // Listar cheques por Empresa EMITIDOS
    public async listarChequesPorEmpresaEmitidos(req: Request, res: Response){
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

            // Filtrado por estado
            if(req.query.estado !== ''){
                if(req.query.estado === 'Emitido'){
                    pipeline.push({ $match: { estado: 'Emitido' }});
                }
            }

            // Filtrado por empresa
            pipeline.push({ $match: { cliente: mongoose.Types.ObjectId(id) }});

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

    // Cheque emitido cobrado
    public async emitidoCobrado(req: Request, res: Response){
        try{

            const {cheque, movimiento} = req.body;

            // FECHAS
            const fecha_cobrado = add(new Date(cheque.fecha_cobrado),{hours: 3});

            // SALDOS
            const saldo = await SaldoModel.findById(cheque.banco_id);
            
            movimiento.origen_saldo_descripcion = saldo.descripcion;
            movimiento.destino_saldo_descripcion = saldo.descripcion;
            
            movimiento.origen_monto_anterior = saldo.monto;
            movimiento.origen_monto_nuevo = saldo.monto;
            movimiento.destino_monto_anterior = saldo.monto;
            
            const nuevoMonto = saldo.monto - cheque.importe;
            movimiento.destino_monto_nuevo = nuevoMonto;

            await SaldoModel.findByIdAndUpdate(cheque.banco_id, { monto: nuevoMonto });
            
            // ACTUALIZACION DE CHEQUE
            await ChequeModel.findByIdAndUpdate(cheque.cheque_id, { fecha_cobrado, activo: false });

            // NUEVO MOVIMIENTO
            const nuevoMovimiento = new MovimientoModel(movimiento);
            const movimientoDB = await nuevoMovimiento.save();

                        
            // EVOLUCION DE SALDO
            
            // Origen
            const dataEvolucion = {
                empresa: movimiento.destino,
                empresa_descripcion: movimiento.destino_descripcion,
                saldo: movimiento.destino_saldo,
                saldo_descripcion: movimiento.destino_saldo_descripcion,
                monto_anterior: movimiento.destino_monto_anterior,
                monto_actual: movimiento.destino_monto_nuevo,
                movimiento: movimientoDB._id 
            }

            const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
            await nuevaEvolucion.save();
            
            respuesta.success(res, 'Actualizacion correcta');

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