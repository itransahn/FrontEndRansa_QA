import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';

@Component({
  selector: 'app-aprob-ajustes',
  templateUrl: './aprob-ajustes.component.html',
  styleUrls: ['./aprob-ajustes.component.scss']
})
export class AprobAjustesComponent implements OnInit {
  public ajustes  : any[] = [];
  public subTotal : any;
  //Paginacion
  public page       = 0;
  public pageEvent  : PageEvent;
  public pageIndex  : number = 0;
  public desde      = 0;
  public hasta      = 50;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize   = 50;

  constructor(
    private paginator  : MatPaginatorIntl, 
    public excelenciaS : ExcelenciaService,
    public auth : AuthService, 
    public sweel : SweetAlertService,
    private toast : ToastServiceLocal, 
    private dialog : MatDialog,
    private ruta : ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
    this.cargarCambios(); 
    this.excelenciaS.refresh$.subscribe( res=> this.cargarCambios() )
   }

cargarCambios(){
    let url = 'excelencia/ajustesAprobar';
    let params = { };  
    this.excelenciaS.get(url , params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.ajustes = data?.data?.Table0;
          // this.subTotal =  Acumulador( this.cambios, 'COSTO' )
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

AprobarAjuste( data ?: any ){
  this.sweel.mensajeConConfirmacion(`¿Seguro de aprobar ajuste ${ data['Ajuste']} sobre el lote ${ data['lote'] }, de ${ data['cantidad']} unidades?`, `Aprobación de ajustes`,"info").then(
    res=>{
        if ( res ){
              let url    = '/excelencia/aprobarAjuste';
              let params = {
                TipoAjuste : data['idAjuste'],
                lote       : data['lote'],
                idllanta   : data['idllanta'],
                cantidad   : data['cantidad'],
                comentario : data['comentario'],
                usuario    : this.auth.dataUsuario['id_usuario'],
                idAjuste   : data['ID']
              } 
              this.excelenciaS.post(url, params).subscribe(
                res=>{
                  if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                  this.cargarCambios()
                }
                }
              )
        }else{ }
    }
  )
}

declinarAjuste( data ?: any){
  this.sweel.mensajeConConfirmacion(`¿Seguro de denegar ajuste ${ data['Ajuste']} sobre el lote ${ data['lote'] }, de ${ data['cantidad']} unidades?`, `denegación de ajustes`, "warning").then(
    res=>{
        if ( res ){
              let url    = '/excelencia/anularAjuste';
              let params = {
                idAjuste     : data['ID'],
                usuario      : this.auth.dataUsuario['id_usuario'],
                idTipoLlanta : data['idllanta'],
                lote         : data['lote'],
                fechaCambio  : data['fecha'],
                comentario   : data['comentario']
              } 
              this.excelenciaS.post(url, params).subscribe(
                res=>{
                  if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                  this.cargarCambios()
                }
                }
              )
        }else{ }
    }
  )
}

}
