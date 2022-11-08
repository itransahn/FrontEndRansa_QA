import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../../rrhh.service';

@Component({
  selector: 'app-form-mantenimiento-dolar',
  templateUrl: './form-mantenimiento-dolar.component.html',
  styleUrls: ['./form-mantenimiento-dolar.component.scss']
})
export class FormMantenimientoDolarComponent implements OnInit {
  public estados           : any;
  public mantenimientoForm : FormGroup;
  catalogo : any[];
    constructor(
    private dialogRef:MatDialogRef<FormMantenimientoDolarComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public seguridad : SeguridadService, 
    public toast:ToastServiceLocal,
    public rrhhS : RrhhService
  ) { }

  ngOnInit(){ 
    this.formModulo();
    this.catalogo = this.auth.returnCatalogo();
    this.cargarFormulario()
  }

  cargarFormulario(){
    this.mantenimientoForm.setValue({
      Hora          :  this.data['HORA'],
      usuario       :  this.data['USUARIO'],
      nombre        :  this.data['Nombre'],
      cco           :  this.data['id_cco']
    })
  }

  
  private formModulo(){
    this.mantenimientoForm = new FormGroup({
      Hora          : new FormControl({ value: '', disabled : true   }, [Validators.required,]),
      usuario       : new FormControl({ value: '', disabled : false  }, [Validators.required,]),
      nombre        : new FormControl({ value: '', disabled : true   }, [Validators.minLength(15)]),
      cco           : new FormControl({ value: '', disabled : true   }, [Validators.required]),
    })
}


onKeypressEvent(event: any){
  this.mantenimientoForm.patchValue({
    nombre : ''
  })
  if(event != ''){
    this.CargarUsuario( event);
  }
}

CargarUsuario( codigo?:any ){
  let url = 'rrhh/validarUsuario';
  let params = {
    usuario : codigo
  }
  this.rrhhS.post( url, params ).subscribe (
    res=>{
      if ( res?.data.Table0[0]['codigo'] == -1 ){
        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
    }else{
      this.mantenimientoForm.patchValue({
        nombre : res?.data.Table0[0]['Colaborador']
      })
    }
    }
  )
}

actualizarPermiso( ){
  let url    = 'rrhh/UpdcontrolCafeteria';
  let params = {
    idControl         : this.data['CONTROL'],
    Uanterior         : this.data['USUARIO'],
    Unuevo            : this.mantenimientoForm.value.usuario,
    fechaCanjeo       : this.data['FECHA'],
  } 
  this.rrhhS.post( url,params ).subscribe(
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

close(){
  this.dialogRef.close()
}

}
