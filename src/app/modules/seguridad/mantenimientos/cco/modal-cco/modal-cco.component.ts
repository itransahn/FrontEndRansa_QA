import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { CcoService } from '../cco.service';

@Component({
  selector: 'app-modal-cco',
  templateUrl: './modal-cco.component.html',
  styleUrls: ['./modal-cco.component.scss']
})
export class ModalCcoComponent implements OnInit {
  public  ccoForm : FormGroup;
  public  visible : boolean = false; 
  public  enable  : boolean = false;
  public  botton  : boolean = false;

  public  titulo    : string;
  public  subtitulo : string;

  constructor( 
  private dialogRef:MatDialogRef<ModalCcoComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public auth:AuthService,
  public toast:ToastServiceLocal, 
  public ccoService : CcoService
   ) { }

  ngOnInit()  {
    this.validacion();
  }
/*
1 VISTA 
2 CREACION
3 ACTUALIZACION
*/

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `CCO` 
      this.subtitulo  = String(this.data['cco']); 
      this.cargarFormGet(),
      this.SetForm()
    }
    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Cco`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }
    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion Cco` 
      this.subtitulo  = String(this.data['cco']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
    this.ccoForm = new FormGroup({
      cco       : new FormControl({ value: '', disabled : this.enable }, [] ),
      codigocco : new FormControl({ value: '', disabled : this.enable }, [] )
    })
}

  cargarFormPost(){
  this.ccoForm = new FormGroup({
    cco       : new FormControl({ value: '', disabled : this.enable },    [Validators.required] ),
    codigocco : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

  cargarFormPut(){
this.ccoForm = new FormGroup({
  cco       : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
  codigocco : new FormControl( { value: '', disabled : this.enable }, [Validators.required] )
})
}

  SetForm(){
this.ccoForm.setValue({
  cco        : this.data['cco'],
  codigocco  : this.data['codigocco']
})
}

submit(){

  if( this.data['bandera'] == 2 ){
    this.insertarCco()
  }

  if( this.data['bandera'] == 3 ){
    this.actualizarCco()
  }
}

  close(){
  this.dialogRef.close()
}



insertarCco(){
  let url    = 'administracion/cco';
  let params = {
    cco        : this.ccoForm.value.cco,
    codigoCco  : this.ccoForm.value.codigocco,
  } 
  this.ccoService.post(url,params).subscribe(
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

actualizarCco(){
let url    = 'administracion/cco';
let params = {
  idCco     : this.data['idCco'],
  cco       : this.ccoForm.value.cco,
  codigoCco : this.ccoForm.value.codigocco,
} 
this.ccoService.put( url,params ).subscribe(
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
