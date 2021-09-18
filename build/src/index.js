"use strict";
/*
    Desarrollador: Equinoccio Technology
    CEO: ing. Lucas Omar Moreno
    Año: 2021
    Tematica: Sistema de control de Multi-Caja
*/
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./database/config");
// Imports - Rutas
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const empresas_routes_1 = __importDefault(require("./routes/empresas.routes"));
const externos_routes_1 = __importDefault(require("./routes/externos.routes"));
const movimientos_routes_1 = __importDefault(require("./routes/movimientos.routes"));
const tipo_movimiento_routes_1 = __importDefault(require("./routes/tipo_movimiento.routes"));
const cheque_routes_1 = __importDefault(require("./routes/cheque.routes"));
const reportes_routes_1 = __importDefault(require("./routes/reportes.routes"));
const evolucion_caja_routes_1 = __importDefault(require("./routes/evolucion_caja.routes"));
const centro_costos_routes_1 = __importDefault(require("./routes/centro_costos.routes"));
const cuenta_contable_routes_1 = __importDefault(require("./routes/cuenta_contable.routes"));
const alertas_routes_1 = __importDefault(require("./routes/alertas.routes"));
// [Express]
const app = express_1.default();
app.set('PORT', process.env.PORT || 3000);
app.use(require('cors')());
app.use(express_1.default.json());
app.use(express_1.default.static('public')); // Para prod solo 'public'
// [MongoDB]
config_1.db.connection();
// [Rutas]
app.use('/api/usuarios', usuarios_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/empresas', empresas_routes_1.default);
app.use('/api/externos', externos_routes_1.default);
app.use('/api/movimientos', movimientos_routes_1.default);
app.use('/api/tipo-movimientos', tipo_movimiento_routes_1.default);
app.use('/api/cheques', cheque_routes_1.default);
app.use('/api/reportes', reportes_routes_1.default);
app.use('/api/evolucion-caja', evolucion_caja_routes_1.default);
app.use('/api/centro-costos', centro_costos_routes_1.default);
app.use('/api/cuenta-contable', cuenta_contable_routes_1.default);
app.use('/api/alertas', alertas_routes_1.default);
// [Necesario para no perder las rutas en produccion]
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, 'public/index.html'));
});
// Ejecución de servidor
app.listen(app.get('PORT'), () => {
    console.log(chalk_1.default.blue('[Desarrollador] - ') + 'Equinoccio Technology');
    console.log(chalk_1.default.blue('[Express] - ') + `Servidor corriendo en http://localhost:${app.get('PORT')}`);
});