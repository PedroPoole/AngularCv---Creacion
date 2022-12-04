import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TarjetaComponent } from './tarjeta/tarjeta.component';
import { SeccionComponent } from './seccion/seccion.component';

import { OrderModule } from 'ngx-order-pipe';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalBasic } from './modal-video/modal-video.component';

import { YouTubePlayerModule } from "@angular/youtube-player";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagLoginComponent } from './pag-login/pag-login.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { FotoPerfilComponent } from './foto-perfil/foto-perfil.component';

@NgModule({
  declarations: [
    TarjetaComponent,
    SeccionComponent,
    AppComponent,
    NgbdModalBasic,
    PagLoginComponent,
    DatosPersonalesComponent,
    FotoPerfilComponent
    
  ],
  imports: [
    BrowserModule,
    OrderModule,
    NgbModule,
    YouTubePlayerModule,
    FormsModule,
    ReactiveFormsModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
