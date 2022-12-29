import { Component, Inject, OnInit } from '@angular/core';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mensajes } from 'src/app/interfaces/generales';
import { DataApi } from 'src/app/interfaces/dataApi';
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
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class DocumentosComponent implements OnInit {
   public FormAntecedentes  : FormGroup;
   public FormularioTarjeta : FormGroup;
   public FormPrimario      : FormGroup;
   public documentos : any = [];
   public catalogo          : any[]  = [];
   public tipoD = [
    {
      id : 1, 
      tipo : 'Antecedentes Penales'
    },
    {
      id : 2,
      tipo : 'Antecedentes Policiales'
    },
    {
      id : 3,
      tipo : 'Tarjeta de Salud'
    }
   ]
   public reactivo = [
    {
      id : 1, 
      tipo : 'No reactivo'
    },
    {
      id : 2,
      tipo : 'Reactivo'
    },
   ]

  constructor(
    private dialogRef:MatDialogRef<DocumentosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService
  ) { }

ngOnInit(){
    this.catalogo = this.auth.returnCatalogo();
    this.cargarDocumentos();
   this.formularioGeneral();
  //  this.FormularioAntecedentes();
  //  this.FormularioTarj()
  }


cargarFormularios(){
    if ( this.FormPrimario.value.tipo === 3){
        this.FormularioTarj();
        this.cargarDocumentos();
        this.setFormulario();
    }

  if( this.FormPrimario.value.tipo === 1) {
    this.FormularioAntecedentes();
    this.cargarDocumentos();
    this.setFormulario();
  }

  if( this.FormPrimario.value.tipo === 2) {
    this.FormularioAntecedentes();
    this.cargarDocumentos();
    this.setFormulario();
  }
  }

formularioGeneral(){
    this.FormPrimario = new FormGroup({  
      tipo       : new FormControl({ value: '', disabled : false },   [Validators.required] ),
  })
}

FormularioAntecedentes(){
    this.FormAntecedentes = new FormGroup({  
      fechaEntrega       : new FormControl({ value: '', disabled : false },   [Validators.required] ),
      fechaVencimiento   : new FormControl({ value: '', disabled : false },   [Validators.required] ),
      detalleAntecedente : new FormControl({ value: '', disabled : false },   [Validators.required] ),
    })
}

FormularioTarj(){
  this.FormularioTarjeta = new FormGroup({  
    fechaEntrega : new FormControl({ value: '', disabled : false },   [Validators.required] ),
    tipoSangre   : new FormControl({ value: '', disabled : false },   [Validators.required] ),
    reactivo     : new FormControl({ value: '', disabled : false },   [Validators.required] ),
  })
}


setFormulario(){
  if ( this.FormPrimario.value.tipo == 1 ){
    if ( this.documentos['antecedentesPenales'].length > 0 ){
      this.FormAntecedentes.setValue({
        fechaEntrega       : this.documentos['antecedentesPenales'][0]?.fechaEntrega, 
        fechaVencimiento   : this.documentos['antecedentesPenales'][0]?.fechaVencimiento,
        detalleAntecedente : this.documentos['antecedentesPenales'][0]?.detalleAntecedentes ,
            })
    }
  }

  if ( this.FormPrimario.value.tipo == 2 ){
    if ( this.documentos['antecedentesPoliciales'].length > 0 ){
      this.FormAntecedentes.setValue({
        fechaEntrega       : this.documentos['antecedentesPoliciales'][0]?.fechaEntrega, 
        fechaVencimiento   : this.documentos['antecedentesPoliciales'][0]?.fechaVencimiento,
        detalleAntecedente : this.documentos['antecedentesPoliciales'][0]?.detalleAntecedentes,
            })
    }
  }

  if ( this.FormPrimario.value.tipo == 3 ){
  if ( this.documentos['tarjetaSalud'].length > 0){
    this.FormularioTarjeta.setValue({
      fechaEntrega : this.documentos['tarjetaSalud'][0]?.fechaEntrega, 
      tipoSangre   : this.documentos['tarjetaSalud'][0]?.tipoSangre,
      reactivo     : this.documentos['tarjetaSalud'][0]?.reactivo ,
          })
  }
  }
}

close(){
  this.dialogRef.close()
}

cargarDocumentos(){
  let url = 'transporte/documentosMotorista';
  let params = {
    idMotorista : this.data['idMotorista']
  };
  this.transporteService.post(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.documentos = data;
      }    
    }
  )
}

submit(){
  /* Antecedentes Penales   */ 
  if( this.FormPrimario.value.tipo == 1){ 
    if  (this.documentos['antecedentesPenales'].length > 0){
        this.actualizarAntecedentes();
    }else{
        this.insertarAntecedentes();
    } 
  }
  /* Antecedentes Policiales*/ 
  if( this.FormPrimario.value.tipo == 2){ 
    if  (this.documentos['antecedentesPoliciales'].length > 0){
      this.actualizarAntecedentes();
  }else{
      this.insertarAntecedentes();
  } 
  }

  /* Tarjeta de Salud     */ 
  if( this.FormPrimario.value.tipo == 3){ 
    if  (this.documentos['tarjetaSalud'].length > 0){
      this.actualizarTarjeta();
  }else{
      this.insertarTarjeta();
  } 

  }

}


insertarAntecedentes(){
  let url = '/transporte/InsAntecedente';
  let params = {
idMotorista        : this.data['idMotorista'],
tipoD              : this.FormPrimario.value.tipo,
fechaEntrega       : this.FormAntecedentes.value.fechaEntrega,
fechaVencimiento   : this.FormAntecedentes.value.fechaVencimiento,
detalleAnt         : this.FormAntecedentes.value.detalleAntecedente,
  }

this.transporteService.put(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

actualizarAntecedentes(){
  let url = '/transporte/updAntecedente';
  let params = {
idMotorista         : this.data['idMotorista'],
fechaEntrega        : this.FormAntecedentes.value.fechaEntrega,
fechaVencimiento    : this.FormAntecedentes.value.fechaVencimiento,
detalleAntecedentes : this.FormAntecedentes.value.detalleAntecedente,
tipoD               : this.FormPrimario.value.tipo,
  }

this.transporteService.put(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

insertarTarjeta(){
  let url = '/transporte/InsTarjeta';
  let params = {
idMotorista  : this.data['idMotorista'],
fechaEntrega : this.FormularioTarjeta.value.fechaEntrega,
tipoSangre   : this.FormularioTarjeta.value.tipoSangre,
reactivo     : this.FormularioTarjeta.value.reactivo,
  }

this.transporteService.put(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

actualizarTarjeta(){
  let url = '/transporte/updTarjeta';
  let params = {
idMotorista  : this.data['idMotorista'],
fechaEntrega : this.FormularioTarjeta.value.fechaEntrega,
tipoSangre   : this.FormularioTarjeta.value.tipoSangre,
reactivo     : this.FormularioTarjeta.value.reactivo,
  }

this.transporteService.put(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}



}


