import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mask, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';


import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { map, Observable, startWith } from 'rxjs';
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
  selector: 'app-modal-mot',
  templateUrl: './modal-mot.component.html',
  styleUrls: ['./modal-mot.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ModalMotComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoF  : any;
  public  titulo     : string;
  public  subtitulo  : string;
  public  mask = mask;
  public idValor : number;
  filteredOptions : Observable<any[]>;

  constructor(
    private dialogRef:MatDialogRef<ModalMotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    public sharedS : SharedService
  ) { }


  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo();
    this.catalogoF = this.transporteService.returnCatalogo();
    this.validacion();
    this.idValor = this.data?.['idTransportista'];
    this.filteredOptions =  this.modalForm.get('transportista').valueChanges.pipe(
      startWith(''),
      map(value => {
      const  proveedor = typeof value === 'string' ? value : value?.proveedor;
      return  this.sharedS._filter(this.catalogoF?.['transportes'], proveedor, 'nombreEmpresa')
      }),
    );
    
  }

  setearValor( data ?: any){
    this.idValor = data?.idTransportista;
      }
  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Nombre']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Motorista`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Nombre']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalForm = new FormGroup({  
        nombre    : new FormControl({ value: '', disabled : this.enable },   [] ),
        celular   : new FormControl({ value: '', disabled : this.enable },   [] ),
        identidad : new FormControl({ value: '', disabled : this.enable },   [] ),
        vencimientoLicencia : new FormControl({ value: '', disabled : this.enable },   [] ),
        transportista : new FormControl({ value: '', disabled : this.enable },   [] )
      })
  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      nombre    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      celular   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      identidad : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      vencimientoLicencia : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      transportista : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    nombre    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    celular   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    identidad : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    vencimientoLicencia : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    transportista : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
this.modalForm.setValue({
nombre     : this.data['Nombre'],
celular    : this.data['celular'],
identidad  : this.data['identidad'],
vencimientoLicencia : this.data['FechaVencimientoLicencia'],
transportista   : this.data['nombreEmpresa']
  })
}

  insertar(){
    let url    = 'transporte/InsMotoristas';
    let params = {
      nombre  :   this.modalForm.value.nombre , 
      celular :   this.modalForm.value.celular , 
      licencia  : this.modalForm.value.identidad, 
      vencimientoLicencia   : this.modalForm.value.vencimientoLicencia , 
      identidad   :   this.modalForm.value.identidad , 
      transportista  :  this.idValor, 
      usuario :  this.auth.dataUsuario['id_usuario'], 
    } 
    this.transporteService.put(url,params).subscribe(
      res=>{
        if(!res.hasError){
            if ( res?.data.Table0[0]['codigo'] == -1 ){
                this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
            }else{
              this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
              this.dialogRef.close()
            }
        }else{
          this.toast.mensajeError(String(res?.errors),"Error")
        }
      }
    )
}

actualizar(){
  let url    = 'transporte/ActMotoristas';
  let params = {
    idMotorista : this.data['idMotorista'],
    nombre  :   this.modalForm.value.nombre , 
    celular :   this.modalForm.value.celular , 
    licencia  : this.modalForm.value.identidad, 
    vencimientoLicencia   : this.modalForm.value.vencimientoLicencia , 
    identidad   :   this.modalForm.value.identidad , 
    transportista  :   this.idValor , 
    usuario :  this.auth.dataUsuario['id_usuario'], 
  } 
  this.transporteService.put( url,params ).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

submit(){

    if( this.data['bandera'] == 2 ){
      this.insertar()
    }

    if( this.data['bandera'] == 3 ){
      this.actualizar()
    }
}

close(){
  this.dialogRef.close()
}

}
