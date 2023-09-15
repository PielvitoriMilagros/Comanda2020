import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private auth: AngularFireAuth) { }


  public iniciarSesion(email: string, pass: string) {
    return this.auth.signInWithEmailAndPassword(email, pass);
  }

  public registrarCuenta(email:string,pass:string){
      console.log(email,pass);
      return this.auth.createUserWithEmailAndPassword(email,pass);
   }

  public cerrarSesion(){
    return this.auth.signOut();
  }

  public currentUser(){
    return this.auth.currentUser;
  }

  public logueado(){
    return this.auth.currentUser.then(resp=>{
      if(resp)
        return true;
      else
        return false;
    });
  }





}
