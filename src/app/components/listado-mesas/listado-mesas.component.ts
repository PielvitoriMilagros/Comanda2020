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
  selector: 'app-listado-mesas',
  templateUrl: './listado-mesas.component.html',
  styleUrls: ['./listado-mesas.component.scss'],
})
export class ListadoMesasComponent implements OnInit {


  public listadoMesas;
  

  public usuarioActivoCorreo;
  public usuarioBDActivo;
  public usuarioBDActivoID;


  @Input() tipoListado: string;


  constructor(private auth: AuthenticationService, private firestore: FirestoreService, private navCtrl:NavController) {

    let mesa: Mesa;
    firestore.getMesas().subscribe((resp: any) => {
      this.listadoMesas = [];
      for (let index = 0; index < resp.length; index++) {
        const element = resp[index];

        mesa = new Mesa(element.payload.doc.data().comensales,element.payload.doc.data().estado,element.payload.doc.data().numero,element.payload.doc.data().tipo,element.payload.doc.id,element.payload.doc.data().cliente,element.payload.doc.data().consulta);

        this.listadoMesas.push(mesa);

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


    });



  }

  ngOnInit() { }


  verConsulta(mesa){

    Swal.fire({
      title:"Consulta mesa "+mesa.numero,
      text: mesa.consulta,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Resolver'
    }).then((result) => {
      if (result.isConfirmed) {
        
        mesa.consulta = null;
        Swal.fire('Gracias','La consulta del usuario fue resuelta','success');
        this.firestore.updateBD(mesa.id,mesa.toJson(),'mesas').then(resp=>{
          console.log("FUNCIONO");
        });
        

      }
    })



  }




}
