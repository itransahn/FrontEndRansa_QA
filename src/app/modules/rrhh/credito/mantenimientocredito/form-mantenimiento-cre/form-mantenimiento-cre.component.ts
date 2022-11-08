import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mask, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../../../rrhh.service';

@Component({
  selector: 'app-form-mantenimiento-cre',
  templateUrl: './form-mantenimiento-cre.component.html',
  styleUrls: ['./form-mantenimiento-cre.component.scss']
})
export class FormMantenimientoCreComponent implements OnInit {
  public estados           : any;
  public mantenimientoForm : FormGroup;
  public mask = mask;
  catalogo : any[];
  constructor(
    private dialogRef:MatDialogRef <FormMantenimientoCreComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth      : AuthService,
    public seguridad : SeguridadService, 
    public toast     : ToastServiceLocal,
    public rrhhS     : RrhhService
  ) { }

  ngOnInit() {
    this.formModulo();
    this.catalogo = this.auth.returnCatalogo();
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.mantenimientoForm.setValue({
      usuario  :  this.data['Usuario'],
      nombre   :  this.data['Colaborador'],
      monto    :  this.data['monto']
    })
  }

  
  private formModulo(){
    this.mantenimientoForm = new FormGroup({
      usuario : new FormControl({ value: '', disabled : false  }, [Validators.required,]),
      nombre  : new FormControl({ value: '', disabled : true   }, [Validators.required,]),
      monto   : new FormControl({ value: '', disabled : false  }, [Validators.required]),
    })
}


onKeypressEvent(event: any){
  this.mantenimientoForm.patchValue({
    nombre : ''
  })
  if(event != ''){
    this.CargarUsuario(event);
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


actualizarCredito( ){
  let url    = 'rrhh/Ucreditos';
  let params = {
    idCredito         : this.data['id_credito'],
    Uanterior         : this.data['Usuario'],
    Unuevo            : this.mantenimientoForm.value.usuario,
    fechaCanjeo       : this.data['Fecha'],
    montoC            : this.mantenimientoForm.value.monto
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
