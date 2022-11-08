import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar-menu-p',
  templateUrl: './editar-menu-p.component.html',
  styleUrls: ['./editar-menu-p.component.scss']
})
export class EditarMenuPComponent implements OnInit {
  public catalogo : any;
  public menuForm : FormGroup;
  constructor( private dialogRef:MatDialogRef<EditarMenuPComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo()
    this.formModulo();
    this.cargarForm();
  }

  private formModulo(){
    this.menuForm   = new FormGroup({
      menuPadre     : new FormControl('', Validators.required),
      icono         : new FormControl('', Validators.required),
      modulo        : new FormControl('', Validators.required),
      estado        : new FormControl('', Validators.required)
    })
}

cargarForm(){
  this.menuForm.setValue({
menuPadre  :  this.data['padre']['menuPadre'], 
icono      :  this.data['padre']['icon'],   
modulo     :  this.data['padre']['id_modulo'], 
estado     :  this.data['padre']['estado']   
  })
}

close(){
  this.dialogRef.close()
}


editarmenuPadre(){
  let url    = 'seguridad/updateMenuPadre';
  let params = {
    idMenuPadre : this.data['padre']['id_menuPadre'], 
    menuPadre   : this.menuForm.value.menuPadre, 
    icon        : this.menuForm.value.icono,
    estado      : this.menuForm.value.estado,
    idmodulo    : this.menuForm.value.modulo
              } 

  this.seguridad.editarMenuPadre(url,params).subscribe(
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
