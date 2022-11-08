import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { PuestoService } from '../puesto.service';

@Component({
  selector: 'app-modal-puestos',
  templateUrl: './modal-puestos.component.html',
  styleUrls: ['./modal-puestos.component.scss']
})
export class ModalPuestosComponent implements OnInit {

  public  puestoForm : FormGroup;
  public  visible    : boolean   = false; 
  public  enable     : boolean   = false;
  public  botton     : boolean   = false;
  public  titulo     : string;
  public  subtitulo  : string;

  constructor(
  private dialogRef:MatDialogRef<ModalPuestosComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public auth:AuthService,
  public toast:ToastServiceLocal, 
  public puestoS : PuestoService
  ) { }

  ngOnInit(){
    this.validacion();
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Puesto` 
      this.subtitulo  = String(this.data['puestoRansa']); 
      this.cargarFormGet(),
      this.SetForm()
    }
    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Puesto`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }
    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion ` 
      this.subtitulo  = String(this.data['puestoRansa']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
    this.puestoForm = new FormGroup({
      puesto       : new FormControl({ value: '', disabled : this.enable }, [] ),
    })
}

  cargarFormPost(){
  this.puestoForm = new FormGroup({
    puesto         : new FormControl({ value: '', disabled : this.enable },    [Validators.required] ),
  })
}

  cargarFormPut(){
this.puestoForm = new FormGroup({
    puesto         : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
})
}

  SetForm(){
this.puestoForm.setValue({
    puesto         : this.data['puestoRansa']
})
}

submit(){

  if( this.data['bandera'] == 2 ){
    this.insertarPuesto()
  }

  if( this.data['bandera'] == 3 ){
    this.actualizarPuesto()
  }
}

  close(){
  this.dialogRef.close()
}



insertarPuesto(){
  let url    = 'administracion/puesto';
  let params = {
    puesto  : this.puestoForm.value.puesto,
  } 
  this.puestoS.post(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

actualizarPuesto(){
let url    = 'administracion/puesto';
let params = {
  idPuesto     : this.data['idPuesto'],
  puesto       : this.puestoForm.value.puesto,
} 
this.puestoS.put( url,params ).subscribe(
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
