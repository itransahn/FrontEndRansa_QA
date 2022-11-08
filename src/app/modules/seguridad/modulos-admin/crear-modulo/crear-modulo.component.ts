import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-crear-modulo',
  templateUrl: './crear-modulo.component.html',
  styleUrls: ['./crear-modulo.component.scss']
})
export class CrearModuloComponent implements OnInit {
  public estado : any;
  public estados : any;

  public moduloForm : FormGroup;
  constructor( private dialogRef:MatDialogRef<CrearModuloComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal) { }


  ngOnInit() {

    this.estados = [
      {
        id_estado : 1,
        estado    : 'Activo'
      },
      {
        id_estado : 2,
        estado    : 'Inactivo'
      }
    ]
  this.formModulo()
    this.estado = this.auth.returnCatalogo()
  }

insertarModulo(){
  let url    = 'seguridad/insertarModulo';
  let params = {
      modulo : this.moduloForm.value.modulo,
      icon   : this.moduloForm.value.icono,
      imagen : this.moduloForm.value.imagen
  } 
  this.seguridad.insertarModulo(url,params).subscribe(
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

  private formModulo(){
    this.moduloForm = new FormGroup({
      modulo     : new FormControl('', [Validators.required,]),
      icono      : new FormControl('', [Validators.required,]),
      imagen     : new FormControl('', [Validators.minLength(15)])
      
    })
}

  close(){
    this.dialogRef.close()
  }




}
