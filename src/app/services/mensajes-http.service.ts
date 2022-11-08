import { Injectable } from '@angular/core';
import { DataApi } from '../interfaces/dataApi';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { ToastServiceLocal } from './toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MensajesHttpService {

  constructor(
    private _toastrService:ToastServiceLocal
  ) { }

  private mensajeError = new BehaviorSubject<string>('');

  private configToastr={
    timeOut:4000,
    closeButton:true,
    progressBar:true
   }


  public filtarDataCorrecta(data: DataApi) {
    if (!data.hasError) {
      return data.data.Table0;
    } else {
      return [];
    }
  }

  public filtarSoloTablas(data:DataApi){
      if(!data.hasError){
          return data.data;
      }else{
        return [];
      }
  }

  public mensajeErrorHttp(mensaje:string,fuenteError?:string){
      return `${mensaje} ${fuenteError}`;
  }


  public mensajeHasData(data:any[],mensajeMostrar:string){
        if(data.length===0){
           this._toastrService.mensajeWarning(mensajeMostrar,'Mensaje',this.configToastr);
        }
  }


  public mostrarErrorHttp(err:HttpErrorResponse,mensajeError:string,fuenteError:string){

    if (err.status !== 401) {

      let { error}=err;
      if (error.errors === undefined) {
        this._toastrService.mensajeError(`Ocurrio un error interno, comuniquese con el administrador`, 'Error', this.configToastr);
        this.mensajeError.next('Ocurrio un error interno, comuniquese con el administrador');
        return
      }
      const errorBase=error?.errors[0].descripcion;

      // this.sweetAlertService.mensajeSimple('Error',`${mensajeError} ${fuenteError}`,'error');
      if( 'errors' in error &&  error?.errors[0]?.criticidad === ''){
        this._toastrService.mensajeError(`${errorBase} `,'Error',this.configToastr);
        return;
      }
      if( 'errors' in error &&  Number(error?.errors[0]?.criticidad) === 2100){
        this._toastrService.mensajeError(`${errorBase} `,'Error',this.configToastr)
      }
      else if('errors' in error &&  Number(error?.errors[0]?.criticidad) === 1000){
       this._toastrService.mensajeError(`Ocurrio un error, verifique su conexión a internet, o de persistir el error comuniquese con el administrador`,'Error',this.configToastr);

      }
      else if('errors' in error &&  Number(error?.errors[0]?.criticidad) === 5000){
        this._toastrService.mensajeError(`${errorBase} `,'Error',this.configToastr)
       }else{
        this._toastrService.mensajeError(`${mensajeError} ${fuenteError}`,'Error',this.configToastr);
        this.mensajeError.next(`${errorBase}`);
      }
    }
  }

  public mostrarErrorHttpString(err: HttpErrorResponse, mensajeError: string, fuenteError?: string): string {
    let errorString: string = '';
    if (err.status !== 401) {

      let { error } = err;
      if (error.errors === undefined) {
        errorString = 'Ocurrio un error interno, comuniquese con el administrador';
        return errorString;
      }
      const errorBase = error?.errors[0]?.descripcion;
      if ('errors' in error && Number(error?.errors[0]?.criticidad) === 2100) {
        errorString = errorBase;
      } else if ('errors' in error && Number(error?.errors[0]?.criticidad) === 1000) {
        errorString = 'Ocurrio un error, verifique su conexión a internet, o de persistir el error comuniquese con el administrador';

      } else if ('errors' in error && Number(error?.errors[0]?.criticidad) === 5000) {
        errorString = errorBase;
      } else {
        error = mensajeError;
      }
    }
    return errorString;
  }

  public obtenerMensajeError = (): Observable<string> => this.mensajeError.asObservable();
}
