import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar-modulo',
  templateUrl: './editar-modulo.component.html',
  styleUrls: ['./editar-modulo.component.scss']
})
export class EditarModuloComponent implements OnInit {
  public estados : any;
  public moduloForm : FormGroup;
  constructor( private dialogRef:MatDialogRef<EditarModuloComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit(): void {
  this.formModulo();
    this.cargarFormulario()
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
  }

  cargarFormulario(){

    this.moduloForm.setValue({
      modulo :  this.data['modulo'],
      icono  :  this.data['icono'],
      imagen :  this.data['imagen'],
      estado :  this.data['estado']
    })

  }

  private formModulo(){
    this.moduloForm = new FormGroup({
      modulo     : new FormControl('', [Validators.required,]),
      icono      : new FormControl('', [Validators.required,]),
      imagen     : new FormControl('', [Validators.minLength(15)]),
      estado     : new FormControl('',[Validators.required]),
    })
}

editarModulo(){
  let url    = 'seguridad/actualizarModulo';
  let params = {
      idModulo : Number(this.data['id_modulo']), 
      modulo   : String(this.moduloForm.value.modulo), 
      icon     : String(this.moduloForm.value.icono),
      imagen   : String(this.moduloForm.value.imagen),
      estado   : Number(this.moduloForm.value.estado)

  } 

  this.seguridad.editarModulo(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        // this.toast.mensajeError(String(res?.errors[0]['descripcion']),"Error")
      }
    }
  )

}



close(){
  this.dialogRef.close()
}

}
