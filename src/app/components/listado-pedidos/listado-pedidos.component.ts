import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Mesa } from 'src/app/models/mesa';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.scss'],
})
export class ListadoPedidosComponent implements OnInit {

  public listadoProductos = [];
  public listadoMesas = [];

  public listadoPedidos = [];
  public listadoPedidosNoCerrados = [];
  public listadoPedidosPendientes = [];

  public listadoProductosPedidos = [];
  public listadoProductosPedidosPorTipo = [];


  public listProductosPorPedido = [];

  public listadoUsuarios = Array<Usuario>();

  public usuarioActivoCorreo;
  public usuarioBDActivo;
  public usuarioBDActivoTIPO;
  public usuarioBDActivoMESA;

  public pedidosDelCliente = [];

  @Input() tipoListado: string;


  constructor(private auth: AuthenticationService, private firestore: FirestoreService, private navCtrl: NavController) {


    this.traerProductos().then(pro => { //productos cargados

      this.traerMesas().then(mes => { // mesas cargadas

        this.traerPedidos().then(ped => { // pedidos cargados

          // this.decidirPedidoQueCorresponde().then(pedid => {
          //   this.listadoProductosPedidos.forEach(element => {
          //     if (element.estadoProducto == 'pendiente') {
          //       if (element.tipoProd == 'bebida' && this.usuarioBDActivoTIPO == 'bartender')
          //         this.listadoProductosPedidosPorTipo.push(element);
          //       if (element.tipoProd == 'plato' && this.usuarioBDActivoTIPO == 'cocinero')
          //         this.listadoProductosPedidosPorTipo.push(element);
          //     }

              
          //   });

          // });

        });

      });

    });

    auth.currentUser().then(resp => {
      this.usuarioActivoCorreo = resp.email;

      firestore.getUsuarios().subscribe((resp: any) => {
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          let user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);
          if (user.correo == this.usuarioActivoCorreo) {
            this.usuarioBDActivo = user;
            this.usuarioBDActivoTIPO = this.usuarioBDActivo.tipo;
            this.usuarioBDActivoMESA = this.usuarioBDActivo.enMesa;

            this.pedidosDelCliente = this.listadoPedidosNoCerrados.filter(pedido => pedido.mesa == this.usuarioBDActivoMESA);
          }
        }
      });
      console.log("cargo usuario");
    });


  }

  ngOnInit() { }


  decidirPedidoQueCorresponde() {
    return new Promise<any>((resolve) => {

      this.listadoProductosPedidos = [];
      this.listadoProductosPedidosPorTipo = [];
      this.listadoPedidosPendientes.forEach(element => {  // cada pedido
        let producto;
        let obj;
        console.log(element);
        for (let index = 0; index < element.productos.length; index++) { // cada producto del pedido
          const pedProd = element.productos[index];
          console.log(pedProd);
          for (let indice = 0; indice < this.listadoProductos.length; indice++) { // recorro todos los productos
            const prodProductos = this.listadoProductos[indice];
            console.log(prodProductos);
            if (prodProductos.id == pedProd) { // cuando encuentro el id del producto del pedido en productos
              obj = new Object();
              obj.idProducto = pedProd;
              obj.nombre = prodProductos.nombre;
              obj.idPedido = element.id;
              obj.cantidad = element.cantidades[index];
              obj.tipoProd = prodProductos.tipo;
              obj.estadoProducto = element.estadoProductos[index];
              obj.foto = prodProductos.fotoDos;
              this.listadoProductosPedidos.push(obj);
              break;
            }
            console.log(this.listadoProductosPedidos);
          }
        }
        resolve("productos pedidos cargados");
      });
    });

  }


  traerProductos() {
    return new Promise<any>((resolve) => {

      this.firestore.getProductos().subscribe((resp: any) => {
        this.listadoProductos = [];
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          let producto = new Producto(element.payload.doc.data().nombre, element.payload.doc.data().descripcion, element.payload.doc.data().tipo, element.payload.doc.data().tiempo, element.payload.doc.data().precio, element.payload.doc.data().fotoUno, element.payload.doc.data().fotoDos, element.payload.doc.data().fotoTres, element.payload.doc.data().cantidad, element.payload.doc.id);
          this.listadoProductos.push(producto);
        }
        console.log("cargo productos");
        resolve("productos");
      });
    });
  }


  traerMesas() {
    return new Promise<any>((resolve) => {

      this.firestore.getMesas().subscribe((resp: any) => {
        this.listadoMesas = [];
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          let mesa = new Mesa(element.payload.doc.data().comensales, element.payload.doc.data().estado, element.payload.doc.data().numero, element.payload.doc.data().tipo, element.payload.doc.id, element.payload.doc.data().cliente, element.payload.doc.data().consulta);
          this.listadoMesas.push(mesa);
        }
        console.log("cargo mesas");
        resolve("mesas");
      });
    });
  }

  traerPedidos() {
    return new Promise<any>((resolve) => {
      
      this.firestore.getPedidos().subscribe((resp: any) => {
        this.listadoPedidos = [];
        this.listadoPedidosNoCerrados = [];
        this.listadoPedidosPendientes = [];
        this.pedidosDelCliente = [];
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          let pedido = new Pedido(element.payload.doc.data().mesa, element.payload.doc.data().cliente, element.payload.doc.data().productos, element.payload.doc.data().nombres, element.payload.doc.data().estadoProductos, element.payload.doc.data().cantidades, element.payload.doc.data().estado, element.payload.doc.data().precios, element.payload.doc.data().descuento, element.payload.doc.data().propina, element.payload.doc.data().total, element.payload.doc.id);
          this.listadoPedidos.push(pedido);
          if (pedido.estado != 'cerrado')
          this.listadoPedidosNoCerrados.push(pedido);
          if (pedido.estado == 'pendiente')
          this.listadoPedidosPendientes.push(pedido);
        }
        this.pedidosDelCliente = this.listadoPedidosNoCerrados.filter(pedido => pedido.mesa == this.usuarioBDActivoMESA);
        console.log("cargo pedidos");
        
        resolve("pedidos");


        this.decidirPedidoQueCorresponde().then(pedid => {
          this.listadoProductosPedidos.forEach(element => {
            if (element.estadoProducto == 'pendiente') {
              if (element.tipoProd == 'bebida' && this.usuarioBDActivoTIPO == 'bartender')
                this.listadoProductosPedidosPorTipo.push(element);
              if (element.tipoProd == 'plato' && this.usuarioBDActivoTIPO == 'cocinero')
                this.listadoProductosPedidosPorTipo.push(element);
            }

            
          });

        });
        
      });
    });
  }
  





  finalizar(producto) {

    // let todoListo=false;
    producto.estadoProducto = 'finalizado';

    this.listadoPedidosPendientes.forEach(element => {
      if (element.id == producto.idPedido) {  // busco el pedido para actualizar el estado del producto en la BD
        for (let index = 0; index < element.productos.length; index++) {
          const productoDelPedido = element.productos[index];
          if (productoDelPedido == producto.idProducto && element.estadoProductos[index] == 'pendiente') {
            element.estadoProductos[index] = 'finalizado';

            Swal.fire('Perfecto!', 'Terminó la preparación del producto correctamente.', 'success');
            this.firestore.updateBD(element.id, element.toJson(), 'pedidos').then(res => {
              console.log("Magicamente funcionó");
              this.verificarEstadoFinal(element.id);

            }).catch(err => {
              console.log("Era más lógico que rompa: " + err);
            })

            break;
          }
        }
      }
    });

  }


  verificarEstadoFinal(idPedido) {
    let todoListo = true;
    this.listadoPedidos.forEach(element => {
      if (element.id == idPedido) {
        element.estadoProductos.forEach(estados => {
          if (estados != 'finalizado') {
            todoListo = false;
          }
        });
        if (todoListo) {
          element.estado = 'finalizado';
          this.firestore.updateBD(element.id, element.toJson(), 'pedidos').then(res => {
            console.log("pedido listo para ser entregado");
          });
        }
      }
    });
  }





  confirmar(pedido) {
    pedido.estado = 'pendiente';
    Swal.fire('Muchas gracias', 'El pedido fue confirmado y se enviará a los sectores correspondientes', 'success');
    this.firestore.updateBD(pedido.id, pedido.toJson(), 'pedidos').then(resp => {
      console.log("recibido");
    });
  }

  entregar(pedido) {
    pedido.estado = 'entregado';
    Swal.fire('Muchas gracias', 'El pedido fue entregado y el cliente debe confirmarlo', 'success');
    this.firestore.updateBD(pedido.id, pedido.toJson(), 'pedidos').then(resp => {
      console.log("recibido");
    });
  }

  recibir(pedido) {
    pedido.estado = 'recibido';
    Swal.fire('Muchas gracias', 'Se confirmó la recepción del pedido', 'success');
    this.firestore.updateBD(pedido.id, pedido.toJson(), 'pedidos').then(resp => {
      console.log("recibido");
    });
  }

  cerrar(pedido) {
    pedido.estado = 'cerrado';

    let mesaA = this.listadoMesas.filter(mesaa => mesaa.id == pedido.mesa);
    let usuario:Usuario = mesaA[0].cliente;

    usuario.enMesa = null;
    mesaA[0].estado = "libre";
    mesaA[0].cliente = null;
    mesaA[0].consulta = null;

    Swal.fire('Muchas gracias', 'Finalizo la gestión del pedido. La mesa quedará libre.', 'success');
    this.firestore.updateBD(pedido.id, pedido.toJson(), 'pedidos').then(resp => {
      console.log("cerrado");
      this.firestore.updateBD(mesaA[0].id, mesaA[0].toJson(), 'mesas').then(() => {
        console.log("liberada");
        this.firestore.updateBD(usuario.id, usuario.toJson(), 'usuarios').then(() => {
          console.log("cliente desasignado.");
        })
      })
    });
  }





}
