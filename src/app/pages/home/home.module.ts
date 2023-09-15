import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { PerfilDuenioComponent } from 'src/app/components/perfil-duenio/perfil-duenio.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { AppModule } from 'src/app/app.module';
import { PerfilClienteComponent } from 'src/app/components/perfil-cliente/perfil-cliente.component';
import { PerfilSupervisorComponent } from 'src/app/components/perfil-supervisor/perfil-supervisor.component';
import { PerfilEmpleadoComponent } from 'src/app/components/perfil-empleado/perfil-empleado.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  exports: [NavbarComponent],
  declarations: [HomePage,
    NavbarComponent,
    PerfilDuenioComponent,
    PerfilClienteComponent,
    PerfilSupervisorComponent,
    PerfilEmpleadoComponent]
})
export class HomePageModule { }
