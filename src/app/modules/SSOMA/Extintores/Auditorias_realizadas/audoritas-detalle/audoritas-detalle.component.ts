import { Component, OnInit, Input } from '@angular/core';
import { SsmoaService } from '../../../ssmoa.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ExportarService } from 'src/app/modules/shared/exportar.service';
import { CargarimagenComponent } from '../../cargarimagen/cargarimagen.component';

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
  @Input()dataAS ?: any[];
  @Input()dataFR ?: any[];
  @Input()Tipo   ?: string;

  public dataMapedaS  : dataMapeadaExcel[] =[];
  public dataMapedaA  : dataMapeadaExcel[] =[];
  public dataMapedaAR : dataMapeadaExcel[]=[];
  public dataMapedaAS : dataMapeadaExcel[]=[];
  public dataMapedaFR : dataMapeadaExcel[]=[];


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
    for(let i = 0; i < this.dataS?.length; i++){
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
        Fecha        : new Date(this.dataS[i]?.['Fecha']),
        observaciones : this.dataS[i]?.['observaciones']
      })
    }
    /* MAPEAR ALMAHSA */
    for(let i = 0; i < this.dataA?.length; i++){
      this.dataMapedaA.push({
        'Tipo Extintor'  : this.dataA[i]?.['tipo_extintor'],
        'Clase Agente'   : this.dataA[i]?.['tipo_agente'],
        Capacidad        : this.dataA[i]?.['Capacidad'],
        'Fecha Anterior' : new Date(this.dataA[i]?.['Fecha_Anterior_Carga']),
        'Fecha Proxima'  : new Date(this.dataA[i]?.['Fecha_Proxima_Carga']),
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
        Fecha        : new Date(this.dataA[i]?.['Fecha']),
        observaciones : this.dataS[i]?.['observaciones']
     
      })
    }
     /* MAPEAR ARCHIVO */
    for(let i = 0; i < this.dataAR?.length; i++){
      this.dataMapedaAR.push({
        'Tipo Extintor'  : this.dataAR[i]?.['tipo_extintor'],
        'Clase Agente'   : this.dataAR[i]?.['tipo_agente'],
        Capacidad        : this.dataAR[i]?.['Capacidad'],
        'Fecha Anterior' : new Date(this.dataAR[i]?.['Fecha_Anterior_Carga']),
        'Fecha Proxima'  : new Date(this.dataAR[i]?.['Fecha_Proxima_Carga']),
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
        Fecha        : new Date(this.dataAR[i]?.['Fecha']),
        observaciones : this.dataS[i]?.['observaciones']     
      })
    }
      /* MAPEAR ARCHIVO SPS*/
    for(let i = 0; i < this.dataAS?.length; i++){
          this.dataMapedaAS.push({
            'Tipo Extintor'  : this.dataAS[i]?.['tipo_extintor'],
            'Clase Agente'   : this.dataAS[i]?.['tipo_agente'],
            Capacidad        : this.dataAS[i]?.['Capacidad'],
            'Fecha Anterior' : new Date(this.dataS[i]?.['Fecha_Anterior_Carga']),
            'Fecha Proxima'  : new Date(this.dataS[i]?.['Fecha_Proxima_Carga']),
            Ubicacion    : this.dataAS[i]?.['ubicacion'],
            Estado       : this.cargarValor(this.dataAS[i]?.['Estado']),
            Presion      : this.cargarValor(this.dataAS[i]?.['Presion']),
            Sello        : this.cargarValor(this.dataAS[i]?.['Sello']),
            Manometro    : this.cargarValor(this.dataAS[i]?.['Manometro']),
            Soporte      : this.cargarValor(this.dataAS[i]?.['Soporte']),
            Manguera     : this.cargarValor(this.dataAS[i]?.['Manguera']),
            Pintura      : this.cargarValor(this.dataAS[i]?.['Pintura']),
            Señalizacion : this.cargarValor(this.dataAS[i]?.['Senalizacion']),
            Altura       : this.cargarValor(this.dataAS[i]?.['Altura']),
            Acceso       : this.cargarValor(this.dataAS[i]?.['Acceso']),
            Usuario      : this.dataAS[i]?.['usuario'],
            Fecha        : new Date(this.dataAS[i]?.['Fecha']),
            observaciones : this.dataS[i]?.['observaciones']
         
          })
        }
     /* MAPEAR ARCHIVO SPS*/
    for(let i = 0; i < this.dataFR?.length; i++){
        this.dataMapedaFR.push({
          'Tipo Extintor'  : this.dataFR[i]?.['tipo_extintor'],
          'Clase Agente'   : this.dataFR[i]?.['tipo_agente'],
          Capacidad        : this.dataFR[i]?.['Capacidad'],
          'Fecha Anterior' : new Date(this.dataFR[i]?.['Fecha_Anterior_Carga']),
          'Fecha Proxima'  : new Date(this.dataFR[i]?.['Fecha_Proxima_Carga']),
          Ubicacion    : this.dataFR[i]?.['ubicacion'],
          Estado       : this.cargarValor(this.dataFR[i]?.['Estado']),
          Presion      : this.cargarValor(this.dataFR[i]?.['Presion']),
          Sello        : this.cargarValor(this.dataFR[i]?.['Sello']),
          Manometro    : this.cargarValor(this.dataFR[i]?.['Manometro']),
          Soporte      : this.cargarValor(this.dataFR[i]?.['Soporte']),
          Manguera     : this.cargarValor(this.dataFR[i]?.['Manguera']),
          Pintura      : this.cargarValor(this.dataFR[i]?.['Pintura']),
          Señalizacion : this.cargarValor(this.dataFR[i]?.['Senalizacion']),
          Altura       : this.cargarValor(this.dataFR[i]?.['Altura']),
          Acceso       : this.cargarValor(this.dataFR[i]?.['Acceso']),
          Usuario      : this.dataFR[i]?.['usuario'],
          Fecha        : new Date(this.dataFR[i]?.['Fecha']),
          observaciones : this.dataS[i]?.['observaciones']       
        })
      }
    //
    this.excelService.exportToExcel(this.dataMapedaS, this.dataMapedaA ,this.dataMapedaAR , this.dataMapedaAS , this.dataMapedaFR , this.Tipo);
  }


 private  cargarValor( valor ?: number):string{
      if(valor == 1){
          return 'X'
      }else{ return ''}
  }

  CargarArchivo ( data ){
    let tipo   : number;
    let itemD : number;

    if (this.Tipo == 'Incidencia'){
      tipo = 1;
      itemD = data?.idIncidencia
    }

    if (this.Tipo == 'Auditoria'){
      tipo = 2;
      itemD = data?.idAuditoria
    }

    if (this.Tipo == 'Correccion'){
      tipo = 3;
      itemD = data?.idCorrecion

    }

    const dialogReg = this.dialog.open( CargarimagenComponent,{
      width :   '1000px',
      height:   'auto',
      maxWidth: 'auto',
      data: { 
          item : itemD,
          tipo : tipo
      },
      disableClose : true
    })
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
  observaciones : string
 }[]