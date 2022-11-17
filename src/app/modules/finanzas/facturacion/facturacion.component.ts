import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { cabeceraFactura, detalleCabecera } from 'src/app/interfaces/Factura';
import { Acumulador } from 'src/app/interfaces/generales';
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
  public dolares = [];
  public parametros = [];
  public fecha = new Date()
  public espaciosBlancos = [];
  public cabeceraF  : cabeceraFactura[] = [];
  public DcabeceraF : detalleCabecera[] = [];
  public cliente : number = 0;
  public documento : number = 0;
  public loading1 = false;
  public loading2 = false;

  public obs : string = "SERVICIO TRAMITE ADUANAL, BL NO MEDUX5035795, FACTURA NO:MINB4944 CONTENEDORES: MEDU9423500, FFAU3016235, MSMU4209438, MSMU4722250 MSMU8235780, CAIU4870715,CAIU75744086, MSMU4715760"

  constructor( 
    public sharedS      : SharedService,
    public facturacionS : FacturacionService,
    public ruta : ActivatedRoute,
    public dialog : MatDialog
    ) { }

  ngOnInit(){
    this.cliente   = Number(this.ruta.snapshot.params['cliente'])
    this.documento = Number(this.ruta.snapshot.params['documento'])
    this.cargarParametrosF()
    this.cabeceraFac()
    this.DetallecabeceraFac();
  }

  validacion(){
    this.cliente   = Number(this.ruta.snapshot.params['cliente'])
    this.documento = Number(this.ruta.snapshot.params['documento'])

    if ( this.cliente == 0 && this.documento == 0 ){
      this.modal()
    }else{
    this.cargarParametrosF()
    this.cabeceraFac()
    this.DetallecabeceraFac();
    }
  }

  modal( ){
    const dialogReg = this.dialog.open( ModalComponent,{
      width  :   '500px',
      height :   'auto',
      maxWidth:  'auto',
      data    :  { },
      disableClose : true
    })
  }

  cargarParametrosF(){
    let url='seguridad/parametrosF';
    let params = {
      sede : 1
    }
  this.facturacionS.post(url,params).subscribe(
    (res:DataApi | any )=>{
        if( !res?.hasError ){
            this.parametros = res.data.Table0;
            // console.log( this.parametros )
        }
    }
  )
  }

  convertirNumLetra( numero : any){
      return numeroALetras(numero,{})
  }

  cabeceraFac(){
    let paramsE = {
      Empresa   : 'AH',
      Cliente   : this.cliente,
      Documento : this.documento
    }
    let params = {
     "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA('${paramsE['Empresa']}', 1,  ${paramsE['Cliente']},${paramsE['Documento']},20210101, 20221231)`,
      "env": "PRD"
    }
    // let params = {
    //   "query": "CALL DC@HONLIB.SP_AWS_LISTA_FACTURA ('RH', 1, 1965, 100031795, 20210101, 20221231)",
    //   "env": "PRD"
    // }

  this.facturacionS.As400( params ).subscribe(
    (res:any)=>{
      // console.log( res )
      this.cabeceraF = res
      this.loading1 = true;
    }
  )
  }

  DetallecabeceraFac(){
    let paramsE = {
      Empresa   : 'AH',
      Cliente   : this.cliente,
      Documento : this.documento
    }
    let params = {
      "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_DETALLE('${paramsE['Empresa']}',1,${paramsE['Documento']})`,
       "env": "PRD"
     }
  this.facturacionS.As400( params ).subscribe(
    (res:any[])=>{
      // this.DcabeceraF = res;
      for(let i=0; i< res.length; i++){
          // console.log( res[i]['TCMTRF'] )
     
    if( res[i]['TCMTRF'] == 'IVA' || res[i]['TCMTRF'] == 'IMPUESTO AL VALOR AGREGADO'){
          }else{
        this.DcabeceraF.push(res[i])

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
      for(let j=0; j<(8-this.DcabeceraF.length); j++){
          this.espaciosBlancos.push(j)
      }
      // console.log(this.DcabeceraF)
      this.loading2 = true;
    }
  )
  }

  
  // if ( this.DcabeceraF.length != 0){
  //   for(let k = 0; k < this.DcabeceraF.length ; k++){
  //     if( this.DcabeceraF[k]['TCMTRF'] === res[i]['TCMTRF'] ) {
  //       this.DcabeceraF[k]['IVLDCS']   += res[i]['IVLDCS']
  //     }else{
  //     this.DcabeceraF.push(res[i])
  //     }
  // }
  //  }else{
  // this.DcabeceraF.push(res[i])
  //  }



  retornarArraryAcum( objeto : any[]){
    let guardado : any[] = [];

    for(let i = 0; i < objeto.length; i++ ){

    }
  }
  
  retornarSubtotal(){
    return Acumulador(this.DcabeceraF,'ITRCTC')
  }
  retornarTotal(){
    let total : number = Acumulador(this.DcabeceraF,'ITRCTC') + Number(this.cabeceraF[0]['IVLIGS'])
    return total;
  }

  retornarLetra( campo : string){
    if( campo.includes(" - EXP") || campo.includes(" EXP")){
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
      this.sharedS.pdfFactura('Factura',  `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Original`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
       ${this.cabeceraF[0]['TCMPCL']}`)

       this.sharedS.pdfFacturaD('cliente', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Cliente`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
       ${this.cabeceraF[0]['TCMPCL']}`)

       this.sharedS.pdfFacturaD('archivo', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Archivo`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
       ${this.cabeceraF[0]['TCMPCL']}`)
    }
}
