import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from 'src/app/services/auth.service';
import { SsmoaService } from '../../ssmoa.service';
import { DialogRef } from '@angular/cdk/dialog';
import { CrearExtintorComponent } from '../crear-extintor/crear-extintor.component';
import { MatDialog } from '@angular/material/dialog';
import { extintor } from 'src/app/interfaces/ssmoa';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AuditoriaComponent } from '../auditoria/auditoria.component';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { mensajes } from 'src/app/interfaces/generales';

@Component({
  selector: 'app-extintores',
  templateUrl: './extintores.component.html',
  styleUrls: ['./extintores.component.scss']
})
export class ExtintoresComponent implements OnInit {
  opcionesModules : any;
  extintor : any;
  idExtintor : any;
  estado : any;
  extintores : extintor[] = []
  dataExtintor : any;
  data = [
    {
      id: '1',
      extintor : 'CDSA1',
      ubicacion : 'Piso1',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    },
    {
      id: '2',
      extintor : 'CDSA2',
      ubicacion : 'Piso2',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    },
    {
      id: '2',
      extintor : 'CDSA3',
      ubicacion : 'Piso3',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA4',
      ubicacion : 'Piso4',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA5',
      ubicacion : 'Piso5',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA6',
      ubicacion : 'Piso6',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA7',
      ubicacion : 'Piso7',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA8',
      ubicacion : 'Piso8',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA9',
      ubicacion : 'Piso9',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    }, {
      id: '2',
      extintor : 'CDSA10',
      ubicacion : 'Piso20',
      TipoAgente : 'C02',
      TipoExtintor : 'ABC',
      Capacidad    : '15 LB'
    },
  ]

  constructor(
    private _bottomSheet : MatBottomSheet,
    public auth : AuthService,
    public ssomas : SsmoaService,
    public dialog  : MatDialog,
    public toast   : ToastServiceLocal
  ) { }

  ngOnInit(): void {
    this.cargarExtintores();
    this.ssomas.refresh$.subscribe(
      res=>{
        this.cargarExtintores()
      }
    )
  }

  cargarExtintores(){
    let params = {
      sede : 1
    }
    this.ssomas.get('/ssmoa/extintor', params).subscribe(
      (res:DataApi)=>{
        this.extintores = res?.data.Table0;
      }
    )
  }




  Modal ( sede : number, data ?: any, bandera ?: any){
    const dialogReg = this.dialog.open( CrearExtintorComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '75%',
      data: { 
        sede : sede,
        data : data  ,
        bandera : bandera 
      },
      disableClose : true
    })
  }

  menu(template, data) {
    this.extintor = data.Nomenclatura;
    this.idExtintor = data?.id_Extintor;
    this.dataExtintor = data;
    this.estado       = data?.estado;
    // this.dataModulo = dataModulo;
    this.opcionesModules = [
      {
        icono     : 'edit',
        titulo    : `Modificar Extintor ${this.extintor}`,
        subtitulo : 'Cambios a Extintor',
        url       : `ransa/administracion/usuarios`,
        accion    : 1,
        estado    : data?.estado
      },
      {
        icono   : 'note_add',
        titulo  : 'Auditoria',
        subtitulo : 'Auditoria del extintor',
        url       :  `ransa/administracion/usuarios/${data?.id}`,
        accion    : 2,
        estado    : data?.estado
      },
      {
        icono   : 'announcement',
        titulo  : 'Incidencia',
        subtitulo : 'Incidencia sobre Extintor',
        url       : `ransa/administracion/usuarios/${data?.id}`,
        accion    : 3,
        estado    : data?.estado

      },
      {
        icono   : 'autorenew',
        titulo  : 'Corrección',
        subtitulo : 'Correción de hallazgos',
        url       :'',
        accion    : 4,
        estado    : data?.estado
      },
    ]
    this._bottomSheet.open(template);
  }
  Accion( accion ?: number, data?:any ){
    if ( accion == 1){
      this.Modal(1,this.dataExtintor,3)
    }
    if ( accion == 2 ){
      this.ssomas.validarExtintor(this.idExtintor).subscribe(
        (res:any)=>{
    if ( res?.data.Table0[0]['codigo'] == -1 ){ this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
  }else{ this.Auditoria(this.dataExtintor,1)}
  } ) 
   }
    if ( accion == 3){
      this.Auditoria(this.dataExtintor,2)
    }
    if ( accion == 4){

        if(this.estado == 0){
          this.Auditoria(this.dataExtintor,4)
        }else{
this.toast.mensajeInfo("Actualmente no tiene items a corregir","Corrección a Extintor")
        }
      
    }
      this._bottomSheet.dismiss();
  }
 
Auditoria(  data ?: any, bandera ?:any ){
    const dialogReg = this.dialog.open( AuditoriaComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '75%',
      minWidth: '50%',
      data: { 
        data : data ,
        bandera : bandera
      },
      disableClose : true
    })
  }

}
