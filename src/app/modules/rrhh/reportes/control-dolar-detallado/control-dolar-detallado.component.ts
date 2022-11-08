import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../../rrhh.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Acumulador } from 'src/app/interfaces/generales';
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
  selector: 'app-control-dolar-detallado',
  templateUrl: './control-dolar-detallado.component.html',
  styleUrls: ['./control-dolar-detallado.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ControlDolarDetalladoComponent implements OnInit {

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
 public pageSize   =  50;
  constructor(
    private paginator : MatPaginatorIntl,
    public  rrhhS     : RrhhService,
    public  dialog    : MatDialog, 
    private sweel     : SweetAlertService,
    private toast     : ToastServiceLocal,
    private sharedS   : SharedService
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
        let url = 'rrhh/dolarDetalle';
        let params = { 
          desde : this.filtro.value.desde ,
          hasta : this.filtro.value.hasta
         }
        this.rrhhS.post( url, params ).subscribe (
          ( res : DataApi | any)=>{
            if( !res.hasError ){
              this.loading = true;
              this.dolares = res?.data?.Table0;
              this.subTotal =  Acumulador( this.dolares, 'Dolar' )

                    }
          }
        )
      }


  // sacarTotal( arreglo ?: any[]){
  //   this.subTotal = 0;
  //   for( let i = 0; i < arreglo.length; i++){
  //     this.subTotal += arreglo[i]['Dolar']
  //   // console.log(arreglo[i]['TOTAL'])

  //   }
  // }

}
