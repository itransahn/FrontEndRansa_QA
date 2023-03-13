import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../../transporte.service';
import {mask} from '../../../../../interfaces/generales';

@Component({
  selector: 'app-modalplaca',
  templateUrl: './modalplaca.component.html',
  styleUrls: ['./modalplaca.component.scss']
})
export class ModalplacaComponent implements OnInit {

  public  Form   : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;
  public mask       =  mask;
  
  constructor(
    private dialogRef:MatDialogRef<ModalplacaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public service : TransporteService
  ) { }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo();
    console.log(this.data)
  }

  validacion(){
    if ( this.data?.['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Placa` 
      this.subtitulo  = String(this.data?.['data']['usuario']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data?.['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nueva Placa empleado`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data?.['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualización de Placa` 
      this.subtitulo  = String(this.data?.['data']['usuario']); 
      this.cargarFormPut()
      this.SetForm()
    }



}

cargarFormGet(){
  this.Form = new FormGroup({
    usuario    : new FormControl({ value: '', disabled : this.enable }, [] ),
    placa      : new FormControl({ value: '', disabled : this.enable }, [] )
  })

}

cargarFormPost(){
this.Form = new FormGroup({
  usuario  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
  placa    : new FormControl({ value: '', disabled : this.enable }, [] )
})
}

cargarFormPut(){
this.Form = new FormGroup({
usuario    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
placa      : new FormControl( { value: '', disabled : this.enable }, [Validators.required] )
})
}

SetForm(){
this.Form.setValue({
usuario  : this.data?.['data']['idUsuario'],
placa    : this.data?.['data']['placa']
})
}


insertarPlaca(){
let url    = 'transporte/creaIplacaEmpleadorRol';
let params = {
placa   : this.Form.value.placa,
usuario   : this.Form.value.usuario,
} 
this.service.post(url,params).subscribe(
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

actualizarPlaca(){
let url    = 'transporte/UplacaEmpleado';
let params = {
placa   : this.Form.value.placa,
usuario   : this.Form.value.usuario,
idRegistro : this.data?.['data']?.['registro']
} 
this.service.put( url,params ).subscribe(
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

submit(){
if( this.data['bandera'] == 2 ){
  this.insertarPlaca()
}
if( this.data['bandera'] == 3 ){
  this.actualizarPlaca()
}
}

close(){
this.dialogRef.close()
}
  

}
