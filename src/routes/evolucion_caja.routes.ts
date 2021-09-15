import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { EvolucionCajaController } from '../controllers/evolucion_caja.controllers';

const router = Router();

// Evolucion de caja por ID
// GET - http://localhost:3000/api/evolucion-caja/:id 
router.get('/:id', validaciones.jwt, EvolucionCajaController.getEvolucionCaja);

// Evolucion de caja 
// POST - http://localhost:3000/api/evolucion-caja
router.post('/', validaciones.jwt, EvolucionCajaController.listarEvolucionCaja);

// Nueva evolucion de caja
// POST - http://localhost:3000/api/evolucion-caja
router.post('/', validaciones.jwt, EvolucionCajaController.nuevaEvolucionCaja);

export default router;
