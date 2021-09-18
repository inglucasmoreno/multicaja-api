"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaController = void 0;
const chalk_1 = __importDefault(require("chalk"));
const response_1 = require("../helpers/response");
const empresas_model_1 = __importDefault(require("../models/empresas.model"));
const saldos_models_1 = __importDefault(require("../models/saldos.models"));
class Empresa {
    // Nueva empresa
    nuevaEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {};
                const { razon_social, cuit, telefono, direccion } = req.body;
                data.razon_social = razon_social;
                cuit.trim() !== '' ? data.cuit = cuit : null;
                telefono.trim() !== '' ? data.telefono = telefono : null;
                direccion.trim() !== '' ? data.direccion = direccion : null;
                console.log(data);
                // Creacion de nueva empresa
                data.saldos_especiales = { caja: null, cheques: null };
                const nuevaEmpresa = new empresas_model_1.default(data);
                const empresa = yield nuevaEmpresa.save();
                // Creacion de tipos especiales (CAJA y CHEQUE)
                let nuevoSaldo = new saldos_models_1.default({ descripcion: 'CAJA', monto: 0, empresa: empresa._id });
                const caja = yield nuevoSaldo.save();
                nuevoSaldo = new saldos_models_1.default({ descripcion: 'CHEQUES', monto: 0, empresa: empresa._id });
                const cheque = yield nuevoSaldo.save();
                // Se le agegran los tipos especiales a la empresa
                const empresaFinal = yield empresas_model_1.default.findByIdAndUpdate(empresa._id, { saldos_especiales: { caja: caja._id, cheques: cheque._id } });
                response_1.respuesta.success(res, { empresa: empresaFinal });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Empresa por ID
    getEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Existe la empresa a actualizar?
                const empresaExiste = yield empresas_model_1.default.findById(id);
                if (!empresaExiste)
                    return response_1.respuesta.error(res, 400, 'La empresa no existe');
                // Creacion de empresa y generacion de respuesta
                const empresa = yield empresas_model_1.default.findById(id);
                response_1.respuesta.success(res, { empresa });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar empresas
    listarEmpresas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recepcion de parametros
                const { columna, direccion } = req.query;
                // Ordenar
                let ordenar = [columna || 'razon_social', direccion || 1];
                // Ejecucion de consulta
                const [empresas, total] = yield Promise.all([
                    empresas_model_1.default.find().sort([ordenar]),
                    empresas_model_1.default.find().countDocuments()
                ]);
                // Respuesta
                response_1.respuesta.success(res, { empresas, total });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Actualizar empresa
    actualizarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Existe la empresa a actualizar?
                const empresaExiste = yield empresas_model_1.default.findById(id);
                if (!empresaExiste)
                    return response_1.respuesta.error(res, 400, 'La empresa no existe');
                // El nuevo CUIT ya esta registrado?
                // const cuitExiste = await EmpresaModel.findOne({ cuit: req.body.cuit });
                // if(cuitExiste) return respuesta.error(res, 400, 'El cuit ya esta registrado')
                // Actualizacion y Respuesta
                const empresa = yield empresas_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { empresa });
            }
            catch (err) {
                console.log(chalk_1.default.red(err));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // --------- SALDOS DE EMPRESAS --------
    // Saldo por ID
    getSaldo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const saldo = yield saldos_models_1.default.findById(id);
                response_1.respuesta.success(res, { saldo });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Listar saldos por ID de empresa
    listarSaldos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empresa = req.params.empresa;
                // Recepcion de parametros
                const { columna, direccion } = req.query;
                // Ordenar
                let ordenar = [columna || 'descripcion', direccion || 1];
                // Ejecucion de consulta
                const [saldos, total] = yield Promise.all([
                    saldos_models_1.default.find({ empresa }).sort([ordenar]),
                    saldos_models_1.default.find({ empresa }).countDocuments()
                ]);
                // Respuesta
                response_1.respuesta.success(res, { saldos, total });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Nuevo saldo
    nuevoSaldo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saldo = new saldos_models_1.default(req.body);
                yield saldo.save();
                response_1.respuesta.success(res, { saldo });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
    // Actualizar saldo
    actualizarSaldo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const saldo = yield saldos_models_1.default.findByIdAndUpdate(id, req.body, { new: true });
                response_1.respuesta.success(res, { saldo });
            }
            catch (error) {
                console.log(chalk_1.default.red(error));
                response_1.respuesta.error(res, 500);
            }
        });
    }
}
exports.EmpresaController = new Empresa();
