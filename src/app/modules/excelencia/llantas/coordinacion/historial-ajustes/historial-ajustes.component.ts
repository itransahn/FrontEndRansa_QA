import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { UsuarioService } from 'src/app/modules/seguridad/usuarios/usuario.service';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';

@Component({
  selector: 'app-historial-ajustes',
  templateUrl: './historial-ajustes.component.html',
  styleUrls: ['./historial-ajustes.component.scss']
})
export class HistorialAjustesComponent implements OnInit {
 //Paginacion
 public page      = 0;
 public pageEvent : PageEvent;
 public pageIndex : number = 0;
 public desde = 0;
 public hasta = 50;
 nextPageLabel     = 'Página Siguiente';
 previousPageLabel = 'Página Anterior';
 public pageSize   = 50;
 public filter :string  = '';
 public filtro : FormGroup;
 public parametrosBusqueda = ['Ajustes','Llanta','Lote','Cantidad','Comentario','Solicitante','Aprobador'];
 public ajustes          : any[] = [];
  constructor(
    private paginator    : MatPaginatorIntl, 
    private auth         : AuthService, 
    private excelenciaS  : ExcelenciaService,
    public usuarioS      : UsuarioService,
    public sweel         : SweetAlertService,
    private toast        : ToastServiceLocal, 
    private dialog       : MatDialog,
    private ruta         : ActivatedRoute
  ) { }


  ngOnInit() {
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] );
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.cargarUsuarios();
 }
  
  cargarUsuarios(){
    let url = 'excelencia/ajustesRealizados';
    let params = {};  
    this.excelenciaS.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.ajustes = data?.data?.Table0;
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

}
