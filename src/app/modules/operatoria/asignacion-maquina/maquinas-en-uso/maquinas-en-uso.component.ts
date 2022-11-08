import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { ExcelenciaService } from 'src/app/modules/excelencia/excelencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { OperatoriaService } from '../../operatoria.service';
import { ModalFinAsignacionComponent } from '../modal-fin-asignacion/modal-fin-asignacion.component';

@Component({
  selector: 'app-maquinas-en-uso',
  templateUrl: './maquinas-en-uso.component.html',
  styleUrls: ['./maquinas-en-uso.component.scss']
})
export class MaquinasEnUsoComponent implements OnInit {

  public maquinasUso  : any[] = [];
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
  public parametrosBusqueda = ['Maquina','tipo','area','Asignado por','Asignado a'];
  constructor(
    private paginator  : MatPaginatorIntl, 
    public  operatoriaS : OperatoriaService,
    private auth : AuthService, 
    public  sweel : SweetAlertService,
    private toast : ToastServiceLocal, 
    private dialog : MatDialog,
    private ruta : ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.cargarMaquinasUso();
    
    this.operatoriaS.refresh$.subscribe(
      res=>{
          this.cargarMaquinasUso()
      }
    )
  }


  cargarMaquinasUso(){
    let url = 'operaciones/maquinasEnuso';
    let params = {};  
    this.operatoriaS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.maquinasUso = data?.data?.Table0;
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
    
    
    Modal ( data ?: any ){
      const dialogReg = this.dialog.open( ModalFinAsignacionComponent,{
        width :   '1300px',
        height:   'auto',
        maxWidth: '1300px',
        data: data,
        disableClose : true
      })
    }


}
