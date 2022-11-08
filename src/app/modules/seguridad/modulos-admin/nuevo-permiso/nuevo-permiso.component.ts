import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-nuevo-permiso',
  templateUrl: './nuevo-permiso.component.html',
  styleUrls: ['./nuevo-permiso.component.scss']
})
export class NuevoPermisoComponent implements OnInit {
  public permisoForm : FormGroup;
  public catalogo       : any;

  constructor( private dialogRef:MatDialogRef<NuevoPermisoComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal) { }

  ngOnInit() {
    this.formPermiso()
    this.formPermiso
    this.catalogo = this.auth.returnCatalogo()
    }


  private formPermiso(){
    this.permisoForm = new FormGroup({
      rol     : new FormControl('', [Validators.required,]),
    })
}

close(){
  this.dialogRef.close()
}


insertarPermisosModulo(){
  let url    = 'seguridad/insertarPmodulo';
  let params = {
     rol     : this.permisoForm.value.rol,
     modulo  : this.data['idModulo']
    } 
  this.seguridad.insertarPermisosModulos(url,params).subscribe(
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
