import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SsmoaService } from '../../ssmoa.service';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { catalogo } from 'src/app/interfaces/generales';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AuditoriaComponent } from '../auditoria/auditoria.component';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss']
})
export class AuditoriasComponent implements OnInit {
  public data : any[]=[];
  public flat  : boolean = false;
  public filtro: FormGroup;
  public parametrosBusqueda = ['Nomenclatura'];
  public subTotal;
  public bandera : boolean = false;
  public sedes = [
    { idSede : 1, 
      Sede   : "CD SAUCE"
    },
    { idSede : 2, 
      Sede   : "ALMAHSA"
    },
    { idSede : 3, 
      Sede   : "ARCHIVO"
    }
  ]

      Paginacion
      public page = 0;
      public pageEvent : PageEvent;
      public pageIndex : number = 0;
      public desde = 0;
      public hasta = 50;
      public fecha = new Date();
      nextPageLabel     = 'Página Siguiente';
      previousPageLabel = 'Página Anterior';
      public pageSize = 50;
      public banderaRol   : any;
    constructor(
      private service : SsmoaService,
      private paginator   : MatPaginatorIntl, 
      public  dialog      : MatDialog, 
      private sweel       : SweetAlertService,
      private toast       : ToastServiceLocal,
      private auth        : AuthService,
      private ruta        : ActivatedRoute
    ) { }
    
  ngOnInit() {

    this.filtro = new FormGroup({
      filtrar    : new FormControl({ value:'',disabled: false}),
      buscar     : new FormControl({ value:'',disabled: false}, [ Validators.required])
    })

  this.service.refresh$.subscribe(
      res=>{
        this.service.get( 'ssmoa/extintoresAud', {sede: this.filtro.value.filtrar} ).subscribe(
          (data : DataApi | any) =>{
            if( !data.hasError ){
              this.data = data?.data?.Table0;
              this.bandera = true
            }
          }
        )
      }
    )
  }

  cargarData( ){
    let url = 'ssmoa/extintoresAud';
    let params = {
      sede : this.filtro.value.filtrar
     }
    this.service.get( url, params ).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.data = data?.data?.Table0;
          this.bandera = true
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

  Auditoria(  data ?: any ){
    this.dialog.open( AuditoriaComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '75%',
      minWidth: '50%',
      data: { 
        data : data  
      },
      disableClose : true
    })

  }

}
