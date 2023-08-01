import { Component, OnInit } from '@angular/core';
import { AuditoriaComponent } from '../auditoria/auditoria.component';
import { mensajes } from 'src/app/interfaces/generales';
import { CrearExtintorComponent } from '../crear-extintor/crear-extintor.component';
import { DataApi } from 'src/app/interfaces/dataApi';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { SsmoaService } from '../../ssmoa.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { extintor } from 'src/app/interfaces/ssmoa';

@Component({
  selector: 'app-extintores-as',
  templateUrl: './extintores-as.component.html',
  styleUrls: ['./extintores-as.component.scss']
})
export class ExtintoresAsComponent implements OnInit {
  opcionesModules : any;
  extintor : any;
  idExtintor : any;
  extintores : extintor[] = []
  dataExtintor : any;

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
      sede : 14
    }
    this.ssomas.get('/ssmoa/extintor', params).subscribe(
      (res:DataApi)=>{
        this.extintores = res?.data.Table0;
      }
    )
  }

  menu(template, data) {
    this.extintor = data.Nomenclatura;
    this.idExtintor = data?.id_Extintor;
    this.dataExtintor = data;
    // this.dataModulo = dataModulo;
    this.opcionesModules = [
      {
        icono     : 'edit',
        titulo    : `Modificar Extintor ${this.extintor}`,
        subtitulo : 'Cambios a Extintor',
        url       : `ransa/administracion/usuarios`,
        accion    : 1
      },
      {
        icono   : 'note_add',
        titulo  : 'Auditoria',
        subtitulo : 'Auditoria del extintor',
        url       :  `ransa/administracion/usuarios/${data?.id}`,
        accion    : 2
      },
      {
        icono   : 'announcement',
        titulo  : 'Incidencia',
        subtitulo : 'Incidencia sobre Extintor',
        url       : `ransa/administracion/usuarios/${data?.id}`,
        accion    : 3

      },
    ]
    this._bottomSheet.open(template);
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

Accion( accion ?: number, data?:any ){
    if ( accion == 1){
      this.Modal(14,this.dataExtintor,3)
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
