import { Inject, Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'
import { resolve } from 'dns';
import { environment } from '../../environments/environment'
import { Seccion } from '../models/Seccion';
import { Tarjeta } from '../models/Tarjeta';
import { Usuario } from '../models/Usuario';

export interface Profile {
  [indice:number]:{codusu:number};
  
}


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  //Creo la conexión con la API de la base de datos de supabase. He guardado en environment las claves API, pero no pasa nada
  //porque sean públicas, pues manejo la seguridad a nivel base de datos.
  private supabase: SupabaseClient;
  constructor()
 {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  //Consulta que retorna los valores necesarios de un usuario.
  dameUsuario(id: number) {
    return this.supabase.
      from('datos').
      select('codusu, nombre, apellidos, sobreMi, fechaNacimiento, email, telefono, direccion,nombreSobreMi,descripcion,imgurl').
      eq('codusu', id).
      single()
  }

  //Consulta que retorna los valores necesarios de una "sección" (Estudios, experiencia profesional...).
  dameSecciones(id: number) {
    return this.supabase.
      from('seccion').
      select('nombre,orden,codSeccion,ignorar').
      eq('codusu', id).
      eq('ignorar',false)
      
  }

//Consulta que retorna los valores necesarios de una "tarjeta" (Cada una de las entradas individuales de las secciones.).
//Nótese que sacamos todas las tarjetas de un USUARIO, no de una sección. Esto es porque más adelante obtendremos todas las 
//tarjetas en una consulta, y luego las distribuiremos entre secciones con una función.
  dameTarjetas(codusu: number) {
    return this.supabase.
    from('tarjeta').
      select('*').
      eq('codusu', codusu).
      eq('ignorar',false)//No cojo las tarjetas que se han marcado como ignoradas.
    
  }

  limpiaTarjetas(codusu:number){
    return this.supabase.
      from('tarjeta').
      update({ ignorar: 'true' }).
      eq('codusu', codusu)
  }

  
  actualizaSeccion(infoSeccion:any){
    return this.supabase.
    from('seccion').
    update(infoSeccion).
    eq('codSeccion', infoSeccion.codSeccion);
    
  }

  compruebaBucket(id:number){
    this.supabase.
    storage.
    getBucket(id.toString()).then(data=>{
      console.log(data)
      if(data.error?.message=="The resource was not found"){
        this.creaBucket(id);
      }
    })
  }

  creaBucket(id:number){
        this.supabase
        .storage
        .createBucket(id.toString(), { public: true })
      
      

  }

  guardaTarjeta(infoTarjeta:Tarjeta, codusu:number){
    return this.supabase.
    from('tarjeta').
    insert(infoTarjeta)
  }

  guardaSeccion(infoSeccion:any, codusu:number){
    return this.supabase.
    from('seccion').
    insert(infoSeccion)
  }

  guardaDatos(infoDatos:any, codUsu:number){
    return this.supabase.
      from('datos').
      update(infoDatos).
      eq('codusu', codUsu)
  }

  /** Función relativamente compleja. El objetivo final es crear un objeto asociativo de tres niveles de profundidad 
   * (usuario con sus secciones, cada sección con sus tarjetas)
   * Para eso usa una serie de promesas encadenadas y bucles forEach. */
  dameTodo(id: number) {
    let datos:Usuario;
    return new Promise<Usuario>(resolve=>{ //En este caso resolve es lo que retorna una promesa que se llama con .then. Si usas return no funciona.

      this.dameUsuario(id).then((infoUsuario) => {
        datos = infoUsuario.data;
  
        this.compruebaBucket(id);

        // Como Typescript no aguanta los arrays relacionales, hay que usar objetos. Y no se puede hacer push() a un objeto.
        // Por lo tanto, es necesario cuando creas una clave que luego vas a poblar, crearla definida como un objeto vacío.
        this.dameSecciones(id).then((infoSecciones)=>{
          datos['secciones']={}; 


          // Por cada sección que retorne la base de datos, la guardamos en su sección del objeto. 
          //Además, en cada una de ellas inicializamos ya la clave "tarjetas" como objeto vacío, porque si hay sección, esta tendrá datos.
          infoSecciones.data?.forEach(element => {
            datos['secciones'][element.nombre]=element;
            datos['secciones'][element.nombre]['tarjetas']={};
          });


          // Aquí es donde la cosa se pone peliaguda. Para no realizar una consulta por cada sección a la base de datos, hemos tomado todas
          // las tarjetas, así que vamos a distribuirlas. Por cada SECCIÓN, iteramos entre todas las TARJETAS.
          this.dameTarjetas(id).then((infoTarjetas)=>{

            //Esta parte la he optimizado de código que CREO que es redundante, pero que dejaré comentado solo por si todo explota luego.
            //(Object.keys(datos.secciones) as (keyof typeof datos.secciones)[]).forEach((key) =>{ 
            Object.keys(datos.secciones).forEach((key) =>{ 
              infoTarjetas.data?.forEach(datoTarjeta => {
                if(datoTarjeta.codSeccion==datos.secciones[key].codSeccion){ //Si coinciden en codigo de sección
                  datos.secciones[datos.secciones[key].nombre]['tarjetas'][datoTarjeta.codTarjeta]=datoTarjeta; //Asignamos la tarjeta a la sección
                }
              });
            });
            resolve(datos);
          })
        })
      })
    })
  }


  guardarTarjetas(seccion:Seccion,codusu:number){
    Object.keys(seccion.tarjetas).forEach((key: any)=>{
      delete seccion.tarjetas[key].codTarjeta;
      seccion.tarjetas[key].codusu=codusu;
      seccion.tarjetas[key].codSeccion=seccion.codSeccion;
      this.guardaTarjeta(seccion.tarjetas[key],codusu).then((x)=>{/*console.log(x)*/})
      //console.log(key,seccionActual.tarjetas[key]);
    })
  }

  guardarTodo(arrCompleto:any,codusu:number){
    
    this.limpiaTarjetas(codusu).then((x)=>{
      this.guardaDatos({apellidos:arrCompleto.apellidos, nombre:arrCompleto.nombre, sobreMi:arrCompleto.sobreMi, fechaNacimiento:arrCompleto.fechaNacimiento, email:arrCompleto.email, telefono:arrCompleto.telefono, descripcion: arrCompleto.descripcion, nombreSobreMi:arrCompleto.nombreSobreMi, imgurl:arrCompleto.imgurl},codusu).then(x=>console.log(x));

      Object.keys(arrCompleto.secciones).forEach((key: any) => {
        let seccionActual:Seccion=arrCompleto.secciones[key];
        if(seccionActual.codSeccion==undefined){
          this.guardaSeccion({'nombre':seccionActual.nombre,'orden':seccionActual.orden,'codusu':codusu, 'ignorar':seccionActual.ignorar},codusu).then((x:any)=>{
            let respuesta:any=x.body[0];
            seccionActual.codSeccion=respuesta.codSeccion;
            this.guardarTarjetas(seccionActual,codusu);
          });
        }
        else{

          
            this.guardarTarjetas(seccionActual,codusu);
          

          //TODO: Update orden.
          
          this.actualizaSeccion({nombre:seccionActual.nombre, ignorar:seccionActual.ignorar, codSeccion:seccionActual.codSeccion}).then(x=>console.log(x)) //PERO QUE CARAJO? Sin el then no funciona
        }
      });
    })
  }



  // Seccion de Login.

  get user() {
    return this.supabase.auth.user()
  }

  get session() {
    return this.supabase.auth.session()
  }

 
  numeroPerfil(userId:String|undefined){
    return this.supabase
    .from('datos')
    .select('codusu')
    .eq('id', userId)
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(imgurl:string) {
    return this.supabase.from('datos').upsert({'imgurl':imgurl})
  }

  

  downLoadImage(path: string, codusu:number) {
    return this.supabase.storage.from('public/'+codusu.toString()).download(path)
  }

  uploadAvatar(filePath: string, file: File,codusu:number) {
    return this.supabase.storage.from(codusu.toString()).upload(filePath, file)
  }
}
  





