import {Request, Response} from 'express';
import chalk from 'chalk';
import bcryptjs from 'bcryptjs';

import { respuesta } from '../helpers/response';
import { jsonwebtoken } from '../helpers/jwt';
import UsuarioModel, { I_Usuario } from '../models/usuarios.model';

// Clase: Usuarios
class Usuarios {
    
    // Metodo: Usuario por ID
    public async getUsuario(req: Request, res: Response) { 
        try{
            const id: string = req.params.id;
            const usuario: I_Usuario = await UsuarioModel.findById(id, 'usuario nombre dni apellido role email createdAt activo');
            if(!usuario) return respuesta.error(res, 400, 'El usuario no existe');
            respuesta.success(res, { usuario });
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }
    }
    
    // Metodo: Listar usuarios
    public async listarUsuarios(req: Request, res: Response) { 
        try{
            
            const { columna, direccion } = req.query;
        
            // Ordenar
            let ordenar = [columna || 'apellido', direccion || 1];
            
            // Ejecución de consulta
            const [usuarios, total] = await Promise.all([
                UsuarioModel.find({}, 'usuario apellido nombre dni role email activo createdAt')
                            .sort([ordenar]),
                UsuarioModel.find().countDocuments()
            ]);
            
            respuesta.success(res, { usuarios, total });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }           
    } 

    // Metodo: Nuevo usuario
    public async nuevoUsuario(req: Request, res: Response) { 
        try{
            const {usuario, password, dni} = req.body;
           
            let existeUsuario: I_Usuario;

            // Verificacion: Usuario repetido?
            existeUsuario = await UsuarioModel.findOne({ usuario });
            if(existeUsuario) return respuesta.error(res, 400, 'El nombre de usuario ya existe');

            // Verificacion: Usuario repetido?
            existeUsuario = await UsuarioModel.findOne({ dni });
            if(existeUsuario) return respuesta.error(res, 400, 'Ya hay un usuario con ese DNI');
                    
            // Se crea la instancia de usuario
            const usuarioObj: I_Usuario = new UsuarioModel(req.body);
    
            // Se encripta la contraseña
            const salt = bcryptjs.genSaltSync();
            usuarioObj.password = bcryptjs.hashSync(password, salt);
            
            // Se almacena en base de datos y se genera el token
            await usuarioObj.save();
            const token = await jsonwebtoken.generar(usuario.id);
    
            respuesta.success(res, {
                usuario,
                token
            });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }
    
    // Metodo: Actualizar usuario
    public async actualizarUsuario(req: Request, res: Response) { 
        try{
            const { usuario, dni, password } = req.body;
            const uid = req.params.id;
    
            // Verificacion: EL usuario existe?
            const usuarioDB: I_Usuario = await UsuarioModel.findById(uid);
            if(!usuarioDB) return respuesta.error(res, 400, 'El usuario no existe');
    
            // Verificacion: El Usuario esta registrado?
            if(usuario !== usuarioDB.usuario){
                const usuarioExiste: I_Usuario = await UsuarioModel.findOne({ usuario });
                if(usuarioExiste) return respuesta.error(res, 400, 'El usuario ya esta registrado');   
            } 

            // Verificacion: El DNI ya esta registrado?
            if(dni !== usuarioDB.dni){
                const usuarioExiste: I_Usuario = await UsuarioModel.findOne({ dni });
                if(usuarioExiste) return respuesta.error(res, 400, 'El DNI ya esta registrado');   
            } 
        
            // Se encripta el password en caso de que sea necesario
            if(password){
                const salt = bcryptjs.genSaltSync();
                req.body.password = bcryptjs.hashSync(password, salt);     
            }
    
            // Se actualiza el usuario
            const usuarioRes: I_Usuario = await UsuarioModel.findByIdAndUpdate(uid, req.body, {new: true});
            respuesta.success(res, { usuario: usuarioRes });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }     
    }

    // Metodo: Inicializar usuario administrador
    public async inicializacionUsuario(req: Request, res: Response) { 
        try{

            // Se verifica si los usuarios ya fueron inicializados
            const usuariosDB = await UsuarioModel.find();
            if(usuariosDB.length !== 0) return respuesta.error(res, 400, 'Los usuarios ya fueron inicializados');

            // Se inicializa el usuario administrador
            const data = {
                usuario: 'admin',
                apellido: 'admin',
                nombre: 'admin',
                dni: '34060397',
                role: 'ADMIN_ROLE',
                password: 'admin',
                email: 'admin@gmail.com', 
            }

            // Se crea la instancia de usuario
            const usuario: I_Usuario = new UsuarioModel(data);
    
            // Se encripta la contraseña
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(data.password, salt);
            
            // Se almacena en base de datos y se genera el token
            await usuario.save();
    
            respuesta.success(res, {
                message: 'Usuario inicializado correctamente'
            });
    
        }catch(err){
            console.log(chalk.red(err));
            respuesta.error(res, 500);
        }   
    }




}

export const UsuariosController = new Usuarios();