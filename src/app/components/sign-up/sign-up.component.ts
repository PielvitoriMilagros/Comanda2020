import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirestoreService } from 'src/app/servicios/firestore.service';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  public mensaje;

  public nombre;
  public apellido;
  public dni;
  public cuil=null;
  public usuario;
  public sexo = "Femenino";
  public clave;
  public claveDos;
  public tipo;

  public datoLeido;

  public imagenCargada;
  public nick: string;

  // public tipoEmpleados=['Mozo','Cocinero','Bartender'];
  // public tipoClientes=['Anonimo','Registrado'];

  types = ["PDF417", "QR Code"];

  optionsCamera: CameraOptions = {
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    correctOrientation: true
  }

  options: BarcodeScannerOptions = {
    //prompt : "Escaneando", // Android
    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    formats: "PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations: true, // iOS
    disableSuccessBeep: false // iOS and Android
  };


  @Input() perfilAlta: string;



  constructor(private router: Router,
    private auth: AuthenticationService,
    private firestore: FirestoreService,
    private escaner: BarcodeScanner,
    private camera: Camera) {


  }

  ngOnInit() {
    if (this.perfilAlta == 'empleado')
      this.tipo = 'mozo';
    else if (this.perfilAlta == 'cliente')
      this.tipo = 'anonimo';
    else
      this.tipo = '';
    console.log(this.perfilAlta + ' - ' + this.tipo);
    this.imagenCargada = "../../../assets/imagenes/whoAmI.png";
  }


  validarRegistro() {
    this.mensaje = '';


    if (this.camposValidos()) {
      
      let user; 
      if (this.tipo != 'anonimo')
        user = new Usuario(this.nombre, this.apellido, this.dni, this.sexo, this.usuario, this.perfilAlta, this.tipo, null, this.cuil, this.imagenCargada);
      else {
        
        this.nick = this.nick.toLowerCase();
        this.clave = this.nombre = this.apellido = this.nick ;
        this.usuario = this.nick+'@anonimo.com'
        user = new Usuario(this.nombre, this.apellido, null, null, this.usuario, this.perfilAlta, this.tipo, null, null, this.imagenCargada)
        
      }

      this.auth.registrarCuenta(this.usuario, this.clave).then(res => {
        console.log(res);
        if (this.tipo != 'anonimo')
          res.user.sendEmailVerification({ handleCodeInApp: true, url: environment.urlVerify });

        this.firestore.saveUser(user.toJson()).then(resp => {
          // if(this.perfilAlta == 'cliente')
          //   this.firestore.savePendientesAprobar(user.toJson()).then(guardo=>{
          //     console.log("guardado en pendientes");
          //   });
          
          Swal.fire({
            title: 'Éxito',
            text: 'El usuario fue dado de alta correctamente',
            icon: 'success'
          }
          ).then(result => {

            if (this.tipo == 'anonimo'){

              this.auth.iniciarSesion(this.usuario,this.clave).then(respue=>{
                console.log("inicio sesion anonimo");
                this.router.navigate(['/home']);
              });
            }
              this.router.navigate(['/login']);

          });
          // this.mostrarNotificacion(true,'El usuario fue dado de alta correctamente');
        }).catch(err => {
          console.log("FALLO la BD");
          console.log(err);
        });
      }).catch(error => {
        console.log("rompio el authentication");
        console.log(error);
        this.setearMsjError(error);
       
        Swal.fire({
          title: 'Error',
          text: this.mensaje,
          icon: 'error'
        })
      });


    } else {
      console.log('Error Aca');
      Swal.fire({
        title: 'Error',
        text: this.mensaje,
        icon: 'error'
      }
      ).then(result => {
        console.log(this.mensaje);
      });

    }


  }




  tomarFoto() {
    this.camera.getPicture(this.optionsCamera).then((imageData) => {

      this.imagenCargada = 'data:image/jpeg;base64,' + imageData;

    }).catch((err) => {
      console.log(err);

    });
  }



  escanear() {

    this.escaner.scan(this.options).then(barcodeData => {
      //nroTramite@apellido@nombre@sexo F o M@dni@ejemplar@fecNac@fecVencimiento@xxx cuil (si lo tiene)

      //tipo1  - cuit 20-3
      // let probandinQR='@29637515@A@1@GALLO@ALEJANDRO JUVENAL@ARGENTINA@31/07/1982@M@23/06/2011@00056192695@7006@23/06/2026@264@0@ILR:2.01 C:110613.02(No Cap.)@UNIDAD #20 || S/N:0040>2008>>00??'
      //tipo2  - cuit 27-0
      //  let probandinQR='00131983786@PIELVITORI@MILAGROS@F@39609385@A@20/05/1996@24/08/2012'
      //tipo3  - cuit 20-0
      // let probandinQR='00484740421@PIELVITORI@OMAR PABLO@M@12857722@B@08/12/1956@21/03/2017@200'
      //tipo4  - cuit 27-4
      // let probandinQR = '00489707425@VILLALBA@CLAUDIA@F@17619032@C@30/10/1965@17/04/2017@274';
      this.datoLeido = barcodeData.text;
      let dni = this.datoLeido.split('@');
      // let dni = probandinQR.split('@');

      if (dni.length == 8 || dni.length == 9) {
        this.apellido = dni[1];
        this.nombre = dni[2];
        this.sexo = dni[3] == 'M' ? 'Masculino' : 'Femenino';
        this.dni = dni[4];
        this.cuil = dni[8] != null ? dni[8].substr(0, 2) + dni[4] + dni[8].substr(-1) : this.calcularCUIT();
      } else {
        this.apellido = dni[4];
        this.nombre = dni[5];
        this.dni = dni[1];
        this.sexo = dni[8] === 'M' ? 'Masculino' : this.sexo = 'Femenino';
        this.cuil = this.calcularCUIT();
      }
      if (this.cuil == (null || '' || undefined)) {
        Swal.fire({
          title: 'Atención',
          text: 'El DNI no contenía el número de CUIL. Ingreselo manualmente.',
          icon: 'warning'
        });

      }


    }).catch(err => {
      console.log('Error', err);
      this.datoLeido = err;
    });

  }


  calcularCUIT(): string {
    let dni = this.dni;
    let cuit: Array<number> = [];
    let cantCeros = 8 - dni.length;
    let result: string;
    cuit[0] = 2;
    cuit[1] = this.sexo === 'Masculino' ? 0 : 7;
    for (let i = 0; i < cantCeros; i++)
      cuit.push(0);

    for (let i = 0; i < dni.length; i++) {
      if (Number.parseInt(dni[i]) != NaN)
        cuit.push(Number.parseInt(dni[i]));
    }
    let tot: number = 0;
    tot += cuit[0] * 5;
    tot += cuit[1] * 4;
    tot += cuit[2] * 3;
    tot += cuit[3] * 2;
    tot += cuit[4] * 7;
    tot += cuit[5] * 6;
    tot += cuit[6] * 5;
    tot += cuit[7] * 4;
    tot += cuit[8] * 3;
    tot += cuit[9] * 2;

    let digVer: number;

    switch (tot % 11) {
      case 0:
        digVer = 0;
        break;
      case 1:
        digVer = cuit[1] == 0 ? 9 : 4;
        cuit[1] = 3;
        break;
      default:
        digVer = 11 - (tot % 11);
        break;
    }
    cuit[10] = digVer;
    let ret: string = cuit.join('');

    return ret.substring(0, 11);
  }


  setType(e) {
    this.tipo = e;
    console.log(this.tipo);
  }


private setearMsjError(error){
  switch (error.code) {
    case 'auth/weak-password':
      this.mensaje = this.tipo != 'anonimo' ? 'La clave debe poseer al menos 6 caracteres' : 'El usuario debe tener al menos 6 caracteres';
      break;
    case 'auth/email-already-in-use':
      this.mensaje = this.tipo != 'anonimo' ? 'Correo ya registrado' : 'El nombre de usuario ya est� siendo utilizado.';
      break;
    case 'auth/invalid-email':
      this.mensaje = this.tipo != 'anonimo' ? 'Correo con formato inv\u00E1lido' : 'El nombre de usaurio elegido no es v\u00E1lido';
      break;
    case 'auth/argument-error':
      if (error.message == 'createUserWithEmailAndPassword failed: First argument "email" must be a valid string.')
        this.mensaje = this.tipo != 'anonimo' ? 'Correo con debe ser una cadena v\u00E1lida' : 'El usuario no tiene un formato v\u00E1lido';
      else
        this.mensaje = this.tipo != 'anonimo' ? 'La constrase\u00F1a debe ser una cadena v\u00E1lida' : 'El usuario no tiene un formato v\u00E1lido';
      break;
    case 'auth/argument-error':
      this.mensaje = this.tipo != 'anonimo' ? 'Correo con debe ser una cadena v\u00E1lida' : 'El usuario no tiene un formato v\u00E1lido';
      break;
    default:
      this.mensaje = 'Error en registro';
  }
}

  private camposValidos() {
    if (this.tipo != 'anonimo') {
      let nombre: string = this.nombre;
      if (this.nombre == (null || '' || undefined) || nombre.length == 0) {
        this.mensaje = 'Debe completar el nombre';
        return false;
      }
      let apellido: string = this.apellido;
      if (this.apellido == (null || '' || undefined) || apellido.length == 0) {
        this.mensaje = 'Debe completar el apellido';
        return false;
      }
      let dni: string = this.dni;
      if (this.dni == (null || '' || undefined) || dni.length == 0) {
        this.mensaje = 'Debe completar el DNI';
        return false;
      }
      if (this.dni < 1000000 || this.dni > 99999999) {
        this.mensaje = 'Debe ingresar un DNI mayor a 1.000.000 y menor a 99.999.999';
        return false;
      }
      if (isNaN(this.dni)) {
        this.mensaje = 'Debe ingresar un DNI num\u00E9rico';
        return false;
      }
      let cuil: string = this.cuil;
      if(this.perfilAlta!='cliente'){
        if (this.cuil == (null || '' || undefined) || cuil.length == 0) {
          this.mensaje = 'Debe completar el CUIL';
          return false;
        }
      }
      let email: string = this.usuario;
      if (this.usuario == (null || '' || undefined) || email.length == 0) {
        this.mensaje = 'Debe completar el email';
        return false;
      }
      let clave1: string = this.clave;
      if (this.clave == (null || '' || undefined) || clave1.length == 0) {
        this.mensaje = 'Debe completar la clave';
        return false;
      }
      let clave2: string = this.claveDos;
      if (this.claveDos == (null || '' || undefined) || clave2.length == 0) {
        this.mensaje = 'Debe completar la confirmaci\u00F3n de la clave';
        return false;
      }
      if (this.clave != this.claveDos) {
        this.mensaje = 'Las claves son distintas';
        return false;
      }
      if (this.sexo == (null || '' || undefined)) {
        this.mensaje = 'Debe seleccionar un sexo';
        return false;
      }
    }
    else
    {
      if (this.nick == (null || '' || undefined) || this.nick.length == 0) {
        this.mensaje = 'Debe completar el nombre de usuario';
        return false;
      }
    }
    return true;

  }


}
