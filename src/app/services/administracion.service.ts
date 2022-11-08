import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataApi } from '../interfaces/dataApi';
import { modulosPadre } from '../interfaces/generales';
import { catchError, Subject, tap } from 'rxjs';
import { MensajesHttpService } from './mensajes-http.service';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private _refresh$ = new Subject<void>();

  constructor( private http:HttpClient, private _mensajesHttp : MensajesHttpService ) { }

  get refresh$(){
    return this._refresh$;
  }

  /* USUARIOS */ 

  usuarios( url:string, params?: any ){
    let request$ = this.http.get<DataApi>(environment.UrlApi + url , params = params).pipe(
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

  usuarioEspecifico( url:string, params?: any ){
   let request$ = this.http.get<DataApi>(environment.UrlApi + url , params = params).pipe(
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

  crearUsuario( url:string, params?: any ){
    let request$ = this.http.post<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
        this.refresh$.next();
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

  actualizarUsuario( url:string, params?: any ){
    let request$ = this.http.put<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
        this.refresh$.next();
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

  /* USUARIOS */

  /* ROLES */
  roles( url:string, params?: any ){
    let request$ = this.http.get<DataApi>(environment.UrlApi + url , params = params).pipe(
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
  /* ROLES */

    /* MENUS ADMINISTRACION -- MODULOS */
  modulosPadre( url:string, params?: any ){
      let request$ = this.http.get(environment.UrlApi + url , params = params).pipe(
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
    /* MENUS ADMINISTRACION -- MODULOS */

    /* MENUS ADMINISTRACION -- MENUS */
    menus( url:string, params?: any ){
      let request$ = this.http.get(environment.UrlApi + url , params = params).pipe(
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

  /* MENUS ADMINISTRACION -- MENUS */


}
