import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { SignUpComponent } from 'src/app/components/sign-up/sign-up.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { AppModule } from 'src/app/app.module';
import { HomePageModule } from '../home/home.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    HomePageModule
  ],
  declarations: [RegisterPage,
    // NavbarComponent, 
    SignUpComponent]
})
export class RegisterPageModule {}
