import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../excelencia.service';
import axios from 'axios';


@Component({
  selector: 'app-entrada-llantas',
  templateUrl: './entrada-llantas.component.html',
  styleUrls: ['./entrada-llantas.component.scss']
})
export class EntradaLLantasComponent implements OnInit {
  public catalogoData : catalogo | any[] = [];
  public llantasForm  : FormGroup;
  public pattern    = /^[0-9]+$/;
  public maxLength = 5;
  constructor( 
    public auth   : AuthService,
    private excelenciaS : ExcelenciaService,
    private toast : ToastServiceLocal,
    private ruta  : ActivatedRoute) { }

  ngOnInit(){
    this.catalogo();
    this.cargarForm();
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
    // this.auth.Insercion();
    // this.auth.Actualizacion();
    // this.auth.Eliminacion();
    // this.excelenciaS.postAs400({})

    // this.postAs400()
    this.pruebaAs400()
  }

  catalogo(){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogoData = res;
      }  }
    ) 
  }

  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }

  cargarForm(){
    this.llantasForm  = new FormGroup({
        tipoLlanta    : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        Cantidad      : new FormControl( { value : '', disabled : false }, [ Validators.required, Validators.pattern(this.pattern),Validators.maxLength(4)]),
        Precio        : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        Proveedor     : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
    })
  }

  insertarLlanta(){
    let url = "excelencia/entradaLlantas";
    let params = {
      cantidad      : this.llantasForm.value.Cantidad,
      idTipoLlanta  : this.llantasForm.value.tipoLlanta,
      precio        : this.llantasForm.value.Precio, 
      proveedor     : this.llantasForm.value.Proveedor,
      usuario       : this.auth.dataUsuario['id_usuario'],
    }
  this.excelenciaS.post( url, params ).subscribe(
    res=>{
      if(!res.hasError){
        if ( res?.data.Table0[0]['codigo'] == -1 ){
            this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
        }else{
          this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
          this.llantasForm.setValue({  
               tipoLlanta : '',
               Cantidad   : '',
               Precio     : '',
               Proveedor  : ''
          })
        }
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
  }
    }
  )
  
  }

pruebaAs400(){
  let params = {
    // query : "CALL DC@RNSLIB.SP_AWS_LISTA_FACTURA ('EZ', 51, 16168, 1390054395, 20220413, 20220413)",
    // env   : "PRD"
    
      "query": "CALL DC@HONLIB.SP_AWS_LISTA_FACTURA ('RH', 1, 1965, 100031795, 20210101, 20221231)",
      "env": "PRD"
  
  }
this.excelenciaS.pruebahttp( params ).subscribe(
  (res:any)=>{
if (res){
  // console.log(res)
}
  }
)
}


async postAs400  (  params?:any ){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  // headers.append('Content-Length', '407');
  // headers.append('Connection','keep-alive');
  // headers.append('keep-alive','timeout=5');
  // headers.append('Authorization','CIKBPPJPBBCFHBIEMGMNBLKNBAGNDEHEOIDNFDNDJDMDLFEMKLBMEECAEKKACOPJPICIIBLIADDMNKPLLOCPIHCDOAGGGEENFNNOEPEAKFGNKEJEDJGDMLKIDLMGODPP')
  // headers.append('Set-Cookie','bbbbbbbbbbbbbbb=CIKBPPJPBBCFHBIEMGMNBLKNBAGNDEHEOIDNFDNDJDMDLFEMKLBMEECAEKKACOPJPICIIBLIADDMNKPLLOCPIHCDOAGGGEENFNNOEPEAKFGNKEJEDJGDMLKIDLMGODPP; HttpOnly; secure')
  let vista = {
    query: `CALL DC@RNSLIB.SP_AWS_LISTA_FACTURA ('EZ', 51, 16168, 1390054395, 20220413, 20220413)`,
    env: 'PRD'
};

let conf = {
  method: 'post',
  baseURL: `https://secure.ransa.net`,
  url: `/callAS400`,
  data: JSON.stringify(vista),
  headers: { "Content-Type": "application/json"  }
};

let contenedores = await axios(conf);

  contenedores = contenedores.data;

  console.log(contenedores);
}

}
