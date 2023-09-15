import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
})
export class CuentaComponent implements OnInit {

  public listadoPedidos = [];
  public listadoPedidosRecibidos = [];

  public listadoProductosPedidos = [];
  public listProductosPorPedido = [];

  public usuarioActivoCorreo;
  public usuarioBDActivo;
  public usuarioBDActivoTIPO;
  public usuarioBDActivoMESA;
  public usuarioBDActivoID;

  public pedidosDelCliente = [];
  public propinaPedido;
  // public totalPedido=[];

  constructor(private auth: AuthenticationService, private firestore: FirestoreService, private navCtrl: NavController) {

    auth.currentUser().then(res => {
      this.usuarioActivoCorreo = res.email;
      let user: Usuario;
      firestore.getUsuarios().subscribe((resp: any) => {
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);

          if (user.correo == this.usuarioActivoCorreo) {
            this.usuarioBDActivo = user;
            this.usuarioBDActivoTIPO = this.usuarioBDActivo.tipo;
            this.usuarioBDActivoID = this.usuarioBDActivo.id;
            this.usuarioBDActivoMESA = this.usuarioBDActivo.enMesa;
            console.log("cargo usuario");

          }
        }
        this.actualizarPedidos();
      });


    });





  }


  actualizarPedidos(){
    this.cargarPedidos().then(resp => {
      console.log(this.listadoPedidosRecibidos);
      if (this.listadoPedidosRecibidos)
        this.pedidosDelCliente = this.listadoPedidosRecibidos.filter(pedido => pedido.cliente == this.usuarioBDActivoID);
      console.log(this.pedidosDelCliente);
      console.log(this.usuarioBDActivoID);

    });
  }



  cargarPedidos() {
    return new Promise<any>((resolve) => {

      let pedido: Pedido;
      this.firestore.getPedidos().subscribe((resp: any) => {
        this.listadoPedidos = [];
        this.listadoPedidosRecibidos = [];
        this.pedidosDelCliente = [];
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          pedido = new Pedido(element.payload.doc.data().mesa, element.payload.doc.data().cliente, element.payload.doc.data().productos, element.payload.doc.data().nombres, element.payload.doc.data().estadoProductos, element.payload.doc.data().cantidades, element.payload.doc.data().estado, element.payload.doc.data().precios, element.payload.doc.data().descuento, element.payload.doc.data().propina, element.payload.doc.data().total, element.payload.doc.id);

          if (pedido.estado == 'recibido')
            this.listadoPedidosRecibidos.push(pedido);

        }
        resolve("promesa de pedidos");
      });
    });

  }



  ngOnInit() { }

  propina(pedido) {

    Swal.fire({
      title: "Propina",
      text: 'Ingrese la propina para el mozo de acuerdo a su grado de satisfacción con el servicio brindado',
      imageUrl: '../../../assets/imagenes/encCliente.png',
      imageAlt: 'Foto satisfacción',
      input: 'number',
      inputPlaceholder: 'Ingrese propina',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      imageWidth: 300,
      imageHeight: 300,
    }).then(result => {

      if (result.isConfirmed && result.value) {
        pedido.propina = Number(result.value);
        pedido.total = pedido.total + pedido.propina;
        Swal.fire('Gracias', 'La propina se registró correctamente', 'success');
        this.firestore.updateBD(pedido.id, pedido.toJson(), 'pedidos').then(()=>{
          this.actualizarPedidos();
        });
      } else {
        Swal.fire('Error', 'Ingrese una cantidad para poder pedir el producto', 'error');
      }
    })
  }


  pagar(pedido) {
    pedido.estado = "pagado";
    this.firestore.updateBD(pedido.id,pedido.toJson(),'pedidos').then(()=>{
      Swal.fire('Muchas gracias','El pago ha sido realizado','success').then(()=>this.navCtrl.navigateBack('/home'));
      console.log("pagado");
    });
    


  }



}
