import { Injectable } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

// Importaciones para PDF 
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public fecha = new Date().toLocaleDateString()
  constructor( private sweel:SweetAlertService) { }

    //PDF
    downloadPDF( id?:string, NombreFinal ?: string, detalle?: string, titulo ?: string) {
      this.sweel.mensajeConConfirmacion(`¿${titulo}?`, `${detalle}`,"question").then(
        res=>{
            if ( res ){
               // Extraemos el
    const DATA = document.getElementById(id);
    const doc = new jsPDF('p', 'pt', 'Letter');
    const options = {
                 background: 'white',
                 scale: 3,
                 format: [4, 2]
                    };
  html2canvas(DATA, options).then((canvas) => {
    const img = canvas.toDataURL('image/PNG');
    // Add image Canvas to PDF
    const bufferX = 15;
    const bufferY = 15;
    const imgProps = (doc as any).getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    return doc;
    }).then((docResult) => {
      docResult.save(`${this.fecha.toString()}${NombreFinal}.pdf`);
    });
            }else{
              
             }
        }
      )
  }

  //IMPRIMIR
  printComponent(idName) { 
    let printContents = document.getElementById(idName).innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
 }


 CalcularTotal(arreglo ?: any[], valor ?:string){
  let subTotal
    for( let i = 0; i < arreglo.length; i++){
      subTotal += arreglo[i][valor]
    }
    return subTotal;
 }

}
