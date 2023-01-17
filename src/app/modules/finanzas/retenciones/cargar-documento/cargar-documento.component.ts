import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
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
    public sharedS  : SharedService,
    public servicio : FacturacionService,
    public toast    : ToastServiceLocal,
    public sweel    : SweetAlertService
    ) { }

  ngOnInit( ) {
    this.sharedS.CleanDataExcel()
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    });

    let fecha = '2022/11/30';
    console.log( new Date(fecha))
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

  this.sweel.mensajeConConfirmacion('¿Seguro de cargar Retenciones?', 'Carga de Retenciones','warning').then(
    res =>{
          if ( res ){
            for ( let i = 0; i <= this.dataExcel.length - 1; i++){
              try{
                this.loading2 = true;
                let fecha : string;
                
          
                fecha = String(this.dataExcel[i]?.fecha).substring(4,8)  + '/' + String(this.dataExcel[i]?.fecha).substring(2,4) + '/'+  String(this.dataExcel[i]?.fecha).substring(0,2);
                // console.log(fecha)
                this.cargarRetencion(
                  String(this.dataExcel[i]?.Empresa),
                  String(this.dataExcel[i]?.RTN),
                  String(this.dataExcel[i]?.Documento),
                  fecha,
                  // fecha,
                  this.dataExcel[i]?.impuesto,
                  this.dataExcel[i]?.retencion,
                  this.dataExcel[i]?.tipoRetencion,
                  String(this.dataExcel[i]?.CAI)
                 )
              }catch( err ){
                this.toast.mensajeError(err,'Error')
              }
             
          }
          this.toast.mensajeSuccess("Data Cargada con éxito","Carga de datos")
          this.loading2 = false;
          }
    }
  )


}

/* CREAR FORMATO DE FECHA dd/mm/yyyy */ 
cargarRetencion( 
  empresaP   ?: string,
  rtnP       ?: string,
  documentoP ?: string,
  fechaP     ?: string,
  impuestoP  ?: number,
  retencionP ?: number,
  tipoRetP   ?: number,
  caiP       ?: string
){



  let url = 'finanzas/retencion';
  let params = {
empresa       : empresaP,
rtn           : rtnP,
documento     : documentoP,
fecha         : new Date(fechaP),
impuesto      : impuestoP,
retencion     : retencionP,
tipoRetencion : tipoRetP,
cai           : caiP,
  }

  console.log(params)
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


