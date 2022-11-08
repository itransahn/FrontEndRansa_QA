import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catalogo } from 'src/app/interfaces/generales';
import { catchError, Subject, tap } from 'rxjs';
import { MensajesHttpService } from 'src/app/services/mensajes-http.service';
import { DataApi } from 'src/app/interfaces/dataApi';
@Injectable({
  providedIn: 'root'
})
export class TipoSangreService {

  private _refresh$ = new Subject<void>();

  constructor( private http:HttpClient,  private _mensajesHttp : MensajesHttpService) { }
  get refresh$(){
    return this._refresh$;
  }



     /* Get tipo Sangre */ 
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

    /* Post tipo Sangre */ 
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

     /* put tipo Sangre */ 
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

      /* delete tipo Sangre */ 
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
