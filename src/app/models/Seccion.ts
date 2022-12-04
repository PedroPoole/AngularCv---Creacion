export interface Seccion {
    id: string;
    nombre: string;
    orden: number;
    tarjetas: { [key: string]: any };
    codSeccion:number;
    ignorar:boolean;
  }