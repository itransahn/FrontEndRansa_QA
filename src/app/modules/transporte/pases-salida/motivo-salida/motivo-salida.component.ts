import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-motivo-salida',
  templateUrl: './motivo-salida.component.html',
  styleUrls: ['./motivo-salida.component.scss']
})
export class MotivoSalidaComponent implements OnInit {
  public FormPrimario      : FormGroup;
  public catalogo          : any[]  = [];
  constructor(
    private dialogRef:MatDialogRef<MotivoSalidaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    private sweel : SweetAlertService,
  ) { }

  ngOnInit() {
    this.catalogo = this.transporteService.returnCatalogo();
    this.formularioGeneral()
  }
  formularioGeneral(){
    this.FormPrimario = new FormGroup({  
      motivo       : new FormControl({ value: '', disabled : false },   [Validators.required] ),
  })
}


aprobarPase( ){
  this.sweel.mensajeConConfirmacion('¿Seguro de aprobar pase de salida?', `Placa de Camión ${this.data['camion']}`,'warning' ).then(
    res=>{
      if( res ){
        let url    = 'transporte/AprobarpaseSalida';
        let params = {
          usuario : this.auth.dataUsuario['id_usuario'],
          idPase  : this.data['idPase'],
        } 
        this.transporteService.put(url,params).subscribe(
          (res)=> {
            if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
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


  close(){
    this.dialogRef.close()
  }


}
