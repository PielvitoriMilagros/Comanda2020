import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-juego-uno',
  templateUrl: './juego-uno.component.html',
  styleUrls: ['./juego-uno.component.scss'],
})
export class JuegoUnoComponent implements OnInit {

  constructor(private auth: AuthenticationService, private firestore: FirestoreService) { }

  ngOnInit() { }

  secuenciasPC: string[] = [];
  secuenciaHumano: string[] = [];
  correctas: number;
  intentos: number;
  gano: boolean;
  iniciado: boolean = false;
  tablaAyudas: TablaHelp[] = [];
  contador: number;

  usuarioBDActivo;
  usuarioBDActivoID;
  pedidoDelUsuario;



  iniciar() {
    this.iniciado = true;
    this.contador = 0;
    this.tablaAyudas = [];
    this.generarSecuencia();
  }



  respuesta(){

    if(this.secuenciasPC != null && this.secuenciasPC != []){
      Swal.fire("Modo testing","Simplemente a modo de pruebas y para mostrar la funcionalidad se agregó este botón. La secuencia correcta es: "+this.secuenciasPC,"info")
    }else {
      Swal.fire("Modo testing","No hay todavía secuencia generada","info");
    }

  }


  verificar(color: string) {
    if (this.contador != 5) {
      this.secuenciaHumano[this.contador] = color;
      this.contador++;

    }

    if (this.contador == 5) {

      if (this.verificarJugada()) { // gano
        this.iniciado = false;
        Swal.fire("Felicidades", "Ganaste el juego de acomodar los dados. Se aplicará un 10% de descuento al precio final de tu pedido", "success");
        this.gestionarGanador().then(resp => {
          if (this.pedidoDelUsuario) {
            // calculo descuento del 10%
            if (this.pedidoDelUsuario.descuento == null || this.pedidoDelUsuario.descuento==0 || this.pedidoDelUsuario.descuento== undefined) {
              this.pedidoDelUsuario.descuento = this.pedidoDelUsuario.total * 0.10;
              this.pedidoDelUsuario.total = this.pedidoDelUsuario.total - this.pedidoDelUsuario.descuento;

              this.firestore.updateBD(this.pedidoDelUsuario.id, this.pedidoDelUsuario.toJson(), 'pedidos').then(res => {
                console.log("se aplico 10% al descuento")
              });

            } else {
              Swal.fire("Error", "Ya se aplicó una vez el descuento a su pedido. Gracias igualmente por haber jugado.", "warning");
            }
          } else {
            Swal.fire("Error", "No se aplicará ningún descuento porque no hay pedidos activos. Gracias igualmente por haber jugado.", 'info');
          }
        });
      } else {
        if (this.intentos == 0) { //perdio
          this.iniciado = false;
          Swal.fire("Lo siento", "Perdiste el juego de acomodar los dados. Igualmente vas a poder volver a intentarlo", "error");
        }
        else {
          this.tablaAyudas.push({ 'intentos': this.intentos, 'eleccion': this.secuenciaHumano.toString(), 'mensaje': this.correctas.toString() });
        }
      }

      this.contador = 0;
    }
  }


  gestionarGanador() {
    return new Promise<any>((resolve) => {

      this.auth.currentUser().then(resp => {
        let usuarioActivoCorreo = resp.email;

        let user: Usuario;
        this.firestore.getUsuarios().subscribe((res: any) => {
          // this.usuariosBD = [];
          for (let index = 0; index < res.length; index++) {
            const element = res[index];

            user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);

            if (user.correo == usuarioActivoCorreo) {
              this.usuarioBDActivo = user;
              this.usuarioBDActivoID = user.id;
            }
          }

          this.firestore.getPedidos().subscribe((resp: any) => {
            for (let index = 0; index < resp.length; index++) {
              const element = resp[index];
              let pedido = new Pedido(element.payload.doc.data().mesa, element.payload.doc.data().cliente, element.payload.doc.data().productos, element.payload.doc.data().nombres, element.payload.doc.data().estadoProductos, element.payload.doc.data().cantidades, element.payload.doc.data().estado, element.payload.doc.data().precios, element.payload.doc.data().descuento, element.payload.doc.data().propina, element.payload.doc.data().total, element.payload.doc.id);

              console.log(pedido)

              if (pedido.estado != 'cerrado' && pedido.cliente == this.usuarioBDActivoID)
                this.pedidoDelUsuario = pedido;
            }
            resolve("promesa de pedidos");
          });
        });
      });
    });

  }



  generarSecuencia() {
    this.secuenciasPC = ['rojo', 'verde', 'amarillo', 'azul', 'negro'];
    this.secuenciasPC.sort(this.func);
    this.intentos = 5;
    console.log(this.secuenciasPC);

  }

  func(a, b) {
    return 0.5 - Math.random();
  }


  verificarJugada() {
    this.correctas = 0;
    console.log('humano:' + this.secuenciaHumano);
    console.log('pc: ' + this.secuenciasPC);
    for (let index = 0; index < 4; index++) {
      if (this.secuenciaHumano[index] == this.secuenciasPC[index]) {
        this.correctas++;
      }
    }
    if (this.correctas == 4) {
      return true;
      // codigo si gana
    } else {
      this.intentos--;
      return false;
    }

  }

  public verificarGanador() {
    if (this.secuenciasPC == this.secuenciaHumano) {
      this.gano = true;
    }
    if (this.gano) {
      return true;
    } else {
      return false;
    }
  }



}

export class TablaHelp {

  intentos: number;
  eleccion: string;
  mensaje: string;
}
