import { Component, OnInit } from '@angular/core';
import { SsmoaService } from '../../ssmoa.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mesesd } from 'src/app/data/data';
import { meses } from 'src/app/interfaces/generales';

@Component({
  selector: 'app-auditorias-realizadas',
  templateUrl: './auditorias-realizadas.component.html',
  styleUrls: ['./auditorias-realizadas.component.scss']
})
export class AuditoriasRealizadasComponent implements OnInit {
  public data1 : any[]=[];
  public data2 : any[]=[];
  public data3 : any[]=[];
  public data4 : any[]=[];
  public data5 : any[]=[];
  public flat  : boolean = false;
  public filtro: FormGroup;
  public parametrosBusqueda = ['Nomenclatura'];
  public subTotal;
  public bandera : boolean = false;
  public meses  = [
    {  idMes : 1, mes :'Enero'},
    {  idMes : 2, mes :'Febrero'},
    {  idMes : 3, mes :'Marzo'},
    {  idMes : 4, mes :'Abril'},
    {  idMes : 5, mes :'Mayo'},
    {  idMes : 6, mes :'Junio'},
    {  idMes : 7, mes :'Julio'},
    {  idMes : 8, mes :'Agosto'},
    {  idMes : 9, mes :'Septiembre'},
    {  idMes : 10, mes :'Octubre'},
    {  idMes : 11, mes :'Noviembre'},
    {  idMes : 12, mes :'Diciembre'}

  ];
      Paginacion
      public page = 0;
      public pageEvent : PageEvent;
      public pageIndex : number = 0;
      public desde = 0;
      public hasta = 50;
      public fecha = new Date();
      nextPageLabel     = 'Página Siguiente';
      previousPageLabel = 'Página Anterior';
      public pageSize = 50;
      public banderaRol   : any;

  constructor( 
    private service   : SsmoaService,
    private paginator : MatPaginatorIntl, 
    public  dialog    : MatDialog, 
    private sweel     : SweetAlertService,
    private toast     : ToastServiceLocal,
    private auth      : AuthService,
    private ruta      : ActivatedRoute
  ) { }

  ngOnInit(){  
    this.filtro = new FormGroup({
      mes      : new FormControl({ value:'',disabled: false}, [ Validators.required]),
      anio     : new FormControl({ value:'',disabled: false}, [ Validators.required])
    })
  }

  cargarData( ){
    let url = 'ssmoa/auditoriasGeneradas';
    let params = {
      Mes  : this.filtro.value.mes,
      anio : this.filtro.value.anio
    }
    this.service.get( url, params ).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.data1 = data?.data?.Table0;
          this.data2 = data?.data?.Table1;
          this.data3 = data?.data?.Table2;
          this.data4 = data?.data?.Table3;
          this.data5 = data?.data?.Table4;
          this.bandera = true
        }
      }
    )
  }



}
