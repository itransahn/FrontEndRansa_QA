import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-modalrg',
  templateUrl: './modalrg.component.html',
  styleUrls: ['./modalrg.component.scss']
})
export class ModalrgComponent implements OnInit {
  public menuForm : FormGroup;

  
  constructor(
    private dialogRef:MatDialogRef<ModalrgComponent>, 
    public auth:AuthService,
    public seguridad : SeguridadService, 
    public servicio : FacturacionService,
  ) { }

  ngOnInit() {
    this.formMenu()
  }


  public formMenu(){
    this.menuForm = new FormGroup({
      correlativo : new FormControl ('' , [ Validators.required,]),
    })
}

redireccionar(){
  this.auth.redirecTo(`/ransa/finanzas/retencion/${this.menuForm.value.correlativo}`);
  this.dialogRef.close()
}

close(){
  this.dialogRef.close()
}


}
