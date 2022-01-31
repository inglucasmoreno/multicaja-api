import { Request, Response } from 'express'
import chalk from 'chalk';
import bcryptjs from 'bcryptjs';

import UsuarioModel from '../models/usuarios.model';
import { respuesta } from '../helpers/response';
import { jsonwebtoken } from '../helpers/jwt';

class Auth {
    
    // Metodo: Login de usuario
    public async login(req: Request, res: Response) {
        try{
            const {usuario, password} = req.body;
    
            // Se verifica si el usuario existe
            const usuarioDB = await UsuarioModel.findOne({usuario});
            if(!usuarioDB) return respuesta.error(res, 400, 'Los datos son incorrectos');
            
            // Se verifica password
            const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
            if(!validPassword) return respuesta.error(res, 400, 'Los datos son incorrectos'); 
            
            // Se verifica si el usuario esta activo
            if(!usuarioDB.activo) return respuesta.error(res, 400, 'Los datos son incorrectos');
    
            // Se genera el token
            const token = await jsonwebtoken.generar(usuarioDB._id);
    
            respuesta.success(res, { token });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }        
    }

    // Metodo: Renovacion de token
    public async renewtoken(req: any, res: Response){
        try{
            const uid = req.uid; // El uid se obtiene del middleware "validar-jwt"
            const [token, usuario] = await Promise.all([
                jsonwebtoken.generar(uid),
                UsuarioModel.findById(uid, 'usuario apellido nombre email role createdAt activo')
            ]);
            respuesta.success(res, {
                token,
                usuario
            });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }        
    }

}

export const AuthController = new Auth;
