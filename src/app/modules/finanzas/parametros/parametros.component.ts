import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApi } from 'src/app/interfaces/dataApi';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../facturacion.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {
  public menuForm  : FormGroup;
  public menuFormP : FormGroup;
  public catalogoData : any[];
  public parametros   : any[]
  public sedes  = [
  {
    idSede : 1,
    Sede   : 'Sauce'
  },
  {
    idSede : 2,
    Sede   : 'Almahsa'
  }]
  constructor( 
  public auth:AuthService,
  public finanzasS : FacturacionService, 
  public toast:ToastServiceLocal,
  public sweel:SweetAlertService
  ) { }

  ngOnInit(){
    this.formMenu()
    this.formMenuP()
  }

  public formMenu(){
    this.menuForm = new FormGroup({
      sede    : new FormControl ('' , [ Validators.required,]),
    })
}

private formMenuP(){
  this.menuFormP = new FormGroup({
    nombreEmpresa : new FormControl ('' , [Validators.required]),
    direccion1 : new FormControl ('' , [Validators.required]),
    direccion2 : new FormControl ('' , [Validators.required]),
    municipio  : new FormControl ('' , []),
    Departamento : new FormControl ('' , []),
    telFijo : new FormControl ('' , [Validators.required]),
    telCel  : new FormControl ('' , [Validators.required]),
    rtnEmpresa : new FormControl ('' , [Validators.required]),
    correo : new FormControl ('' , []),
    lemaFactura : new FormControl ('' , []),
  })
}

public cargarForm(){
  this.menuFormP.patchValue({
nombreEmpresa : this.parametros['nombreCompleto'],
direccion1 : this.parametros['direccion1'],
direccion2 : this.parametros['direccion2'],
municipio : this.parametros['municipio'],
Departamento : this.parametros['Departamento'],
telFijo : this.parametros['Telfijo'],
telCel : this.parametros['TelCel'],
rtnEmpresa : this.parametros['rtnEmpresa'],
correo : this.parametros['correo'],
lemaFactura : this.parametros['lemaFactura'],
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

cargarParametros(){
  let url = 'seguridad/parametrosF';
  let params = {
    sede : this.menuForm.value?.sede
  }
  this.finanzasS.post( url, params ).subscribe(
    res=>{
      if( !res.hasError ){
        this.parametros = res.data.Table0[0]
        console.log(this.parametros)
        this.cargarForm()
      }
    }
  )
}

UpdatePermisos(){
  let sede : string;
  if( this.menuForm?.value.sede == 1){
    sede = 'Sauce'
  }else{
    sede = 'Almahsa'
  }

  let url = 'seguridad/UpdparametrosF';
  let params = {
sede   :  this.menuForm.value?.sede,
nombre   :  this.menuFormP.value?.nombreEmpresa,
direccion1   :  this.menuFormP.value?.direccion1,
direccion2   :  this.menuFormP.value?.direccion2,
municipio   :  this.menuFormP.value?.municipio,
departamento   :  this.menuFormP.value?.Departamento,
telFijos   :  this.menuFormP.value?.telFijo,
telCelulares   :  this.menuFormP.value?.telCel,
rtnE   :  this.menuFormP.value?.rtnEmpresa,
correo   :  this.menuFormP.value?.correo,
lema   :  this.menuFormP.value?.lemaFactura,
  }
  this.sweel.mensajeConConfirmacion(`¿Seguro de cambiar parametros de facturación de ${ sede }?`, `Cambios de parámetros`,"warning").then(
    res=>{
      if( res ){
          this.finanzasS.post( url, params ).subscribe (
            (res:DataApi)=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
                  this.menuFormP.reset();
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

}
