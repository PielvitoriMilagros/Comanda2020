import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.scss'],
})
export class PerfilClienteComponent implements OnInit {

  usuarioActivoCorreo;
  usuariosBD;
  usuarioBDActivo: Usuario;
  waitingList;
  enListaDeEspera = false;
  qrLeido;

  @Output() parametroEnviado: EventEmitter<string> = new EventEmitter<string>();

  options: BarcodeScannerOptions = {
    //prompt : "Escaneando", // Android
    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations: true, // iOS
    disableSuccessBeep: false // iOS and Android
  };

  constructor(private auth: AuthenticationService,
    private firestore: FirestoreService,
    private barcode: BarcodeScanner) {

    auth.currentUser().then(resp => {
      this.usuarioActivoCorreo = resp.email;

      let user: Usuario;

      firestore.getUsuarios().subscribe((resp: any) => {
        this.usuariosBD = [];
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];

          user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);

          if (user.correo == this.usuarioActivoCorreo) {
            console.log(user);
            this.usuarioBDActivo = user;
          }

          this.usuariosBD.push(user);
        }
      });

      firestore.getListaDeEspera().subscribe((res: any) => {
        this.waitingList = [];
        for (let index = 0; index < res.length; index++) {
          const element = res[index];

          user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);

          this.waitingList.push(user);
        }

      });


    })

  }


  ngOnInit() {
  }



  escanear() {
    this.barcode.scan(this.options).then(barcodeData => {
      this.qrLeido = barcodeData.text;

    // this.qrLeido = "mesa5";

    switch (this.qrLeido) {
      case "ingreso": {
        if (this.usuarioBDActivo.enMesa == null || this.usuarioBDActivo.enMesa == undefined) {
          if (this.verificaWaitingList()) {
            this.muestraSwal("Sea paciente", "warning", "Ya se encuentra en lista de espera. Un metre le asignará una mesa a la brevedad");
          } else {
            this.firestore.saveListaDeEspera(this.usuarioBDActivo.toJson(), this.usuarioBDActivo.id).then(resp => {
              this.muestraSwal("¡Bienvenido!", "success", "Ha ingresado en lista de espera. Un metre le asignará una mesa a la brevedad");
            }).catch(error => {
              this.muestraSwal("¡Error!", "error", "No pudo ingresar a la lista de espera. Contacte al dueño.");
            });
          }
        } else {
          this.muestraSwal("¡Error!", "error", "Ya tiene una mesa asignada. Escanee ese QR, este es el de ingreso al local.");
        }
        break;
      }
      default: {
        if (this.usuarioBDActivo.enMesa != null && this.usuarioBDActivo.enMesa != undefined) {
          var nroMesa = this.qrLeido.substr(-1);
          if (this.usuarioBDActivo.enMesa != nroMesa) {
            this.muestraSwal('¡Error!', 'error', 'Ése no es el QR de su mesa. Escanee el correcto. Su mesa es la número ' + this.usuarioBDActivo.enMesa);
          } else {
            this.parametroEnviado.emit('mesaCliente');
          }
        } else {
          this.muestraSwal('¡Atención!', 'warning', 'Aún no tiene una mesa asignada. Aguarde o escanee el QR correcto.');
        }

        break;
      }
    }

    });
  }


  verificaWaitingList() {

    if (this.waitingList != null) {

      let estaEnEspera = this.waitingList.filter(user => user.correo == this.usuarioActivoCorreo);
      if (estaEnEspera.length == 1) {

        this.enListaDeEspera = true;
        return true;
      }
      else {

        this.enListaDeEspera = false;
        return false;
      }
    }

  }







  muestraSwal(titulo, icono, mensaje) {

    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono
    });

  }



}
