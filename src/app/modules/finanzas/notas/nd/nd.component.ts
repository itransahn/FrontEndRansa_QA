import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { cabeceraFactura, detalleCabecera, retornarMes } from 'src/app/interfaces/Factura';
import { mensajes } from 'src/app/interfaces/generales';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-nd',
  templateUrl: './nd.component.html',
  styleUrls: ['./nd.component.scss']
})
export class NdComponent implements OnInit {
  public anioActual = new Date().getFullYear();
  public sede : number ;
  public Emp        :  number;
  public Env        =  '';
  public cliente    =  ''; 
  public documento  =  '';
  public cabeceraN   : cabeceraFactura[] = [];
  public DcabeceraN  : detalleCabecera[] = [];
  public dia : string;
  public mes : string;
  public anio : string;
  public letras : string;
  public loading = false;
  public loading1 = false;
  public permitido = false;
  public parametros    : any[]= [];
  public parametrosCai : any[]= [];

  public espaciosBlancos = [1,2,3,4];
  public anulacion = false;
  public devolcion = false;
  public descuento = false;
  public disabled  = true;

  public leyendaInterna = ' BL No.  CONTENEDORES MEDUX5035795  MEDU9423500,FFAU3016235, MSMU4209438, MSMU4722250, FACTURA No. MSMU4209438,MSMU4722250, MINB4944 MSMU8235780, CAIU4870715, CAIU7574086, MSMU4715780 '
 constructor( 
  public facturacionS : FacturacionService,
  public ruta         : ActivatedRoute,
  public toast        : ToastServiceLocal
      ) { }
      ngOnInit() {
        this.PreCargaData();
        this.validarCorrelativo()
        this.cargarCabeceraN();
        this.DetallecabeceraN();
        this.cargarParametrosF();
      }
    
      PreCargaData(){
        if( this.ruta.snapshot.params['empresa'] == 'AH' ){
          this.sede = 2;
          this.documento = '7000'+ (this.ruta.snapshot.params['documento'])
          this.cliente   = (this.ruta.snapshot.params['cliente']);
          this.Env       = (this.ruta.snapshot.params['empresa'])
        }
    
        if( this.ruta.snapshot.params['empresa'] == 'RH' ){
          this.sede = 1
          this.documento = '7000'+ (this.ruta.snapshot.params['documento'])
          this.cliente   = (this.ruta.snapshot.params['cliente']);
          this.Env       = (this.ruta.snapshot.params['empresa'])
    
        }
      }
    
      convertirNumLetra( numero : any){
        return numeroALetras((Number(this.cabeceraN[0]['ITTFCS']) * -1),{})
    }
    
    cargarCabeceraN(){
        let paramsE = {
          Empresa   : this.Env,
          Cliente   : this.cliente,
          Documento : Number(this.documento)
        }
        let params = {
         "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA('${paramsE['Empresa']}', 2,  ${paramsE['Cliente']},${paramsE['Documento']},${this.anioActual}0101, ${this.anioActual}1231)`,
          "env": "PRD"
        }
      this.facturacionS.As400( params ).subscribe(
        (res:any)=>{
          this.cabeceraN = res;
          console.log( this.cabeceraN )
          if ( this.cabeceraN.length > 0) {
            this.loading = true;
          }
          let fecha : string = String(this.cabeceraN[0]?.FDCCTC);
          this.dia  =  fecha.substring(6,8);
          this.mes  =  fecha.substring(4,6);
          this.mes  =  retornarMes(this.mes);
          this.letras = numeroALetras((Number(this.cabeceraN[0]?.ITTFCS) * -1),{})
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
          "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_DETALLE('${paramsE['Empresa']}',2,${paramsE['Documento']})`,
           "env": "PRD"
         }
      this.facturacionS.As400( params ).subscribe(
        (res:any[])=>{
          if( res.length > 0 ){
            // this.DcabeceraN = res 
            console.log( this.DcabeceraN )
            for(let i=0; i< res.length; i++){
        if( res[i]['TCMTRF'] == 'IVA' || res[i]['TCMTRF'] == 'IMPUESTO AL VALOR AGREGADO'){
              }else{
            this.DcabeceraN.push(res[i]);
              }
          }
            if ( this.DcabeceraN.length > 0){
              this.loading1 = true;
            }
          }
        }
      )
      }
    
      cargarParametrosF(){
        let url='seguridad/parametrosF';
        let params = {
          sede : this.sede,
          tipo : 2
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
    
      retornarCorrelativo( valor){
        let correlativo : string = this.cabeceraN[0]['NDCCTC'];
        return correlativo.substring(1,correlativo.length)
      }
    
    
      validarCorrelativo(){
        let url = 'finanzas/validarNum'
        let params = {
          correlativo : Number(this.ruta.snapshot.params['documento']),
          sede        : this.sede,
          tipo        : 2
        }
        console.log( params )
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

}
