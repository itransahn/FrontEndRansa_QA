import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modal-n',
  templateUrl: './modal-n.component.html',
  styleUrls: ['./modal-n.component.scss']
})
export class ModalNComponent implements OnInit {
  public menuForm : FormGroup;
  public tipo : string = '';
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
  public sedes = [
    {
      id    : 'AH',
      valor : 'AH'
    },
    {
      id    : 'RH',
      valor : 'RH'
    }
  ]
  constructor(
    private dialogRef:MatDialogRef<ModalNComponent>, 
    public auth:AuthService,
    public seguridad : SeguridadService, 
    public toast:ToastServiceLocal,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(){
    this.formMenu();
    this.validarTipo();
  }

  validarTipo(){
    if( this.data['tipo'] == 1){
      this.tipo = 'Débito'
    }

    if( this.data['tipo'] == 2){
      this.tipo = 'Crédito'
    }
  }

  private formMenu(){
    this.menuForm = new FormGroup({
      cliente     : new FormControl ('' , [ Validators.required,]),
      documento   : new FormControl ('' , [ Validators.required, Validators.maxLength(5)]),
      empresa     : new FormControl ('' , [ Validators.required ]),
      cambios     : new FormControl ('' , [ Validators.required,])

    })
}

redireccionar(){
  
  if ( this.menuForm.value.empresa == 'AH' || this.menuForm.value.empresa == 'RH'   ){
    if ( this.data['tipo'] == 1){
      if ( this.menuForm.value.cambios === 0){
        this.auth.redirecTo(`/ransa/finanzas/notaDebito/${this.menuForm.value.empresa}/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/0`)
        this.dialogRef.close()
      }else{
        this.auth.redirecTo(`/ransa/finanzas/notaDebito/${this.menuForm.value.empresa}/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/1`)
        this.dialogRef.close()
      }
   
    }
  
    if ( this.data['tipo'] == 2) {
      if ( this.menuForm.value.cambios === 0){
        this.auth.redirecTo(`/ransa/finanzas/notaCredito/${this.menuForm.value.empresa}/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/0`)
        this.dialogRef.close()
      }else{
        this.auth.redirecTo(`/ransa/finanzas/notaCredito/${this.menuForm.value.empresa}/${this.menuForm.value.cliente}/${this.menuForm.value.documento}/1`)
        this.dialogRef.close()
      }
    
    }
  }
}

close(){
  this.dialogRef.close()
}


}
