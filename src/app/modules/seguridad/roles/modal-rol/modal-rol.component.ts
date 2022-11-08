import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.scss']
})
export class ModalRolComponent implements OnInit {
  public  rolForm   : FormGroup;

  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;


  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;

  constructor( 
  private dialogRef:MatDialogRef<ModalRolComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public auth:AuthService,
  public toast:ToastServiceLocal, 
  public rolService : RolesService
  ) {   }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo()
    this.validacion()
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
      this.titulo     = `Nuevo Rol`;
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

  cargarFormGet(){
      this.rolForm = new FormGroup({
        rol    : new FormControl({ value: '', disabled : this.enable }, [] ),
        estado : new FormControl({ value: '', disabled : this.enable }, [] )
      })

  }

  cargarFormPost(){
    this.rolForm = new FormGroup({
      rol    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      estado : new FormControl({ value: '', disabled : this.enable }, [] )
    })
}

cargarFormPut(){
  this.rolForm = new FormGroup({
    rol    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    estado : new FormControl( { value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
  this.rolForm.setValue({
    rol     : this.data['rol'],
    estado  : this.data['estado']
  })
}


  insertarMenu(){
    let url    = 'seguridad/crearRol';
    let params = {
      rol        : this.rolForm.value.rol,
    } 
    this.rolService.post(url,params).subscribe(
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

actualizarMenu(){
  let url    = 'seguridad/actualizarRol';
  let params = {
    idRol   : this.data['idRol'],
    rol     : this.rolForm.value.rol,
    estado  : this.rolForm.value.estado,
  } 
  this.rolService.put( url,params ).subscribe(
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
      this.insertarMenu()
    }

    if( this.data['bandera'] == 3 ){
      this.actualizarMenu()
    }
}

close(){
  this.dialogRef.close()
}
}
