import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ver-menu-hijo',
  templateUrl: './ver-menu-hijo.component.html',
  styleUrls: ['./ver-menu-hijo.component.scss']
})
export class VerMenuHijoComponent implements OnInit {
  public menuForm : FormGroup;
  constructor( private dialogRef:MatDialogRef<VerMenuHijoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit(){
    this.formMenu();
    this.cargarForm()
  }

  cargarForm(){
    let estado;
    if ( this.data['estado'] == 1){
      estado = 'Activo'
    }else{
      estado = 'Inactivo' 
    }

    this.menuForm.setValue({
      menuHijo  : this.data['menuHijo'],
      icon      : this.data['icon'],
      urlM      : this.data['url'],
      menuPadre : this.data['menuPadre'],
      estado    : estado
    })
  }

  private formMenu(){
    this.menuForm = new FormGroup({
      menuHijo     : new FormControl (''),
      icon         : new FormControl (''),
      urlM         : new FormControl (''),
      menuPadre    : new FormControl (''),
      estado       : new FormControl (''),
    })
}

close(){
  this.dialogRef.close()
}

}
