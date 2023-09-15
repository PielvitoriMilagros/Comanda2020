import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Mesa } from 'src/app/models/mesa';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {

  public usuarioActivoCorreo;
  public usuarioBDActivo;
  public usuarioBDActivoID;

  public mesaActual;


  @Output() parametroEnviado : EventEmitter<string> = new EventEmitter<string>();

  constructor(private navCtrl: NavController,private auth: AuthenticationService, private firestore:FirestoreService) { 

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

        }
      });

    });
    
    let mesa: Mesa;
    firestore.getMesas().subscribe((res: any) => {
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        mesa = new Mesa(element.payload.doc.data().comensales, element.payload.doc.data().estado, element.payload.doc.data().numero, element.payload.doc.data().tipo, element.payload.doc.id, element.payload.doc.data().cliente, element.payload.doc.data().consulta);
        if(mesa.cliente)
        if (mesa.cliente.id == this.usuarioBDActivoID) this.mesaActual=mesa;
      }


    });


  }

  ngOnInit() {}


  enviar(lugar){
    this.parametroEnviado.emit(lugar);
  }

  public encuesta(){
    this.navCtrl.navigateForward('/surveys');
  }

  public cuenta(){
    this.navCtrl.navigateForward('/bill');
  }


  hacerConsulta(){

    Swal.fire({
      title: '',
      text: '',
      imageUrl: '../../../assets/imagenes/consulta.png',
      imageAlt: 'Foto',
      input: 'textarea',
      inputPlaceholder: 'Su consulta aquí...',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      confirmButtonColor: 'success',
      imageWidth: 300,
      imageHeight: 300,
    }).then(result => {
      if (result.isConfirmed) {
        if (result.value) {
          console.log(this.mesaActual);
          
          this.mesaActual.consulta = result.value;
          Swal.fire('Éxito','La consulta fue enviada con éxito','success');
          this.firestore.updateBD(this.mesaActual.id,this.mesaActual.toJson(),'mesas').then(resp=>{
            console.log("funciono");
          })

        } else {

          Swal.fire('Error', 'Si quiere enviar una consulta al mozo debe ingresar algo', 'error');

        }

      }
    })


  }



  jugar(algo){
    this.navCtrl.navigateForward('/games');
    // Swal.fire('Lo sentimos','Aún no hay juegos disponibles','error');
  }


}
