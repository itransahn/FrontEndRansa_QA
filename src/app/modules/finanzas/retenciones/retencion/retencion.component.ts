import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, CanActivate } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, mensajes, meses } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.scss']
})
export class RetencionComponent implements OnInit {

  public fecha = new Date();
  public mes   = this.fecha.getMonth() + 1;
  public dia   = this.fecha.getDate();
  public anio  = this.fecha.getFullYear();
  public parametros    = [];
  public parametrosCai = [];
  public retencionBD   : retenciones[] = [];

  public DiaP        : number = 0;
  public mesP        : number = 0;
  public anioP       : number = 0;
  public proveedorP  : number = 0;
  public sedeP       : number = 0;
  public tipoR       : string;

  public anulacion = false;
  public devolcion = false;

  public permitido : boolean = false;
  
  public espaciosBlancos = [];
  public dataRetenciones : any[] = [];

  public Observaciones =  '----';

  // :periodo/:dia/:anio/:proveedor


  constructor(
    public sharedS      : SharedService,
    public facturacionS : FacturacionService,
    public ruta         : ActivatedRoute,
    public dialog       : MatDialog,
    public toast        : ToastServiceLocal
  ) { }

  ngOnInit(){
    this.cargarParametros()
    this.cargarParametrosF();
    this.cargarDataretenciones();
    this.CargarRetencion();
    this.validarCorrelativo();
  }


  cargarParametros(){
this.DiaP        = this.ruta.snapshot.params?.['dia'] ,
this.mesP        = this.ruta.snapshot.params?.['periodo'] ,
this.anioP       = this.ruta.snapshot.params?.['anio'] ,
this.proveedorP  = this.ruta.snapshot.params?.['proveedor'],
this.sedeP       = this.ruta.snapshot.params?.['empresa']

if( this.ruta.snapshot.params?.['retencion'] == 135 ){
  this.tipoR  = 'retencion135'
}

if( this.ruta.snapshot.params?.['retencion'] == 112 ){
  this.tipoR  = 'retencion112'
}

if( this.ruta.snapshot.params?.['retencion'] == 217 ){
  this.tipoR  = 'retencion217'
}


  }

  cargarParametrosF(){
    let url='seguridad/parametrosF';
    let params = {
      sede : this.sedeP,
      tipo : 4
    }
  this.facturacionS.post(url,params).subscribe(
    (res:DataApi | any )=>{
        if( !res?.hasError ){
            this.parametros    = res.data.Table0;
            this.parametrosCai = res.data.Table1;
          }
    }
  )
  }

  cargarMes( mes ){
   return meses( mes )
  }

  retornarCorrelativo(){
    let correlativo : string = '75572';
    return correlativo.substring(0,correlativo.length)
  }



  retornarSubtotal(filtro:string){
    return Acumulador(this.retencionBD,filtro)
  }


  cargarDataretenciones(){
    this.dataRetenciones = [
      {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 24910,
        montoR  : 249.10,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 28789.89,
        montoR  : 789.89,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       },
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       },
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } , {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       },
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } 
  ];

  }

  convertirNumLetra( numero : any){
    return numeroALetras(numero,{})
}

  GenerarPdf(){  this.sharedS.downloadPDF('Retencion','RetencionClienteX','Retencion 1', '¿Seguro de generar retención?') 
  this.guardarData()
}


  CargarRetencion(){
    this.espaciosBlancos = [];
    let url = '/finanzas/Cargarretencion';
    let params = {
      tipo      : 135,  
      proveedor : this.proveedorP,  
      anio      : this.anioP,  
      mes       : this.mesP,  
    }
    this.facturacionS.post (url,params).subscribe(
      res=>{
        this.retencionBD = res?.data?.Table0
        console.log(this.retencionBD.length)
        if ( this.retencionBD.length <= 10 ){
          for(let j=0; j<(10-this.retencionBD.length); j++){
            this.espaciosBlancos.push(j)
          }
        }
  }
)


console.log(this.espaciosBlancos.length)


}

guardarData(){
  let fecha : string = String(this.DiaP) + '/'+ String(this.mesP) + '/' + String(this.anioP);
  let proveedor : string = String(this.retencionBD[0]?.proveedor);
  let data = this.retencionBD;
  let correlativo = this.retornarCorrelativo();

  let url = '/finanzas/guardarRetencion';
  let params = {
    fecha       : fecha,
    proveedor   : proveedor,
    dataT       : JSON.stringify(data),
    correlativo : correlativo 
  }

  this.facturacionS.post(url, params).subscribe( )

}

validarCorrelativo(){
  let url = 'finanzas/validarNum'
  let params = {
    // correlativo : this.retornarCorrelativo(),
    correlativo : '7500',
    sede        : 1,
    tipo        : 4
  }
  this.facturacionS.post( url, params ).subscribe(
    (res:DataApi)=>{
      console.log(res)
      if(!res.hasError){
        if ( res?.data.Table0[0]['codigo'] != -1 && res?.data.Table0[0]['codigo'] != 1 ){
            this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning);
            this.permitido = true;
        }else{
          // this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
          if ( res?.data.Table0[0]['codigo'] == 1){
              this.permitido = true;
          }else{
            this.toast.mensajeError(String(res?.data.Table0[0]['Mensaje']), mensajes.error);
              this.permitido =  false;
          }
        }
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
  }
    }
  )
}

}


interface retenciones {
  ID             ?: number,
  CAI            ?: string,
  RTN            ?: string,
  TipRetencion   ?: string,
  baseRetencion  ?: number,
  documento    ?: string,
  fecha        ?: string,
  proveedor    ?: string,
  retencion112 ?: number,
  retencion135 ?: number,
  retencion217 ?: number
}