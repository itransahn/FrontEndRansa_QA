import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../transporte.service';
import { CrearPaseSalidaComponent } from './crear-pase-salida/crear-pase-salida.component';

@Component({
  selector: 'app-pases-salida',
  templateUrl: './pases-salida.component.html',
  styleUrls: ['./pases-salida.component.scss']
})
export class PasesSalidaComponent implements OnInit {
  @Input()detonador ?: number;
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
  public parametrosBusqueda = ['NombreUsuario', 'Transporte','Nombre','Hacia'];
  public pases : any[] = [];
  private sub : Subscription = new Subscription();

  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public dialog : MatDialog, 
    private transporteService : TransporteService, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
  ) { }

  ngOnInit(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarPases();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarPases()
      }
    )
  }

  ngOnDestroy()  {
    this.sub.unsubscribe()
}
cargarPases(){
  let url = 'transporte/pasesSalida';
  let params = {};
  this.transporteService.get(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.pases = data?.data?.Table0;
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

  AprobarSalida( data ){
  }

  
  Modal ( ){
    const dialogReg = this.dialog.open( CrearPaseSalidaComponent,{
      width :   '500px',
      height:   'auto',
      maxWidth: 'auto',
      data: {  },
      disableClose : true
    })
  }

}
