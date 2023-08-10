import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { MensajesHttpService } from 'src/app/services/mensajes-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SsmoaService {


  private _refresh$ = new Subject<void>();
  constructor(  private http:HttpClient, private _mensajesHttp : MensajesHttpService ) { }

  get refresh$(){
    return this._refresh$;
  }

  // Servicio de Visualización 
  get( url?:string, params?:any){
    let request$ = this.http.get(environment.UrlApi + url, {params:params}).pipe(
      tap( ( result)=>{
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

  // Servicio de Inserción 
  post( url?:string, params?:any){
    let request$ = this.http.post<DataApi>(environment.UrlApi + url, params).pipe(
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

  validarExtintor(idExtintor : number ){
    let params = { idExtintor : idExtintor}
    let request$ = this.http.get(environment.UrlApi + '/ssmoa/Auditoria', {params:params}).pipe(
      tap( ( result: any)=>{
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

  CargarArchivos( url: string, photo: File ){
   
    const fd = new FormData();
    fd.append('file', photo);
    return this.http.post<DataApi>( environment.UrlApi + url, fd );

   
  }


  Reproceso( params ){
    return this.http.post( 'https://api-tms-r360.ransaaplicaciones.com/liquidacionCAM', params )
  }
}
