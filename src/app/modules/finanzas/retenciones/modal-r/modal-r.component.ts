import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


import { mesesd } from 'src/app/data/data';
import { FacturacionService } from '../../facturacion.service';
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
  selector: 'app-modal-r',
  templateUrl: './modal-r.component.html',
  styleUrls: ['./modal-r.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class ModalRComponent implements OnInit {
  public menuForm : FormGroup;
  public meses = mesesd();
  public idProveedor : number ;
  options: string[] = ['One', 'Two', 'Three'];
  public proveedores : any[] = [];
  filteredOptions: Observable<string[]>;
  public sedes = [
    {
      idSede : 1,
      sede   : 'RANSA'
    },
    {
      idSede : 2,
      sede   : 'ALMAHSA'
    }
  ]

  public tipoR = [
    {
      idTipo : 135,
      retencion   : '1 %',
      valor : 'retencion135'
    },
    {
      idTipo : 112,
      retencion   : '12.5 %',
      valor : 'retencion112'
    },
    {
      idTipo : 217,
      retencion   : '15 %',
      valor : 'retencion217'
    },
    {
      idTipo : 113,
      retencion   : '10 %',
      valor : 'retencion217'
    }
  ]

 
  constructor(
    private dialogRef:MatDialogRef<ModalRComponent>, 
    public auth:AuthService,
    public seguridad : SeguridadService, 
    public servicio : FacturacionService,
    public sharedS  : SharedService
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(){
    this.formMenu();
    this.cargarProveedores();


    // this.filteredOptions =  this.menuForm.get('proveedor').valueChanges.pipe(
    //   startWith(''),
    //   map(value => {
    //   const  proveedor = typeof value === 'string' ? value : value?.proveedor;
    //   return  this._filter(proveedor || '')
    //   }),
    // );


     this.filteredOptions =  this.menuForm.get('proveedor').valueChanges.pipe(
      startWith(''),
      map(value => {
      const  proveedor = typeof value === 'string' ? value : value?.proveedor;
      return  this.sharedS._filter(this.proveedores,proveedor, 'proveedor')
      }),
    );

  }
  
  public formMenu(){
    this.menuForm = new FormGroup({
      proveedor      : new FormControl ('' , [ Validators.required,]),
      // periodo   : new FormControl ('' , [ Validators.required,]),
      // anio      : new FormControl ('' , [ Validators.required,]),
      // dia       : new FormControl ('' , [ Validators.required,]),
      sede      : new FormControl ('' , [ Validators.required,]),
      tipoR     : new FormControl ('' , [ Validators.required,]),
      fecha     : new FormControl ('', [Validators.required])
    })
}

cargarProveedores(){
  let url = '/finanzas/proveedores';
  let params = {};
  this.servicio.get(url,params).subscribe(
    res => {
      if(res){
          this.proveedores = res?.data?.Table0;
          // 
      }
    }
  )
}

  redireccionar(){
    // 
    this.auth.redirecTo(`/ransa/finanzas/retencion/${this.menuForm.value.fecha?._i?.month + 1}/${this.menuForm.value.fecha?._i?.date}/${this.menuForm.value.fecha?._i?.year}/${this.idProveedor}/${this.menuForm.value.sede}/${this.menuForm.value.tipoR}`);
    // this.auth.redirecTo(`/ransa/finanzas/retencion/${this.menuForm.value.periodo}/${this.menuForm.value.dia}/${this.menuForm.value.anio}/${this.idProveedor}/${this.menuForm.value.sede}/${this.menuForm.value.tipoR}`);
    this.dialogRef.close()
  }

  close(){
    this.dialogRef.close()
  }

  public _filter(value: string): string[]{
    const filterValue = value.toLowerCase();
    return this.proveedores.filter((option?:any) => option?.proveedor.toLowerCase().includes(filterValue));
  }  


  setearProveedor( data ?: any){
this.idProveedor = data?.idProveedor;
  }
}
