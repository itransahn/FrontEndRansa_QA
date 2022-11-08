import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ModalSangreComponent } from './modal-sangre/modal-sangre.component';
import { TipoSangreService } from './tipo-sangre.service';

@Component({
  selector: 'app-tipo-sangre',
  templateUrl: './tipo-sangre.component.html',
  styleUrls: ['./tipo-sangre.component.scss']
})
export class TipoSangreComponent implements OnInit {
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 10;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 10;
  public filter :string  = '';
  public filtro: FormGroup;
  public parametrosBusqueda = ['tipoSangre'];
  public dataSangre : any[] = [];

  constructor( 
    private paginator : MatPaginatorIntl, 
    public  auth : AuthService, 
    private sangreS : TipoSangreService,
    private dialog : MatDialog,
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal ) { }


  ngOnInit() {
       this.CargarInicio();
       this.cargarSangre();
       this.sangreS.refresh$.subscribe(
        res=>{
          this.cargarSangre()
        }
       )
  }

  
  CargarInicio(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
  }

  cargarSangre(){
    let url = 'administracion/sangre';
    let params = {};
    this.sangreS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.dataSangre = data?.data?.Table0;
        }    
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

    ModalSangre ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalSangreComponent,{
        width :   '1000px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera     : accion,
          tipoSangre  : data?.id_tipoSangre,
          sangre      : data?.tipoSangre
        },
        disableClose : true
      })
    }

    
    eliminarSangre(  idTipo : number, sangre ?: string ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar tipo de sangre ${ sangre }?`, `Eliminación de tipo de sangre`,"question").then(
        res=>{
            if ( res ){
                  let url    = 'administracion/sangre';
                  let params = {
                    idtipo : idTipo
                  } 
                  this.sangreS.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarSangre()
                    }
                    }
                  )
            }else{ }
        }
      )
    }


}
