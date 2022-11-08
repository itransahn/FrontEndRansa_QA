import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ver-menu-p',
  templateUrl: './ver-menu-p.component.html',
  styleUrls: ['./ver-menu-p.component.scss']
})
export class VerMenuPComponent implements OnInit {
  public menuForm : FormGroup;
  private subs : Subscription = new Subscription()
  constructor( private dialogRef:MatDialogRef<VerMenuPComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit(): void {
    this.formModulo();
    this.cargarForm()
  }

  private formModulo(){
    this.menuForm   = new FormGroup({
      menuPadre     : new FormControl('',),
      icono         : new FormControl('',),
      modulo        : new FormControl('',),
      estado        : new FormControl('',)
    })
}

public cargarForm(){
  let estado: string;
  if ( this.data['padre']['estado'] == 1){
      estado = 'Activo'
  }else{
      estado = 'Inactivo'

  }

    this.menuForm.setValue({
    menuPadre : this.data['padre']['menuPadre'] ,
    icono     : this.data['padre']['icon'],
    modulo    : this.data['modulo']['modulo'],
    estado    : estado
    })
}

close(){
  this.dialogRef.close()
}

}
