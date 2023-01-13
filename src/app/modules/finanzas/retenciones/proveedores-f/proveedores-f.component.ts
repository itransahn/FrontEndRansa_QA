import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../facturacion.service';
import { ModalproveedorfComponent } from './modalproveedorf/modalproveedorf.component';

@Component({
  selector: 'app-proveedores-f',
  templateUrl: './proveedores-f.component.html',
  styleUrls: ['./proveedores-f.component.scss']
})
export class ProveedoresFComponent implements OnInit {
 //Paginacion
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
 public parametrosBusqueda = ['proveedor', 'RTN'];
 public data : any[] = [];
 private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public administracion: AdministracionService, 
    public dialog : MatDialog, 
    public servicio : FacturacionService,
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal

  ) { }

  ngOnInit(): void {

    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
 
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
 
    this.cargarData();
 
    this.sub = this.servicio.refresh$.subscribe(
      res=>{
         this.cargarData()
      }
    )
 
  }


  
 ngOnDestroy()  {
  this.sub.unsubscribe()
}


cargarData(){
let url = 'finanzas/proveedores';
let params = {};

this.servicio.get(url,params).subscribe(
  (data : DataApi | any) =>{
    if( !data.hasError ){
      this.data = data?.data?.Table0;
    }    
  }

)
}



CambiarEstado(idProveedor ?: number, estado?: number){
  let url = 'finanzas/Eproveedores';
  let params = {
    idProveedor: idProveedor,
    estado   : estado
  };
  this.servicio.post(url, params).subscribe( data =>{
    if( !data.hasError ){
            this.cargarData()
    }
  })
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



  Modal ( accion : number, data ?: any ){
    const dialogReg = this.dialog.open( ModalproveedorfComponent ,{
      width :   'auto',
      height:   'auto',
      minWidth : '600px',
      data: { 
        bandera : accion,
        data : data 
        },
      disableClose : true
    })
  }



}
