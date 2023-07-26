import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { extintor } from 'src/app/interfaces/ssmoa';
import { AuthService } from 'src/app/services/auth.service';
import { SsmoaService } from '../../ssmoa.service';
import { MatDialog } from '@angular/material/dialog';
import { DataApi } from 'src/app/interfaces/dataApi';
import { CrearExtintorComponent } from '../crear-extintor/crear-extintor.component';

@Component({
  selector: 'app-extintores-ar',
  templateUrl: './extintores-ar.component.html',
  styleUrls: ['./extintores-ar.component.scss']
})
export class ExtintoresARComponent implements OnInit {

  opcionesModules : any;
  extintor : any;
  extintores : extintor[] = []
  constructor(
    private _bottomSheet : MatBottomSheet,
    public auth : AuthService,
    public ssomas : SsmoaService,
    public dialog  : MatDialog
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
      sede : 3
    }
    this.ssomas.get('/ssmoa/extintor', params).subscribe(
      (res:DataApi)=>{
        this.extintores = res?.data.Table0;
      }
    )
  }

  menu(template, data) {
    this.extintor = data.Nomenclatura;
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
        accion    : 4

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

}
