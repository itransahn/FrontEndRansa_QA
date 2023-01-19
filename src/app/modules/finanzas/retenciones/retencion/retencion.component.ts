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

  public DiaP        : number = 0;
  public mesP        : number = 0;
  public anioP       : number = 0;
  public proveedorP  : number = 0;
  public sedeP       : number = 0;
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
    this.cargarParametros()
    this.cargarParametrosF();
    // this.correlativo();
    // this.validarCorrelativo();
    this.CargarRetencion();
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
            this.validarCorrelativo()
          }
        }
        )
}

cargarParametros(){
  this.correlativo()
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

retornarSubtotal(filtro:string){
    return Acumulador(this.retencionBD,filtro)
  }

convertirNumLetra( numero : any){
    return numeroALetras(numero,{})
}

 GenerarPdf(){  
this.pdfRetencion('Retencion',  `${this.correlativoN}_ ${this.mesP }_${this.retencionBD[0]?.proveedor}RETOriginal`,'Retención Ransa', `Seguro de generar PDF de Retención del CLIENTE
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
  
      // this.pdfFacturaD('cliente',data['numeroFactura']+'FACCliente', 'Seguro','PDF' )
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
      tipo      : 135,  
      proveedor : this.proveedorP,  
      anio      : this.anioP,  
      mes       : this.mesP,  
    }
    this.facturacionS.post (url,params).subscribe(
      res=>{
        this.retencionBD = res?.data?.Table0;
        if ( this.retencionBD.length <= 20 ){
          for(let j=0; j<(20-this.retencionBD.length); j++){
            this.espaciosBlancos.push(j)
          }
        }
  })
}

guardarData(){
  let fecha : string = String(this.DiaP) + '/'+ String(this.mesP) + '/' + String(this.anioP);
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
    rtn         : this.retencionBD[0]?.RTN
  }
  this.facturacionS.post(url, params).subscribe( )

}


cambiarEstadoRetencion(){
  let url    = '/finanzas/estadoRetencion';
for (let i = 0 ; i < this.retencionBD.length; i++ ){
    let params = {
    retencion  : this.retencionBD[i]?.ID
  } 
this.facturacionS.post(url,params).subscribe( )

  
}


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