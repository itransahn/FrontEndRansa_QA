import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-mot-cam',
  templateUrl: './modal-mot-cam.component.html',
  styleUrls: ['./modal-mot-cam.component.scss']
})
export class ModalMotCamComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  catalogo   : any;
  public  catalogoT  : any;

  constructor(
    private dialogRef:MatDialogRef<ModalMotCamComponent>,
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService
  ) { }

  ngOnInit() {
    this.catalogo  = this.transporteService.returnCatalogo();
    this.cargarForm()
  }


  cargarForm(){
    this.modalForm = new FormGroup({
      transporte : new FormControl({ value: '', disabled : false }, [Validators.required] ),
      motorista : new FormControl({ value: '', disabled : false }, [Validators.required] ),
      camion    : new FormControl({ value: '', disabled : false }, [Validators.required] ),
    })
}

submit(){
  let url    = 'transporte/camionMotorista';
  let params = {
    motorista  : this.modalForm.value.motorista,
    camion     : this.modalForm.value.camion,
  } 
  this.transporteService.put(url,params).subscribe(
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
