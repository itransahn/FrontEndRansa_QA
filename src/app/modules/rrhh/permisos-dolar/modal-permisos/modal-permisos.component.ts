import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../../rrhh.service';

@Component({
  selector: 'app-modal-permisos',
  templateUrl: './modal-permisos.component.html',
  styleUrls: ['./modal-permisos.component.scss']
})
export class ModalPermisosComponent implements OnInit {

  public  permisosForm  : FormGroup;
  public  visible       : boolean = false; 
  public  enable        : boolean = false;
  public  botton        : boolean = false;
  public  titulo        : string;
  public  subtitulo     : string;
  public  catalogo      : any;


  constructor( 
  private dialogRef:MatDialogRef<ModalPermisosComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public auth:AuthService,
  public toast:ToastServiceLocal,
  public rrhhS : RrhhService
  ) { }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo()
    this.validacion();
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Colaborador` 
      this.subtitulo  = String(this.data['colaborador']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Permiso`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Permiso` 
      this.subtitulo  = String(this.data['colaborador']); 
      this.cargarFormPut()
      this.SetForm()
    }



  }

  cargarFormGet(){
      this.permisosForm = new FormGroup({
        usuarioRansa    : new FormControl({ value: '', disabled : this.enable }, [] ),
        Colaborador     : new FormControl({ value: '', disabled : this.enable }, [] ),
        Cco             : new FormControl({ value: '', disabled : this.enable }, [] )
      })

  }

  cargarFormPost(){
    this.permisosForm = new FormGroup({
      usuarioRansa    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      Colaborador     : new FormControl({ value: '', disabled : this.enable }, [] ),
      Cco             : new FormControl({ value: '', disabled : this.enable }, [] )
    })
}

cargarFormPut(){
  this.permisosForm = new FormGroup({
    usuarioRansa    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    Colaborador     : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    Cco             : new FormControl( { value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
  this.permisosForm.setValue({
    usuarioRansa     : this.data['usuarioRansa'],
    Colaborador      : this.data['colaborador'],
    Cco              : this.data['cco'],
  })
}


  insertarPermiso(){
    let url    = 'rrhh/insertarPermisos';
    let params = {
      usuario  : this.permisosForm.value.usuarioRansa,
      nombre   : this.permisosForm.value.Colaborador,
      cco      : this.permisosForm.value.cco,
    } 
    this.rrhhS.post(url,params).subscribe(
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

actualizarPermiso(){
  let url    = 'rrhh/actualizarPermisos';
  let params = {
    idPermiso : this.data['idPermiso'],
    usuario   : this.permisosForm.value.usuarioRansa,
    nombre    : this.permisosForm.value.Colaborador,
    cco       : this.permisosForm.value.Cco,
  } 
  this.rrhhS.put( url,params ).subscribe(
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
      this.insertarPermiso()
    }

    if( this.data['bandera'] == 3 ){
      this.actualizarPermiso()
    }
}

close(){
  this.dialogRef.close()
}
}
