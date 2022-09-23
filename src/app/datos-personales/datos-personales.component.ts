import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../models/Usuario';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

  constructor() { }

  @Input() arrCompleto!:Usuario;
  edad: number | undefined;
  ngOnInit(): void {
    this.edad = this.calcularEdad(this.arrCompleto.fechaNacimiento);
  }


  
  //No necesito preocuparme por si el objeto es indefinido ya que sólo llamo al método dentro del 
  //*NgIf, que ya comprueba que arrCompleto esté definido, y la edad es un campo not null.
  calcularEdad(fecha: Date) {
    var hoy = new Date();
    var nacimiento = new Date(fecha);
    var edad = hoy.getFullYear() - nacimiento.getFullYear();
    var m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }


}
