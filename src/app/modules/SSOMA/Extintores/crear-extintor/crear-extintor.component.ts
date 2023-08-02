import { Component, OnInit, Inject } from '@angular/core';
import { SsmoaService } from '../../ssmoa.service';
import { catalogoExt } from 'src/app/interfaces/ssmoa';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { mensajes } from 'src/app/interfaces/generales';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

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
  selector: 'app-crear-extintor',
  templateUrl: './crear-extintor.component.html',
  styleUrls: ['./crear-extintor.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class CrearExtintorComponent implements OnInit {
  dataCatalogo : catalogoExt[] =[];
  public  Form   : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton    : boolean = false;
  public  titulo    : string;
  public  subtitulo : string;
  maxDate = new Date();
  public fecha : string ;

constructor(
    public ssoma : SsmoaService,
    private dialogRef:MatDialogRef<CrearExtintorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast       : ToastServiceLocal, 
    public auth: AuthService,
    public sweel : SweetAlertService
  ) { }

ngOnInit(){
    this.cargarCatalogo( this.data?.sede);
    this.validacion();
  }
  
validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Creación de Extintor` 
      this.subtitulo  = String(this.data?.['Nomenclatura']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Extintor`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion del Extintor` 
      this.subtitulo  = String(this.data?.data?.['Nomenclatura']); 
      this.cargarFormPut()
      this.SetForm()
    }



  }

agregar_dias(){
  this.Form.patchValue({
    fechaProximaCarga :  moment(this?.Form.value?.fechaAnteriorCarga).add(1,'years')
  })
}

close(){
    this.dialogRef.close()
  }

cargarCatalogo( Sede ){
    let params = {
      Sede  : Sede
    }
    this.ssoma.get('/ssmoa/catalogoExt', params).subscribe(
      (res: catalogoExt | any) =>{
         this.dataCatalogo = res;
      }
    )
  }


cargarFormGet(){
    this.Form = new FormGroup({
      tipoAgente   : new FormControl({ value: '', disabled : this.enable }, [] ),
      tipoExtintor : new FormControl({ value: '', disabled : this.enable }, [] ),
      vidaUtil     : new FormControl({ value: '', disabled : this.enable }, [] ),
      Capacidad    : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaAnteriorCarga   : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaProximaCarga   : new FormControl({ value: '', disabled : this.enable }, [] ),
      ubicacion    : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaCreacion  : new FormControl({ value: '', disabled : this.enable }, [] )
    })

}

cargarFormPost(){
  this.Form = new FormGroup({
      tipoAgente   : new FormControl({ value: '', disabled : this.enable }, [] ),
      tipoExtintor : new FormControl({ value: '', disabled : this.enable }, [] ),
      vidaUtil     : new FormControl({ value: '', disabled : this.enable }, [] ),
      Capacidad    : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaAnteriorCarga : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaProximaCarga  : new FormControl({ value: '', disabled : this.enable }, [] ),
      ubicacion     : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaCreacion : new FormControl({ value: '', disabled : this.enable }, [] )
  })
}

cargarFormPut(){
this.Form = new FormGroup({
  tipoAgente   : new FormControl({ value: '', disabled : this.enable }, [] ),
  tipoExtintor : new FormControl({ value: '', disabled : this.enable }, [] ),
  vidaUtil     : new FormControl({ value: '', disabled : this.enable }, [] ),
  Capacidad    : new FormControl({ value: '', disabled : this.enable }, [] ),
  fechaAnteriorCarga   : new FormControl({ value: '', disabled : this.enable }, [] ),
  fechaProximaCarga    : new FormControl({ value: '', disabled : this.enable }, [] ),
  ubicacion    : new FormControl({ value: '', disabled : this.enable }, [] ),
  fechaCreacion  : new FormControl({ value: '', disabled : false }, [] )
})
}

SetForm(){
this.Form.setValue({
  tipoAgente        :  this.data?.data?.['idAgente'],
  tipoExtintor      :  this.data?.data?.['idTipoExtintor'],
  vidaUtil          :  this.data?.data?.['vida_util'],
  Capacidad         :  this.data?.data?.['capacidad'],
  fechaAnteriorCarga : this.data?.data?.['Fecha_Anterior_Carga'],
  fechaProximaCarga  : this.data?.data?.['Fecha_Proxima_Carga'],
  ubicacion      :     this.data?.data?.['idUbicacion'],
  fechaCreacion  :     this.data?.data?.['fechaCreacion']
})
}

submit(){
  if( this.data?.bandera == 2){
    this.crearExtintor()
  }else{
    this.actualizarExtintor()
  }
}

crearExtintor(){
  this.sweel.mensajeConConfirmacion("Creación de Extintor","¿Seguro de guardar Cambios?","warning").then(
    res=>{
      if(res){
        let formValues = this.Form.value;
        let params = {
          sede         : this.data?.sede,
          tipoAgente   : formValues.tipoAgente,
          tipoExtintor : formValues.tipoExtintor,
          vidaUtil     : formValues.vidaUtil,
          capacidad    : formValues.Capacidad,
          Fecha_Anterior_Carga : formValues.fechaAnteriorCarga,
          Fecha_Proxima_Carga : formValues.fechaProximaCarga,
          usuario_creador     : this.auth.dataUsuario['id_usuario'],
          ubicacion           : formValues.ubicacion,
          fechaCreacion       : formValues.fechaCreacion
        }
      this.ssoma.post('ssmoa/extintor', params).subscribe(
        res=>{
          if( !res.hasError){
            if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
              this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
              this.close()
          }
          }
        }
      )
      }
    }
  )}

actualizarExtintor(){
this.sweel.mensajeConConfirmacion("Actualización de Extintor","¿Seguro de guardar Cambios?","warning").then(
  res=>{
    if (res){
      let formValues = this.Form.value;
  let params = {
    idExtintor   : this.data?.data?.['id_Extintor'],
    sede         : this.data?.sede,
    tipoAgente   : formValues.tipoAgente,
    tipoExtintor : formValues.tipoExtintor,
    vidaUtil     : formValues.vidaUtil,
    capacidad    : formValues.Capacidad,
    Fecha_Anterior_Carga : formValues.fechaAnteriorCarga,
    Fecha_Proxima_Carga  : formValues.fechaProximaCarga,
    usuario              : this.auth.dataUsuario['id_usuario'],
    ubicacion            : formValues.ubicacion,
    fechaCreacion        : formValues.fechaCreacion
  }
this.ssoma.put('ssmoa/extintor', params).subscribe(
  res=>{
    if( !res.hasError){
      if ( res?.data.Table0[0]['codigo'] == -1 ){
        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
    }else{
        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
        this.close()
    }
    }
  }
)
    }
  }
)
  

}
}
