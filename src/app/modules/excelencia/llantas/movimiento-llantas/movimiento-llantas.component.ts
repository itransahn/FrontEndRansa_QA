import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../excelencia.service';

@Component({
  selector: 'app-movimiento-llantas',
  templateUrl: './movimiento-llantas.component.html',
  styleUrls: ['./movimiento-llantas.component.scss']
})
export class MovimientoLlantasComponent implements OnInit {
  public cambios  : any[] = [];
  public subTotal : any;
  public bandera  : boolean = false;
  public movimientos : any[] = [
    {
      idMovimiento: 1,
      Movimiento  : "Entrada"
    },
    {
      idMovimiento: 2,
      Movimiento  : "Salida"
    },
    {
      idMovimiento: 3,
      Movimiento  : "Ajuste"
    }
  ]
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
  public parametrosBusqueda = ['CODIGO','Llanta', 'LlantaCambiada', 'LOTE','LlantaCambiada','USUARIO','Comentarios'];
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
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false}, [ Validators.required])
    })
   
    
    this.excelenciaS.refresh$.subscribe(
      res=>{
          this.cargarMovimientos()
      }
    )
 
   }

cargarMovimientos(){
    let url = 'excelencia/movimientoLlantas';
    let params = {
      accion     : this.filtro.value.filtrar
    };  
    this.excelenciaS.put(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.cambios = data?.data?.Table0;
          this.bandera = true;
          this.subTotal =  Acumulador( this.cambios, 'Costo' )
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
