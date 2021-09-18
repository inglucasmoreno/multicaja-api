"use strict";
// Helper - Generacion y Edicion de codigos
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodigosHelpers = void 0;
class Codigos {
    // Metodo: Devuelve un codigo en formato string con una cierta cantidad de digitos
    generar(codigo, digitos) {
        var codigo_string = String(codigo);
        const repeticiones = digitos - codigo_string.length;
        let i = 0;
        while (i < repeticiones) {
            codigo_string = '0' + codigo_string;
            i++;
        }
        return codigo_string;
    }
}
exports.CodigosHelpers = new Codigos();
