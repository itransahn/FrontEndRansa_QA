import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from 'src/app/services/auth.service';
import { SsmoaService } from '../../ssmoa.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { mensajes } from 'src/app/interfaces/generales';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

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
    }else{
      this.titulo = 'Incidencia'   
    }
  }

  formPermiso(){

    this.Form = new FormGroup({
      // idRol      : new FormControl( { value : '' ,disabled : this.lectura} ,[Validators.required,]),
      presion : new FormControl( '',      [Validators.required]),
      sello   : new FormControl( '',      [Validators.required]),
      manometro : new FormControl( '',    [Validators.required]),
      soporte   : new FormControl( '',    [Validators.required]),
      manguera  : new FormControl( '',    [Validators.required]),
      boquilla  : new FormControl( '',    [Validators.required]),
      pintura   : new FormControl( '',    [Validators.required]),
      señalizacion : new FormControl( '', [Validators.required]),
      altura   : new FormControl( '',     [Validators.required]),
      acceso   : new FormControl( '',     [Validators.required]),
      estado   : new FormControl( '',     [Validators.required]),
      observaciones : new FormControl( '',[])
    })
  }

  close(){
    this.dialogRef.close()
  }

  submit(){
    if(this.data?.bandera == 1){
      this.Auditoria()
    }else{
      this.Incidencia()
    }
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
          Estado        : formValues.estado,
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
              Estado        : formValues.estado,
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

}
