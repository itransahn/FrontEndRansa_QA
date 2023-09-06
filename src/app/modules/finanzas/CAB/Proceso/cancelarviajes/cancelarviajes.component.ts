import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { Acumulador } from 'src/app/interfaces/generales';
import { MatDialog } from '@angular/material/dialog';
import { IncidenciasviajesComponent } from '../incidenciasviajes/incidenciasviajes.component';


@Component({
  selector: 'app-cancelarviajes',
  templateUrl: './cancelarviajes.component.html',
  styleUrls: ['./cancelarviajes.component.scss']
})
export class CancelarviajesComponent implements OnInit {

  public viajes  : any[] = [];
  public total : number;
  public loadingB : boolean = false;
  public cancelaciosData : any[]=[];
  checked = false;
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 10;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 10;
  public parametrosBusqueda = ['Solicitante', 'EstadoViaje', 'tipoViaje'];

  public filter :string  = '';
  public filtro: FormGroup;
  
  constructor(
    public auth     : AuthService,
    private service : FacturacionService,
    private toast : ToastServiceLocal,
    private sweel : SweetAlertService,
    private paginator : MatPaginatorIntl, 
    private dialog  : MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarViajes();
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })


    this.service.refresh$.subscribe(
      res=>{
         this.cargarViajes();
      }
    )
  }

  cargarViajes(){
    let url = '/finanzas/viajeCab2';
    let params = {
     tipo  : 1, 
     sede  : this.auth.dataUsuario['sede']
    }
  this.service.get(url,params).subscribe(
    res=>{
      if(res){
        this.viajes = res?.data?.Table0;
        this.total =  Acumulador( this.viajes, 'monto' )

        }
    }
  )
  }

  CancelarSeleccionados(){
    this.sweel.mensajeConConfirmacion("¿Seguro de cancelar Viajes seleccionados?","Cancelación de Viajes","warning").then(
      res=>{
        if ( res) {
          for( let i = 0; i < this.cancelaciosData.length; i++){
            let cancelado : number ;

            if ( this.cancelaciosData[i]?.cancelada == 1){
              cancelado = 1
            }else{
              cancelado = 0
            }

            this.cancelarViaje(this.cancelaciosData[i]?.idviaje, cancelado)

          }
          this.cargarViajes();
          this.toast.mensajeSuccess("Viajes Cancelados Correctamente","Cancelación de Viajes");
        }
      }
    )
      }



  checkOnClick( idviaje : number ,tipo : any )  {
    
    let validacion : number;
      if ( tipo  ){
        this.loadingB  = true;
        validacion = 1
        this.cancelaciosData.push({
          idviaje   :  idviaje , 
          cancelada :  validacion
        })
      }else{
        this.cancelaciosData.push({
          idviaje   :  idviaje , 
          cancelada :  0
        })
      }
  }

  cancelarViaje( idviaje : number, cancelado : number ){
    let url = '/finanzas/cancelarViaje';
    let params = {
      usuario   : this.auth.dataUsuario['id_usuario'],
      idViaje   : idviaje,
      cancelado  : cancelado
    }
   this.service.post(url,params).subscribe( )
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

  incidencia(idViaje : number ){
    this.sweel.mensajeConConfirmacion("¿Seguro de cargar incidencia?","Incidencias Viaje","question").then(
      res=>{
        if (res){
          const dialogReg = this.dialog.open( IncidenciasviajesComponent,{
            width :   'auto',
            height:   'auto',
            maxWidth: 'auto',
            minWidth : '50%',
            data: idViaje,
            disableClose : true
          })
        }
      }
    )
  }

}
