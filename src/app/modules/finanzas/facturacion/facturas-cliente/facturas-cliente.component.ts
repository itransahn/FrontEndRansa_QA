import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-facturas-cliente',
  templateUrl: './facturas-cliente.component.html',
  styleUrls: ['./facturas-cliente.component.scss']
})
export class FacturasClienteComponent implements OnInit {
  public menuForm : FormGroup;
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 50;
  public loading = false;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 50;
  public facturas : any[]
  public sedes = [
    {
      idSede: 1,
      Sede : 'Ransa'
    },
    {
      idSede: 2,
      Sede : 'Almahsa'
    }
  ]
  constructor(
    private paginator : MatPaginatorIntl,
    public facturacionS : FacturacionService,
    public auth  : AuthService,
    public sweet : SweetAlertService
  ) { }

  ngOnInit()  {
    this.formMenu();
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
  }

  public formMenu(){
    this.menuForm = new FormGroup({
      sede    : new FormControl ('' , [ Validators.required,]),
      cliente : new FormControl ('' , [ Validators.required,]),
      desde   : new FormControl ('' , [ Validators.required,]),
      hasta   : new FormControl ('' , [ Validators.required,]),
    })
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

    cargarFacturas(){
      let empresa : string;
      if ( this.menuForm.value.sede == 1 ){
          empresa = 'RH'
      }else{
        empresa = 'AH'
      }

      let paramsE = {
        Empresa   : empresa,
        Cliente   : this.menuForm.value.cliente,
        desde     : this.menuForm.value.desde,
        hasta     : this.menuForm.value.hasta,

      }
      let params = {
       "query": `CALL DC@HONLIB.SP_AWS_LISTA_FACTURA('${paramsE['Empresa']}', 1,  ${paramsE['Cliente']},0,${paramsE['desde']}, ${paramsE['hasta']})`,
        "env": "PRD"
      }
      // let params = {
      //   "query": "CALL DC@HONLIB.SP_AWS_LISTA_FACTURA ('RH', 1, 1965, 100031795, 20210101, 20221231)",
      //   "env": "PRD"
      // }
  
    this.facturacionS.As400( params ).subscribe(
      (res:any)=>{
        if( res ){
  this.facturas = res
  this.loading = true;
        }
      }
    )
    }

    retornarFecha( fecha:string  ){
      let dia  =  fecha.substring(6,8);
      let mes  =  fecha.substring(4,6);
      let anio =  fecha.substring(0,4);
      return ( anio+'/'+mes+'/'+dia )
    }

    retornarFactura( factura : string ){
    if( this.menuForm.value.sede == 1 ){
      return factura.substring(4,9)
    }else{
      return factura.substring(5,10)

    }
    }

    redireccionamiento( factura, cliente ){
this.sweet.mensajeConConfirmacion('Visualización de factura',`Seguro de visualizar la Factura ${factura} del cliente ${cliente}`,"question").then(
  res=>{
    if ( res ){
      if ( this.menuForm.value.sede == 1){
        this.auth.redirecTo(`ransa/finanzas/facturacion/${this.menuForm.value.cliente}/${factura}`)
      }else{
        this.auth.redirecTo(`ransa/finanzas/facturacionAh/${this.menuForm.value.cliente}/${factura}`)

      }
    }
  }
)  
    }

}
