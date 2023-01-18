import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

import { mesesd } from 'src/app/data/data';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-modal-r',
  templateUrl: './modal-r.component.html',
  styleUrls: ['./modal-r.component.scss']
})
export class ModalRComponent implements OnInit {
  public menuForm : FormGroup;
  public meses = mesesd();
  public proveedores : any[] = [];
  public sedes = [
    {
      idSede : 1,
      sede   : 'CD SAUCE'
    },
    {
      idSede : 2,
      sede   : 'ALMAHSA'
    }
  ]

  public tipoR = [
    {
      idTipo : 135,
      retencion   : '1 %',
      valor : 'retencion135'
    },
    {
      idTipo : 112,
      retencion   : '12 %',
      valor : 'retencion112'
    },
    {
      idTipo : 217,
      retencion   : '15 %',
      valor : 'retencion217'
    }
  ]
  constructor(
    private dialogRef:MatDialogRef<ModalRComponent>, 
    public auth:AuthService,
    public seguridad : SeguridadService, 
    public servicio : FacturacionService,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formMenu();
    this.cargarProveedores();
  }
  
  public formMenu(){
    this.menuForm = new FormGroup({
      proveedor : new FormControl ('' , [ Validators.required,]),
      periodo   : new FormControl ('' , [ Validators.required,]),
      anio      : new FormControl ('' , [ Validators.required,]),
      dia       : new FormControl ('' , [ Validators.required,]),
      sede      : new FormControl ('' , [ Validators.required,]),
      tipoR     : new FormControl ('' , [ Validators.required,])
    })
}

cargarProveedores(){
  let url = '/finanzas/proveedores';
  let params = {};
  this.servicio.get(url,params).subscribe(
    res => {
      if(res){
          this.proveedores = res?.data?.Table0;
          // console.log( this.proveedores )
      }
    }
  )
}

  redireccionar(){
    this.auth.redirecTo(`/ransa/finanzas/retencion/${this.menuForm.value.periodo}/${this.menuForm.value.dia}/${this.menuForm.value.anio}/${this.menuForm.value.proveedor}/${this.menuForm.value.sede}/${this.menuForm.value.tipoR}`);
    this.dialogRef.close()
  }

  close(){
    this.dialogRef.close()
  }


}
