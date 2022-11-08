import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-agregar-permisos-menu',
  templateUrl: './agregar-permisos-menu.component.html',
  styleUrls: ['./agregar-permisos-menu.component.scss']
})
export class AgregarPermisosMenuComponent implements OnInit {
  public permisoForm : FormGroup;
  public catalogo    : any;
  public lectura     : boolean;
  public permisos    : string;
  public menuHijo    : string;

  constructor( private dialogRef:MatDialogRef<AgregarPermisosMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
 public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit() {
    this.formPermiso();
    this.catalogo = this.auth.returnCatalogo()
    this.evaluador()
  }


  formPermiso(){
    if ( this.data['tipo'] == 1  ) {
      this.lectura = false }else{ 
      this.lectura = true }

    // this.data['tipo'] == 1 ? this.lectura = false : this.lectura = true
    this.permisoForm = new FormGroup({
      idRol      : new FormControl( { value : '' ,disabled : this.lectura} ,[Validators.required,]),
      insertar   : new FormControl( '',[Validators.required,]),
      actualizar : new FormControl( '',[Validators.required,]),
      eliminar   : new FormControl( '',[Validators.required,]),
    })

  }

  
  evaluador(){
    if ( this.data['tipo'] == 1  ) {
      this.lectura = false
      this.permisos = 'Nuevo Permiso Sobre'
      this.menuHijo = this.data['menuHijo']

    }else{
      this.lectura = true
      this.permisos = 'Editar Permiso sobre';
      this.menuHijo = this.data['dataMenu']['menuHijo']
      this.permisoForm.setValue({
       idRol       : this.data['dataMenu']['idRol'],
       insertar    : this.data['dataMenu']['insertar'],
       actualizar  : this.data['dataMenu']['actualizar'],
       eliminar    : this.data['dataMenu']['eliminar']
      })
    }
}

evaluadorSubmit(){
  if ( this.data['tipo'] == 1  ) {
    this.insertarPermisosMenu()
  }else{
    this.actualizarPermisosMenu()
  }
}

  close(){
    this.dialogRef.close()
  }
  
  
  insertarPermisosMenu(){
    let url    = 'seguridad/insertarPmenu';
    let params = {
      idRol        : this.permisoForm.value.idRol,
      id_menuHijo  : this.data['idMenuHijo'],
      insertar     : this.permisoForm.value.insertar,
      actualizar   : this.permisoForm.value.actualizar,
      eliminar     : this.permisoForm.value.eliminar,
      } 
    this.seguridad.insertarPermisosMenu(url,params).subscribe(
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

  actualizarPermisosMenu(){
    let url    = 'seguridad/actualizaPmenu';
    let params = {
      idRol        : this.data['dataMenu']['idRol'],
      id_menuHijo  : this.data['dataMenu']['idMenuHijo'],
      insertar     : this.permisoForm.value.insertar,
      actualizar   : this.permisoForm.value.actualizar,
      eliminar     : this.permisoForm.value.eliminar,
      } 
    this.seguridad.actualizarPermisosMenu(url,params).subscribe(
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
