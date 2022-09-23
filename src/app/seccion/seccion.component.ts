import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Seccion} from '../models/Seccion';

import {Tarjeta} from '../models/Tarjeta';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.scss']
})
export class SeccionComponent implements OnInit {
  @Input()
  datos!: Seccion;

  contador:number=0;
  constructor() { }

  //Es innecesario viendo cómo trata Angular el input, pero lo dejo, por si en algun momento hace falta.
  @Output() insertarTarjeta:EventEmitter<Tarjeta>=new EventEmitter();

  nuevaTarjeta:Tarjeta={
    enlace:"",
    codusu:1,
    fechas:"",
    lugar:"",
    ignorar:false,
    posicion:0,
    texto:"",
    descripcionEmpresa:"",
    urlVideo:"",
    nombre:"",
    codSeccion: 0 //Pregunta: Por qué carajo no puedo definirla aquí? Necesito entender la inicializacion.
  }

  ngOnInit(): void {
    this.contador=Object.keys(this.datos.tarjetas).length+1;
  }


  //Para debug.
  consolelog(){
    console.log(this.datos);
  }

  crearTarjeta(){
    this.nuevaTarjeta.codSeccion=this.datos.codSeccion; // Tengo que inicializarla aqui.
    this.nuevaTarjeta.posicion=Object.keys(this.datos.tarjetas).length+1;
    this.datos.tarjetas[+this.contador]=this.nuevaTarjeta;
    this.contador++;
  }

  //Viendo como trata Angular los input, este metodo parece no ser necesario.
  //Viendo la cantidad de veces que he tenido que rehacer un método que consideré innecesario, dejo este aquí.
  crearTarjeta2(){
    this.nuevaTarjeta.codSeccion=this.datos.codSeccion; // Tengo que inicializarla aqui.
    this.nuevaTarjeta.posicion=Object.keys(this.datos.tarjetas).length;
    this.insertarTarjeta.emit(this.nuevaTarjeta);
  }

}
