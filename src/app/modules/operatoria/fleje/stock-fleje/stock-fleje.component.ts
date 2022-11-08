import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { OperatoriaService } from '../../operatoria.service';

@Component({
  selector: 'app-stock-fleje',
  templateUrl: './stock-fleje.component.html',
  styleUrls: ['./stock-fleje.component.scss']
})
export class StockFlejeComponent implements OnInit {
  public stock  : any[] = [];
  public Unidades : any;
  public Cajas : any;
  //Paginacion
  public page       = 0;
  public pageEvent  : PageEvent;
  public pageIndex  : number = 0;
  public desde      = 0;
  public hasta      = 50;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize   = 50;
  public filter     :string  = '';
  public filtro     : FormGroup;

  constructor(
    private paginator  : MatPaginatorIntl, 
    public  operacionS : OperatoriaService,
    private auth       : AuthService, 
    public sweel       : SweetAlertService,
    private toast      : ToastServiceLocal, 
    private dialog     : MatDialog,
    private ruta       : ActivatedRoute
  ) { }


  ngOnInit(){
    this.cargarStock();
    this.operacionS.refresh$.subscribe(
      res=>{
          this.cargarStock()
      }
    )
  }

  cargarStock(){
    let url = 'operaciones/stockFleje';
    let params = {};  
    this.operacionS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.stock = data?.data?.Table0;
          this.Unidades =  Acumulador( this.stock, 'Unidades' )
          this.Cajas    =  Acumulador( this.stock, 'Cajas' )
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

}
