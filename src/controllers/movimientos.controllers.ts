import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import MovimientosModel, { I_Movimiento } from '../models/movimientos.model';
import ExternosModel, { I_Externo } from '../models/externos.model';
import SaldosModel, { I_Saldo } from '../models/saldos.models';

class Movimiento {

        // Nuevo movimiento
        public async nuevoMovimiento(req: Request, res: Response){
            try{
                
                const data: any = req.body;
                
                // ORIGEN
                if(req.body.tipo_origen === 'Interno'){    // Origen - Interno
                    data.origen = data.origen_saldo;
                    const saldo = await SaldosModel.findById(data.origen_saldo).populate('empresa');
                    data.origen_descripcion = saldo.empresa.razon_social + ' - ' + saldo.descripcion;
                    const nuevoMonto = saldo.monto - data.monto;
                    await SaldosModel.findByIdAndUpdate(data.origen_saldo, {monto: nuevoMonto}, {new: true});
                }else{                                     // Origen - Externo
                    const externo = await ExternosModel.findById(data.origen);
                    data.origen_descripcion = externo.descripcion;
                }

                // DESTINO
                if(req.body.tipo_destino === 'Interno'){    // Destino - Interno
                    data.destino = data.destino_saldo;
                    const saldo = await SaldosModel.findById(data.destino_saldo).populate('empresa');
                    data.destino_descripcion = saldo.empresa.razon_social + ' - ' + saldo.descripcion;
                    await SaldosModel.findByIdAndUpdate(data.destino_saldo, { $inc: { monto: data.monto }  }, {new: true});
                }else{                                      // Destino - Externo
                    const externo: I_Externo = await ExternosModel.findById(data.destino);
                    data.destino_descripcion = externo.descripcion;
                }

                const movimiento = new MovimientosModel(data);
                await movimiento.save();

                respuesta.success(res, 'Movimiento creado correctamente');

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            } 
        }

        // Listar movimientos
        public async listarMovimientos(req: Request, res: Response){
            try{
                
                // Recepcion de parametros
                const { columna, direccion } = req.query;
    
                // Ordenar
                let ordenar = [columna || 'createdAt', direccion || -1];
    
                // Ejecucion de consulta
                const [movimientos, total] = await Promise.all([
                    MovimientosModel.find().sort([ordenar]),
                    MovimientosModel.find().countDocuments()                
                ]); 
                 
                // Respuesta
                respuesta.success(res, { movimientos, total });

            }catch(error){
                console.log(chalk.red(error));
                respuesta.error(res, 500);
            } 
        }

}

export const MovimientoController = new Movimiento();