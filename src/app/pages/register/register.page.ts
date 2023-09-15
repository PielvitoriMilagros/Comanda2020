import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public perfilUsuarioActivo;
  public pagina;
  public perfilAlta;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.perfilAlta = this.route.snapshot.paramMap.get('perfil');
    let perfilAux = this.perfilAlta == 'duenio' ? 'Dueño' :this.perfilAlta;
    this.pagina = "Alta de " + perfilAux;
    
  }

  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }


}
