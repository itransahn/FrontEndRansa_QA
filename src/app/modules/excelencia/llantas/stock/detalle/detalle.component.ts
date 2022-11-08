import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, catalogo, validadorRol } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';
import { ModalLotesComponent } from '../modal-lotes/modal-lotes.component';
// import { validadorRol } from 'src/app/interfaces/generales';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  public stock : any[]=[];
  public flat  : boolean = false;
  public filtro: FormGroup;
  public parametrosBusqueda = ['LLANTA'];
  public canjeos : any[] = [];
  public subTotal;
  public bandera : boolean = false;

 public  patter = "\d*(\.\d{0,2})?$";
    //Paginacion
    public page = 0;
    public pageEvent : PageEvent;
    public pageIndex : number = 0;
    public desde = 0;
    public hasta = 50;
    public fecha = new Date()
    public catalogoData : catalogo | any[] = [];
    nextPageLabel     = 'Página Siguiente';
    previousPageLabel = 'Página Anterior';
    public pageSize = 50;
    public banderaRol   : any;
  constructor(
    private excelenciaS : ExcelenciaService,
    private paginator   : MatPaginatorIntl, 
    public  dialog      : MatDialog, 
    private sweel       : SweetAlertService,
    private toast       : ToastServiceLocal,
    private auth        : AuthService,
    private seguridad   : SeguridadService,
    private ruta        : ActivatedRoute
  ) { }

  ngOnInit(){
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    this.catalogo();
    this.filtro = new FormGroup({
      filtrar    : new FormControl({ value:'',disabled: false}),
      tipoLlanta : new FormControl({ value:'',disabled: false}, [ Validators.required])
    })
    this.validarRol()
  }

  catalogo (){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogoData = res;
      }  }
    ) 
  }

  cargarStock(){
    let url = 'excelencia/stockLotes';
    let params = {
      tipoLlantas : this.filtro.value.tipoLlanta
     }
    this.excelenciaS.post( url, params ).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.stock = data?.data?.Table0;
          this.subTotal = Acumulador( this.stock, 'Costo')
          this.bandera = true
        }
      }
    )
  }

  validarRol(){
    let url = "/seguridad/validarRol";
    let params = {
      idUsuario : this.auth.dataUsuario['id_usuario'],
      rol       : 'Coordinador Excelencia'
    }
  
    this.seguridad.validarRol(url,params).subscribe(
      res=>{
        if ( res?.data ){
          this.banderaRol = res?.data?.Table0[0]['codigo']
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

  Modal ( data ?: any ){
    const dialogReg = this.dialog.open( ModalLotesComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: 'auto',
      data: { 
        data : data,
        tipoLlanta : this.filtro.value.tipoLlanta
      },
      disableClose : true
    })
  }
}
