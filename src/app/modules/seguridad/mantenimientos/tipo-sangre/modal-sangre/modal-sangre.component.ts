import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TipoSangreService } from '../tipo-sangre.service';

@Component({
  selector: 'app-modal-sangre',
  templateUrl: './modal-sangre.component.html',
  styleUrls: ['./modal-sangre.component.scss']
})
export class ModalSangreComponent implements OnInit {
  public  sangreForm : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  titulo     : string;
  public  subtitulo  : string;
  constructor(
    private dialogRef:MatDialogRef<ModalSangreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public sangreS : TipoSangreService

  ) { }

  ngOnInit() {
      this.validacion()
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Tipo de Sangre` 
      this.subtitulo  = String(this.data['sangre']); 
      this.cargarFormGet(),
      this.SetForm()
    }
    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo tipo de Sangre`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }
    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion de tipo de Sangre` 
      this.subtitulo  = String(this.data['sangre']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
    this.sangreForm = new FormGroup({
      sangre       : new FormControl({ value: '', disabled : this.enable }, [] ),
    })
}

  cargarFormPost(){
  this.sangreForm = new FormGroup({
    sangre       : new FormControl({ value: '', disabled : this.enable }, [] )
  })
}

  cargarFormPut(){
this.sangreForm = new FormGroup({
  sangre       : new FormControl({ value: '', disabled : this.enable }, [] )
})
}

  SetForm(){
this.sangreForm.setValue({
  sangre        : this.data['sangre']
})
}

submit(){
  
  if( this.data['bandera'] == 2 ){
    this.insertarSangre()
  }

  if( this.data['bandera'] == 3 ){
    this.actualizarSangre()
  }
}

  close(){
  this.dialogRef.close()
}


insertarSangre(){
  let url    = 'administracion/sangre';
  let params = {
tipoSangre    : this.sangreForm.value.sangre,
  } 
  this.sangreS.post(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
            this.visible = false;
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.visible = true
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

actualizarSangre(){
let url    = 'administracion/sangre';
let params = {
  idtipo     : this.data['tipoSangre'],
  tipoSangre : this.sangreForm.value.sangre,
} 
this.sangreS.put( url,params ).subscribe(
  res=>{
    if(!res.hasError){
        if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.visible = false;
            this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
        }else{
          this.visible = true;
          this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
          this.dialogRef.close()
        }
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
    }
  }
)
}


}
