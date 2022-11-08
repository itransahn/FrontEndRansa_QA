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
import { CcoService } from './cco.service';
import { ModalCcoComponent } from './modal-cco/modal-cco.component';

@Component({
  selector: 'app-cco',
  templateUrl: './cco.component.html',
  styleUrls: ['./cco.component.scss']
})
export class CcoComponent implements OnInit {
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
  public parametrosBusqueda = ['cco','codigo_cco'];
  public dataCcos : any[] = [];
  constructor( 
    private paginator : MatPaginatorIntl,
    public auth  : AuthService, 
    private ccoS  : CcoService ,
    public dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal
    ) { }

  ngOnInit(): void {
    this.CargarInicio();
    this.cargarCcos();
    this.ccoS.refresh$.subscribe ( res=>  this.cargarCcos() )
  }



  CargarInicio(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
  }

  cargarCcos(){
    let url = 'administracion/cco';
    let params = {};
    this.ccoS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.dataCcos = data?.data?.Table0;
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


    ModalCco ( accion : number, dataRol ?: any ){
      const dialogReg = this.dialog.open( ModalCcoComponent,{
        width :   'auto',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera   : accion,
          idCco     : dataRol?.id_cco,
          cco       : dataRol?.cco,
          codigocco : dataRol?.codigo_cco
        },
        disableClose : true
      })
    }

eliminarCco(  idCco : number, cco ?: string ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el CCO ${ cco }?`, `Eliminación de CCO`,"question").then(
        res=>{
            if ( res ){
                  let url    = 'administracion/cco';
                  let params = {
                    idCco : idCco
                  } 
                  this.ccoS.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarCcos()
                    }
                    }
                  )
            }else{ }
        }
      )
    }

}
