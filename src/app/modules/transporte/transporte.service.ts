import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, tap } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { MensajesHttpService } from 'src/app/services/mensajes-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  private _refresh$ = new Subject<void>();

public catalogo$ = new BehaviorSubject<any[]>([]) ;
public catalogoData$ : Observable<any[]>= this.catalogo$.asObservable();
public dataCatalogo : any;

  constructor(
   private http          :  HttpClient,
   private _mensajesHttp :  MensajesHttpService
  ) {
    this.cargarCatalogo()
   }

  // ngOnInit(): void {
  //   this.cargarCatalogo()
  // }

  get refresh$(){
    return this._refresh$;
  }

  cargarCatalogo(){
    let url = 'transporte/catalogoT';
    this.http.get(environment.UrlApi + url , {}).subscribe(
      (res : any)  =>{
        this.dataCatalogo = res;
        this.catalogo$.next(res);
      }
    );
  }

  returnCatalogo(){
    this.cargarCatalogo();
    return this.catalogo$.value
  }
  
  returnCatalogoData(){
    return this.catalogoData$
  }

    // Servicio de Visualización 
    get( url?:string, params?:any){
      let request$ = this.http.get<DataApi>(environment.UrlApi + url, params ).pipe(
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
    
}
