import { Component, OnInit } from '@angular/core';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { mensajes } from 'src/app/interfaces/generales';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { RrhhService } from '../../rrhh.service';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { DataApi } from 'src/app/interfaces/dataApi';
import { FormMantenimientoCreComponent } from './form-mantenimiento-cre/form-mantenimiento-cre.component';
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
  selector: 'app-mantenimientocredito',
  templateUrl: './mantenimientocredito.component.html',
  styleUrls: ['./mantenimientocredito.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class MantenimientocreditoComponent implements OnInit {
  
  public flat  : boolean = false;
  public filtro: FormGroup;

  public parametrosBusqueda = ['Usuario', 'Colaborador'];
  public canjeos : any[] = [];
  public loading : boolean = false

  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 50;
  public fecha = new Date()
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize   = 50;
  constructor(
    private paginator : MatPaginatorIntl,
    public rrhhS      : RrhhService,
    public dialog     : MatDialog, 
    private sweel     : SweetAlertService,
    private toast     : ToastServiceLocal 
  ) { }

  ngOnInit() {
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'', disabled: false}),
      buscar : new FormControl({ value:'', disabled: false})
    })
    this.CargarCanjeos(1);

    this.rrhhS.refresh$.subscribe(
      res=>{
      this.CargarCanjeos(1)
      }
    )
  }

//Paginación de la tabla
next(event: PageEvent) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.desde = this.desde + this.pageSize;
      this.hasta = this.hasta + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.desde = this.desde - this.pageSize;
      this.hasta = this.hasta - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

/* JUGAR CON EL TIPO PARA SABER SI TENGO O NO PARAMETROS / SINO QUE CARGUE POR DEFAULT LA DATA */ 
  CargarCanjeos( tipo ?: number ){
    if ( tipo == 1 ){
      this.fecha = new Date()
      let url = 'rrhh/creditos';
      let params = {   }
      this.rrhhS.get( url, params ).subscribe (
        ( res : DataApi | any)=>{
          if( !res.hasError ){
            this.loading = true;
            this.canjeos = res?.data?.Table0;
                  }
        }
      )
    } else {
        this.fecha = this.filtro.value.filtrar;
      let url = 'rrhh/creditos';
      let params = {  
        tipo  : 2,
        date : this.filtro.value.filtrar
      }
      this.rrhhS.put( url, params ).subscribe (
        ( res : DataApi | any)=>{
          if( !res.hasError ){
            this.loading = true;
            this.canjeos = [];
            this.canjeos = res?.data?.Table0;
          }
        }
      )
    }
  }


eliminacion(  idControl ?: number ,colaborador?:string, usuario ?: string, monto ?: string){
    this.sweel.mensajeConConfirmacion(`¿Seguro de eliminar el crédito del empleado  ${ colaborador }?`, `Eliminación de crédito`,"warning").then(
      res=>{
          if ( res ){
                let url    = '/rrhh/Dcreditos';
                let params = {
                  idCredito : idControl,
                  usuario   : usuario
                } 
                this.rrhhS.delete(url, params).subscribe(
                  res=>{
                    if ( res?.data.Table0[0]['codigo'] == -1 ){
                      this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']),   mensajes.warning)
                  }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.CargarCanjeos(1);
                  }
                  }
                )
          }else{ }
      }
    )
  }

  
  Modal ( data ?: any ){
    const dialogReg = this.dialog.open( FormMantenimientoCreComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: 'auto',
      data: data,
      disableClose : true
    })
  }
}
