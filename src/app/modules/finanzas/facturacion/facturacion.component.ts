import { Component, OnInit } from '@angular/core';
import { DataApi } from 'src/app/interfaces/dataApi';
import { cabeceraFactura, detalleCabecera } from 'src/app/interfaces/Factura';
import { Acumulador } from 'src/app/interfaces/generales';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { SharedService } from '../../shared/shared.service';
import { FacturacionService } from '../facturacion.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {
  public dolares = [];
  public parametros = [];
  public fecha = new Date()
  public espaciosBlancos = [1,2,3,4,5,6,7,8];
  public cabeceraF  : cabeceraFactura[] = [];
  public DcabeceraF : detalleCabecera[] = [];

  constructor( 
    public sharedS      : SharedService,
    public facturacionS : FacturacionService
    ) { }

  ngOnInit(){
    this.cargarParametrosF()
    this.cabeceraFac()
    this.DetallecabeceraFac();
    console.log(numeroALetras(12000, {}))
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
      Empresa   : 'RH',
      Cliente   : '1965',
      Documento : '100031795'
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
      console.log( res )
      this.cabeceraF = res
    }
  )
  }

  DetallecabeceraFac(){
    let paramsE = {
      Empresa   : 'RH',
      Cliente   : '1965',
      Documento : '100031795'
    }
    let params = {
      "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_DETALLE('${paramsE['Empresa']}', 1,${paramsE['Documento']})`,
       "env": "PRD"
     }
  this.facturacionS.As400( params ).subscribe(
    (res:any)=>{
      console.log( res )
      this.DcabeceraF = res;
      
    }
  )
  }
  
  retornarSubtotal(){
    return Acumulador(this.DcabeceraF,'ITRCTC')
  }



}
