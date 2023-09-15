import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingPageRoutingModule } from './listing-routing.module';

import { ListingPage } from './listing.page';
import { HomePageModule } from '../home/home.module';
import { ListadoClientesComponent } from 'src/app/components/listado-clientes/listado-clientes.component';
import { ListadoEsperaComponent } from 'src/app/components/listado-espera/listado-espera.component';
import { ListadoProductosComponent } from 'src/app/components/listado-productos/listado-productos.component';
import { ListadoPedidosComponent } from 'src/app/components/listado-pedidos/listado-pedidos.component';
import { ListadoMesasComponent } from 'src/app/components/listado-mesas/listado-mesas.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListingPageRoutingModule,
    HomePageModule
  ],
  declarations: [ListingPage,
    ListadoClientesComponent,
    ListadoEsperaComponent,
    ListadoProductosComponent,
    ListadoPedidosComponent,
    ListadoMesasComponent]
})
export class ListingPageModule { }
