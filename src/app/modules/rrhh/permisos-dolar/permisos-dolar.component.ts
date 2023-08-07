import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../rrhh.service';
import { ModalPermisosComponent } from './modal-permisos/modal-permisos.component';

@Component({
  selector: 'app-permisos-dolar',
  templateUrl: './permisos-dolar.component.html',
  styleUrls: ['./permisos-dolar.component.scss']
})
export class PermisosDolarComponent implements OnInit {
  
  public flat  : boolean = false;
  public filtro: FormGroup;

  public parametrosBusqueda = ['USUARIO', 'NOMBRE', 'Departamento'];
  public permisos : any[] = [];

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
    public  auth  : AuthService
  ) { }

  ngOnInit(){
    this.CargarPermisos()

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.rrhhS.refresh$.subscribe(
      res=>{
         this.CargarPermisos()
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

  CargarPermisos( ){
    let url = 'rrhh/usuariosPermitidosC';
    let params = {  }
    this.rrhhS.get( url, params ).subscribe (
      ( res : DataApi | any)=>{
        if( !res.hasError ){
          this.permisos = res?.data?.Table0;
        }
      }
    )

  }

  
  permisosCafeteria( idPermiso ?: number, estado ?: number ){
    let url = 'rrhh/estadoPcaf';
    let params = { 
          idPermiso : idPermiso ,
          estado    : estado
     }

    this.rrhhS.put( url, params ).subscribe (
      ( res : DataApi | any)=>{
        if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
            this.CargarPermisos()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
      }
    )
  }

  ModalPermisos ( accion : number, dataRol ?: any ){
    const dialogReg = this.dialog.open( ModalPermisosComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: 'auto',
      data: { 
        bandera      : accion,
        idPermiso    : dataRol?.CONTROL,
        usuarioRansa : dataRol?.USUARIO,
        colaborador  : dataRol?.NOMBRE,
        cco          : dataRol?.id_cco,
        sede         : dataRol?.sede
      },
      disableClose : true
    })
  }


}
