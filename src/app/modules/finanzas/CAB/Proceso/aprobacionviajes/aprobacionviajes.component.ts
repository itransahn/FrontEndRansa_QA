import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-aprobacionviajes',
  templateUrl: './aprobacionviajes.component.html',
  styleUrls: ['./aprobacionviajes.component.scss']
})
export class AprobacionviajesComponent implements OnInit {
  public viajes  : any[] = [];
  
  constructor(
    public auth     : AuthService,
    private service : FacturacionService,
    private toast : ToastServiceLocal,
    private sweel : SweetAlertService
  ) { }

  ngOnInit(): void {
    
    this.cargarViajes();
    this.service.refresh$.subscribe(
      res=>{
         this.cargarViajes();
      }
    )
  }


  cargarViajes(){
    let url = '/finanzas/AprobarviajeCab';
    let params = {
      id_usuario : (this.auth.dataUsuario['id_usuario'])
    }
  this.service.get(url,params).subscribe(
    res=>{
      if(res){
        this.viajes = res?.data?.Table0;
        
        }
    }
  )
  }

  aprobacion( viaje:number ,aprobacion : number, data?:any ){
let aprobacion1 : string
let tipo        : string

if( aprobacion == 1){
  aprobacion1 = 'Aprobar';
  tipo        = 'Aprobación'
}else{
  aprobacion1 = 'Denegar';
  tipo        = 'Denegación'
}

this.sweel.mensajeConConfirmacion(`¿Seguro de ${aprobacion1} viaje?`,`${tipo} de viaje`,`question`).then(
  res=>{
    if(res){
      let url = '/finanzas/aprobacion';
let params = {
idViaje    : viaje,
aprobacion : aprobacion,
usuario    : this.auth.dataUsuario['id_usuario'],
    }
this.service.post( url, params ).subscribe(
  res=>{
    if(!res.hasError){
      if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
      }else{
        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
        this.correoAprobacion( data );
        this.cargarViajes()
      }
  }else{
    this.toast.mensajeError(String(res?.errors),"Error")
  }
  }
)
    }
  }
) }

correoAprobacion( data ){
  let url = '/auth/ViajeAprobado';
  let params = {
    solicitado      : data?.['nombre'],
    tipoViaje       : data?.['tipoViaje'],
    FechaHora       : data?.['Fecha'] + data?.['Hora'],
    numero          : data?.['numero'],
    origen          : data?.['Origen'],
    destino         : data?.['Destino'],
    multipleDestino : data?.['multipleDestinto'],
    correo          : this.auth.dataUsuario['correo'],
    recibo          : data?.['recibo'],
    valor           : data?.['monto'],
  }
this.service.get(url,params).subscribe(
  res =>{
    
  }
);

}
}
