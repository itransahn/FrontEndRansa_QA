import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { MensajesHttpService } from 'src/app/services/mensajes-http.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatoriaService {

  private _refresh$ = new Subject<void>();
  
  constructor(
    private http           : HttpClient,
    private _mensajesHttp  : MensajesHttpService,
    private sweel          : SweetAlertService,
    private toast          : ToastServiceLocal
  ) { }

  get refresh$(){
    return this._refresh$;
  }
   // Servicio de Visualización 
   get( url?:string, params?:any){
    let request$ = this.http.get<DataApi>(environment.UrlApi + url,  { params } ).pipe(
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
  // Servicio de Inserción 
  post( url?:string, params?:any){
    let request$ = this.http.post<DataApi>(environment.UrlApi + url,params).pipe(
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
  // Servicio de Actualización
  put( url?:string, params?:any){
    let request$ = this.http.put<DataApi>(environment.UrlApi + url,params).pipe(
      tap( ( result:DataApi | any )=>{
        // this.refresh$.next();
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

  // Servicio de Eliminación
  delete( url?:string, params?:any){
    let request$ = this.http.delete<DataApi>(environment.UrlApi + url, { body: params }).pipe(
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
}
