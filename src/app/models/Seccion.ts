export interface Seccion {
    id: String;
    nombre: String;
    orden: number;
    tarjetas: { [key: string]: any };
    codSeccion:number;
  }