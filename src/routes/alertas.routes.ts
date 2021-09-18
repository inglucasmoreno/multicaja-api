import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { AlertasController } from '../controllers/alertas.controllers';

const router = Router();

// Alerta: Cobrar cheques
// GET - http://localhost:3000/api/alertas/cobrar-cheques
router.get('/cobrar-cheques', validaciones.jwt, AlertasController.cobrarCheques);

export default router;
