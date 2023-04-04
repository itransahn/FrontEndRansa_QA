import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, CanActivate } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, mensajes, meses } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
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
  public correlativoN  : string = '';

  public DiaP        : string = '0';
  public mesP        : string = '0';
  public anioP       : string = '0';
  public proveedorP  : number;
  public sedeP       : number;
  public tipoR       : string;

  public anulacion = false;
  public devolcion = false;

  public permitido : boolean = true;
  
  public espaciosBlancos = [];
  public dataRetenciones : any[] = [];

  public Observaciones =  '----';

  public subs : Subscription;

  // :periodo/:dia/:anio/:proveedor

  constructor(
    public sharedS      : SharedService,
    public facturacionS : FacturacionService,
    public ruta         : ActivatedRoute,
    public dialog       : MatDialog,
    public toast        : ToastServiceLocal,
    public auth         : AuthService,
    public sweel        : SweetAlertService
  ) { }

  ngOnInit(){
    this.cargarParametros();
    this.cargarParametrosF();
    // this.correlativo();
    // this.validarCorrelativo();
   
    // this.CargarRetencionG();
  }

correlativo(){
  let url = '/finanzas/cargarCorrelativo';
  let params = {
    sede : this.sedeP
  };
 this.subs = this.facturacionS.post(url,params).subscribe(
    ( res:DataApi)=>{
        if(res){
            this.correlativoN = res?.data?.Table0[0]?.['Correlativo'];  
            if ( this.correlativoN === '-1'){
                 this.permitido = false;
            }
            this.validarCorrelativo()
          }
        }
        )
}

cargarParametros(){
  this.DiaP        = this.ruta.snapshot.params?.['dia'] ;
  if ( Number(this.DiaP) < 10 ){
    this.DiaP =  `0${this.DiaP}`
  }
  this.mesP        = this.ruta.snapshot.params?.['periodo'] ;
  this.anioP       = this.ruta.snapshot.params?.['anio'] ;
  this.proveedorP  = this.ruta.snapshot.params?.['proveedor'];
  this.sedeP       = this.ruta.snapshot.params?.['empresa'];
  this.correlativo();
  this.CargarRetencion();

if( this.ruta.snapshot.params?.['retencion'] == 135 ){
  this.tipoR  = 'retencion135'
}

if( this.ruta.snapshot.params?.['retencion'] == 112 ){
  this.tipoR  = 'retencion112'
}

if( this.ruta.snapshot.params?.['retencion'] == 217 ){
  this.tipoR  = 'retencion217'
}

if( this.ruta.snapshot.params?.['retencion'] == 113 ){
  this.tipoR  = 'retencion113'
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
            this.parametros    = res?.data?.Table0;
            this.parametrosCai = res?.data?.Table1;
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

retornarSubtotal(){
    return Acumulador(this.retencionBD,this.validarTipoRetencion())
  }


  retornarImpuesto(){
    return Acumulador(this.retencionBD,'baseRetencion')
  }
convertirNumLetra( numero : any){
    return numeroALetras(numero,{})
}

 GenerarPdf(){  
this.pdfRetencion('Retencion',  `${this.correlativoN}_ ${this.mesP }_${this.retencionBD[0]?.proveedor}_RETOriginal`,'Retención Ransa', `Seguro de generar PDF de Retención del CLIENTE
${this.retencionBD[0]?.proveedor}`,{
  numeroFactura: `${this.correlativoN}_${this.retencionBD[0]?.proveedor }`,
  factura : 'Retención Ransa',
  titulo : ''
})

}


pdfRetencion( id?:string, NombreFinal ?: string, detalle?: string, titulo ?: string, data?:any) :boolean {

  this.sweel.mensajeConConfirmacion(`¿${titulo}?`, `${detalle}`,"warning").then(
        res=>{
            if ( res ){
               // Extraemos el
    const DATA = document.getElementById(id);
    const doc = new jsPDF('p', 'pt', 'Letter');
    const options = {
                 background: 'transparent',
                 scale: 3,
                 format: [4, 2]
                    };
  html2canvas(DATA, options).then((canvas) => {
    const img = canvas.toDataURL('image/PNG');
    // Add image Canvas to PDF
    const bufferX = 15;
    const bufferY = 15;
    const imgProps = (doc as any).getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    return doc;
    }).then( (docResult) => {
      docResult.save(`${NombreFinal}.pdf`);
  
      this.sharedS.pdfFacturaD('Retencion2', data['numeroFactura'] +'_RETCCPROVEEDOR', 'Seguro','PDF' )
      // this.pdfFacturaD('archivo',data['numeroFactura']+'FACArchivo', 'Seguro','PDF' )
  
      this.toast.mensajeSuccess("Documento generado correctamente","Generación de PDF");
      this.guardarData();
      this.cambiarEstadoRetencion();
      this.auth.redirecTo('/ransa/finanzas/retencion')
      return true;
    });
                return true
            }else{
                return false
             }
        }
      )
      return false
  }

CargarRetencion(){
    this.espaciosBlancos = [];
    let url = '/finanzas/Cargarretencion';
    let params = {
      tipo      : this.ruta.snapshot.params?.['retencion'],  
      proveedor : this.proveedorP,  
      anio      : this.anioP,  
      mes       : this.mesP,  
      sede      : this.sedeP
    }
    this.facturacionS.post (url,params).subscribe(
      res=>{
        this.retencionBD = res?.data?.Table0;
        if ( this.retencionBD.length < 20 ){
          for(let j = this.retencionBD.length; j<(40-this.retencionBD.length); j++){
            this.espaciosBlancos.push(j)
          }
        }else{
          
        }
  })
}
retornarMes(periodo : number){  
  if (periodo < 10){
    return `0${periodo.toString()}`
  }else{
    return periodo.toString()
  }
}


guardarData(){
  let fecha : string = String(this.DiaP) + '/'+ String(this.retornarMes(Number(this.mesP))) + '/' + String(this.anioP);
  let proveedor : string = String(this.retencionBD[0]?.proveedor);
  let data = this.retencionBD;
  let correlativo = this.correlativoN;
  let url = '/finanzas/guardarRetencion';
  let params = {
    fecha       : fecha,
    proveedor   : proveedor,
    dataT       : JSON.stringify(data),
    correlativo : correlativo,
    usuario     : this.auth.dataUsuario['id_usuario'],
    sede        : this.sedeP,
    tipoR       : this.ruta.snapshot.params?.['retencion'],
    rtn         : this.retencionBD[0]?.RTN,
    cai         : this.parametrosCai[0]?.['CAI'], 
    desde       : this.parametrosCai[0]?.['desde'],
    hasta       : this.parametrosCai[0]?.['hasta'],
    fechaCAI    : this.parametrosCai[0]?.['fechaLimite']
  }
  this.facturacionS.post(url, params).subscribe( res=>{ })

}


cambiarEstadoRetencion(){
  let url    = '/finanzas/estadoRetencion';
for (let i = 0 ; i < this.retencionBD.length; i++ ){
    let params = {
    retencion  : this.retencionBD[i]?.ID,
    tipoR      : this.ruta.snapshot.params?.['retencion']
  } 
this.facturacionS.post(url,params).subscribe( ) 
}


}

validarTipoRetencion(){

  if(this.ruta.snapshot.params?.['retencion'] == '112'){
    return 'retencion112'
  }

  if(this.ruta.snapshot.params?.['retencion'] == '113'){
    return 'retencion113'
  }
  if(this.ruta.snapshot.params?.['retencion'] == '135'){
    return 'retencion135'
  }
  if(this.ruta.snapshot.params?.['retencion'] == '217'){
    return 'retencion217'
  }

return ''
}


validarCorrelativo(){

  let url = 'finanzas/validarNum'
  let params = {
    correlativo : Number(this.correlativoN),
    sede        : this.sedeP,
    tipo        : 4
  }
  this.facturacionS.postRetencion( url, params ).subscribe(
    (res:DataApi)=>{
      if(!res.hasError){
        if ( res?.data?.Table0[0]?.['codigo'] != -1 && res?.data?.Table0[0]?.['codigo'] != 1 ){
            this.toast.mensajeWarning(String(res?.data?.Table0[0]?.['Mensaje']), mensajes.warning);
            this.permitido = true;
        }else{
          // this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
          if ( res?.data?.Table0[0]?.['codigo'] == 1){
              this.permitido = true;
          }else{
            this.toast.mensajeError(String(res?.data?.Table0[0]?.['Mensaje']), mensajes.error);
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