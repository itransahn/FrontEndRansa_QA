import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catalogo } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelenciaService } from '../../../excelencia.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { mensajes } from 'src/app/interfaces/generales';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FormCambioComponent } from '../form-cambio/form-cambio.component';
import { ActivatedRoute } from '@angular/router';
const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-cambio',
  templateUrl: './cambio.component.html',
  styleUrls: ['./cambio.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class CambioComponent implements OnInit {
  public cambioForm  : FormGroup;
  public catalogo    : any[] = [];
  public tiposLlanta : any[] = [];
  public lotes       : any[] = [];
  
  constructor(
    public  auth        : AuthService,
    private excelenciaS : ExcelenciaService,
    private toast       : ToastServiceLocal, 
    private ruta        : ActivatedRoute
   ) { }

  ngOnInit(){
    this.CargarCatalogo();
    this.incializarForm();
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
  }

  CargarCatalogo (){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogo = res;
      }  }
    ) 
  }

  cargarTipoLlanta( ){
      let url = "excelencia/tipoLlantas";
      let params = {
        tipoMaquina : this.cambioForm.value?.tipoMaquina
      }
      this.excelenciaS.post( url, params ).subscribe(
        res=>{
            this.tiposLlanta = res?.data?.Table0
        }
      )
    }

  incializarForm(){
    this.cambioForm   = new FormGroup({
      tipoMaquina    : new FormControl( '', [ Validators.required] ),
      Maquina        : new FormControl( '', [ Validators.required] ),
      tipoLlanta     : new FormControl( '', [ Validators.required] ),
      ladoCambiar    : new FormControl( '', [ Validators.required] ),
      Lote           : new FormControl( '', [ Validators.required] ),
      disponible     : new FormControl( {value: '', disabled : true }, [ Validators.required] ),
      fecha          : new FormControl( '', [ Validators.required] ),
      comentario     : new FormControl( '', [ Validators.required] )
    })
}
cargarLote(  ){
  let url = "excelencia/lotesportipo";
  let params = {
    tipoLlanta : this.cambioForm.value?.tipoLlanta
  }
  this.excelenciaS.post( url, params ).subscribe(
    res=>{
        this.lotes = res?.data?.Table0
    }
  )
}

CantidadLote(  ){
  let url = "excelencia/lotesTipo";
  let params = {
    tipoLlanta : this.cambioForm.value?.tipoLlanta,
    lote       : this.cambioForm.value?.Lote,
  }
  this.excelenciaS.post( url, params ).subscribe(
    res=>{
      if ( res) {
        this.cambioForm.patchValue({
          disponible : res?. data?.Table0[0]['stockActual']
        })
      }
    }
  )
}

submit(){
    let url = 'excelencia/salidaLlantas';
  let params = {
    tipoLlanta      : this.cambioForm.value?.tipoLlanta,
    maquina         : this.cambioForm.value?.Maquina,
    usuario         : this.auth.dataUsuario['id_usuario'],
    lote            : this.cambioForm.value?.Lote,
    comentario      : this.cambioForm.value?.comentario,
    DetalleCambio   : this.cambioForm.value?.ladoCambiar,
    id_stockDetalle : this.cambioForm.value?.disponible,
    fecha           : this.cambioForm.value?.fecha,
  }
this.excelenciaS.put(url,params).subscribe( res=>{
  if ( !res.hasError){
    if ( res?.data.Table0[0]['codigo'] == -1 ){
      this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
  }else{
      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
      this.cambioForm.patchValue({
           tipoMaquina : '',
           Maquina     : '',
           tipoLlanta  : '',
           ladoCambiar : '',
           Lote        : '',
           disponible  : '',
           fecha       : '',
           comentario  : '',
      })
  }
}else{
this.toast.mensajeError(String(res?.errors),"Error")
}
})
}




}
