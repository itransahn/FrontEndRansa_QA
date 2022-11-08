import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { Acumulador, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';
import { FormCambioComponent } from '../form-cambio/form-cambio.component';


@Component({
  selector: 'app-historial-cambios',
  templateUrl: './historial-cambios.component.html',
  styleUrls: ['./historial-cambios.component.scss']
})
export class HistorialCambiosComponent implements OnInit {
  public cambios  : any[] = [];
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
  public filter     :string  = '';
  public filtro     : FormGroup;
  public parametrosBusqueda = ['CODIGO','Llanta', 'LlantaCambiada', 'LOTE','LlantaCambiada','USUARIO','Comentarios'];
  constructor(
    private paginator  : MatPaginatorIntl, 
    public excelenciaS : ExcelenciaService,
    public auth : AuthService, 
    public  sweel : SweetAlertService,
    private toast : ToastServiceLocal, 
    private dialog : MatDialog,
    private ruta : ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.cargarCambios();
    
    this.excelenciaS.refresh$.subscribe(
      res=>{
          this.cargarCambios()
      }
    )
 
   }

cargarCambios(){
    let url = 'excelencia/cambioLlantas';
    let params = {};  
    this.excelenciaS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.cambios = data?.data?.Table0;
          this.subTotal =  Acumulador( this.cambios, 'COSTO' )
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
      const dialogReg = this.dialog.open( FormCambioComponent,{
        width :   'auto',
        height:   'auto',
        maxWidth: 'auto',
        data: data,
        disableClose : true
      })
    }


eliminarCambio(  data : any ){
      this.sweel.mensajeConConfirmacion(
      `¿Seguro de eliminar el registro de cambio de llanta con el lote ${ data['LOTE'] }?`,
      `Eliminación de Registro de cambio de llanta`
      ,"warning").then(
        res=>{
            if ( res ){
                  let url    = '/excelencia/deleteCambio';
                  let params = {
                    idCambio     : data['ID'],
                    idTipoLlanta : data['idLlanta'],
                    lote         : data['LOTE'],
                    maquina      : data['id_maquina'],
                    ladoaCambiar : data['LlantaCambiada'],
                    fechaCambio  : data['Fecha'],
                    comentario   : data['Comentarios'],
                    usuario      : this.auth.dataUsuario['id_usuario']
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
