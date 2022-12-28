import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public menuForm : FormGroup;
  public cambios = [
    {
      id : 0,
      valor : 'No'
    },
    {
      id : 1,
      valor : 'Si'
    }
  ]
  constructor(
  private dialogRef:MatDialogRef<ModalComponent>, 
  public auth:AuthService,
  public seguridad : SeguridadService, 
  public toast:ToastServiceLocal,
  
  @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formMenu()
    }

  

  private formMenu(){
    this.menuForm = new FormGroup({
      cliente     : new FormControl ('' , [ Validators.required,]),
      documento   : new FormControl ('' , [ Validators.required,]),
      cambios     : new FormControl ('' , [ Validators.required,])
    })
}

close(){
  this.dialogRef.close()
}

redireccionar(){

  if ( this.data['sede'] == 1){

      if ( this.menuForm.value.cambios === 0){
        this.auth.redirecTo(`/ransa/finanzas/facturacion/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/0`)
        this.dialogRef.close()
        }else{
          this.auth.redirecTo(`/ransa/finanzas/facturacion/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/1`)
          this.dialogRef.close()
      }
  }

  if ( this.data['sede'] == 2) {

    
    if ( this.menuForm.value.cambios === 0){
      this.auth.redirecTo(`/ransa/finanzas/facturacionAh/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/0`)
    this.dialogRef.close()
      }else{
        this.auth.redirecTo(`/ransa/finanzas/facturacionAh/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/1`)
        this.dialogRef.close()
    }
  }
}

}
