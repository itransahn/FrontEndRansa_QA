import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar-menus-hijos',
  templateUrl: './editar-menus-hijos.component.html',
  styleUrls: ['./editar-menus-hijos.component.scss']
})
export class EditarMenusHijosComponent implements OnInit {
  public menuForm : FormGroup
  public catalogo : any;
  constructor( private dialogRef:MatDialogRef<EditarMenusHijosComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,  public auth:AuthService,
               public seguridad : SeguridadService, public toast:ToastServiceLocal  ) { }

  ngOnInit() {
    this.formMenu();
    this.catalogo = this.auth.returnCatalogo();
    this.cargarForm()
  }

  private formMenu(){
    this.menuForm = new FormGroup({
      menuHijo     : new FormControl ('' , [ Validators.required,]),
      icon         : new FormControl ('' , [ Validators.required,]),
      urlM         : new FormControl ('' , [ Validators.required ]),
      menuPadre    : new FormControl ('' , [ Validators.required ]),
      estado       : new FormControl ('' , [ Validators.required ]),
    })
}

cargarForm(){
  this.menuForm.setValue({
    menuHijo  : this.data['menuHijo'],
    icon      : this.data['icon'],
    urlM      : this.data['url'],
    menuPadre : this.data['id_menuPadre'],
    estado    : this.data['estado'],
  })
}

close(){
  this.dialogRef.close()
}

editarmenuHijo(){
  let url    = 'seguridad/actualizarMenusHijos';
  let params = {
    idMenuHijo   : this.data['idMenuHijo'], 
    menu         : this.menuForm.value.menuHijo, 
    icon         : this.menuForm.value.icon,
    urlM         : this.menuForm.value.urlM,
    menuPadre    : this.menuForm.value.menuPadre,
    estado       : this.menuForm.value.estado,
              } 

  this.seguridad.actualizarMenuHijo(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
            this.dialogRef.close()
          }
      }else{
        // this.toast.mensajeError(String(res?.errors[0]['descripcion']),"Error")
      }
    }
  )

}

}
