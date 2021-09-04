import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import MovimientosModel, { I_Movimiento } from '../models/movimientos.model';
import ExternosModel, { I_Externo } from '../models/externos.model';
import SaldosModel, { I_Saldo } from '../models/saldos.models';
import mongoose from 'mongoose';

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
                
                console.log(data);

                const movimiento = new MovimientosModel(data);
                await movimiento.save();

                respuesta.success(res, 'Movimiento creado correctamente');

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            } 
        }

        // Listar movimientos
        public async listarMovimientos(req: any, res: Response){
            try{
                
                // Recepcion de parametros
                const { columna, direccion } = req.query;
    
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

}

export const MovimientoController = new Movimiento();