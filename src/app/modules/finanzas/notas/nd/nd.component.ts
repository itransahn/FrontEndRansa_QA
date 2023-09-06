import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { cabeceraFactura, detalleCabecera, retornarMes } from 'src/app/interfaces/Factura';
import { Acumulador, mensajes } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { FacturacionService } from '../../facturacion.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nd',
  templateUrl: './nd.component.html',
  styleUrls: ['./nd.component.scss']
})
export class NdComponent implements OnInit {

  public form : FormGroup;
  public espaciosBlancos2 = [];
  public detalleServicios : dataManual[] = [];
  public tipo: any;
  
  public anioActual = new Date().getFullYear();
  public sede : number ;
  public Emp        :  number;
  public Env        =  '';
  public cliente    =  ''; 
  public documento  =  '';
  public cabeceraN   : cabeceraFactura[] = [];
  public DcabeceraN  : detalleCabecera[] = [];
  public Observaciones : string ='';
  public Motivo   : string ='';
  public EstrObs1 : any[] = [];
  public EstrObs2 : any[] = [];
  public dia    : string;
  public mes    : string;
  public mesN   : string;
  public anio   : string;
  public letras : string;
  public loading   = false;
  public loading1  = false;
  public permitido = false;
  public parametros    : any[]= [];
  public parametrosCai : any[]= [];
  public espaciosBlancos = [];

  public anulacion = false;
  public devolcion = false;
  public descuento = false;
  public disabled  = true;

  constructor( 
  public facturacionS : FacturacionService,
  public ruta         : ActivatedRoute,
  public toast        : ToastServiceLocal,
  public sharedS      : SharedService
      ) { }
      ngOnInit() {
        this.tipo = this.ruta.snapshot.params?.['tipo'];
        this.cargarForm();
        this.PreCargaData();
        this.validarCorrelativo()
        this.cargarCabeceraN();
        this.DetallecabeceraN();
        this.cargarParametrosF();
      }
    

      cargarForm(){
        this.form = new FormGroup({
        cantidad   : new FormControl('', [ Validators.required]),
        punitario  : new FormControl('', [ Validators.required]),
        detalle    : new FormControl('', [ Validators.required]),
        impuesto   : new FormControl('', [ Validators.required]),
            })
          }
        
          total( descripcion : string, monto : number){ 
            let isv   : number;
            let total : number;
            
            if ( this.tipo == 0){
              if(descripcion.includes('EX') || descripcion.includes("ex") ){
                total = (monto);
              }else{
                  isv = (monto * 0.15) ;
                total =  (monto  + isv );
              }
            }
        
            if ( this.tipo == 1){
              if(descripcion.includes('EX') || descripcion.includes("ex") ){
                total = (monto) ;
              }else{
                  isv = (monto * 0.15) ;
                total =  (monto  + isv ) ;
              }
            }
        // 
            return total;
          }       
          llenarDataManual(){
            this.espaciosBlancos2 = []
            this.detalleServicios.push({
             cantidad    : this.form.value.cantidad,
             descripcion : this.form.value.detalle,
             Punitario   : this.form.value.punitario,
             descuento   : 0,
             impuesto    : this.form.value.impuesto,
             total       : (Number(this.form.value.punitario)  + Number(this.form.value.impuesto) ),
            })
          
            for(let j=0; j<(10-this.detalleServicios.length); j++){
              this.espaciosBlancos2.push(j)
          }
            this.form.reset()
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
        return numeroALetras((Number(this.cabeceraN[0]?.['ITTFCS']) * -1),{})
    }
    
    cargarCabeceraN(){
        let paramsE = {
          Empresa   : this.Env,
          Cliente   : this.cliente,
          Documento : Number(this.documento)
        }
        let params = {
         "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA('${paramsE['Empresa']}', 2,  ${paramsE['Cliente']},${paramsE['Documento']},20180101, ${this.anioActual}1231)`,
          "env": "PRD"
        }
      this.facturacionS.As400( params ).subscribe(
        (res:any)=>{
          this.cabeceraN = res;
          if ( this.cabeceraN.length > 0) {
            this.loading = true;
          }
          let fecha : string = String(this.cabeceraN[0]?.FDCCTC);
          this.dia  =  fecha.substring(6,8);
          this.mes  =  fecha.substring(4,6);
          this.mesN =  fecha.substring(4,6);
          this.mes  =  retornarMes(this.mes);
          this.letras = numeroALetras( Number(this.cabeceraN[0]?.['ITTFCS']),{})
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
            
            for(let i=0; i< res.length; i++){
        if( res[i]['TCMTRF'] == 'IVA' || res[i]['TCMTRF'] == 'IMPUESTO AL VALOR AGREGADO'){
              }else{
            this.DcabeceraN.push(res[i]);
              }
          }
            if ( this.DcabeceraN.length > 0){
              this.cargarObservacionesFac()
              this.loading1 = true;
            }
            for(let j = this.DcabeceraN.length; j<(30-this.DcabeceraN.length); j++){
              this.espaciosBlancos.push(j)
            }
          }
        }
      )
      }

      retornarTotal(){
        let total : number = Acumulador(this.DcabeceraN, 'IVLDCS')
        return total;
      }
      
      cargarObservacionesFac(){
        // Observaciones
        let paramsE = {
          Empresa   : this.Env,
          Cliente   : this.cliente,
          Documento : Number(this.documento)
        }
        let params = {
          "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA_OBCTC('${paramsE['Empresa']}',2,${paramsE['Documento']})`,
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
      
      retornarTotalIsv(){
        let total: number = 0;
        let isv  : number = 0;
        for(let i=0; i< this.DcabeceraN.length; i++){
          if( this.DcabeceraN[i]?.TCMTRF.includes('EX') || this.DcabeceraN[i]?.TCMTRF.includes('ex') ){
            total += 0;
          }else{
            isv = this.DcabeceraN[i]?.IVLDCS* 0.15;
            total += ( isv );
          }
      }
        return total;
    
      }
      
    
    
      retornarTotalN(){
        let total: number = 0;
        let isv  : number = 0;
        for(let i=0; i< this.DcabeceraN.length; i++){
          if( this.DcabeceraN[i]?.TCMTRF.includes('EX') || this.DcabeceraN[i]?.TCMTRF.includes('ex') ){
            total += ( Number(this.DcabeceraN[i]?.IVLDCS));
          }else{
            isv = 0;
            isv    = Number(this.DcabeceraN[i]?.IVLDCS) * 0.15;
            total += (Number(this.DcabeceraN[i]?.IVLDCS) + isv );
          }
      } 
        return (total);
        }
      
      EstructurarObservaciones( array : any[]){
          for( let i = 0; i < array.length; i++ ){
              if (    (array[i]['TOBCTC']).includes('ND') || (array[i]['TOBCTC']).includes('N/D')
                   || (array[i]['TOBCTC']).includes('nd') || (array[i]['TOBCTC']).includes('n/d') ){
                this.Motivo = array[i]['TOBCTC'];
              }else{
                this.EstrObs2.push(array[i])
              }
          }
      
          for( let i = 0; i < this.EstrObs2.length; i++ ){
           this.Observaciones += this.EstrObs2[i]['TOBCTC']
        }
          // 
      }
           
    retornarImpuesto( descripcion : string, cantidad : number){
        let monto  : number = 0;
        if( this.tipo == 0 ){
          if(descripcion.includes('EX') || descripcion.includes(" ex") ){
            monto =  0;
          }else{
            monto = (cantidad * 0.15) ;
          }
        }
    
        if( this.tipo == 1 ){
          if(descripcion.includes('EX') || descripcion.includes(" ex") ){
            monto = 0;
          }else{
            monto = (cantidad * 0.15) ;
          }
        }
    
    return monto
       
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
    
      retornarCorrelativo( ){
        let correlativo : string = this.cabeceraN[0]['NDCCTC'];
        return correlativo.substring(1,correlativo.length)
      } 
      
      retornarCorrelativoND( ){
        let correlativo : string = this.cabeceraN[0]['NDCCTC'];
        return correlativo.substring(4,correlativo.length)
      } 
      validarCorrelativo(){
        let url = 'finanzas/validarNum'
        let params = {
          correlativo : Number(this.ruta.snapshot.params['documento']),
          sede        : this.sede,
          tipo        : 2
        }
        // 
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

      GenerarPdf(){
        this.sharedS.pdfNotas('originalN',  `${this.retornarCorrelativoND()}_${this.cabeceraN[0]['TCMPCL']}NDOriginal`,'Nota de débito de Ransa', `Seguro de generar PDF de Nota ${this.cabeceraN[0]['NDCCTC']} del CLIENTE
        ${this.cabeceraN[0]['TCMPCL']}`,{
          numeroFactura: `${this.retornarCorrelativoND()}_${this.cabeceraN[0]['TCMPCL']}`,
          factura : 'Nota de débito Ransa',
          titulo : '',
          tipo   : 'ND'
        })
      }


      
}


interface dataManual {
  cantidad    : number,
  descripcion : string,
  Punitario   : string,
  descuento   : number,
  impuesto    : string,
  total       : number
}