import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamesPageRoutingModule } from './games-routing.module';

import { GamesPage } from './games.page';
import { HomePageModule } from '../home/home.module';
import { JuegoUnoComponent } from 'src/app/components/juego-uno/juego-uno.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamesPageRoutingModule,
    HomePageModule
  ],
  declarations: [GamesPage,JuegoUnoComponent]
})
export class GamesPageModule {}
