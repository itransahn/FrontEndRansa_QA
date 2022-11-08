import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { SedeService } from '../sede.service';

@Component({
  selector: 'app-modal-sedes',
  templateUrl: './modal-sedes.component.html',
  styleUrls: ['./modal-sedes.component.scss']
})
export class ModalSedesComponent implements OnInit {
  public  sedeForm : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton    : boolean = false;

  public  titulo    : string;
  public  subtitulo : string;
  constructor(
    private dialogRef:MatDialogRef<ModalSedesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public sedeS : SedeService
  ) { }

  ngOnInit() {
    this.validacion();
  }

  
  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Sede` 
      this.subtitulo  = String(this.data['sede']); 
      this.cargarFormGet(),
      this.SetForm()
    }
    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nueva Sede`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }
    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion Sede` 
      this.subtitulo  = String(this.data['sede']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
    this.sedeForm = new FormGroup({
      sede       : new FormControl({ value: '', disabled : this.enable }, [] ),
    })
}

  cargarFormPost(){
  this.sedeForm = new FormGroup({
    sede       : new FormControl({ value: '', disabled : this.enable }, [] )
  })
}

  cargarFormPut(){
this.sedeForm = new FormGroup({
  sede       : new FormControl({ value: '', disabled : this.enable }, [] )
})
}

  SetForm(){
this.sedeForm.setValue({
  sede        : this.data['sede']
})
}

submit(){
  
  if( this.data['bandera'] == 2 ){
    this.insertarSede()
  }

  if( this.data['bandera'] == 3 ){
    this.actualizarSede()
  }
}

  close(){
  this.dialogRef.close()
}


insertarSede(){
  let url    = 'administracion/sede';
  let params = {
    sede        : this.sedeForm.value.sede,
  } 
  this.sedeS.post(url,params).subscribe(
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

actualizarSede(){
let url    = 'administracion/sede';
let params = {
  idSede     : this.data['idSede'],
  sede       : this.sedeForm.value.sede,
} 
this.sedeS.put( url,params ).subscribe(
  res=>{
    if(!res.hasError){
        if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.visible = false;
            this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
        }else{
          this.visible = true;
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
