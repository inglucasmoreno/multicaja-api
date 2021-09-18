import {Request, Response} from 'express';
import chalk from 'chalk';

import { respuesta } from '../helpers/response';
import MovimientoModel from '../models/movimientos.model';
import ChequeModel from '../models/cheque.model';
import EvolucionSaldosModel from '../models/evolucion_caja.model';
import mongoose from 'mongoose';
import { add } from 'date-fns';

class Reportes {

    // Reportes de movimientos
    public async movimientos(req: any, res: Response) {
        try{
            const {desde , hasta, tipo_movimiento, origen, destino, tipo_origen, tipo_destino} = req.body;
            
            let pipeline = [];

            pipeline.push({$match: {}});
            
            // Fecha de creacion de movimiento
            if(desde !== null && desde !== '') {
                const desdeNew = add(new Date(desde), { hours: 3 });

                
                pipeline.push({ $match: { createdAt: { $gte: new Date(desdeNew) } } })
            };
            
            if(hasta !== null && hasta !== ''){
                const hastaNew = add(new Date(hasta), { days: 1, hours: 3 });
                pipeline.push({ $match: { createdAt: { $lte: new Date(hastaNew) } } });
            } 

            // Tipo de movimiento
            if(tipo_movimiento !== null && tipo_movimiento !== '') pipeline.push({$match: { tipo_movimiento: mongoose.Types.ObjectId(tipo_movimiento) }});     

            // Tipo de origen
            if(tipo_origen !== null && tipo_origen !== '') pipeline.push({$match: { tipo_origen }});  
            
            // Tipo de destino
            if(tipo_destino !== null && tipo_destino !== '') pipeline.push({$match: { tipo_destino }});  

            // Origen
            if(origen !== null && origen !== '') pipeline.push({$match: { origen }});     
    
            // Destino
            if(destino !== null && destino !== '') pipeline.push({$match: { destino }});     
            
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

            // Join con "Centro de costos"
            pipeline.push(
                { $lookup: { // Lookup - centro_costos
                    from: 'centro_costos',
                    localField: 'centro_costos',
                    foreignField: '_id',
                    as: 'centro_costos'
                }},
            );
            pipeline.push({ $unwind: '$centro_costos' });

            // Join con "Cuenta contable"
            pipeline.push(
                { $lookup: { // Lookup - cuenta_contable
                    from: 'cuenta_contable',
                    localField: 'cuenta_contable',
                    foreignField: '_id',
                    as: 'cuenta_contable'
                }},
            );
            pipeline.push({ $unwind: '$cuenta_contable' });

            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }

            const movimientos = await MovimientoModel.aggregate(pipeline);
            
            respuesta.success(res, { movimientos });
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    // Reportes de cheques emitidos
    public async chequesEmitidos(req: any, res: Response) {
        try{

            const {cliente , destino, fechaDesde, fechaHasta, tipoDestino, estado} = req.body;

            let pipeline = [];
            
            pipeline.push({$match: { estado: 'Emitido' }});

            // Fecha de emision
            if(fechaDesde !== null && fechaDesde !== '') {
                const fechaDesdeNew = add(new Date(fechaDesde), { hours: 3 });
                pipeline.push({ $match: { fecha_emision: { $gte: new Date(fechaDesdeNew) } } });
            }
            
            if(fechaHasta !== null && fechaHasta !== '') {
                const fechaHastaNew = add(new Date(fechaHasta), { days: 1, hours: 3 });
                pipeline.push({ $match: { fecha_emision: { $lte: new Date(fechaHastaNew) } } })
            };

            // Estado - Cobrado o No cobrado
            if(estado !== ''){
                if(estado === 'true'){
                    pipeline.push({$match: { activo: true }});
                }else{
                    pipeline.push({$match: { activo: false }});
                }
            }    

            // Tipo de destino
            if(tipoDestino !== null && tipoDestino !== '') pipeline.push({$match: { tipo_destino: tipoDestino }});     

            // Cliente
            if(cliente !== null && cliente !== '') pipeline.push({$match: { cliente: mongoose.Types.ObjectId(cliente) }});     
    
            // Destino
            if(destino !== null && destino !== '') pipeline.push({$match: { destino: mongoose.Types.ObjectId(destino) }});
            
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }

            const cheques = await ChequeModel.aggregate(pipeline);
            
            respuesta.success(res, { cheques });

        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }

    // Reportes de evolucion de caja
    public async evolucionSaldo(req: any, res: Response) {
        try{
            
            const { fechaDesde, fechaHasta, saldo } = req.body;
            
            let pipeline = [];

            pipeline.push({ $match: { }});
            
            // Filtrado por saldo
            if(saldo !== null && saldo !== '') pipeline.push({ $match: { saldo: mongoose.Types.ObjectId(saldo) } });

            // Fecha de saldo
            if(fechaDesde !== null && fechaDesde !== '') {
                const fechaDesdeNew = add(new Date(fechaDesde), { hours: 3 });
                pipeline.push({ $match: { createdAt: { $gte: new Date(fechaDesdeNew) } } });
            }
            
            if(fechaHasta !== null && fechaHasta !== '') {
                const fechaHastaNew = add(new Date(fechaHasta), { days: 1, hours: 3 });
                pipeline.push({ $match: { createdAt: { $lte: new Date(fechaHastaNew) } } })
            };          
    
            // Ordenando datos
            const ordenar: any = {};
            if(req.query.columna){
                ordenar[req.query.columna] = Number(req.query.direccion); 
                pipeline.push({$sort: ordenar});
            }

            const saldos = await EvolucionSaldosModel.aggregate(pipeline);

            respuesta.success(res, { saldos });
            
        }catch(error){
            console.log(chalk.red(error));
            respuesta.error(res, 500);
        }
    }


}

export const ReportesController = new Reportes();

