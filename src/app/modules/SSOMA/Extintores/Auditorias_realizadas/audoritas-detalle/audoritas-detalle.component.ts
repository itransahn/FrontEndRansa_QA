import { Component, OnInit, Input } from '@angular/core';
import { SsmoaService } from '../../../ssmoa.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ExportarService } from 'src/app/modules/shared/exportar.service';

@Component({
  selector: 'app-audoritas-detalle',
  templateUrl: './audoritas-detalle.component.html',
  styleUrls: ['./audoritas-detalle.component.scss']
})
export class AudoritasDetalleComponent implements OnInit {
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 10;
  public fecha = new Date();
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 10;
  @Input()data ?: any[];
  @Input()dataS ?: any[];
  @Input()dataA ?: any[];
  @Input()dataAR ?: any[];
  @Input()Tipo   ?: string;

  public dataMapedaS : dataMapeadaExcel[]=[];
  public dataMapedaA : dataMapeadaExcel[]=[];
  public dataMapedaAR : dataMapeadaExcel[]=[];


  constructor(
    private service   : SsmoaService,
    private paginator : MatPaginatorIntl, 
    public  dialog    : MatDialog, 
    private sweel     : SweetAlertService,
    private toast     : ToastServiceLocal,
    private auth      : AuthService,
    private ruta      : ActivatedRoute,
    private excelService      : ExportarService
  ) { }

  ngOnInit(): void {
  }


    //Paginación de la tabla
  next(event: PageEvent) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.desde = this.desde + this.pageSize;
      this.hasta = this.hasta + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.desde = this.desde - this.pageSize;
      this.hasta = this.hasta - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  exportAsXLSX():void{
    this.sweel.mensajeConConfirmacion("Generación de Excel","¿Seguro de generar Documento de Excel?","question").then(
        res=>{
          if(res){
            this.cargarDataMapeada();
          }
        }
    )
  }


  cargarDataMapeada() {

    /* MAPEAR SAUCE */
    for(let i = 0; i < this.dataS.length; i++){
      this.dataMapedaS.push({
        'Tipo Extintor'  : this.dataS[i]?.['tipo_extintor'],
        'Clase Agente'   : this.dataS[i]?.['tipo_agente'],
        Capacidad        : this.dataS[i]?.['Capacidad'],
        'Fecha Anterior' : new Date(this.dataS[i]?.['Fecha_Anterior_Carga']),
        'Fecha Proxima'  : new Date(this.dataS[i]?.['Fecha_Proxima_Carga']),
        Ubicacion    : this.dataS[i]?.['ubicacion'],
        Estado       : this.cargarValor(this.dataS[i]?.['Estado']),
        Presion      : this.cargarValor(this.dataS[i]?.['Presion']),
        Sello        : this.cargarValor(this.dataS[i]?.['Sello']),
        Manometro    : this.cargarValor(this.dataS[i]?.['Manometro']),
        Soporte      : this.cargarValor(this.dataS[i]?.['Soporte']),
        Manguera     : this.cargarValor(this.dataS[i]?.['Manguera']),
        Pintura      : this.cargarValor(this.dataS[i]?.['Pintura']),
        Señalizacion : this.cargarValor(this.dataS[i]?.['Senalizacion']),
        Altura       : this.cargarValor(this.dataS[i]?.['Altura']),
        Acceso       : this.cargarValor(this.dataS[i]?.['Acceso']),
        Usuario      : this.dataS[i]?.['usuario'],
        Fecha        : new Date(this.dataS[i]?.['Fecha'])
      })
    }
    /* MAPEAR ALMAHSA */
    for(let i = 0; i < this.dataA.length; i++){
      this.dataMapedaA.push({
        'Tipo Extintor'  : this.dataA[i]?.['tipo_extintor'],
        'Clase Agente'   : this.dataA[i]?.['tipo_agente'],
        Capacidad        : this.dataA[i]?.['Capacidad'],
        'Fecha Anterior' : new Date(this.dataS[i]?.['Fecha_Anterior_Carga']),
        'Fecha Proxima'  : new Date(this.dataS[i]?.['Fecha_Proxima_Carga']),
        Ubicacion    : this.dataA[i]?.['ubicacion'],
        Estado       : this.cargarValor(this.dataA[i]?.['Estado']),
        Presion      : this.cargarValor(this.dataA[i]?.['Presion']),
        Sello        : this.cargarValor(this.dataA[i]?.['Sello']),
        Manometro    : this.cargarValor(this.dataA[i]?.['Manometro']),
        Soporte      : this.cargarValor(this.dataA[i]?.['Soporte']),
        Manguera     : this.cargarValor(this.dataA[i]?.['Manguera']),
        Pintura      : this.cargarValor(this.dataA[i]?.['Pintura']),
        Señalizacion : this.cargarValor(this.dataA[i]?.['Senalizacion']),
        Altura       : this.cargarValor(this.dataA[i]?.['Altura']),
        Acceso       : this.cargarValor(this.dataA[i]?.['Acceso']),
        Usuario      : this.dataA[i]?.['usuario'],
        Fecha        : new Date(this.dataA[i]?.['Fecha'])
     
      })
    }
     /* MAPEAR ARCHIVO */
    for(let i = 0; i < this.dataAR.length; i++){
      this.dataMapedaAR.push({
        'Tipo Extintor'  : this.dataAR[i]?.['tipo_extintor'],
        'Clase Agente'   : this.dataAR[i]?.['tipo_agente'],
        Capacidad        : this.dataAR[i]?.['Capacidad'],
        'Fecha Anterior' : new Date(this.dataS[i]?.['Fecha_Anterior_Carga']),
        'Fecha Proxima'  : new Date(this.dataS[i]?.['Fecha_Proxima_Carga']),
        Ubicacion    : this.dataAR[i]?.['ubicacion'],
        Estado       : this.cargarValor(this.dataAR[i]?.['Estado']),
        Presion      : this.cargarValor(this.dataAR[i]?.['Presion']),
        Sello        : this.cargarValor(this.dataAR[i]?.['Sello']),
        Manometro    : this.cargarValor(this.dataAR[i]?.['Manometro']),
        Soporte      : this.cargarValor(this.dataAR[i]?.['Soporte']),
        Manguera     : this.cargarValor(this.dataAR[i]?.['Manguera']),
        Pintura      : this.cargarValor(this.dataAR[i]?.['Pintura']),
        Señalizacion : this.cargarValor(this.dataAR[i]?.['Senalizacion']),
        Altura       : this.cargarValor(this.dataAR[i]?.['Altura']),
        Acceso       : this.cargarValor(this.dataAR[i]?.['Acceso']),
        Usuario      : this.dataAR[i]?.['usuario'],
        Fecha        : new Date(this.dataAR[i]?.['Fecha'])
     
      })
    }
    // console.log(this.dataMapedaS, this.dataMapedaA, this.dataMapedaAR)
    this.excelService.exportToExcel(this.dataMapedaS, this.dataMapedaA ,this.dataMapedaAR ,  this.Tipo);
  }


 private  cargarValor( valor ?: number):string{
      if(valor == 1){
          return 'X'
      }else{ return ''}
  }
}


interface dataMapeadaExcel{
  'Tipo Extintor' : string,
  'Clase Agente'  : string,
  Capacidad       : string,
  'Fecha Anterior': Date,
  'Fecha Proxima' : Date,
  Ubicacion    : string,
  Estado       : string,
  Presion      : string,
  Sello        : string,
  Manometro    : string,
  Soporte      : string,
  Manguera     : string,
  Pintura      : string,
  Señalizacion : string,
  Altura       : string,
  Acceso       : string,
  Usuario      : string,
  Fecha        : Date

 }[]