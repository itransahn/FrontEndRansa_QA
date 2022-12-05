import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Acumulador, mensajes } from 'src/app/interfaces/generales';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { RrhhService } from '../../rrhh.service';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { DataApi } from 'src/app/interfaces/dataApi';
import html2canvas from 'html2canvas';
import { SharedService } from 'src/app/modules/shared/shared.service';
// import { jsPDF } from "jspdf";

const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-control-dolar-cco',
  templateUrl: './control-dolar-cco.component.html',
  styleUrls: ['./control-dolar-cco.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ControlDolarCCOComponent implements OnInit {
   public filtro  : FormGroup;
   public loading : boolean = false;
   public dolares : any[];
   public subTotal = 0;
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desdeF = 0;
  public hastaF= 50;
  public fecha = new Date()
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize   = 50;
  constructor(
    private paginator : MatPaginatorIntl,
    public  rrhhS : RrhhService,
    public  dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal,
    public  sharedS : SharedService
  ) { }

  ngOnInit() {
    this.cargarForm()
  }

  cargarForm(){
    this.filtro = new FormGroup({
      desde :     new FormControl({ value:'', disabled: false}, [ Validators.required]),
      hasta :     new FormControl({ value:'', disabled: false}, [ Validators.required])
    })
  }

    //Paginación de la tabla
    next(event: PageEvent) {

      if (event.pageIndex === this.pageIndex + 1) {
        this.desdeF = this.desdeF + this.pageSize;
        this.hastaF = this.hastaF + this.pageSize;
      }
      else if (event.pageIndex === this.pageIndex - 1) {
        this.desdeF = this.desdeF - this.pageSize;
        this.hastaF = this.hastaF - this.pageSize;
      }
      this.pageIndex = event.pageIndex;
    }


/* Cargar Canjeos*/ 
    CargarCanjeos(  ){
        this.fecha = new Date()
        let url = 'rrhh/dolarCCO';
        let params = { 
          desde : this.filtro.value.desde ,
          hasta : this.filtro.value.hasta
         }
        this.rrhhS.post( url, params ).subscribe (
          ( res : DataApi | any)=>{
            if( !res.hasError ){
              this.loading = true;
              this.dolares = res?.data?.Table0;
              this.subTotal =  Acumulador( this.dolares, 'COSTO' )
                    }
          }
        )
      }


  // sacarTotal( arreglo ?: any[]){
  //   this.subTotal = 0;
  //   for( let i = 0; i < arreglo.length; i++){
  //     this.subTotal += arreglo[i]['COSTO']
  //   }
  // }
   



//   downloadPDF() {

//     this.sweel.mensajeConConfirmacion(`¿Seguro de descargar documento?`, `Factura control de Dolar`,"question").then(
//       res=>{
//           if ( res ){
//              // Extraemos el
//   const DATA = document.getElementById('Factura');
//   const doc = new jsPDF('p', 'pt', 'a4');
//   const options = {
//                background: 'white',
//                scale: 3
//                   };
// html2canvas(DATA, options).then((canvas) => {
//   const img = canvas.toDataURL('image/PNG');
//   // Add image Canvas to PDF
//   const bufferX = 15;
//   const bufferY = 15;
//   const imgProps = (doc as any).getImageProperties(img);
//   const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
//   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//   doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
//   return doc;
//   }).then((docResult) => {
//     docResult.save(`${new Date().toISOString()}_facturaCCO.pdf`);
//   });
//           }else{

//            }
//       }
//     )

// }


}


  
  

