import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Mesa } from 'src/app/models/mesa';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-perfil-empleado',
  templateUrl: './perfil-empleado.component.html',
  styleUrls: ['./perfil-empleado.component.scss'],
})
export class PerfilEmpleadoComponent implements OnInit {


  @Input() tipoUsuarioActivo: string;
  @Output() parametroEnviado : EventEmitter<string> = new EventEmitter<string>();


  constructor(private navCtrl: NavController, private firestore:FirestoreService, public toastController: ToastController) { 
  }

  ngOnInit() {
    let primeraVez=false;
    let longitud;

    switch (this.tipoUsuarioActivo) {

      case 'metre':
        this.firestore.getListaDeEspera().subscribe((res: any) => {
          let waitingList=[];
          for (let index = 0; index < res.length; index++) {
            const element = res[index];
            let user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);
            waitingList.push(user);
          }
          if(primeraVez){
            if(waitingList.length > longitud ){
              let mensaje = 'HAY NUEVOS CLIENTES EN LISTA DE ESPERA, AGUARDANDO SER ASIGNADOS A UNA MESA';
              primeraVez = false;
              this.dispararToast(mensaje);
            }
          } else{
            primeraVez=true;
            longitud = waitingList.length;
          }
        });
        break;

      case 'mozo':
        this.firestore.getMesas().subscribe((res: any) => {
          let listaMesas=[];
          for (let index = 0; index < res.length; index++) {
            const element = res[index];
            let mesa = new Mesa(element.payload.doc.data().comensales, element.payload.doc.data().estado, element.payload.doc.data().numero, element.payload.doc.data().tipo, element.payload.doc.id, element.payload.doc.data().cliente, element.payload.doc.data().consulta);
            if ((mesa.consulta != null || mesa.consulta != undefined) && mesa.cliente)
            listaMesas.push(mesa);
          }
          if(primeraVez){
            if(longitud != listaMesas.length){
              let mensaje = 'NUEVA CONSULTA. POR FAVOR DIRIGIRSE AL LISTADO DE MESAS PARA SOLUCIONAR LA INQUIETUD DEL CLIENTE';
              primeraVez = false;
              this.dispararToast(mensaje);
            }
          } else{
            primeraVez=true;
            longitud = listaMesas.length;
          }
        });
        break;

      case 'bartender':
        this.firestore.getPedidos().subscribe((resp: any) => {
          let listadoPedidos = [];
          for (let index = 0; index < resp.length; index++) {
            const element = resp[index];
            let pedido = new Pedido(element.payload.doc.data().mesa, element.payload.doc.data().cliente, element.payload.doc.data().productos, element.payload.doc.data().nombres, element.payload.doc.data().estadoProductos, element.payload.doc.data().cantidades, element.payload.doc.data().estado, element.payload.doc.data().precios, element.payload.doc.data().descuento, element.payload.doc.data().propina, element.payload.doc.data().total, element.payload.doc.id);
            if (pedido.estado == 'pendiente')
            listadoPedidos.push(pedido);
          }
          if(primeraVez){
            if(listadoPedidos.length > longitud){
              let mensaje = 'HAY PEDIDOS QUE REQUIEREN DE SU ATENCIÓN. POR FAVOR DIRIGIRSE A LA BARRA PARA COMPLETAR LOS PEDIDOS PENDIENTES';
              primeraVez = false;
              this.dispararToast(mensaje);
            }
          } else{
            primeraVez=true;
            longitud = listadoPedidos.length;
          }
        });

        break;

      case 'cocinero':
        this.firestore.getPedidos().subscribe((resp: any) => {
          let listadoPedidos = [];
          for (let index = 0; index < resp.length; index++) {
            const element = resp[index];
            let pedido = new Pedido(element.payload.doc.data().mesa, element.payload.doc.data().cliente, element.payload.doc.data().productos, element.payload.doc.data().nombres, element.payload.doc.data().estadoProductos, element.payload.doc.data().cantidades, element.payload.doc.data().estado, element.payload.doc.data().precios, element.payload.doc.data().descuento, element.payload.doc.data().propina, element.payload.doc.data().total, element.payload.doc.id);
            if (pedido.estado == 'pendiente')
            listadoPedidos.push(pedido);
          }
          if(primeraVez){
            if(listadoPedidos.length > longitud){
              let mensaje = 'HAY PEDIDOS QUE REQUIEREN DE SU ATENCIÓN. POR FAVOR DIRIGIRSE A LA COCINA PARA COMPLETAR LOS PEDIDOS PENDIENTES';
              primeraVez = false;
              this.dispararToast(mensaje);
            }
          } else{
            primeraVez=true;
            longitud = listadoPedidos.length;
          }
        });
        break;

      default:
        break;
    }

  }



  public enviar(perfil){
    this.parametroEnviado.emit(perfil);
  }


  public encuesta(){
    this.navCtrl.navigateForward('/surveys');
  }






  async dispararToast(mensaje){

    const toast = await this.toastController.create({
      color: 'success',
      duration: 3000,
      message: mensaje,
      position: "top"
    });

    await toast.present();




  }



}
