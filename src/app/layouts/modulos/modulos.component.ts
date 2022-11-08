import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { catalogo, GeneraRandomPassword, modulos } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.scss']
})
export class ModulosComponent implements OnInit {
  public modulos     : modulos[]  = [];

  public subs : Subscription;


  constructor( public auth : AuthService, public toas: ToastServiceLocal) {
   }

  ngOnInit(): void {
    this.cargarModuloss();
    this.auth.consumirData();
    this.cleanLocalStorage()
  } 

    cargarModuloss(){
      if ( localStorage.getItem("modulos")){
        let data: any          = localStorage.getItem("modulos");
        let dataParseada : any =  JSON.parse(data)
        this.modulos     = dataParseada
      }else{
        this.auth.redirecToLogin()
      }
    }

  redireccionar(idModulo : number ){
    localStorage.setItem('Modulo', String(idModulo))
    this.auth.redirecTo('/ransa')
  }
    
 cleanLocalStorage(){
  localStorage.removeItem("menus");
  localStorage.removeItem("MenuHijo");
  localStorage.removeItem("MenuActual");
  localStorage.removeItem("dataHijo");
  localStorage.removeItem("MenuActual");
  localStorage.removeItem("Modulo");

}
}



