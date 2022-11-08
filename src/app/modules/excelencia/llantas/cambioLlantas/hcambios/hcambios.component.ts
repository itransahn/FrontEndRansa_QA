import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';

@Component({
  selector: 'app-hcambios',
  templateUrl: './hcambios.component.html',
  styleUrls: ['./hcambios.component.scss']
})
export class HcambiosComponent implements OnInit {

  public cambios  : any[] = [];
  public subTotal : any;
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
  public parametrosBusqueda = ['Accion','Usuario','TipoMaquina','MaquinaAnterior','MaquinaNueva','LadoAnterior','LadoNuevo'];
  constructor(
    private paginator  : MatPaginatorIntl, 
    public excelenciaS : ExcelenciaService,
    private auth       : AuthService, 
    public sweel       : SweetAlertService,
    private toast      : ToastServiceLocal, 
    private dialog     : MatDialog,
    private ruta       : ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.cargarCambios();
    
    this.excelenciaS.refresh$.subscribe(
      res=>{
          this.cargarCambios()
      }
    )
  }

  cargarCambios(){
    let url = 'excelencia/cambiosRealizados';
    let params = {};  
    this.excelenciaS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.cambios = data?.data?.Table0;
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
