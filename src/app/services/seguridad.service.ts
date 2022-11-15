import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DataApi } from '../interfaces/dataApi';
import { environment } from 'src/environments/environment';
import { catchError, Subject, tap } from 'rxjs';
import { MensajesHttpService } from './mensajes-http.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private _refresh$ = new Subject<void>();
  
  constructor( private http:HttpClient, private _mensajesHttp : MensajesHttpService ) { }

  get refresh$(){
    return this._refresh$;
  }

/* Insertar Módulo */ 
  insertarModulo( url?:string, params?:any){
  
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
  
  /* Editar Módulo */ 
  editarModulo( url?:string, params?:any){
  let request$ = this.http.put<DataApi>(environment.UrlApi + url , params).pipe(
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

    /* Eliminar Módulo */ 
    eliminarModulo( url?:string, params?:any){
      let request$ = this.http.delete<DataApi>(environment.UrlApi + url , {body : params}).pipe(
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
  /* Ver Permisos Módulo */
  verPermisosModulos( url?:string, params?:any){
    
  let request$ = this.http.get<DataApi>(environment.UrlApi + url,params).pipe(
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

   /* Ver Permisos Módulo Especifico*/
   verPermisosModulosEsp( url?:string, params?:any){
    let request$ = this.http.post<DataApi>(environment.UrlApi + url,params).pipe(
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

     /* Eliminar permisos sobre Módulo*/
     eliminarPermisosModulos( url?:string, params?:any){
      let request$ = this.http.delete<DataApi>(environment.UrlApi + url ,  {body:params}).pipe(
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
      return request$;
    }

        /* Insertar permisos sobre Módulo*/
        insertarPermisosModulos( url?:string, params?:any){
          let request$ =  this.http.post<DataApi>(environment.UrlApi + url ,  params ) .pipe(
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
          return request$;
        }


        /* SERVICIOS PARA MENUS PADRES */

        /* Insertar Menú Padre */ 
  insertarMenuPadre( url?:string, params?:any){
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




         /* Editar Menu Padre */ 
  editarMenuPadre( url?:string, params?:any){
    let request$ = this.http.put<DataApi>(environment.UrlApi + url , params).pipe(
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

       /* Eliminar Menú */
       eliminarMenu( url?:string, params?:any){
        let request$ = this.http.delete<DataApi>(environment.UrlApi + url ,  {body:params}).pipe(
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
        return request$;
      }

              /* SERVICIOS PARA MENUS PADRES */

             /* SERVICIOS PARA MENUS HIJOS */

             verHijos( url?:string, params?:any){
              let request$ = this.http.post<DataApi>(environment.UrlApi + url,params).pipe(
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

                   /* Insertar menú hijo*/
        insertarMenuHijo( url?:string, params?:any){
          let request$ =  this.http.post<DataApi>(environment.UrlApi + url ,  params ) .pipe(
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
          return request$;
        }


                    /* Actualizar menú hijo*/
        actualizarMenuHijo( url?:string, params?:any){
          let request$ =  this.http.post<DataApi>(environment.UrlApi + url ,  params ) .pipe(
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
          return request$;
                    }

         /* Insertar permisos sobre Menú*/
         insertarPermisosMenu( url?:string, params?:any){
          let request$ =  this.http.post<DataApi>(environment.UrlApi + url ,  params ) .pipe(
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
          return request$;
        }

     /* Actualizar permisos sobre Menú*/
          actualizarPermisosMenu( url?:string, params?:any){
            let request$ =  this.http.put<DataApi>(environment.UrlApi + url ,  params ) .pipe(
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
            return request$;
          }


 /* Actualizar permisos sobre Menú*/
 validarRol( url?:string, params?:any){
  let request$ =  this.http.post<DataApi>(environment.UrlApi + url ,  params ) .pipe(
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

 // Servicio de Visualización 
 get( url?:string, params?:any){
  
  let request$ = this.http.get<DataApi>(environment.UrlApi + url,params).pipe(
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





      /* SERVICIOS PARA MENUS HIJOS */
        
}
