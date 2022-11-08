import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { MensajesHttpService } from 'src/app/services/mensajes-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  private _refresh$ = new Subject<void>();

  constructor( private http:HttpClient,  private _mensajesHttp : MensajesHttpService ) { }

  
  get refresh$(){
    return this._refresh$;
  }

  
    /* Get puesto */ 
    get( url:string, params?: any ){
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

    /* Post puesto */ 
    post( url:string, params?: any ){
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

     /* put puesto */ 
     put( url:string, params?: any ){
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

      /* delete puesto */ 
      delete( url:string, params?: any ){
        let request$ = this.http.delete<DataApi>(environment.UrlApi + url , { body : params}).pipe(
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
