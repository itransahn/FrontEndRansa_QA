import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { SsmoaService } from '../../../ssmoa.service';
import { DataApi } from 'src/app/interfaces/dataApi';
import { ModalAgenteComponent } from './modal-agente/modal-agente.component';

@Component({
  selector: 'app-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit {
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 20;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 20;
  public filter :string  = '';
  public filtro: FormGroup;
  public parametrosBusqueda = ['tipo_agente'];
  public data : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public dialog : MatDialog, 
    private service : SsmoaService, 
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

    this.sub = this.service.refresh$.subscribe(
      res=>{
         this.cargarData()
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


cargarData(){
    let url = 'ssmoa/TipoAgente';
    let params = {};
    
    this.service.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.data = data?.data?.Table0;
        }    
      }
    )
  }


  Modal ( accion : number, data ?: any, pantalla ?:any ){
    const dialogReg = this.dialog.open( ModalAgenteComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: 'auto',
      minWidth : '50%',
      data: { 
        bandera : accion,
        data    :  data,
        Pantalla : pantalla
      },
      disableClose : true
    })
  }
}
