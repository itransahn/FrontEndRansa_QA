import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { FacturacionService } from 'src/app/modules/finanzas/facturacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-incidenciasviajes',
  templateUrl: './incidenciasviajes.component.html',
  styleUrls: ['./incidenciasviajes.component.scss']
})
export class IncidenciasviajesComponent implements OnInit {
  public  FormModule   : FormGroup;

  constructor(
    private dialogRef:MatDialogRef<IncidenciasviajesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public service : FacturacionService
  ) { }

  ngOnInit(): void {
    this.cargarForm();
    
  }

  cargarForm(){
    this.FormModule = new FormGroup({
      Incidencia  : new FormControl({ value: '', disabled : false }, [ Validators.required] ),
      monto              : new FormControl({ value: '', disabled : false }, [ Validators.required] ),
    })
}


submit(){
  let url    = 'finanzas/incidenciaViajeCab';
  let params = {
idViaje          : this.data,
incidencia       : String(this.FormModule.value.Incidencia),
ValorIncidencia  : Number(this.FormModule.value.monto)
  } 
  
  this.service.post(url,params).subscribe(
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
