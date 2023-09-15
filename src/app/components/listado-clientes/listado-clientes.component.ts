import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss'],
})
export class ListadoClientesComponent implements OnInit {

  public listadoUsuarios;
  public listadoClientes;
  public listadoClientesReg;

  @Input() tipoListado:string;

  
  constructor(private firestore:FirestoreService) {

    let user: Usuario;
    firestore.getUsuarios().subscribe((resp: any) => {
      this.listadoUsuarios = [];
      for (let index = 0; index < resp.length; index++) {
        const element = resp[index];

        user = new Usuario(element.payload.doc.data().nombre, element.payload.doc.data().apellido, element.payload.doc.data().dni, element.payload.doc.data().sexo, element.payload.doc.data().correo, element.payload.doc.data().perfil, element.payload.doc.data().tipo, element.payload.doc.data().aprobado, element.payload.doc.data().cuil, element.payload.doc.data().foto,element.payload.doc.id);

        this.listadoUsuarios.push(user);
      }

      this.listadoClientes = this.listadoUsuarios.filter(user => user.perfil == "cliente");
      this.listadoClientesReg = this.listadoClientes.filter(user => user.tipo != "anonimo");
    });


   }




  ngOnInit() {}


  aprobarCliente(user){

    Swal.fire({
      title: '¿Aprobar cliente?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        user.aprobado = true;
        this.firestore.updateUser(user.id,user.toJson()).then(()=>{
          Swal.fire('Cliente Aprobado!', '', 'success')
        });
      } else if (result.isDenied) {
        user.aprobado = false;
        this.firestore.updateUser(user.id,user.toJson()).then(()=>{
        Swal.fire('Cliente Rechazado', '', 'error')
        });
      }
    })


  }


}
