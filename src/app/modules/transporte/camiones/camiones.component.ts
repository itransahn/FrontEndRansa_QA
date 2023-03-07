import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransporteService } from '../transporte.service';
import { ModalCaComponent } from './modal-ca/modal-ca.component';

@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.component.html',
  styleUrls: ['./camiones.component.scss']
})
export class CamionesComponent implements OnInit {
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 50;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 50;
  public filter :string  = '';
  public filtro: FormGroup;
  public parametrosBusqueda = ['descripcionCamion', 'placa','nombreEmpresa','tipoUnidad','sedeRansa'];
  public camiones : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public administracion: AdministracionService, 
    public dialog : MatDialog, 
    private transporteService : TransporteService, 
  ) { }

  ngOnInit() {  
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarCamiones();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarCamiones()
      }
    )
  }
  
  ngOnDestroy()  {
    this.sub.unsubscribe()
}

cargarCamiones(){
  let url = 'transporte/camiones';
  let params = {};
  
  this.transporteService.get(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.camiones = data?.data?.Table0;
      }    
    }
  )
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

    CambiarEstado(id ?: number, estado?: number){
      let url = 'transporte/cambiarEstado';
      let params = {
        id: id,
        estado   : estado,
        tabla : 2
      };
      this.transporteService.post(url, params).subscribe( data =>{
        if( !data.hasError ){
                this.cargarCamiones()
        }
      })
    }


    
    Modal ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalCaComponent,{
        width :   '1000px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera : accion,
          camion : data?.descripcionCamion  ,
          idUnidad : data?.idUnidad,
          placa : data?.placa,
          idTransportista : data?.idTransportista,
          GPS : data?.GPS,
          Rampa : data?.Rampa,
          Refrigerado : data?.Refrigerado,
          idSede : data?.idSede,
          idCamion : data?.idCamion,
          idMarca  : data?.idMarca,
          idModelo : data?.idModelo,
          idtonelada : data?.idtonelada,
          idColor    : data?.idColor,
          idMetraje  : data?.metraje,
          anio       : data?.anio,
          transporte : data?.nombreEmpresa
        },
        disableClose : true
      })
    }


}
