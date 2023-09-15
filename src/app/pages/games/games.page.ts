import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {

  public perfilUsuarioActivo;
  public pagina;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // this.tipoProducto = this.route.snapshot.paramMap.get('producto');
    this.pagina = "Juegos";
    
  }


  recibirPerfil(e){
    this.perfilUsuarioActivo = e;
  }
  
}
