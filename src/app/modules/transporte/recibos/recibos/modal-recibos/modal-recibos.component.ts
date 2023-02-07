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
import { mensajes } from 'src/app/interfaces/generales';
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
  public  botton     : boolean = false;

  public  catalogo   : any;
  public  catalogoF  : any;

  public  titulo     : string;
  public  subtitulo  : string;
  
  constructor(
    private dialogRef:MatDialogRef<ModalRecibosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    public sweel             : SweetAlertService

  ) { }

  ngOnInit() {
    this.cargarFormTipo();
  }

  cargarFormTipo(){
    this.formTipo = new FormGroup({
      tipo : new FormControl({ value: '',disabled : false}, [Validators.required])
    })
  }

  cargarCatalogos(){
  
  }

  cargarFormRecibo(){
    this.formRecibo = new FormGroup({

    })
  }




}
