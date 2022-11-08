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
  selector: 'app-mod-lotes',
  templateUrl: './mod-lotes.component.html',
  styleUrls: ['./mod-lotes.component.scss']
})
export class ModLotesComponent implements OnInit {
  public modificaciones : any[];
  public flat   : boolean = false;
  public filtro : FormGroup;
  public parametrosBusqueda = ['LLANTA'];
  public canjeos : any[] = [];

 public  patter = "\d*(\.\d{0,2})?$";
    //Paginacion
    public page = 0;
    public pageEvent : PageEvent;
    public pageIndex : number = 0;
    public desde = 0;
    public hasta = 50;
    public fecha = new Date()

    nextPageLabel     = 'Página Siguiente';
    previousPageLabel = 'Página Anterior';
    public pageSize = 50;
  constructor(
    private excelenciaS : ExcelenciaService,
    private paginator   : MatPaginatorIntl, 
    public  dialog : MatDialog, 
    private sweel  : SweetAlertService,
    private toast  : ToastServiceLocal,
    private auth   : AuthService,
    private ruta   : ActivatedRoute
  ) { }

  ngOnInit(){
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    this.cargarModificaciones();
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.excelenciaS.refresh$.subscribe(
      res => {
        this.cargarModificaciones()
      }
    )
  }

  cargarModificaciones(){
    let url = 'excelencia/verCamLotes';
    let params = { }
    this.excelenciaS.get( url, params ).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.modificaciones = data?.data?.Table0;
        }
      }
    )
  }

}
