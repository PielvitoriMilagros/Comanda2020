import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  
  // public usuarioActivo=false;
  // public listadoUsuarios;
  public perfilUsuarioActivo;
  public tipoUsuarioActivo;
  public pagina;

  // public ucorreoActivo;


  constructor(private authService: AuthenticationService, private router:Router,private firestore:FirestoreService,private navCtrl: NavController) {
    this.pagina="Inicio";

  }

  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }
  
  recibirTipo(e){
    this.tipoUsuarioActivo = e;
  }



  recibirPerfilRegistrar(e){
    this.navCtrl.navigateForward('/register/'+e);
  }
  
  
  recibirParametro(e){
    //validar que llega a ver que se hace
    if(e == 'cliente') this.navCtrl.navigateForward('/register/'+e); // ?
    if(e == 'bebida' || e == 'plato') this.navCtrl.navigateForward('/create/'+e);
    if(e == 'mesaCliente') this.navCtrl.navigateForward('/client');
    
    if(e == 'clientes') this.navCtrl.navigateForward('/listing/'+e);
    if(e == 'espera') this.navCtrl.navigateForward('/listing/'+e);
    if(e == 'pedidos') this.navCtrl.navigateForward('/listing/'+e);
    if(e == 'mesas') this.navCtrl.navigateForward('/listing/'+e);

  }








}
