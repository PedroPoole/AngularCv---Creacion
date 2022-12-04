import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../models/Usuario';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

   @Input() arrCompleto!:Usuario;

  constructor(fb:FormBuilder) {
    
  }
  datosForm!:FormGroup;
  updateProfileForm!:FormGroup;

  


 

  

 

  edad: number | undefined;
  ngOnInit(): void {
    this.edad = this.calcularEdad(this.arrCompleto.fechaNacimiento);

    this.updateProfileForm=new FormGroup({});

    this.datosForm = new FormGroup({
      nombreSobreMi: new FormControl(this.arrCompleto?.nombreSobreMi,Validators.required),
      sobreMi: new FormControl(this.arrCompleto?.sobreMi,Validators.required),
      email: new FormControl(this.arrCompleto?.email, Validators.compose([Validators.required, Validators.email])),
      telefono: new FormControl(this.arrCompleto?.telefono),
      nombre: new FormControl(this.arrCompleto?.nombre,Validators.required),
      apellidos: new FormControl(this.arrCompleto?.apellidos,Validators.required),
      descripcion: new FormControl(this.arrCompleto?.descripcion),
      fechaNacimiento: new FormControl(this.arrCompleto?.fechaNacimiento)
    });
    
    this.datosForm.valueChanges.subscribe(x => {
      
      if(this.datosForm.status=='VALID'){
        Object.assign(this.arrCompleto,x);
       console.log(x);
      }
      
  })

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
