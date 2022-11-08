import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceLocal {

  conf = {
    timeOut: 3000,
    progressBar : true,
    closeButton : true
  };
  constructor( private toastr: ToastrService ) { }

  mensajeSuccess(texto: string, titulo: string, config?: Object) {
    this.toastr.success(texto, titulo, this.conf );
  }

  // mensajeLoading(texto: string, titulo: string, config?: Object){
  //   this.toastr.success(texto, titulo,
  //      { toastComponent: LoadingToastComponent, timeOut: 500000})
  // }

  mensajeBienvenida(texto: string, titulo: string, config?: Object) {
    this.toastr.success(texto, titulo, this.conf)
  }

  mensajeError(texto: string, titulo: string, config?: Object) {
    this.toastr.error(texto, titulo, this.conf);
  }

  mensajeWarning(texto: string, titulo: string, config?: Object) {
    this.toastr.warning(texto, titulo, this.conf);
  }

  mensajeInfo(texto: string, titulo: string, config?: Object) {
    this.toastr.info(texto, titulo, this.conf);
  }

  clearToasts() {
    this.toastr.clear();
  }
}
