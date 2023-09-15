import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {

  public perfilUsuarioActivo;
  public pagina;
  public tipoProducto;

  constructor(private route: ActivatedRoute,private navCtrl: NavController) { }

  ngOnInit() {
    // this.tipoProducto = this.route.snapshot.paramMap.get('producto');
     this.pagina = "Funciones";
    
  }

  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }

    
  recibirParametro(e){
    //validar que llega a ver que se hace
    if(e == 'menu') this.navCtrl.navigateForward('/listing/'+e);
    if(e == 'pedidos') this.navCtrl.navigateForward('/listing/'+e);
    // if(e == 'cliente') this.navCtrl.navigateForward('/surveys');



  }



}
