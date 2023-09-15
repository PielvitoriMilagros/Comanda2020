import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientPageRoutingModule } from './client-routing.module';

import { ClientPage } from './client.page';
import { HomePageModule } from '../home/home.module';
import { ClientesComponent } from 'src/app/components/clientes/clientes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientPageRoutingModule,
    HomePageModule
  ],
  declarations: [ClientPage,
  ClientesComponent]
})
export class ClientPageModule {}
