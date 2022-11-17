import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(
  private dialogRef:MatDialogRef<ModalComponent>, 
  public auth:AuthService,
  public seguridad : SeguridadService, 
  public toast:ToastServiceLocal
  ) { }

  ngOnInit() {
    this.formMenu()
    }

  private formMenu(){
    this.menuForm = new FormGroup({
      cliente     : new FormControl ('' , [ Validators.required,]),
      documento   : new FormControl ('' , [ Validators.required,]),
    })
}

close(){
  this.dialogRef.close()
}

redireccionar(){
  this.auth.redirecTo(`/ransa/finanzas/facturacion/${this.menuForm.value.cliente}/${this.menuForm.value.documento}`)
  this.dialogRef.close()
}

}
