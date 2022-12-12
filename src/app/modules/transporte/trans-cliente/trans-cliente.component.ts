import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AuthService } from 'src/app/services/auth.service';
import { TransporteService } from '../transporte.service';

@Component({
  selector: 'app-trans-cliente',
  templateUrl: './trans-cliente.component.html',
  styleUrls: ['./trans-cliente.component.scss']
})
export class TransClienteComponent implements OnInit {
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
  public parametrosBusqueda = ['Cliente', 'Transporte'];
  public clientes : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl,  
    public dialog : MatDialog, 
    private transporteService : TransporteService, 
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
    let url = 'transporte/transCliente';
    let params = {};
    this.transporteService.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.clientes = data?.data?.Table0;
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
