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

  constructor(
    public ssoma : SsmoaService,
    private dialogRef:MatDialogRef<CrearExtintorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast       : ToastServiceLocal, 
    public auth: AuthService
  ) { }

  ngOnInit(){
    this.cargarCatalogo( this.data?.sede)
    this.validacion();
  }
  
  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Rol` 
      this.subtitulo  = String(this.data['rol']); 
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
      this.titulo     = `Actualizacion del Rol` 
      this.subtitulo  = String(this.data['rol']); 
      this.cargarFormPut()
      this.SetForm()
    }



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
      fechaAnteriorCarga   : new FormControl({ value: '', disabled : this.enable }, [] ),
      fechaProximaCarga   : new FormControl({ value: '',  disabled : this.enable }, [] ),
      ubicacion    : new FormControl({ value: '',   disabled : this.enable }, [] ),
      fechaCreacion  : new FormControl({ value: '', disabled : this.enable }, [] )
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
  fechaCreacion  : new FormControl({ value: '', disabled : true }, [] )
})
}

SetForm(){
this.Form.setValue({
  tipoAgente        : this.data['idAgente'],
  tipoExtintor      : this.data['idtipoExtintor'],
  vidaUtil          : this.data['vida_util'],
  Capacidad         : this.data['capacidad'],
  fechaAnteriorCarga : this.data['Fecha_Anterior_Carga'],
  fechaProximaCarga  : this.data['Fecha_Proxima_Carga'],
  ubicacion      :    this.data['idUbicacion'],
  fechaCreacion  :    this.data['fechaCreacion']
})
}

crearExtintor(){
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
