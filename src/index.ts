/*
    Desarrollador: Equinoccio Technology
    CEO: ing. Lucas Omar Moreno
    Año: 2021
    Tematica: Sistema de control de Multi-Caja
*/

// Imports
import express from 'express';
import chalk from 'chalk';
import path from 'path';
import { db } from './database/config';

// Imports - Rutas
import UsuariosRoutes from './routes/usuarios.routes';
import AuthRoutes from './routes/auth.routes';
import EmpresasRoutes from './routes/empresas.routes';
import ExternosRoutes from './routes/externos.routes';
import MovimientosRoutes from './routes/movimientos.routes';
import TipoMovimientoRoutes from './routes/tipo_movimiento.routes';
import ChequesRoutes from './routes/cheque.routes';

// [Express]
const app = express();
app.set('PORT', process.env.PORT || 3000);
app.use(require('cors')());
app.use(express.json());
app.use(express.static('src/public')); // Para prod solo 'public'

// [MongoDB]
db.connection();

// [Rutas]
app.use('/api/usuarios', UsuariosRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/empresas', EmpresasRoutes);
app.use('/api/externos', ExternosRoutes);
app.use('/api/movimientos', MovimientosRoutes);
app.use('/api/tipo-movimientos',TipoMovimientoRoutes); 
app.use('/api/cheques', ChequesRoutes); 

// [Necesario para no perder las rutas en produccion]
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Ejecución de servidor
app.listen(app.get('PORT'), () => {
    console.log(chalk.blue('[Desarrollador] - ') + 'Equinoccio Technology');
    console.log(chalk.blue('[Express] - ') + `Servidor corriendo en http://localhost:${app.get('PORT')}`);   
});

