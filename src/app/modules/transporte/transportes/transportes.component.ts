import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RolesService } from '../../seguridad/roles/roles.service';
import { TransporteService } from '../transporte.service';
import { ModalTransporteComponent } from './modal-transporte/modal-transporte.component';

@Component({
  selector: 'app-transportes',
  templateUrl: './transportes.component.html',
  styleUrls: ['./transportes.component.scss']
})
export class TransportesComponent implements OnInit {
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
  public parametrosBusqueda = ['nombreEmpresa', 'RTNEmpresa','sedeRansa','Propietario'];
  public transportes : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public administracion: AdministracionService, 
    public dialog : MatDialog, 
    private transporteService : TransporteService, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
    
  ) { }

  ngOnInit() {
    
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarTransportes();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarTransportes()
      }
    )
  
  }

  ngOnDestroy()  {
    this.sub.unsubscribe()
}
cargarTransportes(){
  let url = 'transporte/transportes';
  let params = {};
  
  this.administracion.usuarios(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.transportes = data?.data?.Table0;
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
        tabla : 1
      };
      this.transporteService.post(url, params).subscribe( data =>{
        if( !data.hasError ){
                this.cargarTransportes()
        }
      })
    }

    Modal ( accion : number, data ?: any ){
      const dialogReg = this.dialog.open( ModalTransporteComponent,{
        width :   '500px',
        height:   'auto',
        maxWidth: 'auto',
        data: { 
          idTransportista : data?.ID,
          bandera : accion,
          nombreEmpresa  : data?.nombreEmpresa,
          direccionEmpresa  : data?.direccionEmpresa,
          nombrePropietario  : data?.Propietario,
          RTNEmpresa  : data?.RTNEmpresa,
          telefonoEmpresa  : data?.telefonoEmpresa,
          idSede  : data?.idSede,
          celularPropietario  : data?.celularPropietario,
          Camiones  : data?.Camiones,
          Motoristas  : data?.Motoristas,
        },
        disableClose : true
      })
    }


    eliminarTransporte(  transporte?:string ,idTr?:number){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el Transporte ${ transporte }?`, `Eliminación de Transporte`,"question").then(
        res=>{
            if ( res ){
                  let url    = '/transporte/transporte';
                  let params = {
                    idTransporte : idTr
                  } 
                  this.transporteService.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarTransportes()
                    }
                    }
                  )
            }else{ }
        }
      )
    }

}
