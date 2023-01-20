import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, mensajes, meses } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { SharedService } from '../../shared/shared.service';
import { FacturacionService } from '../facturacion.service';

@Component({
  selector: 'app-retenciones-g',
  templateUrl: './retenciones-g.component.html',
  styleUrls: ['./retenciones-g.component.scss']
})
export class RetencionesGComponent implements OnInit {
  public fecha = new Date();
  public mes   = this.fecha.getMonth() + 1;
  public dia   = this.fecha.getDate();
  public anio  = this.fecha.getFullYear();
  public parametros    = [];
  public parametrosCai = [];
  public retencionBD   : any[] = [];
  public correlativoN  : string = '';

  public DiaP        : number = 0;
  public mesP        : number = 0;
  public anioP       : number = 0;
  public proveedorP  : number = 0;
  public sedeP       : number = 0;
  public tipoR       : string;
  public cai         : string = '';
  public desde       : string = '';
  public hasta       : string = '';
  public fechaLimite : string = '';
  public rtn         : string = '';


  public anulacion = false;
  public devolcion = false;

  public permitido : boolean = true;
  
  public espaciosBlancos = [];
  public dataRetenciones : any[] = [];

  public Observaciones =  '----';

  public subs : Subscription;
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
    this.correlativoN = this.ruta.snapshot.params?.['correlativo'];
    this.CargarRetencion();
    // this.correlativo();
    // this.validarCorrelativo();
    this.CargarRetencion();
  }



cargarParametrosF(){
  console.log(this.sedeP)
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


retornarSubtotal(filtro:string){
    return Acumulador(this.retencionBD,filtro)
  }

convertirNumLetra( numero : any){
    return numeroALetras(numero,{})
}



CargarRetencion(){
    this.espaciosBlancos = [];
    let retencionT ;
    let url = '/finanzas/cargarRetencionG';
    let params = {
      correlativo   : this.correlativoN
    }
    this.facturacionS.post (url,params).subscribe(
      res=>{
this.retencionBD = JSON.parse(res?.data?.Table0[0]?.dataT);
this.DiaP          =   res?.data?.Table0[0]?.dia ,
this.mesP          =  res?.data?.Table0[0]?.mes ,
this.anioP         =  res?.data?.Table0[0]?.anio ,
this.proveedorP    =  res?.data?.Table0[0]?.proveedor,
this.sedeP         =  res?.data?.Table0[0]?.sede,
this.cai           = res?.data?.Table0[0]?.cai,
this.desde         = res?.data?.Table0[0]?.desde,
this.hasta         = res?.data?.Table0[0]?.hasta,
this.fechaLimite   = res?.data?.Table0[0]?.fechaLimite,
this.rtn           = res?.data?.Table0[0]?.rtn,
retencionT         = res?.data?.Table0[0]?.tipoR

this.cargarParametrosF();
if( retencionT == '135' ){
  this.tipoR  = 'retencion135'
}

if( retencionT == 112 ){
  this.tipoR  = 'retencion112'
}

if( retencionT == 217 ){
  this.tipoR  = 'retencion217'
}
for(let j=0; j<(20-this.retencionBD.length); j++){
  this.espaciosBlancos.push(j)
}
  })

}



GenerarPdf(){  
  this.pdfRetencion('RetencionG',  `${this.correlativoN}_ ${this.mesP }_${this.retencionBD[0]?.proveedor}_RETOriginal_RI`,'Retención Ransa REGENERACIÓN', `Seguro de re-generar PDF de Retención del CLIENTE
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
        this.auth.redirecTo('/ransa')
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

}
