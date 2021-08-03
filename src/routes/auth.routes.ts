import Router from 'express';
import { check } from 'express-validator';

import { validaciones } from '../middlewares/validations';
import { AuthController } from '../controllers/auth.controllers'

const router = Router();

// Actualizacion de token
// GET - http://localhost:3000/api/auth 
router.get('/', validaciones.jwt, AuthController.renewtoken);

// Login
// POST - http://localhost:3000/api/auth 
router.post('/',
        [
            check('usuario', 'El Usuario es obligatorio').not().isEmpty(),
            check('password', 'El password es obligatorio').not().isEmpty(),
            validaciones.campos
        ], 
        AuthController.login);

export default router;