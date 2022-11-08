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
import { ModalAjustesComponent } from './modal-ajustes/modal-ajustes.component';

@Component({
  selector: 'app-historial-aprobaciones',
  templateUrl: './historial-aprobaciones.component.html',
  styleUrls: ['./historial-aprobaciones.component.scss']
})
export class HistorialAprobacionesComponent implements OnInit {
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
    private auth       : AuthService, 
    public sweel       : SweetAlertService,
    private toast      : ToastServiceLocal, 
    private dialog     : MatDialog,
    private ruta       : ActivatedRoute
  ) { }
  
  ngOnInit() {
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';
    this.cargarCambios(); 
    this.excelenciaS.refresh$.subscribe( res=> this.cargarCambios() )
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
   }

cargarCambios(){
    let url = 'excelencia/AjustesSolicitados';
    let params = {
      idUsuario : this.auth.dataUsuario['id_usuario']
    };  
    this.excelenciaS.put(url,params).subscribe(
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
  
ModalAjustes ( data ?: any ){
      const dialogReg = this.dialog.open( ModalAjustesComponent,{
        width :   'auto',
        height:   'auto',
        maxWidth: 'auto',
        data: data,
        disableClose : true
      })
    }
// Eliminación de ajustes
eliminarAjuste(  data ?: any  ){
      this.sweel.mensajeConConfirmacion(`¿Seguro de anular el ajuste ${ data['Ajuste'] }?`, `Cancelación de ajuste`,"question").then(
        res=>{
            if ( res ){
                  let url    = '/excelencia/deleteAjustes';
                  let params = {
                    idAjuste   : data['ID'],
                    idUsuario  : this.auth.dataUsuario['id_usuario'],
                  } 
                  this.excelenciaS.delete(url, params).subscribe(
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
