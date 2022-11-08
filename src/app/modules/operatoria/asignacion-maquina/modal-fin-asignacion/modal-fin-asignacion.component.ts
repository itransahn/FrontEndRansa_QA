import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { OperatoriaService } from '../../operatoria.service';

@Component({
  selector: 'app-modal-fin-asignacion',
  templateUrl: './modal-fin-asignacion.component.html',
  styleUrls: ['./modal-fin-asignacion.component.scss']
})
export class ModalFinAsignacionComponent implements OnInit {
  public estados : any;
  public asignacion : FormGroup;
  catalogo : any[];
  
  constructor(
    private dialogRef:MatDialogRef<ModalFinAsignacionComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public operatoriaS: OperatoriaService, 
    public toast:ToastServiceLocal,
  ) { }

  ngOnInit(){
    this.formModulo()
  }

  private formModulo(){
    this.asignacion = new FormGroup({
      Observaciones : new FormControl({ value: '', disabled : false   } )
    })
}


actualizarAsignacion( ){
  let url    = 'operaciones/actualizarAsignacionMaq';
  let params = {
    observaciones : this.asignacion.value.Observaciones,
    usuario       : this.auth.dataUsuario['id_usuario'],
    idAsignacion  : this.data['ID'],
  } 
  this.operatoriaS.post( url,params ).subscribe(
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
