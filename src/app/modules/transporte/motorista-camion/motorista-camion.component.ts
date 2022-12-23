import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ModalMotCamComponent } from './modal-mot-cam/modal-mot-cam.component';
import { TransporteService } from '../transporte.service';

@Component({
  selector: 'app-motorista-camion',
  templateUrl: './motorista-camion.component.html',
  styleUrls: ['./motorista-camion.component.scss']
})
export class MotoristaCamionComponent implements OnInit {
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
  public parametrosBusqueda = ['Motorista', 'Camion','placa','Propietario'];
  public Uniones : any[] = [];
  private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl,  
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
    this.cargarUniones();
    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarUniones()
      }
    )
  }



  
  ngOnDestroy()  {
    this.sub.unsubscribe()
}
cargarUniones(){
  let url = 'transporte/camionMotorista';
  let params = {};
  
  this.transporteService.get(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.Uniones = data?.data?.Table0;
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



    eliminarUnion(  motorista?:string ,camion?:number){
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el Permiso?`, `Eliminación de Permiso`,"question").then(
        res=>{
            if ( res ){
                  let url    = '/transporte/camionMotorista';
                  let params = {
                 motorista : motorista,
                 camion : camion
                  } 
                  this.transporteService.delete(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarUniones()
                    }
                    }
                  )
            }else{ }
        }
      )
    }


    Modal ( ){
      const dialogReg = this.dialog.open( ModalMotCamComponent,{
        width :   '1000px',
        height:   'auto',
        maxWidth: 'auto',
        data: {  },
        disableClose : true
      })
    }



}
