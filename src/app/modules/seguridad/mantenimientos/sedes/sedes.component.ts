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
import { ModalSedesComponent } from './modal-sedes/modal-sedes.component';
import { SedeService } from './sede.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit {
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
  public parametrosBusqueda = ['sedeRansa'];
  public dataSede : any[] = [];
  constructor( 
     private paginator : MatPaginatorIntl, 
     public  auth   : AuthService, 
     private sedeS  : SedeService,
     private dialog : MatDialog ,
     private sweel : SweetAlertService,
     private toast : ToastServiceLocal ) { }

  ngOnInit(){
      this.CargarInicio();
      this.cargarSedes()
    this.sedeS.refresh$.subscribe( res=>  this.cargarSedes() )
  }

  CargarInicio(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
    
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

  }

  cargarSedes(){
    let url = 'administracion/sede';
    let params = {};
    this.sedeS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.dataSede = data?.data?.Table0;
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

    ModalSede ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalSedesComponent,{
        width :   '1000px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera   : accion,
          idSede     : data?.id_sedeRansa,
          sede       : data?.sedeRansa
        },
        disableClose : true
      })
    }


    eliminarSede(  idSede : number, sede ?: string ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar sede ${ sede }?`, `Eliminación de Sede`,"question").then(
        res=>{
            if ( res ){
                  let url    = 'administracion/sede';
                  let params = {
                    idSede : idSede
                  } 
                  this.sedeS.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarSedes()
                    }
                    }
                  )
            }else{ }
        }
      )
    }
  
}
