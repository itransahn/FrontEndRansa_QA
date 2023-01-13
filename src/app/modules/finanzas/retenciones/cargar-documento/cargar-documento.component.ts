import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-cargar-documento',
  templateUrl: './cargar-documento.component.html',
  styleUrls: ['./cargar-documento.component.scss']
})
export class CargarDocumentoComponent implements OnInit {

  public dataExcel : retenciones[]=[];

   //Paginacion
   public page = 0;
   public pageEvent : PageEvent;
   public pageIndex : number = 0;
   public desde = 0;
   public hasta = 100;
   nextPageLabel     = 'Página Siguiente';
   previousPageLabel = 'Página Anterior';
   public pageSize = 100;
   public filter :string  = '';
   public filtro: FormGroup;
   public parametrosBusqueda = ['Empresa','Documento'];
   public loading1 : Boolean = false;
   public loading2 : Boolean = false;

  constructor( 
    public sharedS : SharedService,
    public servicio : FacturacionService,
    public toast    : ToastServiceLocal
    ) { }

  ngOnInit( ) {
    this.sharedS.CleanDataExcel()
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
  }


  cargarData(evt){
      this.loading1 = true; 
   this.sharedS.onChange(evt);
   this.sharedS.dataExcelo$.subscribe(
    res=>{
     if( res  ){
       this.dataExcel = res;
       this.loading1 = false
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

Retencion(){
  for ( let i = 0; i <= this.dataExcel.length; i++){
    this.loading2 = true;

    this.cargarRetencion(
      this.dataExcel[i]?.Empresa,
      this.dataExcel[i]?.RTN,
      this.dataExcel[i]?.Documento,
      this.dataExcel[i]?.fecha,
      this.dataExcel[i]?.impuesto,
      this.dataExcel[i]?.retencion,
      this.dataExcel[i]?.tipoRetencion,
      this.dataExcel[i]?.CAI
     )
  }
  this.loading2 = false;
}


cargarRetencion( 
  empresa   ?: any,
  rtn       ?: any,
  documento ?: any,
  fecha     ?: any,
  impuesto  ?: any,
  retencion ?: any,
  tipoRet   ?: any,
  cai       ?: any
){
  let url = 'finanzas/retencion';
  let params = {
empresa       : empresa,
rtn           : rtn,
documento     : documento,
fecha         : fecha,
impuesto      : impuesto,
retencion     : retencion,
tipoRetencion : tipoRet,
cai           : cai,
  }
console.log( params )
  this.servicio.put( url, params ).subscribe (  )
}

}


interface retenciones {
CAI           ?: string,
Documento     ?: string,
Empresa       ?: string,
RTN           ?: string,
fecha         ?: string,
impuesto      ?: number,
retencion     ?: number,
tipoRetencion ?: number
}