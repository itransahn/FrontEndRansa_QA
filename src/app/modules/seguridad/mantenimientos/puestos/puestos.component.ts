import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ModalPuestosComponent } from './modal-puestos/modal-puestos.component';
import { PuestoService } from './puesto.service';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.scss']
})
export class PuestosComponent implements OnInit {
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
 public parametrosBusqueda = ['puestoRansa'];
 public dataPuestos : any[] = [];
  constructor( 
    private paginator : MatPaginatorIntl, 
    public  auth    : AuthService, 
    private puestoS : PuestoService ,
    public  dialog : MatDialog,
    private sweel  : SweetAlertService,
    private toast  : ToastServiceLocal
  ) { }

  ngOnInit(){
    this.CargarInicio();
    this.cargarPuestos();
    this.puestoS.refresh$.subscribe( res=> this.cargarPuestos() )
  }

  

  CargarInicio(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
  }

  cargarPuestos(){
    let url = 'administracion/puesto';
    let params = {};
    this.puestoS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.dataPuestos = data?.data?.Table0;
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


    ModalPuesto ( accion : number, dataPuesto ?: any ){
      const dialogReg = this.dialog.open( ModalPuestosComponent,{
        width :   '850px',
        height:   'auto',
        maxWidth: '850px',
        data: { 
          bandera      : accion,
          idPuesto     : dataPuesto?.id_puesto,
          puestoRansa  : dataPuesto?.puestoRansa,
        },
        disableClose : true
      })
    }

eliminarPuesto(  idPuesto : number, puesto ?: string ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el puesto ${ puesto }?`, `Eliminación de puesto`,"question").then(
        res=>{
            if ( res ){
                  let url    = 'administracion/cco';
                  let params = {
                    idPuesto : idPuesto
                  } 
                  this.puestoS.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarPuestos()
                    }
                    }
                  )
            }else{ }
        }
      )
    }
}
