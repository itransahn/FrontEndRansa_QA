import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AreasService } from '../areas.service';

@Component({
  selector: 'app-modal-areas',
  templateUrl: './modal-areas.component.html',
  styleUrls: ['./modal-areas.component.scss']
})
export class ModalAreasComponent implements OnInit {
  public  areaForm : FormGroup;
  public  visible  : boolean = false; 
  public  enable   : boolean = false;
  public  botton   : boolean = false;

  public  titulo    : string;
  public  subtitulo : string;

  constructor(
    private dialogRef:MatDialogRef<ModalAreasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public areaServi : AreasService
  ) { }

  ngOnInit()  {
    this.validacion();
  }


  
  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `AREA` 
      this.subtitulo  = String(this.data['area']); 
      this.cargarFormGet(),
      this.SetForm()
    }
    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nueva Area`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion de` 
      this.subtitulo  = String(this.data['area']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

cargarFormGet(){
    this.areaForm = new FormGroup({
      area       : new FormControl({ value: '', disabled : this.enable }, [] )
    })
}

  cargarFormPost(){
  this.areaForm = new FormGroup({
    area         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
  })
}

  cargarFormPut(){
this.areaForm = new FormGroup({
  area         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
})
}

SetForm(){
this.areaForm.setValue({
  area        : this.data['area'],
})
}

close(){
  this.dialogRef.close()
}

submit(){
  if( this.data['bandera'] == 2 ){
    this.insertarArea()
  }

  if( this.data['bandera'] == 3 ){
    this.actualizarArea()
  }
}


insertarArea(){
  let url    = 'administracion/area';
  let params = {
    area        : this.areaForm.value.area,
  } 
  this.areaServi.post(url,params).subscribe(
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

actualizarArea(){
let url    = 'administracion/area';
let params = {
  idArea     : this.data['idArea'],
  area       : this.areaForm.value.area,
} 
this.areaServi.put( url,params ).subscribe(
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
