import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';
import { ModalRecibosComponent } from './modal-recibos/modal-recibos.component';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.scss']
})

export class RecibosComponent implements OnInit {
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
  public parametrosBusqueda = ['SEDE', 'cco','ReciboC','proveedor','Combustible','servidoAC', 'placa',];
  public dataE : any[] = [];
  private sub : Subscription = new Subscription();
  public total : number = 0;
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public dialog : MatDialog, 
    private transporteService : TransporteService, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
  ) { }

  ngOnInit(){
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarData();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarData()
      }
    )

 
  
  }

  
  ngOnDestroy()  {
    this.sub.unsubscribe()
}

cargarData(){
  let url = 'transporte/recibos';
  let params = {};
  
  this.transporteService.get(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.dataE = data?.data?.Table0;
        this.total =  Acumulador( this.dataE, 'valorRecibo' );
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
                this.cargarData()
        }
      })
    }
 Modal ( accion : number, data ?: any ){
  const dialogReg = this.dialog.open( ModalRecibosComponent,{
    width :   '1000px',
    height:   'auto',
    maxWidth: 'auto',
    minWidth : '1000px',
    data: {
     bandera : accion,
     data    : data
      },
    disableClose : true
  })
    }
    anularRecibo(  idRecibo : number, recibo : string ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de anular el Recibo ${ recibo }?`, `Anulación de Recibo`,"warning").then(
        res=>{
            if ( res ){
                  let url    = '/transporte/anularRecibo';
                  let params = {
                    idRecibo : idRecibo,
                    recibo   : recibo, 
                    usuario  : this.auth.dataUsuario['id_usuario']  
                  } 
                  this.transporteService.post(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarData()
                    }
                    }
                  )
            }else{ }
        }
      )
    }


  
}
