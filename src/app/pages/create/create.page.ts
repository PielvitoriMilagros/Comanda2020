import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {


  public perfilUsuarioActivo;
  public pagina;
  public tipoProducto;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.tipoProducto = this.route.snapshot.paramMap.get('producto');
    this.pagina = "Alta de " + this.tipoProducto;
    
  }


  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }

}
