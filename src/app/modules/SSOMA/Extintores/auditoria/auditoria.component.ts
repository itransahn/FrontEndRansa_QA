import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from 'src/app/services/auth.service';
import { SsmoaService } from '../../ssmoa.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { mensajes } from 'src/app/interfaces/generales';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DataApi } from 'src/app/interfaces/dataApi';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  public Form : FormGroup;
  public catalogo : any;
  public lectura  : boolean;
  public extintor : string;
  public titulo   : string;
  public tipo     : number;

  
  constructor(
    private _bottomSheet : MatBottomSheet,
    public auth   : AuthService,
    public ssoma : SsmoaService,
    public dialog : MatDialog,
    private dialogRef:MatDialogRef<AuditoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast       : ToastServiceLocal, 
    private sweel       : SweetAlertService
  ) { }

  ngOnInit(){
    this.formPermiso();
    this.extintor = this.data?.data?.['Nomenclatura'];
    if( this.data?.bandera == 1 ){
      this.titulo = 'Auditoria'
    }
    if( this.data?.bandera == 2 ){
      this.titulo = 'Incidencia'  
    }
    if( this.data?.bandera == 4 ){
      this.titulo = 'Corrección' ;
      this.cargarData(this.data?.data?.id_Extintor)
    }
    
this.cargarForm();
  }

  cargarForm(){
    //INCIDENCIA
    if ( this.data?.bandera == 2 ){
      this.cargarFormInc()
    }
  }

 cargarFormInc(){
this.Form.setValue({
presion : '1',
sello  :  '1',
manometro :'1',
soporte : '1',
manguera :'1',
boquilla :'1',
pintura : '1',
señalizacion : '1',
altura : '1',
acceso : '1',
observaciones : '' 
    })
  }

  formPermiso(){
    this.Form = new FormGroup({
      // idRol      : new FormControl( { value : '' ,disabled : this.lectura} ,[Validators.required,]),
      presion   : new FormControl( '',      [Validators.required]),
      sello     : new FormControl( '',      [Validators.required]),
      manometro : new FormControl( '',    [Validators.required]),
      soporte   : new FormControl( '',    [Validators.required]),
      manguera  : new FormControl( '',    [Validators.required]),
      boquilla  : new FormControl( '',    [Validators.required]),
      pintura   : new FormControl( '',    [Validators.required]),
      señalizacion : new FormControl( '', [Validators.required]),
      altura   : new FormControl( '',     [Validators.required]),
      acceso   : new FormControl( '',     [Validators.required]),
      observaciones : new FormControl( '',[])
    })
  }

  close(){
    this.dialogRef.close()
  }

  submit(){
    if(this.data?.bandera == 1){  this.Auditoria()} 

    if(this.data?.bandera == 2){  this.Incidencia()} 

    if(this.data?.bandera == 4){  this.Correccion()} 
  
  }
  Auditoria(){
  this.sweel.mensajeConConfirmacion("Auditoria Extintor","¿Seguro de generar auditoria?","question").then(
  res=>{
      if ( res ){
        let formValues = this.Form.value;
        let params = {
          Presion       : formValues.presion,
          Sello         : formValues.sello,
          Manometro     : formValues.manometro,
          Soporte       : formValues.soporte ,
          Manguera      : formValues.manguera  ,
          Boquilla      : formValues.boquilla,
          Pintura       : formValues.pintura,
          Señalizacion  : formValues.señalizacion,
          Altura        : formValues.altura,
          Acceso        : formValues.acceso,
          Usuario       : this.auth.dataUsuario['id_usuario'],
          observaciones : formValues.observaciones,
          idExtintor    : this.data?.data?.['id_Extintor']  
        }
      this.ssoma.put('/ssmoa/Audextintores', params).subscribe(
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
  Incidencia(){
    this.sweel.mensajeConConfirmacion("Incidencia Extintor","¿Seguro de generar Incidencia?","question").then(
      res=>{
          if ( res ){
            let formValues = this.Form.value;
            let params = {
              Presion       : formValues.presion,
              Sello         : formValues.sello,
              Manometro     : formValues.manometro,
              Soporte       : formValues.soporte ,
              Manguera      : formValues.manguera  ,
              Boquilla      : formValues.boquilla,
              Pintura       : formValues.pintura,
              Señalizacion  : formValues.señalizacion,
              Altura        : formValues.altura,
              Acceso        : formValues.acceso,
              Usuario       : this.auth.dataUsuario['id_usuario'],
              observaciones : formValues.observaciones,
              idExtintor    : this.data?.data?.['id_Extintor']  
            }
          this.ssoma.put('/ssmoa/Incidencia', params).subscribe(
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

  Correccion(){
    this.sweel.mensajeConConfirmacion("Correción a Extintor","¿Seguro de la corrección?","question").then(
      res=>{
          if ( res ){
            let formValues = this.Form.value;
            let params = {
              Presion       : formValues.presion,
              Sello         : formValues.sello,
              Manometro     : formValues.manometro,
              Soporte       : formValues.soporte ,
              Manguera      : formValues.manguera  ,
              Boquilla      : formValues.boquilla,
              Pintura       : formValues.pintura,
              Señalizacion  : formValues.señalizacion,
              Altura        : formValues.altura,
              Acceso        : formValues.acceso,
              Usuario       : this.auth.dataUsuario['id_usuario'],
              observaciones : formValues.observaciones,
              idExtintor    : this.data?.data?.['id_Extintor'],
              tipo          : this.tipo
            }
          this.ssoma.put('/ssmoa/CorreccionE', params).subscribe(
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

  cargarData( idExtintor : Number){ 
let params = {
  idExtintor : idExtintor
}
let url = '/ssmoa/AuditoriaE';
this.ssoma.get(url, params ).subscribe(
  (res:DataApi)=>{
    if(!res.hasError){
      this.tipo = res?.data?.Table0?.[0]?.['tipo'];
      this.Form.setValue({
        presion : String(res?.data?.Table0?.[0]?.['Presion']),
        sello  :  String(res?.data?.Table0?.[0]?.['Sello']),
        manometro :String(res?.data?.Table0?.[0]?.['Manometro']),
        soporte : String(res?.data?.Table0?.[0]?.['Soporte']),
        manguera :String(res?.data?.Table0?.[0]?.['Manguera']),
        boquilla :String(res?.data?.Table0?.[0]?.['Boquilla']),
        pintura : String(res?.data?.Table0?.[0]?.['Pintura']),
        señalizacion : String(res?.data?.Table0?.[0]?.['Senalizacion']),
        altura : String(res?.data?.Table0?.[0]?.['Altura']),
        acceso : String(res?.data?.Table0?.[0]?.['Acceso']),
        observaciones :  String(res?.data?.Table0?.[0]?.['observaciones'])
            })
    }
  }
)
  }
}
