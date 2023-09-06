import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { Acumulador } from 'src/app/interfaces/generales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viajesaprobados',
  templateUrl: './viajesaprobados.component.html',
  styleUrls: ['./viajesaprobados.component.scss']
})
export class ViajesaprobadosComponent implements OnInit {
  public viajes  : any[] = [];
  public total : number;
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
    private router    : Router
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
     tipo  : 2, 
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

  VerViaje(idViaje){
    this.router.navigateByUrl(`ransa/finanzas/vale/${idViaje}`)
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

}
