import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
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

   public loading3 : boolean = false;

   public proveedoresF :  proveedores[]=[];
   public proveedoresFR : proveedores[]=[];

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
                this.cargarRetencion(
                  String(this.dataExcel[i]?.Proveedor),
                  String(this.dataExcel[i]?.RTN),
                  String(this.dataExcel[i]?.Documento),
                  fecha,
                  // fecha,
                  Number(this.dataExcel[i]?.BaseImponible),
                  Number(this.dataExcel[i]?.Impuesto),
                  this.dataExcel[i]?.tipoRetencion,
                  String(this.dataExcel[i]?.CAI),
                  this.dataExcel[i]?.Sociedad,
                 )
              }catch( err ){
                this.toast.mensajeError(err,'Error')
              }
             
          }

          this.toast.mensajeSuccess("Data Cargada con éxito","Carga de datos");
          this.loading2 = false;
        }
      }
      )
}

Limpieza(){
  this.sweel.mensajeConConfirmacion("¿Seguro de Limpiar data?","Limpieza","question").then(
    res=>{
      if ( res ){
        this.proveedoresF = []
        this.sharedS.CleanDataExcel()
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
  caiP       ?: string,
  sede       ?: number
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
sede          : sede
  };
  console.log(params)
 this.servicio.put( url, params ).subscribe ( 
  res=>{
      if( res?.data?.Table0?.[0]['codigo'] != -1 ){
      }else{
  this.proveedoresF.push( {
          proveedor : res?.data?.Table0?.[0]['proveedor']
        });
          if( this.proveedoresF.length > 0){
        this.proveedoresFR = this.removeDuplicates(this.proveedoresF)
            this.loading3 = true;
          }

        }
    }
   )
}

removeDuplicates(array : any[]){
  let arrayOut = [];
  array.forEach(  item =>{
    try{
      if ( JSON.stringify(arrayOut[arrayOut.length -1].proveedor  ) !== JSON.stringify(item.proveedor) ){
        arrayOut.push(item);
      }
    }catch( err ) {
      arrayOut.push(item)
    }
  })

  return arrayOut;

}

}

interface retenciones {
CAI           ?: string,
Documento     ?: string,
Proveedor     ?: string,
RTN           ?: string,
fecha         ?: string,
BaseImponible ?: number,
Impuesto      ?: number,
tipoRetencion ?: number,
Sociedad      ?: number
}


interface proveedores{
  proveedor ?: string
}[]