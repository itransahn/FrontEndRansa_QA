import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApi } from 'src/app/interfaces/dataApi';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../facturacion.service';


import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ModalCaiComponent } from './modal-cai/modal-cai.component';
import { MatDialog } from '@angular/material/dialog';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-cai',
  templateUrl: './cai.component.html',
  styleUrls: ['./cai.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class CaiComponent implements OnInit {
  public menuForm  : FormGroup;
  public menuFormP : FormGroup;
  public catalogoData : any[];
  public parametros   : any[]
  public sedes  = [
  {
    idSede : 1,
    Sede   : 'Ransa'
  },
  {
    idSede : 2,
    Sede   : 'Almahsa'
  }]

  public tipoCai  = [
    {
      id : 1,
      tipo   : 'Factura'
    },
    {
      id : 2,
      tipo   : 'ND'
    },
    {
      id : 3,
      tipo   : 'NC'
    }]

  public maskCai = '9AAA-A999'
  constructor(
    public auth      : AuthService,
    public finanzasS : FacturacionService, 
    public toast     : ToastServiceLocal,
    public sweel     : SweetAlertService,
    public dialog    : MatDialog
  ) { }

  ngOnInit(){
    this.formMenu()
    this.formMenuP()
  }

  public formMenu(){
    this.menuForm = new FormGroup({
      sede : new FormControl ('' , [ Validators.required,]),
      documento : new FormControl ('' , [ Validators.required,]),
    })
}

private formMenuP(){
  this.menuFormP = new FormGroup({
    cai : new FormControl ({disabled:true, value : ''}, [Validators.required]),
    desde : new FormControl ('', [Validators.required]),
    hasta : new FormControl ('', [Validators.required]),
    fechaLimite  : new FormControl ('', [Validators.required]),
  })
}

public cargarForm(){
  this.menuFormP.patchValue({
cai : this.parametros['CAI'],
desde : this.parametros['desde'],
hasta : this.parametros['hasta'],
fechaLimite : this.parametros['fechaLimite'],
  })
}

catalogo(){
  this.auth.returnCatalogoData().subscribe(
   (res : catalogo | any) =>{ 
    if ( res['areasRansa'] ){
      this.catalogoData = res;
    }  }
  ) 
}

cargarCai(){
  let url = 'finanzas/caiActual';
  let params = {
    idSede : this.menuForm.value?.sede,
    tipo   : this.menuForm.value?.documento
  }
  this.finanzasS.post( url, params ).subscribe(
    res=>{
      // console.log(res)
      if( !res.hasError ){
        this.parametros = res.data.Table0[0]
        // console.log(this.parametros)
        this.cargarForm()
      }
    }
  )
}

actualizarCai(){
  let url = 'finanzas/updateCai';
  let params = {
id      :  this.parametros['id'],
cai     :  this.parametros['CAI'],
desde   :  this.menuFormP.value.desde,
hasta   :  this.menuFormP.value.hasta,
fechalimite   :  this.menuFormP.value.fechaLimite,
sede    :  this.menuForm.value.sede,
usuario : this.auth.dataUsuario['id_usuario'],
tipo    : 3
}
  this.sweel.mensajeConConfirmacion(`¿Seguro de Actualizar CAI ${ this.parametros['CAI'] }?`, `Actualización CAI`,"warning").then(
    res=>{
      if( res ){
          this.finanzasS.post( url, params ).subscribe (
            (res:DataApi)=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
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


modal( ){
  const dialogReg = this.dialog.open( ModalCaiComponent,{
    width  :   '500px',
    height :   'auto',
    maxWidth:  'auto',
    data    :  { },
    disableClose : true
  })
}

}
