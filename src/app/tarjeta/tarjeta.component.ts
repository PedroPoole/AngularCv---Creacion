
import { Component, OnInit ,Input } from '@angular/core';
import { Tarjeta } from '../models/Tarjeta';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent implements OnInit {
  @Input()
  datos!: Tarjeta;

  tarjetaForm!:FormGroup;
  

  constructor() {
    urlVideo: Text;
    jobTitle: Text;
    jobDates: Text;
  }

  
  
  ngOnInit(): void {

    this.tarjetaForm = new FormGroup({
      nombre: new FormControl(this.datos.nombre),
      lugar: new FormControl(this.datos.lugar),
      enlace: new FormControl(this.datos.enlace, Validators.minLength(3)),
      fechas: new FormControl(this.datos.fechas),
      urlVideo: new FormControl(this.datos.urlVideo),
      descripcionEmpresa: new FormControl(''),
      texto: new FormControl(this.datos.texto)
    });

    if(this.datos.urlVideo!=undefined){

      //No se usa en entrada de datos.
      //this.urlVideo=this.obtenerCodigoLink(this.datos.urlVideo);
      
    }

    

    this.tarjetaForm.valueChanges.subscribe(x => {
      if(this.tarjetaForm.status=='VALID'){
        this.cambiarDatos(x);
      }
      
  })
    
    

  
  }

  /**Sencillo método para obtener el código de un enlace. Lo he hecho con un split para asegurarme de que funciona
   * tanto con el enlace entero como sin el HTTPS
   */
  obtenerCodigoLink(link:String){
    let primerCorte=link.split('youtube.com/watch?v=')[1];

    if (primerCorte!=undefined){
    return primerCorte.substring(0,11);
    }
    else{
      console.log(this.datos);
      return 'lalala';
    }
  }

  borrarTarjeta(){
    this.datos.ignorar=true;
  }

  cambiarDatos(x:Tarjeta){
    /*

    PREGUNTAR A TUTORES. Como narices se hace esta asignación bien? Por ahora la haré manual, pero... ostias.

    Object.keys(x).forEach(key => {
      console.log(key);
      this.datos[key as keyof Tarjeta]=x[key as keyof Tarjeta];
    });
    */
    
    this.datos.nombre=x.nombre;
    this.datos.lugar=x.lugar;
    this.datos.enlace=x.enlace;
    this.datos.fechas=x.fechas;
    this.datos.urlVideo=x.urlVideo;
    this.datos.descripcionEmpresa=x.descripcionEmpresa;
    this.datos.texto=x.texto;




  }

  

}
