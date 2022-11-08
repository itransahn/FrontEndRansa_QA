import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
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
  selector: 'app-form-cambio',
  templateUrl: './form-cambio.component.html',
  styleUrls: ['./form-cambio.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class FormCambioComponent implements OnInit {

  public estados           : any;
  public cambiosForm : FormGroup;
  public tiposLlanta : any[] = [];
  public catalogo : any[]=[];
  public lotes    : any[]=[];

  constructor(
    private dialogRef: MatDialogRef <FormCambioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth      : AuthService,
    public seguridad : SeguridadService,
    public toast     : ToastServiceLocal,
    public excelenciaS : ExcelenciaService
  ) { }

  ngOnInit() {
    this.CargarCatalogo();
    this.cargarLote();
    this.formCambios();
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.cambiosForm.patchValue({
      tipoMaquina : this.data['tipoMaquina'],
      Maquina     : this.data['id_maquina'],
      tipoLlanta  : this.data['idLlanta'],
      ladoCambiar : Number(this.data['idLado']),
      Lote        : this.data['idStock'],
      // disponible  : this.data[''],
      fecha       : this.data['Fecha'],
      comentario  : this.data['Comentarios'],
    })

    if( this.data['idLlanta'] ){
    this.cargarLote();
    this.cargarTipoLlanta();
    this.CantidadLote()
    }
  }

  CantidadLote(  ){
    let url = "excelencia/lotesTipo";
    let params = {
      tipoLlanta : this.data['idLlanta'],
      lote       : this.data['LOTE'],
    }
    this.excelenciaS.post( url, params ).subscribe(
      res=>{
        if ( res) {
          this.cambiosForm.patchValue({
            disponible : res?. data?.Table0[0]['stockActual']
          })
        }
      }
    )
  }

  cargarTipoLlanta(  ){
    let url = "excelencia/tipoLlantas";
    let params = {
      tipoMaquina : this.data['tipoMaquina']
    }
    this.excelenciaS.post( url, params ).subscribe(
      res=>{
          this.tiposLlanta = res?.data?.Table0
      }
    )
  }

  cargarLote(  ){
    let url = "excelencia/lotesportipo";
    let params = {
      tipoLlanta : this.data['idLlanta']
    }
    this.excelenciaS.post( url, params ).subscribe(
      res=>{
        this.lotes = res?.data?.Table0
      }
    )
  }

  CargarCatalogo (){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{
      if ( res['areasRansa'] ){
        this.catalogo = res;
      }  }
    )
  }

  private formCambios(){
    this.cambiosForm = new FormGroup({
      tipoMaquina : new FormControl({ value :'', disabled : true }, [ Validators.required] ),
      Maquina     : new FormControl({ value :'', disabled : false}, [ Validators.required] ),
      tipoLlanta  : new FormControl({ value :'', disabled : true }, [ Validators.required] ),
      ladoCambiar : new FormControl({ value :'', disabled : false}, [ Validators.required] ),
      Lote        : new FormControl({ value :'', disabled : true }, [ Validators.required] ),
      disponible  : new FormControl({ value :'', disabled : true }, [ ] ),
      fecha       : new FormControl({ value :'', disabled : false}, [ Validators.required] ),
      comentario  : new FormControl({ value :'', disabled : true }, [ Validators.required] ),
      comentarioU : new FormControl({ value :'', disabled : false}, [ Validators.required] ),
    })
}


submit(){
  let url = 'excelencia/updCambiosLlanta';
let params = {
  idCambio      : this.data['ID'],
  idMaquina     : this.cambiosForm.value?.Maquina,
  ladoCambiar   : this.cambiosForm.value?.ladoCambiar != Number(this.data['idLado']) ? this.cambiosForm.value?.ladoCambiar : Number(this.data['idLado']) ,
  fecha         : this.cambiosForm.value?.fecha != this.data['Fecha'] ? this.cambiosForm.value?.fecha : this.data['Fecha'],
}
this.excelenciaS.post(url,params).subscribe( res=>{
if ( !res.hasError){
  if ( res?.data.Table0[0]['codigo'] == -1 ){
    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
}else{
    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
    this.bitacoraCambios();
  this.dialogRef.close();
}
}else{
this.toast.mensajeError(String(res?.errors),"Error")
}
})
}

bitacoraCambios(){
  let url = 'excelencia/bitUpdCambios'; 
  let params = {
    tipoMaquina      : this.data['ID'],
    maquinaAnterior  : this.data['id_maquina'],
    tipoLlanta       : this.cambiosForm.value?.ladoCambiar != Number(this.data['idLado']) ? this.cambiosForm.value?.ladoCambiar : Number(this.data['idLado']) ,
    lote             : this.cambiosForm.value?.Lote,
    ladoanterior      : this.data['LlantaCambiada'],
    ladoActual        : this.cambiosForm.value?.ladoCambiar,
    fechaAnterior     : this.data['Fecha'],
    fechaModificacion : this.cambiosForm.value?.fecha,
    usuarioModifica   : this.auth.dataUsuario['id_usuario'],
    idCambioLlanta    : this.data['ID'],
    motivoCambio      : this.cambiosForm.value?.comentarioU,
    maquinaNueva      : this.cambiosForm.value?.Maquina,
    accion            : 1
  }
  this.excelenciaS.post(url,params).subscribe( res=>{
  if ( !res.hasError){

  }else{
  this.toast.mensajeError(String(res?.errors),"Error")
  }
  })
}

close(){
  this.dialogRef.close()
}

}
