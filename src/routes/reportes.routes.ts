import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { ReportesController } from '../controllers/reportes.controllers';

const router = Router();

// Movimientos
// POST - http://localhost:3000/api/reportes/movimientos
router.post('/movimientos', validaciones.jwt, ReportesController.movimientos);

// Cheques emitidos
// POST - http://localhost:3000/api/reportes/cheques-emitidos
router.post('/cheques-emitidos', validaciones.jwt, ReportesController.chequesEmitidos);

// Saldos
// POST - http://localhost:3000/api/reportes/saldos
router.post('/saldos', validaciones.jwt, ReportesController.evolucionSaldo);

export default router;
