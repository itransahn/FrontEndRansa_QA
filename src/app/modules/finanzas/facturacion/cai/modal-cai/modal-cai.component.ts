import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-modal-cai',
  templateUrl: './modal-cai.component.html',
  styleUrls: ['./modal-cai.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ModalCaiComponent implements OnInit {
  public menuForm : FormGroup;
  public maskCai = '999999-999999-999999-A0999A-999999-99';
  datemask = [/\d/, /\d/, /\d/,/\d/,/\d/,/\d/, '-', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public sedes  = [
    {
      idSede : 1,
      Sede   : 'Sauce'
    },
    {
      idSede : 2,
      Sede   : 'Almahsa'
    }]
  // 1AA9A9 - AA9999 - 999F93 - F999AA - 999999 - A9
  constructor(
    private dialogRef:MatDialogRef<ModalCaiComponent>, 
    public auth:AuthService, 
    public toast:ToastServiceLocal,
    public finanzasS : FacturacionService,
    public sweel : SweetAlertService
  ) { }

  ngOnInit() {
    this.formMenu()
  }

  private formMenu(){
    this.menuForm = new FormGroup({
      cai   : new FormControl ('' , [ Validators.required,]),
      desde : new FormControl ('' , [ Validators.required,]),
      hasta : new FormControl ('' , [ Validators.required,]),
      fecha : new FormControl ('' , [ Validators.required,]),
      sede  : new FormControl ('' , [ Validators.required,]),
    })
}

close(){
  this.dialogRef.close()
}

insertCai(){
  let url = 'finanzas/insertCAI';
  let params = {
cai     :  this.menuForm.value?.cai,
desde   :  this.menuForm.value?.desde,
hasta   :  this.menuForm.value?.hasta,
fechalimite   :  this.menuForm.value?.fecha,
sede    :  this.menuForm.value?.sede,
usuario : this.auth.dataUsuario['id_usuario']
}
  this.sweel.mensajeConConfirmacion(`¿Seguro de ingresar CAI ${ params['cai'] }?`, `Nuevo CAI`,"warning").then(
    res=>{
      if( res ){
          this.finanzasS.post( url, params ).subscribe (
            (res:DataApi)=>{
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
    }
  )
}

}
