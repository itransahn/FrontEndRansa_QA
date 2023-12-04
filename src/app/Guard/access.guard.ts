import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { hijo } from '../modules/excelencia/llantas/stock/stock.component';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  public menus : any [] = [];
  public hijos : hijo[] = [];
  public dataHijo : any[] = [];
  public access : boolean = false;
  public cliente : boolean = false;

  constructor( private _router: Router, private auth : AuthService ){
    this.validarRol()
  }

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.dataHijo = JSON.parse(localStorage.getItem("dataHijo"));
      // 
      let idMenu = Number(this.dataHijo?.['idMenuHijo']);
      this.descomponerHijos();
      this.validarRol();
      if( idMenu &&  this.access &&  !this.cliente){
        return true
    }else{ 
       return false;
    }
  }



  descomponerHijos(){
    this.hijos = [];
    this.menus = JSON.parse(localStorage.getItem("menus"))
    for( let i = 0; i < this.menus?.length ; i++ ){
      for( let j = 0; j < this.menus[i]?.hijos?.length; j++){
        this.hijos.push({ idMenuHijo : this.menus[i]?.hijos[j]?.idMenuHijo })
      }
    }
    this.recorrerHijos()
  }

validarRol(){
  (this.auth.dataUsuario?.['rol']== 'Cliente') ? this.cliente = true :  this.cliente = false
}

  recorrerHijos(){
    let idMenu = Number(this.dataHijo?.['idMenuHijo']);;
      for( let i = 0; i < this.hijos?.length; i++ ){
        if( this.hijos[i]?.idMenuHijo === idMenu){
            this.access = true;
            break;
        }
      }
  }

  // validarExistencia():boolean{
  //   let idMenu = localStorage.getItem("MenuHijo");

  //   if( idMenu &&  this.access){
  //       return true
  //   }
  //   return true
  // }
  
}
