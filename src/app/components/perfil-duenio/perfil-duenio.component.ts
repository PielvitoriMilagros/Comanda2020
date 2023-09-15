import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-perfil-duenio',
  templateUrl: './perfil-duenio.component.html',
  styleUrls: ['./perfil-duenio.component.scss'],
})
export class PerfilDuenioComponent implements OnInit {


  @Output() perfilRegistrar : EventEmitter<string> = new EventEmitter<string>();
  @Output() listaDe : EventEmitter<string> = new EventEmitter<string>();


  constructor(private firestore: FirestoreService, private toastController: ToastController) { }

  ngOnInit() {
    let primeraVez=false;
    let longitud;
    this.firestore.getUsuarios().subscribe((resp: any) => {
      let clientes = [];
      for (let index = 0; index < resp.length; index++) {
        const element = resp[index];

        let user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, null, element.payload.doc.data().foto, element.payload.doc.id, element.payload.doc.data().enMesa);

        if (user.tipo == 'registrado') {
          clientes.push(user);
        }
      }
      if(primeraVez){
        if(longitud != clientes.length){
          let mensaje = 'NUEVO CLIENTE REGISTRADO. POR FAVOR ACCEDA A LA LISTA DE CLIENTES PENDIENTES DE APROBACIÓN PARA PERMITIRLE EL INGRESO AL LOCAL';
          primeraVez = false;
          this.dispararToast(mensaje);
        }
      } else{
        primeraVez=true;
        longitud = clientes.length;
      }
    });

  }

  
  async dispararToast(mensaje){

    const toast = await this.toastController.create({
      color: 'danger',
      duration: 3000,
      message: mensaje,
      position: "top"
    });
    await toast.present();
  }
  

  public registro(perfil){
    this.perfilRegistrar.emit(perfil);

  }

  public enviar(lista){
    this.listaDe.emit(lista);

  }


}
