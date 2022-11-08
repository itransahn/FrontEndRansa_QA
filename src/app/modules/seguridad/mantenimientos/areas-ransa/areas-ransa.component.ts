import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { CcoService } from '../cco/cco.service';
import { AreasService } from './areas.service';
import { ModalAreasComponent } from './modal-areas/modal-areas.component';

@Component({
  selector: 'app-areas-ransa',
  templateUrl: './areas-ransa.component.html',
  styleUrls: ['./areas-ransa.component.scss']
})
export class AreasRansaComponent implements OnInit {
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
  public parametrosBusqueda = ['area'];
  public dataAreaRansa : any[] = [];
  constructor( 
    private paginator : MatPaginatorIntl,
    private areaS     : AreasService,
    public auth       : AuthService,
    private dialog    : MatDialog, 
    private sweel  : SweetAlertService,
    private toast  : ToastServiceLocal ) { }

  ngOnInit() {
      this.CargarInicio();
      this.cargarAreas();
      this.areaS.refresh$.subscribe( res=>  this.cargarAreas() )
  }

  CargarInicio(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
  }
  cargarAreas(){
    let url = 'administracion/area';
    let params = {};
    this.areaS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.dataAreaRansa = data?.data?.Table0;
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


    ModalArea ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalAreasComponent,{
        width :   '1000px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera   : accion,
          idArea     : data?.id_areaDeOperacion,
          area       : data?.area,
        },
        disableClose : true
      })
    }
    

    eliminarArea(  idArea : number, area ?: string ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar área ${ area }?`, `Eliminación de CCO`,"question").then(
        res=>{
            if ( res ){
                  let url    = 'administracion/area';
                  let params = {
                    idArea : idArea
                  } 
                  this.areaS.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarAreas()
                    }
                    }
                  )
            }else{ }
        }
      )
    }

}
