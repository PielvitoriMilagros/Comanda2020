import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillPageRoutingModule } from './bill-routing.module';

import { BillPage } from './bill.page';
import { HomePageModule } from '../home/home.module';
import { CuentaComponent } from 'src/app/components/cuenta/cuenta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillPageRoutingModule,
    HomePageModule
  ],
  declarations: [BillPage,
  CuentaComponent]
})
export class BillPageModule {}
