import { Component } from '@angular/core';
import { SupabaseService } from './services/supabase.service'

import { Observable } from 'rxjs';
import { Seccion } from './models/Seccion';
import { Usuario } from './models/Usuario';
import { Tarjeta } from './models/Tarjeta';
import { FormBuilder } from '@angular/forms'
export interface Item { name: string; }

import { Profile } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent {
  session = this.supabase.session;
  arrCompleto!: Usuario;
  perfilUsu!: Profile;
  edad: number | undefined;
  perfilSacado: boolean=false;
  constructor(private readonly supabase: SupabaseService,private formBuilder: FormBuilder) {

  }



  
  title = 'NgCV';


  /**Al iniciar, necesito obtener el objeto del servicio que conecta con la API. Se lo atribuyo a "arrCompleto" (Nota: Es realmente
   un objeto, no un array, pero TScript no tiene objetos relacionales).
  * El siguiente paso es convertir la fecha de nacimiento en edad para mantenerla actualizada. 
  * Ambas cosas se hacen de forma asincronia con una promesa, puesto que el servicio puede tardar un segundo en enviarlo.
    **/
  ngOnInit() {
    this.supabase.authChanges((_, session) => {
      (this.session = session)

      if (this.perfilSacado==false){
      this.sacaPerfiles();
      this.perfilSacado=true;
      }
    })
    console.log(this.session);



  }

  sacaPerfiles() {
    this.supabase.numeroPerfil(this.session?.user?.id).then((data) => {

      
      //DEBUG console.log(this.session?.user?.id);
      let { data: perfilUsu } = data;
      if (perfilUsu && perfilUsu.length > 0) {
        this.perfilUsu = perfilUsu;
        this.supabase.dameTodo(this.perfilUsu[0].codusu).then((coso) => {
          this.arrCompleto = coso;
          this.edad = this.calcularEdad(this.arrCompleto.fechaNacimiento);
        })

      }

    })

  }

  
  

  borrarSeccion(evt: Seccion) {
    delete this.arrCompleto.secciones[evt.nombre];
    
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


  //Viendo como trata Angular los input, este metodo parece no ser necesario.
  //Viendo la cantidad de veces que he tenido que rehacer un método que consideré innecesario, dejo este aquí.
  insertarTarjeta(tarjeta: Tarjeta) {
    let nombreSeccion = this.obtenerNombrePorCodSeccion(tarjeta.codSeccion);
    this.arrCompleto.secciones[nombreSeccion]['tarjetas']['2'] = tarjeta; //Cuidado, si lo hago necesario, con ese 2 tan sospechoso.
    console.log(this.arrCompleto);
  }


  //Metodo para guardar todo a la base de datos.
  guardarTodo() {
    console.log(this.arrCompleto);
    this.supabase.guardarTodo(this.arrCompleto, this.perfilUsu[0].codusu);
  }

  salir() {
    this.supabase.signOut();
    window.location.reload();
  }

  nuevaSeccion() {
    let nombreSeccion = prompt("Introduce el nombre de la sección.");
    if (nombreSeccion != null && nombreSeccion != "") {
      this.arrCompleto.secciones[nombreSeccion] = { nombre: nombreSeccion, tarjetas: {}, orden: Object.keys(this.arrCompleto.secciones).length + 1, ignorar:false }
    }
  }




  //Viendo como trata Angular los input, este metodo parece no ser necesario.
  //Viendo la cantidad de veces que he tenido que rehacer un método que consideré innecesario, dejo este aquí.
  obtenerNombrePorCodSeccion(codSeccion: number) {
    let nombre = "";

    Object.keys(this.arrCompleto.secciones).forEach((key) => {
      if (this.arrCompleto.secciones[key].codSeccion == codSeccion) {
        nombre = this.arrCompleto.secciones[key].nombre;
      }
    }
    )
    return nombre;
  }
};





