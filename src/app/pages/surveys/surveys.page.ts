import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})
export class SurveysPage implements OnInit {

  
  public perfilUsuarioActivo;
  public pagina;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // this.tipoProducto = this.route.snapshot.paramMap.get('responde');
    this.pagina = "Encuesta";
    
  }


  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }


}
