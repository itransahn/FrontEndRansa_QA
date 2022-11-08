import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-crea-menu-hijo',
  templateUrl: './crea-menu-hijo.component.html',
  styleUrls: ['./crea-menu-hijo.component.scss']
})
export class CreaMenuHijoComponent implements OnInit {
  public menuForm : FormGroup;
  constructor(  private dialogRef:MatDialogRef<CreaMenuHijoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit() {
    this.formMenu() 
  }

  private formMenu(){
    this.menuForm = new FormGroup({
      menuHijo     : new FormControl ('' , [ Validators.required,]),
      icon         : new FormControl ('' , [ Validators.required,]),
      urlM         : new FormControl ('' , [ Validators.required ])
    })
}

close(){
  this.dialogRef.close()
}


insertarMenu(){
  let url    = 'seguridad/insertarMenuHijo';
  let params = {
      menu        : this.menuForm.value.menuHijo,
      icon        : this.menuForm.value.icon,
      urlM        : this.menuForm.value.urlM,
      menuPadre   : this.data['id_menuPadre']
  } 
  this.seguridad.insertarMenuHijo(url,params).subscribe(
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
