import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  public menus : any[] = [];
  public hijos : hijo[] = []
  @Input()detonador ?: number;
  
  constructor(  
    private auth: AuthService,
    private ruta: ActivatedRoute
    ) { }

  ngOnInit(){
    this.menus = JSON.parse(localStorage.getItem("menus"))
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    // 
    this.descomponerHijos()
    // this.validarAcceso()
  //  this.auth.validarMenu2( this.auth.dataUsuario['id_rol'], Number(localStorage.getItem('MenuHijo') )) 
  }

  validarAcceso(){
    this.auth.validarMenu( this.auth.dataUsuario['id_rol'], Number(localStorage.getItem('MenuHijo'))).subscribe(
      res=>{
        // 
      }
    )
  }

  descomponerHijos(){
        for( let i = 0; i < this.menus.length ; i++ ){
          for( let j = 0; j < this.menus[i].hijos.length; j++){
            this.hijos.push({
              idMenuHijo : this.menus[i].hijos[j]?.idMenuHijo
             })
          }
        }
  }
}

export interface hijo {
  idMenuHijo : number
}[]