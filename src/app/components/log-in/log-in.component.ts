import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
// import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {


  mostrar;
  mensaje: string;
  usuario: string;
  clave: string;
  usuariosBD = [];
  usuariosClientes = [];
  public usuarioActivo = false;
  emailVerificado = null;

  constructor(private authService: AuthenticationService, private router: Router, private firestore: FirestoreService) {
    this.usuarioActivo = false;
    let user: Usuario;
    firestore.getUsuarios().subscribe((resp: any) => {
      this.usuariosBD = [];
      for (let index = 0; index < resp.length; index++) {
        const element = resp[index];

        user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, element.payload.doc.data().cuil, element.payload.doc.data().foto);

        this.usuariosBD.push(user);
      }


      this.usuariosClientes = this.usuariosBD.filter(user => user.perfil == "cliente");



    });




  }

  ngOnInit() {
    this.authService.currentUser().then(resp => {
      if (resp != null)
        this.usuarioActivo = true;

    }).catch(error => {
      this.usuarioActivo = false;

    });
  }

  logOut() {

    this.authService.cerrarSesion().then(resp => {
      this.usuarioActivo = false;
      this.router.navigate(['/home']);
    });
  }



  validarUsuario() {

    let esCliente = this.usuariosClientes.filter(user => user.correo == this.usuario);
    if (esCliente.length == 1) {
      if (esCliente[0].aprobado == true)
        this.loguearUsuario();
      else {
        this.mensaje = "El cliente no fue aprobado. Debe contactarse con el dueño"
        this.mostrar = true;
        setTimeout(() => {
          this.mostrar = false;
        }, 2500);
      }
    } else
      this.loguearUsuario();

  }




  loguearUsuario() {
    this.authService.iniciarSesion(this.usuario, this.clave).then(resp => {
   
      
      // DESCOMENTAR cuando carguemos datos reales y borrar las dos lineas de acá abajo

      console.log(resp);
      this.router.navigate(['/home']);    
      // if(resp.user.emailVerified){
      //   console.log(resp);
      //   this.router.navigate(['/home']);

      // }else{

      //   this.authService.cerrarSesion().then(res=>{});
      //   this.mensaje = "Falta verificar el correo. Ingrese a su casilla o revise en Correo No Deseado.";
      //   this.mostrar = true;
      //   setTimeout(() => {
      //     this.mostrar = false;
      //   }, 2500);


      // }


    }).catch(error => {
      console.log(error);
      this.mensaje = "Correo o contraseña incorrectos. Favor de verificar.";
      this.mostrar = true;
      setTimeout(() => {
        this.mostrar = false;
      }, 2500);
    });
  }



  registrarUsuario() {
    this.router.navigate(['/register/cliente']);
  }



  cargarUser(tipo) {
    switch (tipo) {
      case 'User1': {
        this.usuario = 'encuarentenadospps@gmail.com';
        this.clave = '123456';
        break;
      }
      case 'User2': {
        this.usuario = 'cli@cliente.com';
        this.clave = '222222';
        break;
      }
      case 'User3': {
        this.usuario = 'mili@mili.com';
        this.clave = '123123';
        break;
      }
      case 'User5': {
        this.usuario = 'miledupi@hotmail.com';
        this.clave = '123123';
        break;
      }
      case 'User6': {
        this.usuario = 'juancito@gmail.com';
        this.clave = 'juancito';
        break;
      }
      case 'User7': {
        this.usuario = 'milagrosp619@gmail.com';
        this.clave = '123456';
        break;
      }
    }
  }





}
