import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.scss'],
})
export class ListadoProductosComponent implements OnInit {

  public listadoProductos;
  public listadoBebidas;
  public listadoPlatos;

  public usuarioActivoCorreo;
  public usuarioBDActivo;
  public usuarioBDActivoID;


  public productosPedidos=[];
  public productosPedidosIDs=[];
  public productosPedidosNombre=[];
  public productosPedidosEstados=[];
  public productosPedidosPrecio=[];
  public cantidades=[];
  public totalPedido=0;

  @Input() tipoListado: string;

  public cantidad = 0;



  constructor(private auth: AuthenticationService, private firestore: FirestoreService, private navCtrl:NavController) {

    let producto: Producto;
    firestore.getProductos().subscribe((resp: any) => {
      this.listadoProductos = [];
      this.listadoBebidas = [];
      this.listadoPlatos = [];
      for (let index = 0; index < resp.length; index++) {
        const element = resp[index];

        producto = new Producto(element.payload.doc.data().nombre, element.payload.doc.data().descripcion, element.payload.doc.data().tipo, element.payload.doc.data().tiempo, element.payload.doc.data().precio, element.payload.doc.data().fotoUno, element.payload.doc.data().fotoDos, element.payload.doc.data().fotoTres,element.payload.doc.data().cantidad, element.payload.doc.id);

        this.listadoProductos.push(producto);

        if (producto.tipo == 'bebida')
          this.listadoBebidas.push(producto);
        else
          this.listadoPlatos.push(producto);

      }
    });



    auth.currentUser().then(resp => {
      this.usuarioActivoCorreo = resp.email;

      let user: Usuario;

      firestore.getUsuarios().subscribe((resp: any) => {
        // this.usuariosBD = [];
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];

          user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);

          if (user.correo == this.usuarioActivoCorreo) {
            this.usuarioBDActivo = user;
            this.usuarioBDActivoID = user.id;
          }

          // this.usuariosBD.push(user);
        }
      });


    })





  }

  ngOnInit() { }


  opciones(producto, foto) {

    Swal.fire({
      title: producto.nombre,
      text: producto.descripcion + '. Precio: $' + producto.precio,
      imageUrl: foto,
      imageAlt: 'Foto uno producto',
      input: 'number',
      inputPlaceholder: 'Ingrese cantidad a pedir',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Pedir',
      imageWidth: 400,
      imageHeight: 300,
    }).then(result => {
      if (result.isConfirmed) {
        if (result.value) {
          producto.cantidad = Number(result.value);
          this.productosPedidos.push(producto);
          this.calcularTotal();

        } else {

          Swal.fire('Error', 'Ingrese una cantidad para poder pedir el producto', 'error');

        }

      }
    })
  }


  altaPedido(){
    this.productosPedidos.forEach(element => {
      console.log(element);
      this.productosPedidosIDs.push(element.id);
      this.productosPedidosNombre.push(element.nombre);
      this.productosPedidosPrecio.push(element.precio);
      this.productosPedidosEstados.push('pendiente');
      this.cantidades.push(element.cantidad);
    });

    let pedido = new Pedido(this.usuarioBDActivo.enMesa,this.usuarioBDActivoID,this.productosPedidosIDs,this.productosPedidosNombre,this.productosPedidosEstados,this.cantidades,'noaprobado',this.productosPedidosPrecio,null,null,this.totalPedido);
    
    this.firestore.savePedidos(pedido.toJson()).then(resp=>{
      Swal.fire('Muchas gracias','Su pedido fue realizado y se está preparando','success').then(()=>this.navCtrl.navigateBack('/home'));

    }).catch(error=>{
      console.log(error);
      Swal.fire('Error','Hubo un inconveniente en su pedido','error');

    })


  }





  calcularTotal(){
    this.totalPedido=0;
    this.productosPedidos.forEach(element => {
      this.totalPedido+=element.cantidad*element.precio;
    });
  }

  borrarProducto(item){
    let auxProductos = this.productosPedidos;
    for (let index = 0; index < this.productosPedidos.length; index++) {
      const element = this.productosPedidos[index];
      if(item.nombre == element.nombre){
        auxProductos.splice(index,1);
      }
    }
    this.productosPedidos = auxProductos;
    this.calcularTotal();
  }



}
