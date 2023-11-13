import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
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
  selector: 'app-crear-pase-salida',
  templateUrl: './crear-pase-salida.component.html',
  styleUrls: ['./crear-pase-salida.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class CrearPaseSalidaComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  modalForm2  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoF  : any;
  public  titulo     : string;
  public  subtitulo  : string;

  public  destino    : number;
  public  transporte : number;

  filteredOptions  : Observable<any[]>;
  filteredOptions2 : Observable<any[]>;


  public motivos = [
    {
      id: 1,
      motivo : 'Cliente'
    },
    {
      id: 2,
      motivo : 'Proveedor'
    }
  ]
  constructor(
    private dialogRef:MatDialogRef<CrearPaseSalidaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    public sweel : SweetAlertService,
    public sharedS : SharedService

  ) { }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo();
    this.cargarForm1();
    this.cargarForm2();

    this.filteredOptions2 =  this.modalForm2.get('transporte').valueChanges.pipe(
      startWith(''),
      map(value => {
      const  proveedor = typeof value === 'string' ? value : value?.motivo;
      return  this.sharedS._filter(this.motivos, proveedor, 'motivo')
      }),
    );

    this.filteredOptions2.subscribe(
      res=>{
        console.log(res)
      }
    )

  }

  cargarForm1(){
    this.modalForm = new FormGroup({
      tipo    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })
}

setearValorD( data ?: any ){
  this.destino = data?.ID;
}

setearValorT( data ?: any ){
  this.transporte = data?.idTransportista;
}
  cargarForm2(){
    this.modalForm2 = new FormGroup({
      transporte    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      camion        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      motorista     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      fechaSalida   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      HoraSalida    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      destino       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      contenido     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })

 
}

cargarCatalogo( ){
  let url = 'transporte/CatpasesSalida';
  let params = {
      sede : this.auth.dataUsuario['sede'], 
      rol  : this.auth.dataUsuario['id_rol'], 
      tipo : this.modalForm.value.tipo,
  }
  this.transporteService.post(url,params).subscribe(
    (data : DataApi | any) =>{
        this.catalogoF = data;   
        this.filteredOptions =  this.modalForm2.get('destino').valueChanges.pipe(
          startWith(''),
          map(value => {
          const  proveedor = typeof value === 'string' ? value : value?.Destino;
          return  this.sharedS._filter(this.catalogoF?.['data'],proveedor, 'Destino')
          }),
        );
    }
  )
}

cargarData(){
  this.filteredOptions2 =  this.modalForm2.get('transporte').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value;
    return  this._filter2(this.catalogoF?.['Transportes'],proveedor, 'nombreEmpresa')
    }),
  );
}

public _filter2(array:any[],value: string, valorBuscar : string): string[]{
  const filterValue = value.toLowerCase();
  return array.filter((option?:any) => option?.[`${valorBuscar}`].toLowerCase().includes(filterValue));
} 

close(){
  this.dialogRef.close()
}


submit(){
  this.sweel.mensajeConConfirmacion('¿Seguro de crear pase de salida?','Pase de Salida Ransa','question').then(
    res=>{
      if ( res ){
        let url    = 'transporte/paseSalida';
        let params = {
          idTransportista : this.modalForm2.value.transporte,
          idCamion        : this.modalForm2.value.camion,
          idMotorista     : this.modalForm2.value.motorista,
          usuario         : this.auth.dataUsuario['id_usuario'],
          fechaSalida     : this.modalForm2.value.fechaSalida,
          horaSalida      : this.modalForm2.value.HoraSalida,
          tipo            : this.modalForm.value.tipo,
          idDestino       : this.destino,
          contenido       : this.modalForm2.value.contenido,
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
    }
  )

}
}
