import { Seccion } from "./Seccion";

export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: Date;
  nombreSobreMi: string;
  sobreMi: string;
  email:string;
  codusu:number;
  descripcion:string;
  telefono: string;  
  direccion: string;
  imgurl:string;
  secciones:  { [key: string]: any };
  }