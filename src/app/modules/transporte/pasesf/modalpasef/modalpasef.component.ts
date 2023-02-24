import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { mask, mensajes } from 'src/app/interfaces/generales';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

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
  selector: 'app-modalpasef',
  templateUrl: './modalpasef.component.html',
  styleUrls: ['./modalpasef.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ModalpasefComponent implements OnInit {

  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoF  : any;
  public  titulo     : string;
  public  subtitulo  : string;
  public readonly    : boolean = true;
  public mask      =   mask;
  public fechaG  = new Date();
  public fecha : string;
  public transporte = [
    {
      id  : 1, 
      obj : ' SI'
    },
    {
      id  : 2, 
      obj : ' NO'
    },
  ]
  constructor(
    private dialogRef:MatDialogRef<ModalpasefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    public sweel : SweetAlertService
  ) { }

  ngOnInit(): void {
  this.cargarForm();
  this.fecha = `${this.retornarValorMes(this.fechaG.getMonth()+1)}/01/${this.fechaG.getFullYear()}`;
  }

  retornarValorMes( mes : number ){
    if ( mes < 10){
      return `0${String(mes)}`
    }else{
      return String(mes)
    }
  }

  cargarForm(){
    this.modalForm = new FormGroup({
      fechaSalida   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      HoraSalida    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      identidad     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      nombre        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      transporte    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      placa         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      contenido     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      valor         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })
}

close(){
  this.dialogRef.close()
}

placaChange(){
  if ( this.modalForm.value.transporte == 1){
    this.readonly = false;
    this.modalForm.patchValue({
      placa : ''
    })
  }else{
    this.readonly = true;
    this.modalForm.patchValue({
      placa : 'XXX-9999'
    })
  }
}

submit(){
  this.sweel.mensajeConConfirmacion('¿Seguro de crear pase de salida?','Pase de Salida Ransa','question').then(
    res=>{
      if ( res ){
        let url    = 'transporte/paseSalidaf';
        let params = {
          fechaSalida     : this.modalForm.value.fechaSalida,
          horaSalida      : this.modalForm.value.HoraSalida,
          usuarioCreador  : this.auth.dataUsuario['id_usuario'],
          nombrePersona   : this.modalForm.value.nombre,
          contenido       : this.modalForm.value.contenido,
          identidad       : this.modalForm.value.identidad,
          placa           : this.modalForm.value.placa,
          valorSa         : this.modalForm.value.valor,
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
