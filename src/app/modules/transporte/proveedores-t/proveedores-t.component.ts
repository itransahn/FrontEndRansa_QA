import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AuthService } from 'src/app/services/auth.service';
import { TransporteService } from '../transporte.service';
import { ModalProveedoresTComponent } from './modal-proveedores-t/modal-proveedores-t.component';

@Component({
  selector: 'app-proveedores-t',
  templateUrl: './proveedores-t.component.html',
  styleUrls: ['./proveedores-t.component.scss']
})
export class ProveedoresTComponent implements OnInit {
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
  public parametrosBusqueda = ['Proveedor', 'Cliente','Corto','cco','Sede'];
  public proveedores : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl,  
    public dialog     : MatDialog, 
    private transporteService : TransporteService, 
  ) { }

  ngOnInit() {  
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarCamiones();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarCamiones()
      }
    )
  }
  
  ngOnDestroy()  {
    this.sub.unsubscribe()
}

cargarCamiones(){
  let url = 'transporte/proveedoresT';
  let params = {
    tipo : 0
  };
  this.transporteService.post(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.proveedores = data?.data?.Table0;
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

    CambiarEstado(id ?: number, estado?: number){
      let url = 'transporte/cambiarEstado';
      let params = {
        id: id,
        estado   : estado,
        tabla : 5
      };
      this.transporteService.post(url, params).subscribe( data =>{
        if( !data.hasError ){
                this.cargarCamiones()
        }
      })
    }



          
    Modal ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalProveedoresTComponent,{
        width :   '500px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
        bandera : accion,
         ID         : data?.ID,
         Proveedor    : data?.Proveedor,
         direccion  : data?.direccion,
         rtnProveedor : data?.rtnProveedor,
         Corto      : data?.Corto,
         idSede     : data?.idSede
        },
        disableClose : true
      })
    }


}
