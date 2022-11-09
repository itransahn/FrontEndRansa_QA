import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../rrhh.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormMantenimientoDolarComponent } from './form-mantenimiento-dolar/form-mantenimiento-dolar.component';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
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
  selector:    'app-mantenimiento-canjeo',
  templateUrl: './mantenimiento-canjeo.component.html',
  styleUrls: [ './mantenimiento-canjeo.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class MantenimientoCanjeoComponent implements OnInit {

  public flat  : boolean = false;
  public filtro: FormGroup;

  public parametrosBusqueda = ['USUARIO', 'Nombre', 'Departamento'];
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
    public rrhhS : RrhhService,
    public dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal,
    private auth  : AuthService 
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
        let url = 'rrhh/controlCafeteria';
        let params = { 
            tipo  : 1,
            fecha : ''
         }
        this.rrhhS.put( url, params ).subscribe (
          ( res : DataApi | any)=>{
            if( !res.hasError ){
              this.loading = true;
              this.canjeos = res?.data?.Table0;
                    }
          }
        )
        } else {
          this.fecha = this.filtro.value.filtrar;
        let url = 'rrhh/controlCafeteria';
        let params = {  
          tipo  : 2,
          fecha : this.filtro.value.filtrar
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


eliminacion(  idControl ?: number ,colaborador?:string, usuario ?: string){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el canjeo de dolar de  ${ colaborador }?`, `Eliminación de Canjeo de dolar`,"warning").then(
        res=>{
            if ( res ){
                  let url    = '/rrhh/DelcontrolCafeteria';
                  let params = {
                    idControl : idControl,
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
      const dialogReg = this.dialog.open( FormMantenimientoDolarComponent,{
        width :   'auto',
        height:   'auto',
        maxWidth: 'auto',
        data: data,
        disableClose : true
      })
    }


}
