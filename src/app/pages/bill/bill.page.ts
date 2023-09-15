import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {


  public perfilUsuarioActivo;
  public pagina;
  public tipoProducto;

  constructor(private route: ActivatedRoute,private navCtrl: NavController) { }

  
  ngOnInit() {
     this.pagina = "Cuenta";
    
  }

  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }

    
  recibirParametro(e){
    //validar que llega a ver que se hace
    
    // if(e == 'menu') this.navCtrl.navigateForward('/listing/'+e);
    // if(e == 'pedidos') this.navCtrl.navigateForward('/listing/'+e);


  }

}
