import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransporteService } from '../transporte.service';
import { ModalMotComponent } from './modal-mot/modal-mot.component';

@Component({
  selector: 'app-motoristas',
  templateUrl: './motoristas.component.html',
  styleUrls: ['./motoristas.component.scss']
})
export class MotoristasComponent implements OnInit {
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
  public parametrosBusqueda = ['Nombre', 'Nlicencia','nombreEmpresa','SEDE'];
  public motoristas : any[] = [];
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

    this.cargarMotorista();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarMotorista()
      }
    )
  }

  cargarMotorista(){
    let url = 'transporte/motoristas';
    let params = {};
    this.transporteService.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.motoristas = data?.data?.Table0;
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
        tabla : 3
      };
      this.transporteService.post(url, params).subscribe( data =>{
        if( !data.hasError ){
                this.cargarMotorista()
        }
      })
    }


        
    Modal ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalMotComponent,{
        width :   '500px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          bandera : accion,
          Nombre : data?.descripcionCamion,
          celular : data?.idUnidad,
          identidad : data?.placa,
          FechaVencimientoLicencia : data?.idTransportista,
          idTransportista : data?.dimensiones,
          idMotorista : data?.idMotorista
        },
        disableClose : true
      })
    }


}
