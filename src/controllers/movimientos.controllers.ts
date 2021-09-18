import {Request, Response} from 'express';
import chalk from 'chalk';
import { respuesta } from '../helpers/response';
import MovimientosModel from '../models/movimientos.model';
import ChequeModel from '../models/cheque.model';
import ExternosModel, { I_Externo } from '../models/externos.model';
import SaldosModel from '../models/saldos.models';
import EmpresaModel from '../models/empresas.model';
import EvolucionCajaModel from '../models/evolucion_caja.model';
import mongoose from 'mongoose';
import { add } from 'date-fns';

class Movimiento {

        // Movimiento por ID
        public async getMovimiento(req: Request, res: Response){
            try{
                const id = req.params.id;

                const movimientoTemp = await MovimientosModel.findById(id);
        
                const pipeline = [];

                // 1) - Filtrado por ID
                pipeline.push({ $match: { _id: mongoose.Types.ObjectId(id) } });

                // 2) - Join con "Tipo de movimientos"
                pipeline.push(
                    { $lookup: { // Lookup - Tipo movimientos
                        from: 'tipo_movimiento',
                        localField: 'tipo_movimiento',
                        foreignField: '_id',
                        as: 'tipo_movimiento'
                    }},
                );
                pipeline.push({ $unwind: '$tipo_movimiento' });

                // 3) - Join con "Saldo" - Origen | cuando es necesario
                if(movimientoTemp.tipo_origen === 'Interno'){
                    pipeline.push(
                        { $lookup: { // Lookup - Saldo
                            from: 'saldos',
                            localField: 'origen_saldo',
                            foreignField: '_id',
                            as: 'origen_saldo'
                        }},
                    );
                    pipeline.push({ $unwind: '$origen_saldo' });
                }

                // 4) - Join con "Saldo" - Destino | cuando es necesario
                if(movimientoTemp.tipo_destino === 'Interno'){
                    pipeline.push(
                        { $lookup: { // Lookup - Saldo
                            from: 'saldos',
                            localField: 'destino_saldo',
                            foreignField: '_id',
                            as: 'destino_saldo'
                        }},
                    );
                    pipeline.push({ $unwind: '$destino_saldo' });
                }

                // 5) - Join con "Centro de costos"
                pipeline.push(
                    { $lookup: { // Lookup - centro_costos
                        from: 'centro_costos',
                        localField: 'centro_costos',
                        foreignField: '_id',
                        as: 'centro_costos'
                    }},
                );
                pipeline.push({ $unwind: '$centro_costos' });

                // 6) - Join con "Cuenta contable"
                pipeline.push(
                    { $lookup: { // Lookup - cuenta_contable
                        from: 'cuenta_contable',
                        localField: 'cuenta_contable',
                        foreignField: '_id',
                        as: 'cuenta_contable'
                    }},
                );
                pipeline.push({ $unwind: '$cuenta_contable' });

                
                const movimiento = await MovimientosModel.aggregate(pipeline);
                
                respuesta.success(res, { movimiento: movimiento[0] });

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            }
        }

        // Nuevo movimiento
        public async nuevoMovimiento(req: Request, res: Response){
            try{
                
                const data: any = req.body;
                
                // ORIGEN
                if(req.body.tipo_origen === 'Interno'){    // Origen - Interno
                
                    const saldo = await SaldosModel.findById(data.origen_saldo).populate('empresa');
                    
                    // data.origen = data.origen_saldo;

                    data.origen_descripcion = saldo.empresa.razon_social;
                    data.origen_monto_anterior = saldo.monto;
                    data.origen_saldo_descripcion = saldo.descripcion;
                    
                    const nuevoMonto = saldo.monto - data.monto;
                    const nuevoSaldo = await SaldosModel.findByIdAndUpdate(data.origen_saldo, {monto: nuevoMonto}, {new: true});
                    
                    data.origen_monto_nuevo = nuevoSaldo.monto;

                }else{                                     // Origen - Externo
                    const externo = await ExternosModel.findById(data.origen);
                    data.origen_descripcion = externo.descripcion;
                    data.origen_monto_anterior = null;
                    data.origen_monto_nuevo = null;
                    data.origen_saldo = null;
                    data.origen_saldo_descripcion = null;
                }

                // DESTINO
                if(req.body.tipo_destino === 'Interno'){    // Destino - Interno
                    
                    const saldo = await SaldosModel.findById(data.destino_saldo).populate('empresa');
                    
                    // data.destino = data.destino_saldo;
                    
                    data.destino_descripcion = saldo.empresa.razon_social;
                    data.destino_monto_anterior = saldo.monto;
                    data.destino_saldo_descripcion = saldo.descripcion;
                    
                    const nuevoSaldo = await SaldosModel.findByIdAndUpdate(data.destino_saldo, { $inc: { monto: data.monto }  }, {new: true});
                    
                    data.destino_monto_nuevo = nuevoSaldo.monto;
                
                }else{                                      // Destino - Externo
                    const externo: I_Externo = await ExternosModel.findById(data.destino);
                    data.destino_descripcion = externo.descripcion;
                    data.destino_monto_anterior = null;
                    data.destino_monto_nuevo = null;
                    data.destino_saldo = null;
                    data.destino_saldo_descripcion = null;
                }
                
                const movimiento = new MovimientosModel(data);
                const movimientoDB = await movimiento.save();

                // ----- EVOLUCION DE SALDO -----
                
                // Origen
                if(req.body.tipo_origen === 'Interno'){
                    const dataEvolucion = {
                        empresa: data.origen,
                        empresa_descripcion: data.origen_descripcion,
                        saldo: data.origen_saldo,
                        saldo_descripcion: data.origen_saldo_descripcion,
                        monto_anterior: data.origen_monto_anterior,
                        monto_actual: data.origen_monto_nuevo,
                        movimiento: movimientoDB._id 
                    }
    
                    const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
                    await nuevaEvolucion.save();
    
                }
                
                // Destino
                if(req.body.tipo_destino === 'Interno'){
                    const dataEvolucion = {
                        empresa: data.destino,
                        empresa_descripcion: data.destino_descripcion,
                        saldo: data.destino_saldo,
                        saldo_descripcion: data.destino_saldo_descripcion,
                        monto_anterior: data.destino_monto_anterior,
                        monto_actual: data.destino_monto_nuevo,
                        movimiento: movimientoDB._id 
                    }
    
                    const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
                    await nuevaEvolucion.save();
    
                }

                respuesta.success(res, 'Movimiento creado correctamente');

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            } 
        }

        // Listar movimientos
        public async listarMovimientos(req: any, res: Response){
            try{
    
                const pipeline = [];

                pipeline.push({ $match: {} });

                // Ordenar
                // let ordenar = [columna || 'createdAt', direccion || -1];

                // Join con "Tipo de movimientos"
                 pipeline.push(
                    { $lookup: { // Lookup - Tipo movimientos
                        from: 'tipo_movimiento',
                        localField: 'tipo_movimiento',
                        foreignField: '_id',
                        as: 'tipo_movimiento'
                    }},
                );
                pipeline.push({ $unwind: '$tipo_movimiento' });
                
                // Ordenando datos
                const ordenar: any = {};
                if(req.query.columna){
                    ordenar[req.query.columna] = Number(req.query.direccion); 
                    pipeline.push({$sort: ordenar});
                }

                const movimientos = await MovimientosModel.aggregate(pipeline);
                 
                // Respuesta
                respuesta.success(res, { movimientos });

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            } 
        }

        // Cobrar cheque
        public async cobrarCheque(req: Request, res: Response){
            try{
                
                const { cheque, origen_saldo, destino_saldo, fecha_cobrado } = req.body;

                console.log(req.body);

                // FECHAS
                const fecha_cobrado_adaptada = add(new Date(fecha_cobrado),{hours: 3});

                let data:any = req.body; 

                // SE BUSCA LA DESCRIPCION DE SALDO
                const saldoDB = await SaldosModel.findById(destino_saldo);
                data.destino_saldo_descripcion = saldoDB.descripcion;

                // CALCULO DE MONTOS           
                const origen_monto = await SaldosModel.findById(origen_saldo);
                data.origen_monto_anterior = origen_monto.monto;
                data.origen_monto_nuevo = data.origen_monto_anterior - data.monto;

                const destino_monto = await SaldosModel.findById(destino_saldo);
                data.destino_monto_anterior = destino_monto.monto;
                data.destino_monto_nuevo = data.destino_monto_anterior + data.monto;

                // ACTUALIZACION DE MONTOS
                await SaldosModel.findByIdAndUpdate(origen_saldo, { monto: data.origen_monto_nuevo });
                await SaldosModel.findByIdAndUpdate(destino_saldo, { monto: data.destino_monto_nuevo });

                // ACTUALIZACION DE ESTADO DE CHEQUE
                await ChequeModel.findByIdAndUpdate(cheque, { fecha_cobrado: fecha_cobrado_adaptada, estado: 'Cobrado', activo: false }, { new: true });

                // SE CREA EL NUEVO MOVIMIENTO
                const nuevoMovimiento = new MovimientosModel(data);
                const movimientoDB = await nuevoMovimiento.save();

                // ----- EVOLUCION DE SALDO -----
                
                // Origen
                const dataEvolucionOrigen = {
                    empresa: data.origen,
                    empresa_descripcion: data.origen_descripcion,
                    saldo: data.origen_saldo,
                    saldo_descripcion: data.origen_saldo_descripcion,
                    monto_anterior: data.origen_monto_anterior,
                    monto_actual: data.origen_monto_nuevo,
                    movimiento: movimientoDB._id 
                }

                const nuevaEvolucionOrigen = new EvolucionCajaModel(dataEvolucionOrigen);
                await nuevaEvolucionOrigen.save();
      
                // Destino
                const dataEvolucionDestino = {
                    empresa: data.destino,
                    empresa_descripcion: data.destino_descripcion,
                    saldo: data.destino_saldo,
                    saldo_descripcion: data.destino_saldo_descripcion,
                    monto_anterior: data.destino_monto_anterior,
                    monto_actual: data.destino_monto_nuevo,
                    movimiento: movimientoDB._id 
                }

                const nuevaEvolucionDestino = new EvolucionCajaModel(dataEvolucionDestino);
                await nuevaEvolucionDestino.save();
               
                // RESPUESTA API-REST
                respuesta.success(res, 'Todo correcto');

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            }
        }

        // Transferir cheque
        public async transferirCheque(req: Request, res: Response){
            try{

                const { cheque, origen_saldo, tipo_destino, concepto, destino, fecha_transferencia } = req.body;
                
                let data:any = req.body;                
                let destinoDB: any = {};

                // AJUSTE DE FECHAS
                data.fecha_transferencia = add(new Date(fecha_transferencia),{hours: 3});   

                // SE OBTIENE LA DESCRIPCION DEL DESTINO
                if(tipo_destino === 'Interno'){
                    destinoDB = await EmpresaModel.findById(destino);
                    data.destino_descripcion = destinoDB.razon_social;
                }else{
                    destinoDB = await ExternosModel.findById(destino);
                    data.destino_descripcion = destinoDB.descripcion;
                }

                // MONTOS - ORIGEN             
                const origen_monto = await SaldosModel.findById(origen_saldo);
                data.origen_monto_anterior = origen_monto.monto;
                data.origen_monto_nuevo = data.origen_monto_anterior - data.monto; 
                await SaldosModel.findByIdAndUpdate(origen_saldo, { monto: data.origen_monto_nuevo });
                  
                // MONTOS - DESTINO
                if(tipo_destino === 'Interno'){
                    
                    const empresa = await EmpresaModel.findById(data.destino);
                    console.log(empresa.saldos_especiales.cheques);
                    data.destino_saldo = empresa.saldos_especiales.cheques;
                    data.destino_saldo_descripcion = 'CHEQUES';
                    
                    const destino_monto = await SaldosModel.findById(data.destino_saldo);
                    data.destino_monto_anterior = destino_monto.monto;
                    data.destino_monto_nuevo = data.destino_monto_anterior + data.monto;            
                    await SaldosModel.findByIdAndUpdate(data.destino_saldo, { monto: data.destino_monto_nuevo });
                
                }else{

                    data.destino_monto_anterior = null;
                    data.destino_monto_nuevo = null;
                    data.destino_saldo = null;
                    data.destino_saldo_descripcion = null;   
               
                }
                                      
                // ACTUALIZACION DEL CHEQUE
                const chequeAnterior = await ChequeModel.findByIdAndUpdate(cheque, { 
                    estado: 'Transferido', 
                    transferencia_destino_descripcion: data.destino_descripcion, 
                    transferencia_destino: data.destino,
                    fecha_transferencia: data.fecha_transferencia,
                    activo: false });
                
                // SE CREA UN NUEVO CHEQUE SI ES NECESARIO
                if(tipo_destino === 'Interno'){
                    const dataCheque = {
                        emisor: chequeAnterior.emisor,
                        cuit: chequeAnterior.cuit,
                        fecha_emision: chequeAnterior.fecha_emision,
                        fecha_cobro: chequeAnterior.fecha_cobro,
                        banco: chequeAnterior.banco,
                        nro_cheque: chequeAnterior.nro_cheque,
                        estado: 'Activo',
                        activo: true,
                        concepto,
                        importe: chequeAnterior.importe,
                        cliente: chequeAnterior.destino,
                        tipo_cliente: data.tipo_origen,
                        cliente_descripcion: chequeAnterior.destino_descripcion,
                        destino,
                        tipo_destino: data.tipo_destino,
                        destino_descripcion: data.destino_descripcion
                    };
                    const nuevoCheque = new ChequeModel(dataCheque); 
                    const chequeDB = await nuevoCheque.save();
                    data.cheque = chequeDB._id;    
                }

                // SE CREA EL MOVIMIENTO
                const nuevoMovimiento = new MovimientosModel(data);
                const movimientoDB = await nuevoMovimiento.save();

                 // ----- EVOLUCION DE SALDO -----
                
                // Origen
                if(req.body.tipo_origen === 'Interno'){
                    const dataEvolucion = {
                        empresa: data.origen,
                        empresa_descripcion: data.origen_descripcion,
                        saldo: data.origen_saldo,
                        saldo_descripcion: data.origen_saldo_descripcion,
                        monto_anterior: data.origen_monto_anterior,
                        monto_actual: data.origen_monto_nuevo,
                        movimiento: movimientoDB._id 
                    }
    
                    const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
                    await nuevaEvolucion.save();
    
                }
                
                // Destino
                if(req.body.tipo_destino === 'Interno'){
                    const dataEvolucion = {
                        empresa: data.destino,
                        empresa_descripcion: data.destino_descripcion,
                        saldo: data.destino_saldo,
                        saldo_descripcion: data.destino_saldo_descripcion,
                        monto_anterior: data.destino_monto_anterior,
                        monto_actual: data.destino_monto_nuevo,
                        movimiento: movimientoDB._id 
                    }
    
                    const nuevaEvolucion = new EvolucionCajaModel(dataEvolucion);
                    await nuevaEvolucion.save();
    
                }
                
                // RESPUESTA API-REST
                respuesta.success(res, 'Todo correcto');

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            }    
        }

}

export const MovimientoController = new Movimiento();