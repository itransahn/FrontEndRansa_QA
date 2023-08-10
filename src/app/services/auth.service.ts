import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataApi } from '../interfaces/dataApi';
import { catalogo, dataUsuario, menushijos } from '../interfaces/generales';
import loginI from '../interfaces/loginI';
import { MensajesHttpService } from './mensajes-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
public dataUsuario : dataUsuario;
public dataCatalogo : catalogo;
public dataUsuario$ = new BehaviorSubject<dataUsuario[]>([]);
public responseData$ : Observable<dataUsuario[]>= this.dataUsuario$.asObservable();
public access : boolean = false;

public catalogo$ = new BehaviorSubject<catalogo[]>([]) ;
public catalogoData$ : Observable<catalogo[]>= this.catalogo$.asObservable();


  constructor( private http:HttpClient, private router: Router,
    private _mensajesHttp : MensajesHttpService ) { 
    this.cargarCatalogo()
  }
  //APIS
  login( url:string, params ?: any ){
      return this.http.post<loginI>(environment.UrlApi + url , params);
  }

  menus( url:string, params?: any ){
    return this.http.post<menushijos>(environment.UrlApi + url , params = params)
  }

  cambioContra( url:string, params?: any ){
    return this.http.post<menushijos>(environment.UrlApi + url , params = params)
  }

  cambioContraUsuario( url:string, params?: any ){
    let request$ = this.http.put<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
          return result
      } ),
  catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }

  leave(){
    localStorage.clear()
  }

  ngOnInit(): void {
    this.consumirData();
    this.cargarCatalogo();
  }
  //SHARED
  redirecTo(url : string ){
    this.router.navigateByUrl(url)
  }
  redirecToLogin(){
    this.router.navigateByUrl(environment.env)
  }

  returnCatalogo(){
    this.cargarCatalogo();
    return this.catalogo$.value
  }

  returnCatalogoData(){
    return this.catalogoData$
  }

  consumirData(){
    let data : any[] = [];
    data = JSON.parse(localStorage.getItem("dataUsuario"));
    this.dataUsuario$.next(data)
  }

  cargarCatalogo(){
    let url = 'seguridad/catalogo';
    this.http.get(environment.UrlApi + url , {}).subscribe(
      (res : catalogo | any)  =>{
        this.dataCatalogo = res;
        this.catalogo$.next(res);
      }
    );
  }

  extraerData(){
    let data: any = localStorage.getItem("dataUsuario");
    let dataParseada : any =  JSON.parse(data)
    this.dataUsuario = dataParseada;
      return this.dataUsuario
   }

  limpiarDataLoca(){
    localStorage.clear()
  }

  reiniciarBandera(){
    this.access = false;
  }

  obtenerValidacion(){
    return this.access;
  }

validarMenu( rol : number, menu : number){
    let url = 'auth/validarMenu';
    let params = {
      rol  : rol,
      menu : menu
    }
    let request$ =  this.http.post(environment.UrlApi + url , params ).pipe(
      tap( ( result:DataApi | any )=>{
          return result
      } ),
  catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
      return request$;
  }


  validarMenu2 ( rol : number, menu : number){
    let url = 'auth/validarMenu';
    let params = {
      rol  : rol,
      menu : menu
    }
  this.http.post(environment.UrlApi + url , params ).subscribe(
  (res : any) => {
        // 
        localStorage.setItem("Access", res?.access)
    }
  )
  }

  CargarMenuActual ( idMenu : number  ){
      localStorage.setItem("MenuActual", String(idMenu))
  }

Insercion(){
  let dataHijo = JSON.parse( localStorage.getItem("dataHijo"));
  if( Number(dataHijo['insertar']) === 1  ){
return true
  }else{
return false;
  }
  }

Actualizacion(){
let dataHijo = JSON.parse( localStorage.getItem("dataHijo"));
if( Number(dataHijo['actualizar']) === 1  ){
  return true
    }else{
  return false;
    }
  }

Eliminacion(){
let dataHijo = JSON.parse( localStorage.getItem("dataHijo"));
if( Number(dataHijo['eliminar']) === 1  ){
  return true
    }else{
  return false;
    }
  }


}
