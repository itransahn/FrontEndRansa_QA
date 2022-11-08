import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-crear-menu-mod',
  templateUrl: './crear-menu-mod.component.html',
  styleUrls: ['./crear-menu-mod.component.scss']
})
export class CrearMenuModComponent implements OnInit {
  public menuForm : FormGroup;
  public catalogo : any;
  constructor(  private dialogRef:MatDialogRef<CrearMenuModComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal) { }

  ngOnInit(): void {
    this.formModulo()
    this.catalogo = this.auth.returnCatalogo();
  }

  private formModulo(){
    this.menuForm   = new FormGroup({
      menuPadre     : new FormControl('', [Validators.required,]),
      icono         : new FormControl('', [Validators.required,]),
      modulo        : new FormControl('', [Validators.required,])
    })
}

insertarMenu(){
  let url    = 'seguridad/insertarMenuPadre';
  let params = {
    menuPadre :  this.menuForm.value?.menuPadre,
    icon      :  this.menuForm.value?.icono,
    modulo    :  this.menuForm.value?.modulo
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