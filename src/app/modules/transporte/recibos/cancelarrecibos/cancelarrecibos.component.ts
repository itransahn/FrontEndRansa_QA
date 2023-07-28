import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-cancelarrecibos',
  templateUrl: './cancelarrecibos.component.html',
  styleUrls: ['./cancelarrecibos.component.scss']
})
export class CancelarrecibosComponent implements OnInit {
  public filtro  : FormGroup;
  public loading : boolean = false;
  public loadingB : boolean = false;
  public parametrosBusqueda = ['SEDE', 'ReciboC','proveedor','servidoAC','Nfactura'];
  public data : any[];
  public recibos  = 0;
  public facturas = 0;
 //Paginacion
 public page = 0;
 public pageEvent : PageEvent;
 public pageIndex : number = 0;
 public desdeF = 0;
 public hastaF= 50;
 public fecha = new Date();

 public cancelaciosData : cancelacion[]=[];

 nextPageLabel     = 'Página Siguiente';
 previousPageLabel = 'Página Anterior';
 public pageSize   = 50;
  constructor(
    private paginator : MatPaginatorIntl,
    public  servicio  : TransporteService,
    public dialog     : MatDialog, 
    private sweel     : SweetAlertService,
    private toast     : ToastServiceLocal,
    private sharedS   : SharedService,
    private auth      : AuthService
  ) { }

  ngOnInit() {
    this.CargarData();

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    
  }

    /* Cargar Data*/ 
    CargarData(  ){
      let url = 'transporte/recibosaCerrar';
      let params = { 
        sede : this.auth.dataUsuario['sede']
       }
      this.servicio.post( url, params ).subscribe (
        ( res : DataApi | any)=>{
          if( !res.hasError ){
            this.loading = true;
            this.data = res?.data?.Table0;
            this.recibos  =  Acumulador( this.data, 'valorRecibo');
            this.facturas =  Acumulador( this.data, 'valorFacturaa');
                  }
        }
      )
    }


    CancelarSeleccionados(){
    this.sweel.mensajeConConfirmacion("¿Seguro de cancelar recibos seleccionados?","Cancelación de Recibos","warning").then(
      res=>{
        if ( res) {
          for( let i = 0; i < this.cancelaciosData.length; i++){
            let cancelado : number ;

            if ( this.cancelaciosData[i]?.cancelada ){
              cancelado = 1
            }else{
              cancelado = 0
            }

            this.cancelarRecibo(this.cancelaciosData[i]?.idRecibo, cancelado)

          }
          this.CargarData();
          this.toast.mensajeSuccess("Recibos Cancelados Correctamente","Cancelación de recibos");
        }
      }
    )
      }

    CancelarTodos(){
      this.sweel.mensajeConConfirmacion("¿Seguro de cancelar recibos seleccionados?","Cancelación de Recibos","warning").then(
        res=>{
          if ( res ){
            for( let i = 0; i < this.data.length; i++){
              this.cancelarRecibo(this.data[i]['idRecibo'],1)
            }
          this.toast.mensajeSuccess("Recibos Cancelados Correctamente","Cancelación de recibos");
          this.CargarData()
          }
        }
      )

    

    }

    checkOnClick( recibo : number ,tipo : boolean )  {
      let validacion : number;
        if ( tipo  ){
          this.loadingB  = true;
          validacion = 1
          this.cancelaciosData.push({
            idRecibo :  recibo , 
            cancelada : validacion
          })
        }
    }

    cancelarRecibo( idRecibo : number, cancelado : number ){
      let url = '/transporte/cancelarRecibo';
      let params = {
           idRecibo  : idRecibo,
           cancelado : cancelado,
           usuario   : this.auth.dataUsuario['id_usuario']
      }
     this.servicio.post(url,params).subscribe( )
    }

    
}





interface cancelacion {
  idRecibo  : number,
  cancelada : number
}