import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { HomePageModule } from '../home/home.module';
import { AltaComponent } from 'src/app/components/alta/alta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule,
    HomePageModule
  ],
  declarations: [CreatePage,
  AltaComponent]
})
export class CreatePageModule {}
