import { Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Params  } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarFacadeService } from './sidebar-facade.service';
import { MediaMatcher } from '@angular/cdk/layout';
import * as $ from 'jquery';
import { menushijos } from 'src/app/interfaces/generales';
import { SeguridadService } from 'src/app/services/seguridad.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public subscrption : Subscription;
  public cargando : boolean = false;
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public menu : menushijos[] = [];

  constructor( public auth_ : AuthService, private ruta: ActivatedRoute, public sidebarService : SidebarFacadeService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private seguridad : SeguridadService , private auth : AuthService) {
      this.mobileQuery = media.matchMedia('(min-width: 768px)');
      // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      // this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit(){
    this.cargarMenus();
    // this.sidebarService.CargarMenus();  
    this.subscrption = this.seguridad.refresh$.subscribe(
      res=>{
        this.cargarMenus()
      }
    )
    
  }

  redireccionar(){
      this.auth_.redirecTo('/modulos')
  }

  redireccionarHijos(url:string, MenuHijo : number){
    let dataHijo = {
      idMenuHijo : MenuHijo['idMenuHijo'],
      insertar   : MenuHijo['insertar'],
      actualizar : MenuHijo['actualizar'],
      eliminar   : MenuHijo['eliminar']
    }
    this.auth_.redirecTo(`ransa${url}`);
    localStorage.setItem("dataHijo", JSON.stringify(dataHijo))
}

  cargarMenus(){
    let url = 'auth/menus';
    let params = {
        rol    : this.auth_.extraerData().id_rol,
        modulo : localStorage.getItem("Modulo")
    }
this.subscrption =  this.auth_.menus(url ,  params).subscribe( 
    data =>{
      localStorage.removeItem("menus");
      localStorage.setItem("menus", JSON.stringify(data.data.menu) )
      this.menu = JSON.parse(localStorage.getItem("menus"));
      this.cargando = true
    }
  )
  } 

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscrption.unsubscribe()
  }

  salir() {
    this.auth.redirecToLogin()
  }}
