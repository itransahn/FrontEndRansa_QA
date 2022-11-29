import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cabeceraFactura, detalleCabecera } from 'src/app/interfaces/Factura';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-nc',
  templateUrl: './nc.component.html',
  styleUrls: ['./nc.component.scss']
})
export class NcComponent implements OnInit {
  public anioActual = new Date().getFullYear();
  public Emp        :  number;
  public Env        =  '';
  public cliente    =  ''; 
  public documento  =  '';
  public cabeceraN   : cabeceraFactura[] = [];
  public DcabeceraN  : detalleCabecera[] = [];
  public dia : string;
  public mes : string;
  public anio : string;
  public loading = false;
  public loading1 = false;
  public DcabeceraF : any[] = [
    {
      descripcion : 'Otros-EXP',
      Subtotal    : 189496.98,
      Impuesto    : 0.00,
      MTotal      : 189496.98
    } 
  ];

  public espaciosBlancos = [1,2,3,4];
  public anulacion = true;
  public devolcion = false;
  public descuento = false;
  public disabled  = true;

  public leyendaInterna = ' BL No.  CONTENEDORES MEDUX5035795  MEDU9423500,FFAU3016235, MSMU4209438, MSMU4722250, FACTURA No. MSMU4209438,MSMU4722250, MINB4944 MSMU8235780, CAIU4870715, CAIU7574086, MSMU4715780 '
  constructor(
    public facturacionS : FacturacionService,
    public ruta         : ActivatedRoute
  ) { }

  ngOnInit() {
    this.PreCargaData();
    this.cargarCabeceraN();
    this.DetallecabeceraN();
  }

  PreCargaData(){
    if( this.ruta.snapshot.params['empresa'] == 'AH' ){
      this.documento = '6000'+ (this.ruta.snapshot.params['documento'])
      this.cliente   = (this.ruta.snapshot.params['cliente']);
      this.Env       = (this.ruta.snapshot.params['empresa'])

      console.log( this.documento, this.cliente, this.Env)
    }

    if( this.ruta.snapshot.params['empresa'] == 'RH' ){
      this.documento = '6000'+ (this.ruta.snapshot.params['documento'])
      this.cliente   = (this.ruta.snapshot.params['cliente']);
      this.Env       = (this.ruta.snapshot.params['empresa'])
      console.log( this.documento, this.cliente, this.Env)

    }
   

  }

  cargarCabeceraN(){
    let paramsE = {
      Empresa   : this.Env,
      Cliente   : this.cliente,
      Documento : Number(this.documento)
    }
    let params = {
     "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA('${paramsE['Empresa']}', 3,  ${paramsE['Cliente']},${paramsE['Documento']},${this.anioActual}0101, ${this.anioActual}1231)`,
      "env": "PRD"
    }
  this.facturacionS.As400( params ).subscribe(
    (res:any)=>{
      this.cabeceraN = res;
      if ( this.cabeceraN.length > 0) {
        console.log( this.cabeceraN )
        this.loading = true;
      }
      let fecha : string = String(this.cabeceraN[0]?.FDCCTC);
      this.dia  =  fecha.substring(6,8);
      this.mes  =  fecha.substring(4,6);
      this.anio =  fecha.substring(0,4);
    }
  )
  }

  DetallecabeceraN(){
    let paramsE = {
      Empresa   : this.Env,
      Cliente   : this.cliente,
      Documento : Number(this.documento)
    }
    let params = {
      "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_DETALLE('${paramsE['Empresa']}',3,${paramsE['Documento']})`,
       "env": "PRD"
     }
  this.facturacionS.As400( params ).subscribe(
    (res:any[])=>{
      if( res.length > 0 ){
        // this.DcabeceraN = res 
        // console.log( this.DcabeceraN )
        for(let i=0; i< res.length; i++){
    if( res[i]['TCMTRF'] == 'IVA' || res[i]['TCMTRF'] == 'IMPUESTO AL VALOR AGREGADO'){
          }else{
        this.DcabeceraN.push(res[i]);
          }
      }
        if ( this.DcabeceraN.length > 0){
        console.log( this.DcabeceraN )
          this.loading1 = true;
        }
      }
    }
  )
  }
}
