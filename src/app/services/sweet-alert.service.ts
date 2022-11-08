import { Injectable } from '@angular/core';
import Swal from "sweetalert2";



type opcSweet = "success" | "error" | "warning" | "info" | "question";


interface moreOption{
    tipoColor?:number;
    background?:string;
}
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  /*TIPO COLOR 
    1) color principal
    2) color Actualizar
    3) color eliminar
  
  
  */

    private buttonPrincipalColor:string='#563d7c';
    private buttonActualizarColor:string='#563d7c';
    private buttonEliminarColor:string='#';
    private defaultOptions:moreOption;

  constructor() {
    this.buttonPrincipalColor='#563d7c';
    this.buttonActualizarColor='#1e88e5';
    this.buttonEliminarColor='#d33';
    this.defaultOptions={
      tipoColor:1,
      background:''
    }
   }

   
  //SA normal
  mensajeSimple(titulo: string, texto: string, tipo: opcSweet) {
    Swal.fire(titulo.toUpperCase(), texto.toUpperCase(), tipo);
  }
//SA con tiempo
  mensajeControlado(titulo: string, timer: number) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: titulo,
      showConfirmButton: false,
      timer: timer
    })
  }

  //Mensaje con confirmacion
  mensajeConConfirmacion(
    titulo: string,
    texto: string,
    icono: opcSweet,
    options:moreOption =this.defaultOptions
  ): Promise<boolean> {

   
    let colorBoton:string;

    switch (options.tipoColor) {
      case 1:
        colorBoton= this.buttonPrincipalColor;
        break;
      case 2:
        colorBoton= this.buttonActualizarColor;
        break;
      case 3:
        colorBoton= this.buttonEliminarColor;
        break;
      default:
        colorBoton=this.buttonPrincipalColor;
        break;
    }

    return new Promise((resolve, reject) => {


      Swal.fire({
        title: `${titulo.toUpperCase()}`,
        text: `${texto.toUpperCase()}`,
        icon: icono,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        confirmButtonColor: (options.background !=null) ? options.background : colorBoton,
        allowOutsideClick:false,
        reverseButtons:true
         
        //cancelButtonColor: '#d33',
        //confirmButtonText: 'Yes, delete it!'
      }).then((result:any) => {
        if (result.value) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }



  mensajeError( texto: string){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: texto,
    })
  }
}
