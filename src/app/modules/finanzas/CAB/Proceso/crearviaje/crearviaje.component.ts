import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo, mask, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

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
  selector: 'app-crearviaje',
  templateUrl: './crearviaje.component.html',
  styleUrls: ['./crearviaje.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class CrearviajeComponent implements OnInit {
  maxDate = new Date();
  minHour = new Date().getTime();
  public mask = mask
  public catalogoData : catalogo | any[] = [];
  public tarifas : any[] = [];
  public viajes  : any[] = [];
  public personas = [
    {
      id    : 1 ,
      value : 1
    },
    {
      id    : 2 ,
      value : 2
    },
    {
      id    : 3 ,
      value : 3
    },
    {
      id    : 4 ,
      value : 4
    }
  ]
  public multipleDestino : multipleDestino[] = [];
  public tipoViaje = [ 
    {
      id: 1,
      tipo : 'Ida'
    },
    {
      id: 2,
      tipo : 'Retorno'
    },
    {
      id: 3,
      tipo : 'Multi Parada'
    }
  ]

  public tipoPago = [ 
    {
      id: 1,
      tipo : 'Contado'
    },
    {
      id: 2,
      tipo : 'Crédito'
    }
  ]
  public Form  : FormGroup;
  public 
  public pattern    = /^[0-9]+$/;
  public maxLength = 5;
  constructor(
    public auth   : AuthService,
    private service : FacturacionService,
    private toast : ToastServiceLocal,
    private sweel : SweetAlertService
  ) { }

  ngOnInit(): void {
    
    this.cargarTarifa();
    this.cargarForm();
    this.cargarViajes(); 
    this.service.refresh$.subscribe(
      res=>{
      this.cargarViajes();
      }
    )
   }

   tipoViajeSelecionado(){
    if( this.Form.value.tipoViaje != 3 ){

    }else{
      this.Form.value.patchValue({
origen  : 'Multiple Destino',
destino : 'Multiple Destino',
      })
    }
   }

  cargarForm(){
    this.Form  = new FormGroup({
        tipoViaje         : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        origen            : new FormControl( { value : '', disabled : false }, [ ] ),
        destino           : new FormControl( { value : '', disabled : false }, [ ] ),
        fecha             : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        hora              : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        cantidadPersonas  : new FormControl( { value : '', disabled : false }, [ Validators.required, Validators.max(4)] ),
        metodoPago        : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        motivo            : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        numero            : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
    })
  }

  
  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }

  cargarTarifa(){
    let url = '/finanzas/tarifasCab';
    let params = {
      cod_empleado : this.auth.dataUsuario['id_usuarioRansa']
    }
  this.service.get(url,params).subscribe(
    res=>{
      if ( res ){
      this.tarifas = res?.data?.Table0
      }
    }
  )
  }

  Paradas(){
    this.multipleDestino.push({
      id      : (this.multipleDestino.length + 1),
      Origen  : this.Form.value.origen, 
      Destino : this.Form.value.destino
    });
    this.Form.patchValue(
      {destino : '', origen : ''}
    )
  }

  quitarViaje(id : number){
  this.multipleDestino.splice(id,1);

  }

  cargarViaje(){
    this.sweel.mensajeConConfirmacion("Vale de Transporte","¿Seguro de envíar viaje?","question").then(
      res=>{
        if ( res ) {
            
    let values = this.Form.value;
    let multipleDestino : any;
    let origen : any;
    let destino : any;

if ( values.tipoViaje != 3){
  multipleDestino = '';
  origen =  values.origen;
  destino = values.destino;
}else{
  multipleDestino = JSON.stringify(this.multipleDestino);
  
  origen =  'MultipleDestino';
  destino = 'MultipleDestino';
}

    let url = '/finanzas/viajeCab';
    let params = {
tipoViaje     :    values.tipoViaje,
origen :           origen,
destino :          destino,
fecha :            values.fecha,
hora :             values.hora,
multipleDestino :  multipleDestino,
solicitante :      this.auth.dataUsuario['id_usuarioRansa'],
cantidadPersonas : values.cantidadPersonas,
metodoPago :       values.metodoPago,
motivo     :       values.motivo,
numero     :       values.numero,
  }
    
this.service.post(url,params).subscribe(
  res=>{
    if(!res.hasError){
      if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
      }else{
        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
        this.Form.setValue({  
          tipoViaje         : '',
          origen : '',
          destino : '',
          fecha : '',
          hora : '',
          cantidadPersonas : '',
          metodoPago : '',
          motivo : '',
          numero : '',
        })
      this.multipleDestino = [];
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

cargarViajes(){
  let url = '/finanzas/viajeCab';
  let params = {
    codEmpleado : (this.auth.dataUsuario['id_usuarioRansa'])
  }
this.service.get(url,params).subscribe(
  res=>{
    if(res){
      this.viajes = res?.data?.Table0;
      }
  }
)
}

}



interface multipleDestino{
  id      : number,
  Origen  : string,
  Destino : string
}[]
