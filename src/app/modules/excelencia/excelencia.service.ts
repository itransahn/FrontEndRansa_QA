import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { MensajesHttpService } from 'src/app/services/mensajes-http.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ExcelenciaService {

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

  async postAs400  (  params ){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('Content-Length', '407');
    // headers.append('Connection','keep-alive');
    // headers.append('keep-alive','timeout=5');
    // headers.append('Authorization','CIKBPPJPBBCFHBIEMGMNBLKNBAGNDEHEOIDNFDNDJDMDLFEMKLBMEECAEKKACOPJPICIIBLIADDMNKPLLOCPIHCDOAGGGEENFNNOEPEAKFGNKEJEDJGDMLKIDLMGODPP')
    // headers.append('Set-Cookie','bbbbbbbbbbbbbbb=CIKBPPJPBBCFHBIEMGMNBLKNBAGNDEHEOIDNFDNDJDMDLFEMKLBMEECAEKKACOPJPICIIBLIADDMNKPLLOCPIHCDOAGGGEENFNNOEPEAKFGNKEJEDJGDMLKIDLMGODPP; HttpOnly; secure')
    let vista = {
      query: `CALL DC@RNSLIB.SP_AWS_LISTA_FACTURA ('EZ', 51, 16168, 1390054395, 20220413, 20220413)`,
      env: 'PRD'
  };
  
  let conf = {
    method: 'post',
    baseURL: `https://secure.ransa.net`,
    url: `/callAS400`,
    data: JSON.stringify(vista),
    headers: { "Content-Type": "application/json"  }

};

let contenedores = await axios(conf);

    contenedores = contenedores.data;

    console.log(contenedores)
  }

  pruebahttp( params ){
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
 
   return this.http.post( environment.UrlAs400, params )
  }


  /* AXIOS */


}
