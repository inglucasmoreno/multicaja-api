// Helper - Generacion y Edicion de codigos

class Codigos {
    
    // Metodo: Devuelve un codigo en formato string con una cierta cantidad de digitos
    public generar(codigo: number, digitos: number): string {
        
        var codigo_string = String(codigo);
        const repeticiones = digitos - codigo_string.length;
        
        let i = 0;
        while(i < repeticiones){
            codigo_string = '0' + codigo_string;
            i++;
        }
        
        return codigo_string;
    }

}

export const CodigosHelpers = new Codigos();