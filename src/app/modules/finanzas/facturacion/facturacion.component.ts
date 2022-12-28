import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { cabeceraFactura, detalleCabecera } from 'src/app/interfaces/Factura';
import { Acumulador, mensajes } from 'src/app/interfaces/generales';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { SharedService } from '../../shared/shared.service';
import { FacturacionService } from '../facturacion.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {
/* DATA PARA DETALLES MANUALES */
  public detalleServicios : dataManual[] = [];
  public form : FormGroup;
  public tipo : number = 0;
/* DATA PARA DETALLES MANUALES */
  public anioActual = new Date().getFullYear()
  public dolares = [];
  public parametros = [];
  public parametrosCai = [];
  public fecha = new Date()
  public espaciosBlancos = [];
  public espaciosBlancos2 = [];
  public cabeceraF  : cabeceraFactura[] = [];
  public DcabeceraF : detalleCabecera[] = [];
  public Observaciones : string ='';
  public EstrObs1 : any[] = [];
  public EstrObs2 : any[] = [];
  public cliente : string = '0';
  public documento : string = '0';
  public loading1 = false;
  public loading2 = false;
  public Env      = 'RH';
  public permitido : boolean = false;
  public sede : number = 1;
  public dia : string;
  public mes : string;
  public anio : string;

  public obs : string = "SERVICIO TRAMITE ADUANAL, BL NO MEDUX5035795, FACTURA NO:MINB4944 CONTENEDORES: MEDU9423500, FFAU3016235, MSMU4209438, MSMU4722250 MSMU8235780, CAIU4870715,CAIU75744086, MSMU4715760"

  constructor( 
    public sharedS      : SharedService,
    public facturacionS : FacturacionService,
    public ruta : ActivatedRoute,
    public dialog : MatDialog,
    public toast : ToastServiceLocal
    ) { }

  ngOnInit(){
    this.cargarForm();
    this.tipo = this.ruta.snapshot.params['tipo'];
    this.cliente   = (this.ruta.snapshot.params['cliente']);
    this.documento = '1000'+ (this.ruta.snapshot.params['documento']);
    this.validarCorrelativo();
    this.cargarParametrosF();
    this.cabeceraFac();
    this.DetallecabeceraFac();
  }
  

llenarDataManual(){
  this.espaciosBlancos2 = []
  this.detalleServicios.push({
   cantidad    : this.form.value.cantidad,
   descripcion : this.form.value.detalle,
   Punitario   : this.form.value.punitario,
   descuento   : 0,
   impuesto    : this.form.value.impuesto,
   total       : String(  this.form.value.cantidad  * this.form.value.punitario ),
  })

  for(let j=0; j<(15-this.detalleServicios.length); j++){
    this.espaciosBlancos2.push(j)
}
  console.log( this.detalleServicios)
  this.form.reset()
}


  cargarForm(){
    this.form = new FormGroup({
cantidad   : new FormControl('', [ Validators.required]),
punitario  : new FormControl('', [ Validators.required]),
detalle    : new FormControl('', [ Validators.required]),
impuesto   : new FormControl('', [ Validators.required]),
    })
  }

  validacion(){
    this.cliente   = (this.ruta.snapshot.params['cliente']);
    this.documento = '1000'+ (this.ruta.snapshot.params['documento'])
    if ( this.cliente == '0' && this.documento == '0' ){
      this.modal()
    }else{
    this.cargarParametrosF()
    this.cabeceraFac()
    this.DetallecabeceraFac();
    }
  }

  validarCorrelativo(){
    let url = 'finanzas/validarNum'
    let params = {
      correlativo : this.ruta.snapshot.params['documento'],
      sede        : this.sede,
      tipo        : 1
    }
    this.facturacionS.post( url, params ).subscribe(
      (res:DataApi)=>{
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

  modal( ){
    const dialogReg = this.dialog.open( ModalComponent,{
      width  :   '500px',
      height :   'auto',
      maxWidth:  'auto',
      data    :  { 
        sede : this.sede
      },
      disableClose : true
    })
  }

  cargarParametrosF(){
    let url='seguridad/parametrosF';
    let params = {
      sede : this.sede,
      tipo : 1
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
  convertirNumLetra( numero : any){
      return numeroALetras(numero,{})
  }

  cabeceraFac(){
    let paramsE = {
      Empresa   : this.Env,
      Cliente   : this.cliente,
      Documento : Number(this.documento)
    }
    let params = {
     "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA('${paramsE['Empresa']}', 1,  ${paramsE['Cliente']},${paramsE['Documento']},${this.anioActual}0101, ${this.anioActual}1231)`,
      "env": "PRD"
    }
    // let params = {
    //   "query": "CALL DC@HONLIB.SP_AWS_LISTA_FACTURA ('RH', 1, 1965, 100031795, 20210101, 20221231)",
    //   "env": "PRD"
    // }

  this.facturacionS.As400( params ).subscribe(
    (res:any)=>{
      // console.log( res )
      this.cabeceraF = res;
      let fecha : string = String(this.cabeceraF[0]?.FDCCTC);
      this.dia  =  fecha.substring(6,8);
      this.mes  =  fecha.substring(4,6);
      this.anio =  fecha.substring(0,4);
      this.loading1 = true;
    }
  )
  }

  DetallecabeceraFac(){
    let paramsE = {
      Empresa   : this.Env,
      Cliente   : this.cliente,
      Documento : Number(this.documento)
    }
    let params = {
      "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_DETALLE('${paramsE['Empresa']}',1,${paramsE['Documento']})`,
       "env": "PRD"
     }
  this.facturacionS.As400( params ).subscribe(
    (res:any[])=>{
      if( res.length > 0 ){
             // this.DcabeceraF = res;
      for(let i=0; i< res.length; i++){
        // console.log( res[i]['TCMTRF'] )
   
  if( res[i]['TCMTRF'] == 'IVA' || res[i]['TCMTRF'] == 'IMPUESTO AL VALOR AGREGADO'){
        }else{
      this.DcabeceraF.push(res[i]);

//         if ( this.DcabeceraF[0]){
//   for(let k = 0; k < this.DcabeceraF.length ; k++){
//     if( this.DcabeceraF[k]['TCMTRF'] == res[i]['TCMTRF'] ) {
//       this.DcabeceraF[k]['IVLDCS']   += res[i]['IVLDCS']
//     }else{
//       this.DcabeceraF.push(res[i])
//     }
// }
//        }else{
//       this.DcabeceraF.push(res[i])
//         }
      // this.DcabeceraF.push(res[i])
        }
    }
    for(let j=0; j<(15-this.DcabeceraF.length); j++){
        this.espaciosBlancos.push(j)
    }
    this.DcabeceraF =  this.descomponerArray(this.DcabeceraF);
    this.cargarObservacionesFac()
    this.loading2 = true;
      }
    }
  )
  }
  
cargarObservacionesFac(){
  // Observaciones
  let paramsE = {
    Empresa   : this.Env,
    Cliente   : this.cliente,
    Documento : Number(this.documento)
  }
  let params = {
    "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_OBCTC('${paramsE['Empresa']}',1,${paramsE['Documento']})`,
     "env": "PRD"
   }
   this.facturacionS.As400( params ).subscribe(
    (res:any[])=>{
      if( res ){
          this.EstrObs1 = res;
          this.EstructurarObservaciones( this.EstrObs1)
      }
    }
  )
}


EstructurarObservaciones( array : any[]){
    for( let i = 0; i < array.length; i++ ){
        if ( array[i]['CTPDCC'] == 2 ){
            this.EstrObs2.push(array[i])
        }
    }

    for( let i = 0; i < this.EstrObs2.length; i++ ){
     this.Observaciones += ' ' + this.EstrObs2[i]['TOBCTC']
  }
    // console.log( this.EstrObs2)
    // console.log( this.Observaciones)
}

  retornarArraryAcum( objeto : any[]){
    let guardado : any[] = [];

    for(let i = 0; i < objeto.length; i++ ){

    }
  }
  
  retornarSubtotal(){
    return Acumulador(this.DcabeceraF,'IVLDCS')
  }
  retornarTotal(){
    let total : number = Acumulador(this.DcabeceraF,'IVLDCS') + Number(this.cabeceraF[0]['IVLIGS'])
    return total;
  }

  retornarLetra( campo : string){
    if( campo.includes(" - EXP") || campo.includes(" EXP") || campo.includes(" EXONERADO")) {
        return 'E'
    }else{
      return 'G'
    }
  }

  retornarCorrelativo(){
    let correlativo : string = this.cabeceraF[0]['NDCCTC'];
    return correlativo.substring(1,correlativo.length)
  }
  retornarCorrelativoPDF(){
    let correlativo : string = this.cabeceraF[0]['NDCCTC'];
    return correlativo.substring(3,correlativo.length)
  }

  GenerarPdf(){
    this.sharedS.pdfFactura('Factura',  `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}FACOriginal`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    ${this.cabeceraF[0]['TCMPCL']}`,{
      numeroFactura: `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}`,
      factura : 'Factura Ransa',
      titulo : ''
    })

    // this.sharedS.pdfFacturaD('cliente', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Cliente`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    // ${this.cabeceraF[0]['TCMPCL']}`)

    // this.sharedS.pdfFacturaD('archivo', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Archivo`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    // ${this.cabeceraF[0]['TCMPCL']}`)
    }

  descomponerArray( array : detalleCabecera[] ){
      let arrayC : detalleCabecera[];
      // console.log(array[0])
      // arrayC.push(array[0]);
      arrayC = [{
CCNCSD:array[0]['CCNCSD'],
CRBCTC:array[0]['CRBCTC'],
CUNCNA:array[0]['CUNCNA'],
CUTCTC:array[0]['CUTCTC'],
ITRCTC:array[0]['ITRCTC'],
IVLDCD:array[0]['IVLDCD'],
IVLDCS:0,
NCRDCC:array[0]['NCRDCC'],
NDCCTC:array[0]['NDCCTC'],
QAPCTC:array[0]['QAPCTC'],
TCMTRF:array[0]['TCMTRF']
      }]
      
      for( let i = 0; i < array.length; i++ ){
      // console.log(array[i]['TCMTRF'],array[i]['IVLDCS'])
      // console.log(array[i])
      // console.log(arrayC.length)

      /* FALLA PORQUE NO CONTROLA LA IGUALACION DENTRO DEL CICLO  
      ¿Variable temporal?
      */
                let bandera = false;
               for(let j = 0; j < arrayC.length; j++){
              if(arrayC[j]['TCMTRF'] == array[i]['TCMTRF'] ){
                bandera = true;
                arrayC[j]['IVLDCS']  +=  Number(array[i]['IVLDCS'])
                // arrayC[j]['ITRCTC']  +=  Number(array[i]['IVLDCS'])
               }else{
                 //  break
                }
              }

              if( !bandera ){
                arrayC.push(
               {
                CCNCSD:array[i]['CCNCSD'],
                CRBCTC:array[i]['CRBCTC'],
                CUNCNA:array[i]['CUNCNA'],
                CUTCTC:array[i]['CUTCTC'],
                ITRCTC:Number(array[i]['ITRCTC']),
                IVLDCD:array[i]['IVLDCD'],
                IVLDCS:Number(array[i]['IVLDCS']),
                NCRDCC:array[i]['NCRDCC'],
                NDCCTC:array[i]['NDCCTC'],
                QAPCTC:array[i]['QAPCTC'],
                TCMTRF:array[i]['TCMTRF']
               }
                );
              }

            }
            return arrayC;

    }

  retornarPrecioUnitario( index : number, cantidad : number ){
      if ( cantidad != 1 ){
          return this.DcabeceraF[index]?.ITRCTC
        }else{
          return this.DcabeceraF[index]?.IVLDCS
        }
  }
}


export interface dataManual {
  cantidad    : number,
  descripcion : string,
  Punitario   : string,
  descuento   : number,
  impuesto    : string,
  total       : string
}