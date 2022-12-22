import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../transporte.service';
import { ModalProComponent } from './modal-pro/modal-pro.component';

@Component({
  selector: 'app-trans-proveedor',
  templateUrl: './trans-proveedor.component.html',
  styleUrls: ['./trans-proveedor.component.scss']
})
export class TransProveedorComponent implements OnInit {
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 50;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 50;
  public filter :string  = '';
  public filtro: FormGroup;
  public parametrosBusqueda = ['Proveedor', 'Transporte'];
  public proveedores : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl,  
    public dialog : MatDialog, 
    private transporteService : TransporteService, 
    public toast  :ToastServiceLocal,
    public sweel : SweetAlertService
  ) { }

  ngOnInit() {  
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarRelacion();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarRelacion()
      }
    )
  }

  cargarRelacion(){
    let url = 'transporte/transProveedor';
    let params = {};
    this.transporteService.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.proveedores = data?.data?.Table0;
          console.log(this.proveedores)
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

    eliminarRelacion(  transporte?:string ,proveedor?:number){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el permiso?`, `Eliminación de Permiso`,"question").then(
        res=>{
            if ( res ){
                  let url    = '/transporte/proveedorTransporte';
                  let params = {
                    transporte : transporte,
                    proveedor : proveedor,
                  } 
                  this.transporteService.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarRelacion()
                    }
                    }
                  )
            }else{ }
        }
      )
    }

    Modal ( accion : number, dataRol ?: any ){
      const dialogReg = this.dialog.open( ModalProComponent,{
        width :   '1000px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera : accion
        },
        disableClose : true
      })
    }


}
