import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../../transporte.service';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mask, mensajes } from 'src/app/interfaces/generales';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { concat, map, Observable, startWith } from 'rxjs';
import { SharedService } from 'src/app/modules/shared/shared.service';
const moment = _rollupMoment || _moment;

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
  selector: 'app-modal-recibos',
  templateUrl: './modal-recibos.component.html',
  styleUrls: ['./modal-recibos.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ModalRecibosComponent implements OnInit {
  public  formTipo     : FormGroup;
  public  formRecibo   : FormGroup;
  public  formFactura  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  enable2    : boolean = false;
  public  enable3    : boolean = false;
  public  enable4    : boolean = true;
  filteredOptions:  Observable<string[]>;
  filteredOptions2: Observable<string[]>;
  public  botton     : boolean = false;

  public  catalogo      : any[]=[];
  public  catalogoTgu   : any[]=[];
  public  catalogoSps   : any[]=[];
  public  catalogoF  : any;

  public  titulo     : string;
  public  subtitulo  : string;

  public mask = mask;
  public cco  : number = 0;

  public fechaG  = new Date();
  public fechaF  : string;

  // public fecha = '02/08/2023' ;

  public fecha : string ;
  
  /* Nuevas Variables */
idCliente : number;
servidaA : number;
  public tiposRecibo = [
    {
      id : 1,
      tipo : 'INTERNO'
    },
    {
      id : 2,
      tipo : 'EXTERNO'
    }
  ]
   
  constructor(
    private dialogRef:MatDialogRef<ModalRecibosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    public sweel             : SweetAlertService,
    public sharedS           : SharedService
  ) { }

  ngOnInit() {
    this.fecha = `${this.retornarValorMes(this.fechaG.getMonth()+1)}/01/${this.fechaG.getFullYear()}`;
    this.cargarCatalogoTgu();
    this.cargarCatalogoSps();
    this.cargarCatalogo();
    this.catalogoF = this.auth.returnCatalogo();
    this.Validacion();
    console.log(this.data)
  }

  retornarValorMes( mes : number ){
    if ( mes < 10){
      return `0${String(mes)}`
    }else{
      return String(mes)
    }
  }

  setearCliente(data ){
    this.idCliente = data?.idCliente;
  } 

  setearservidaA(data ){
    this.servidaA = data?.idTransportista;
  } 

  Validacion(){
    /*  BANDERA 1 VISUALIZAR*/
    if ( this.data?.['bandera'] == 1 ){
      this.enable  = true;
      this.enable2 = true;
      this.enable3 = true;
      this.idCliente = this.data?.['data']['idCliente']
      this.servidaA = this.data?.['data']['servidoA']
      this.cargarFormTipo();
      this.formTipo.patchValue({
        tipo : this.data?.['data']['tipoRecibo']
      })

      if ( this.data?.['data']['tipoRecibo'] == 1){
          this.cargarFormReciboInterno();
          this.cargarFormFacturaMR();
          this.setForm( this.data?.['data']['tipoRecibo'] )
      }else{
        this.cargarFormReciboExterno();
        this.cargarFormFacturaMR();
        this.setForm( this.data?.['data']['tipoRecibo'] )
      }
    }
/*
     BANDERA
    2 Insertar */
    if ( this.data?.['bandera'] == 2 ){
      this.enable = false;
      this.enable3 = false;
      this.cargarFormTipo();
      this.cargarCatalogoTgu();
      this.cargarCatalogoSps();
    }
/*
    BANDERA
    3 Actualizar
    */
    if ( this.data?.['bandera'] == 3 ){
      this.cargarCatalogoTgu();
      this.cargarCatalogoSps();
      this.enable = true;
      this.enable2 = false;
      this.enable3 = true;
      this.idCliente = this.data?.['data']['idCliente']
      this.servidaA = this.data?.['data']['servidoA']
      this.cargarFormTipo();
      this.formTipo.patchValue({
        tipo : this.data?.['data']['tipoRecibo']
      })

      if ( this.data?.['data']['tipoRecibo'] == 1){
          this.cargarFormReciboInterno();
          this.cargarFormFacturaMR();
          this.setForm( this.data?.['data']['tipoRecibo'] )
      }else{
        this.cargarFormReciboExterno();
        this.cargarFormFacturaMR();
        this.setForm( this.data?.['data']['tipoRecibo'] )
      }
    }
    /*
    BANDERA
    4 Cierre
    */
    if ( this.data?.['bandera'] == 4 ){
      this.enable = true;
      this.enable  = true;
      this.enable2 = true;
      this.enable3 = true;
      this.enable4 = false;
      this.idCliente = this.data?.['data']['idCliente']
      this.servidaA = this.data?.['data']['servidoA']
      this.fechaF = this.data?.['data']['fechaR'];
      this.cargarFormTipo();
      this.formTipo.patchValue({
        tipo : this.data?.['data']['tipoRecibo']
      })
      this.cargarFormFacturaR()
      if ( this.data?.['data']['tipoRecibo'] == 1){
          this.cargarFormReciboInterno();
          this.setForm( this.data?.['data']['tipoRecibo'] )
      }else{
        this.cargarFormReciboExterno();
        this.setForm( this.data?.['data']['tipoRecibo'] )
      }
   
    }

  }

  setForm(tipo : number){
      if ( tipo == 1) {
        this.formRecibo.patchValue({
          cco           : this.data?.['data']?.['idCco'],
          reciboC       : this.data?.['data']?.['ReciboC'],
          fechaR        : this.data?.['data']?.['fechaR'],
          proveedorC    : this.data?.['data']?.['proveedorCombustible'],
          tipoC         : this.data?.['data']?.['tipoCombustible'],
          servidoA      : this.data?.['data']?.['servidoA'],
          placa         : this.data?.['data']?.['placa'],
          valorRecibo   : this.data?.['data']?.['valorRecibo'],
          observaciones : this.data?.['data']?.['Observaciones']
        })
      }
    if ( tipo == 2) {
      this.precargarAutoComplete()
        this.formRecibo.patchValue({
          cco           : this.data?.['data']?.['idCco'],
          reciboC       : this.data?.['data']?.['ReciboC'],
          fechaR        : this.data?.['data']?.['fechaR'],
          proveedorC    : this.data?.['data']?.['proveedorCombustible'],
          tipoC         : this.data?.['data']?.['tipoCombustible'],
          servidoA      : this.data?.['data']?.['servidoA'],
          placa         : this.data?.['data']?.['placa'],
          valorRecibo   : this.data?.['data']?.['valorRecibo'],
          observaciones : this.data?.['data']?.['Observaciones'],
          cliente       : this.data?.['data']?.['idCliente']
        })

      }
  }

  cargarFormTipo(){
    this.formTipo = new FormGroup({
      tipo : new FormControl({ value: '',disabled : this.enable}, [Validators.required])
    })
  }

  cargarCatalogos(){
  if( this.formTipo.value.tipo == 1  ) {
    this.cargarCatalogoTgu();
    this.cargarCatalogoSps();
    this.cargarFormReciboInterno()
  }else{
    this.cargarCatalogoTgu();
    this.cargarCatalogoSps();
    this.cargarFormReciboExterno();
  }
  }

  retornarCCO( ){
  if( this.auth.dataUsuario['sede'] === 1){
    for(let i = 0; this.catalogoTgu?.['clientes'].length; i++){
      if ( this.formRecibo.value.cliente === this.cargarCatalogoTgu?.['clientes'][i]?.idCliente){
          this.cco =   this.catalogoTgu?.['clientes'][i]?.idCeco
      }
  }
    }else{
      for(let i = 0; this.cargarCatalogoSps?.['clientes'].length; i++){
        if ( this.formRecibo.value.cliente === this.cargarCatalogoSps?.['clientes'][i]?.idCliente){
            this.cco =   this.cargarCatalogoSps?.['clientes'][i]?.idCeco
        }
    }
    }
       
    }

  cargarFormReciboInterno(){
    this.formRecibo = new FormGroup({
      cco           : new FormControl({ value:'', disabled: this.enable3}, [Validators.required]),
      reciboC       : new FormControl({ value:'', disabled: this.enable3}, [Validators.required]),
      fechaR        : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      proveedorC    : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      tipoC         : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      servidoA      : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      placa         : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      valorRecibo   : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      observaciones : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
    })
  }

  
cargarFormReciboExterno(){
    this.formRecibo = new FormGroup({
      cco           : new FormControl({ value:'', disabled: this.enable3}, [Validators.required]),
      reciboC       : new FormControl({ value:'', disabled: this.enable3}, [Validators.required]),
      fechaR        : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      proveedorC    : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      tipoC         : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      servidoA      : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      placa         : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      valorRecibo   : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      observaciones : new FormControl({ value:'', disabled: this.enable2}, [Validators.required]),
      cliente       : new FormControl({ value:'', disabled: this.enable3}, [Validators.required]),
    })
    this.precargarAutoComplete();
  }

precargarAutoComplete(){

if ( this.catalogo.length > 0) {
}else{
  this.cargarCatalogo()
}

if ( this.catalogoTgu.length > 0) {
}else{
  this.cargarCatalogoTgu()
}

if ( this.catalogoSps.length > 0) {
}else{
  this.cargarCatalogoSps()
}


if( this.auth.dataUsuario['sede'] === 1 ){
  this.filteredOptions =  this.formRecibo.get('cliente').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value?.cliente;
    return  this.sharedS._filter(this.catalogoTgu?.['clientes'],proveedor, 'cliente')
    }),
  );
this.filteredOptions2 =  this.formRecibo.get('servidoA').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value?.nombreEmpresa;
    return  this.sharedS._filter(this.catalogoTgu?.['transportes'],proveedor, 'nombreEmpresa')
    }),
  );
}else{
  this.filteredOptions =  this.formRecibo.get('cliente').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value?.cliente;
    return  this.sharedS._filter(this.catalogoSps?.['clientes'],proveedor, 'cliente')
    }),
  );
this.filteredOptions2 =  this.formRecibo.get('servidoA').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value?.nombreEmpresa;
    return  this.sharedS._filter(this.catalogoSps?.['transportes'],proveedor, 'nombreEmpresa')
    }),
  );
}
}

cargarFormFacturaR(){
    this.formFactura = new FormGroup({
      Nfactura : new FormControl({ value : '', disabled : this.enable4 }, [Validators.required]),
      fechaF   : new FormControl({ value:''  , disabled : this.enable4 }, [Validators.required]),
      valorF   : new FormControl({ value:''  , disabled : this.enable4 }, [Validators.required])
    })
  }

cargarFormFacturaMR(){
    this.formFactura = new FormGroup({
      Nfactura : new FormControl({ value : '', disabled : false }, []),
      fechaF   : new FormControl({ value:''  , disabled : false }, []),
      valorF   : new FormControl({ value:''  , disabled : false }, [])
    })
  }

  cargarCatalogo(){
    let url = '/transporte/catalogoRec';
    let params = {
      sede : this.auth.dataUsuario['sede']
    }
  this.transporteService.post(url, params).subscribe(
    res=>{
      if ( res ){
        this.catalogo = res;  
    }
    }
  )
  }
  cargarCatalogoTgu(){
    let url = '/transporte/catalogoRec';
    let params = {
      sede : 1
    }
  this.transporteService.post(url, params).subscribe(
    res=>{
      if ( res ){
        this.catalogoTgu = res;  
      }
    }
  )
  }
  cargarCatalogoSps(){
    let url = '/transporte/catalogoRec';
    let params = {
      sede : 2
    }
  this.transporteService.post(url, params).subscribe(
    res=>{
      if ( res ){
        this.catalogoSps = res;  
      }
    }
  )
  }

close(){
  this.dialogRef.close()
}

crearRecibo(){
  let url = '/transporte/Insrecibos';
  let cliente :number;
  let servidoA :number;
  if( this.formTipo.value.tipo  == 1){
    cliente = 0;
    servidoA = this.formRecibo.value.servidoA
  }else{
    cliente  = this.idCliente;
    servidoA = this.servidaA;
   }
  let params = {
tipoRecibo      : this.formTipo.value.tipo,
sede            : this.auth.dataUsuario['sede'],
cco             : this.formRecibo.value.cco,
reciboC         : this.formRecibo.value.reciboC,
fechaR          : this.formRecibo.value.fechaR,
proveedorC      : this.formRecibo.value.proveedorC,
tipoCombustible : this.formRecibo.value.tipoC,
servidoA        : servidoA,
placa           : this.formRecibo.value.placa,
valorRecibo     : this.formRecibo.value.valorRecibo,
observaciones   : this.formRecibo.value.observaciones,
usuarioCreador  : this.auth.dataUsuario['id_usuario'],
cliente         : cliente,
  }

this.transporteService.put(url,params).subscribe(
  res=>{
    if(!res.hasError){
      if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning);
      }else{
        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
        this.dialogRef.close();
      }
  }else{
       this.toast.mensajeError(String(res?.errors),"Error")
  }
  }
)
}

actualizarRecibo(){
  let cliente :number;
  let servidoA :number;
  if( this.formTipo.value.tipo  == 1){
    cliente = 0;
    servidoA = this.formRecibo.value.servidoA
  }else{
    cliente  = this.idCliente | this.data?.['data']['idCliente'];
    servidoA = this.servidaA  | this.data?.['data']['servidoA'];
   }
  let url = '/transporte/Updrecibos';
  let params = {
idRecibo        : this.data?.['data']['idRecibo'],
idSede          : this.auth.dataUsuario['sede'],
cco             : this.data?.['data']['idCco'],
fechaR          : this.formRecibo.value.fechaR,
proveedorC      : this.formRecibo.value.proveedorC,
tipoCombustible : this.formRecibo.value.tipoC,
servidoA        : servidoA,
placa           : this.formRecibo.value.placa,
valorR          : this.formRecibo.value.valorRecibo,
obs             : this.formRecibo.value.observaciones,
usuarioM        : this.auth.dataUsuario['id_usuario'],
  }
this.transporteService.put(url,params).subscribe(
  res=>{
    if(!res.hasError){
      if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning);
      }else{
        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
        this.dialogRef.close();
      }
  }else{
       this.toast.mensajeError(String(res?.errors),"Error")
  }
  }
)
}

submit(){
    if ( this.data?.bandera === 2 ){  
        this.crearRecibo()
    }  

    if ( this.data?.bandera === 3 ){  
      this.actualizarRecibo()
    }  

    if ( this.data?.bandera === 4 ){  
      this.cerrarRecibo()
    }  

}

cerrarRecibo( ){

  this.sweel.mensajeConConfirmacion(`¿Seguro de cerrar Recibo ${ this.data?.['data']['ReciboC'] }?`, `Cierre de Recibo`,"warning").then(
    res=>{
        if ( res ){
          let url = '/transporte/Cerrarrecibos';
          let params = {
        idRecibo      : this.data?.['data']['idRecibo'],
        Nfactura      : this.formFactura.value.Nfactura,
        fechaFactura  : this.formFactura.value.fechaF,
        valorFactura  : this.formFactura.value.valorF,
        usuarioM      : this.auth.dataUsuario['id_usuario'],
          }
        this.transporteService.put(url,params).subscribe(
          res=>{
            if(!res.hasError){
              if ( res?.data.Table0[0]['codigo'] == -1 ){
                  this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning);
              }else{
                this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
                this.dialogRef.close();
              }
          }else{
               this.toast.mensajeError(String(res?.errors),"Error")
          }
          }
        )
        }})

}

}
