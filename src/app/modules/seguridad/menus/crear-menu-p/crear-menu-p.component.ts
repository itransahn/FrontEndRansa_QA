import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-crear-menu-p',
  templateUrl: './crear-menu-p.component.html',
  styleUrls: ['./crear-menu-p.component.scss']
})
export class CrearMenuPComponent implements OnInit, OnDestroy {
  public menuForm : FormGroup;
  private subs : Subscription = new Subscription()
  constructor( private dialogRef:MatDialogRef<CrearMenuPComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit() {
    this.formModulo();
  }

  ngOnDestroy() {
      this.subs.unsubscribe()
  }

  private formModulo(){
    this.menuForm   = new FormGroup({
      menuPadre     : new FormControl('', [Validators.required,]),
      icono         : new FormControl('', [Validators.required,])
    })
}

insertarMenu(){
  let url    = 'seguridad/insertarMenuPadre';
  let params = {
    menuPadre :  this.menuForm.value.menuPadre,
    icon      :  this.menuForm.value.icono,
    modulo    :  this.data['id_modulo']
  } 
  this.seguridad.insertarMenuPadre(url,params).subscribe(
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

close(){
  this.dialogRef.close()
}
}
