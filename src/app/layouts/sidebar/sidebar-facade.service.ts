import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { menushijos } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarFacadeService {
  public menu : menushijos[] = [];

  private menu$ = new BehaviorSubject<menushijos[]>([]);
  public  responseData$ : Observable<menushijos[]> = this.menu$.asObservable();


  constructor( private auth_: AuthService) { }

  CargarMenus(){
      if ( localStorage.getItem("menus")){
        let data : [] = [];
        data = JSON.parse(localStorage.getItem("menus"));
        this.menu$.next(data)
        this.menu = data
      } else{
        this.auth_.redirecTo("/modulos")
      }
  }
}
