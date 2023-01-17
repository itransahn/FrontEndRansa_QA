import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, meses } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { numeroALetras } from 'src/app/shared/functions/conversorNumLetras';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.scss']
})
export class RetencionComponent implements OnInit {

  public fecha = new Date();
  public mes   = this.fecha.getMonth() + 1;
  public dia   = this.fecha.getDate();
  public anio  = this.fecha.getFullYear();
  public parametros    = [];
  public parametrosCai = [];

  public anulacion = false;
  public devolcion = false;
  
  public espaciosBlancos = [];
  public dataRetenciones : any[] = [];

  public Observaciones =  '----'

  constructor(
    public sharedS      : SharedService,
    public facturacionS : FacturacionService,
    public ruta         : ActivatedRoute,
    public dialog       : MatDialog,
    public toast        : ToastServiceLocal
  ) { }

  ngOnInit(){
    this.cargarParametrosF();
    this.cargarDataretenciones()
  }

  cargarParametrosF(){
    let url='seguridad/parametrosF';
    let params = {
      sede : 1,
      tipo : 4
    }
  this.facturacionS.post(url,params).subscribe(
    (res:DataApi | any )=>{
        if( !res?.hasError ){
            this.parametros    = res.data.Table0;
            this.parametrosCai = res.data.Table1;

            console.log( this.parametros, this.parametrosCai )
          }
    }
  )
  }

  cargarMes( mes ){
   return meses( mes )
  }

  retornarCorrelativo(){
    let correlativo : string = '75572';
    return correlativo.substring(1,correlativo.length)
  }



  retornarSubtotal(filtro:string){
    return Acumulador(this.dataRetenciones,filtro)
  }


  cargarDataretenciones(){
    this.dataRetenciones = [
      {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 24910,
        montoR  : 249.10,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 28789.89,
        montoR  : 789.89,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       },
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       },
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } , {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       },
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } ,
       {
        fecha   : '30/12/2022',
        cai     : 'A7148D-E25BCD-584CB4-E90917-515AF3-4E',
        factura : '10100001816',
        baseR   : 50343.93,
        montoR  : 343.93,
        tipoR   : '1%'
       } 
  ];

    for(let j=0; j<(10-this.dataRetenciones.length); j++){
      this.espaciosBlancos.push(j)
  }
  }

  convertirNumLetra( numero : any){
    return numeroALetras(numero,{})
}

  GenerarPdf(){
   this.sharedS.downloadPDF('Retencion','RetencionClienteX','Retencion 1', '¿Seguro de generar retención?') }

}
