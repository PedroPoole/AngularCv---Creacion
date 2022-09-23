import { Seccion } from "./Seccion";

export interface Usuario {
  id: String;
  nombre: String;
  apellidos: String;
  fechaNacimiento: Date;
  nombreSobreMi: String;
  sobreMi: String;
  email:String;
  codusu:number;
  descripcion:String;
  telefono: String;  
  direccion: String;
  secciones:  { [key: string]: any };
  }