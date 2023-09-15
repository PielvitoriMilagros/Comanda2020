import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-perfil-supervisor',
  templateUrl: './perfil-supervisor.component.html',
  styleUrls: ['./perfil-supervisor.component.scss'],
})
export class PerfilSupervisorComponent implements OnInit {

  @Output() perfilRegistrar : EventEmitter<string> = new EventEmitter<string>();
  @Output() listaDe : EventEmitter<string> = new EventEmitter<string>();


  constructor() { }

  ngOnInit() {}


  public registro(perfil){
    this.perfilRegistrar.emit(perfil);

  }

  
  public enviar(lista){
    this.listaDe.emit(lista);

  }


}
