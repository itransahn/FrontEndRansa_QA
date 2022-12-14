import { Injectable } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

// Importaciones para PDF 
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ToastServiceLocal } from 'src/app/services/toast.service';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public fecha = new Date().toLocaleDateString()
  constructor( private sweel:SweetAlertService,
    private toast: ToastServiceLocal) { }

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
  //PDF FACTURA
  pdfFactura( id?:string, NombreFinal ?: string, detalle?: string, titulo ?: string, data?:any){
    this.sweel.mensajeConConfirmacion(`¿${titulo}?`, `${detalle}`,"warning").then(
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
    docResult.save(`${NombreFinal}.pdf`);
    this.pdfFacturaD('cliente',data['numeroFactura']+'FACCliente', 'Seguro','PDF' )
    this.pdfFacturaD('archivo',data['numeroFactura']+'FACArchivo', 'Seguro','PDF' )

    this.toast.mensajeSuccess("Documento generado correctamente","Generación de PDF")
    return true;
  });
          }else{
            
           }
      }
    )
}

  //PDF
  pdfNotas( id?:string, NombreFinal ?: string, detalle?: string, titulo ?: string, data?:any){
    this.sweel.mensajeConConfirmacion(`¿${titulo}?`, `${detalle}`,"warning").then(
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
    docResult.save(`${NombreFinal}.pdf`);

    if(data['tipo'] == 'ND'){
      this.pdfFacturaD('segunda',data['numeroFactura']+'NDCliente', 'Seguro','PDF' )
      this.pdfFacturaD('tercera',data['numeroFactura']+'NDArchivo', 'Seguro','PDF' )
      this.toast.mensajeSuccess("Documento generado correctamente","Generación de PDF")
      return true;
    }else{
      this.pdfFacturaD('segundaNC',data['numeroFactura']+'NCCliente', 'Seguro','PDF' )
      this.pdfFacturaD('terceraNC',data['numeroFactura']+'NCArchivo', 'Seguro','PDF' )
      this.toast.mensajeSuccess("Documento generado correctamente","Generación de PDF")
      return true;
    }
  });
          }else{
            
           }
      }
    )
}

  //PDF
  pdfFacturaD( id?:string, NombreFinal ?: string, detalle?: string, titulo ?: string) {
             // Extraemos el
  const DATA = document.getElementById(id);
  const doc = new jsPDF('p', 'pt', 'Letter');
  const options = {
               background: 'white',
               color     : 'black',
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
    docResult.save(`${NombreFinal}.pdf`);
  });
      
      }
   


  //IMPRIMIR
  printComponent(idName) { 
    this.sweel.mensajeConConfirmacion(`¿Seguro de imprimir documento?`, `Factura`,"warning").then(
    res=>{
        if( res  ){
          // let printContents = document.getElementById(idName).innerHTML;
          // let originalContents = document.body.innerHTML;
          // document.body.innerHTML = printContents;
          // document.write(originalContents.toString())
          // window.print(); 
          // document.body.innerHTML = originalContents;
          // window.close();


          // let printContents, popupWin;
          // printContents = document.getElementById(idName).innerHTML;
          // // printContents = (<string>printContents + "").replace("col-sm", "col-xs");
          // // console.log(printContents);
          // popupWin = window.open("", "", "top=0,left=0,height=100%,width=auto");
          // popupWin.document.open();
          // popupWin.document.write(document.body.innerHTML.toString())
          // popupWin.document.close();


          // const printContent = document.getElementById(idName);
          // const WindowPrt = window.open('', '', 'left=0,top=0,width=auto,height=auto,toolbar=0,scrollbars=0,status=0');
          // WindowPrt.document.write(printContent.innerHTML);
          // WindowPrt.document.close();
          // WindowPrt.focus();
          // WindowPrt.print();
          // WindowPrt.close();


          let popupWin = window.open('', '_blank', 'width=1080,height=595');
          let printContents = document.getElementById(idName).innerHTML;
          let printHead = document.head.innerHTML;
          popupWin.document
              .write(`<html>
               ${printHead}
              <body onload="window.print();">${printContents}</body></html>`);
          popupWin.document.close();


        }
    } ) 
 }

 CalcularTotal(arreglo ?: any[], valor ?:string){
  let subTotal
    for( let i = 0; i < arreglo.length; i++){
      subTotal += arreglo[i][valor]
    }
    return subTotal;
 }

}
