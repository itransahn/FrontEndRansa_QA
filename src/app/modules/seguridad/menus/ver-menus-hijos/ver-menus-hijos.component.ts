import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ver-menus-hijos',
  templateUrl: './ver-menus-hijos.component.html',
  styleUrls: ['./ver-menus-hijos.component.scss']
})
export class VerMenusHijosComponent implements OnInit {
  public hijos : any;
  constructor( private dialogRef:MatDialogRef<VerMenusHijosComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public auth:AuthService,
  public seguridad : SeguridadService, public toast:ToastServiceLocal ) { }

  ngOnInit() {
    this.cargarHijos()
  }

  close(){
    this.dialogRef.close()
  }

  cargarHijos(){
    let url = 'seguridad/verHijos';
    let params = {
      idMenuPadre : Number(this.data['padre']['id_menuPadre'])
    }
    this.seguridad.verHijos(url,params).subscribe(
      (data : any ) =>{
        this.hijos = data.data.Table0;
    }
    )
  }


}
