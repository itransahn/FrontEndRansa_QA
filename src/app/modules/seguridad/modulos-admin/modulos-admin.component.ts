import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { mensajes, modulosP, modulosPadre } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { CrearMenuPComponent } from '../menus/crear-menu-p/crear-menu-p.component';
import { CrearModuloComponent } from './crear-modulo/crear-modulo.component';
import { EditarModuloComponent } from './editar-modulo/editar-modulo.component';
import { Subscription } from 'rxjs'
import { VerMenuPComponent } from '../menus/ver-menu-p/ver-menu-p.component';
import { VerMenusHijosComponent } from '../menus/ver-menus-hijos/ver-menus-hijos.component';
import { EditarMenuPComponent } from '../menus/editar-menu-p/editar-menu-p.component';

@Component({
  selector: 'app-modulos-admin',
  templateUrl: './modulos-admin.component.html',
  styleUrls: ['./modulos-admin.component.scss']
})
export class ModulosAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public  opcionesModules : any[]=[];
  public  opcionesPadres  : any[]= [];
  public modulosPadre: modulosP[]= [];
  public modulo : string;
  public padre  : string;
  private sub : Subscription = new Subscription()

  /* Complementos */
    //Paginacion
    public page = 0;
    public pageEvent : PageEvent;
    public pageIndex : number = 0;
    public desde = 0;
    public hasta = 10;
    nextPageLabel     = 'Página Siguiente';
    previousPageLabel = 'Página Anterior';
    public pageSize = 10;
    public filter :string  = '';
    public filtro: FormGroup;
    public parametrosBusqueda = ['modulo'];
    public dataModulo : any
    public dataPadre : any
  /* Complementos */

  constructor( 
    private administracion : AdministracionService,
    private _bottomSheet : MatBottomSheet,
    public  auth : AuthService, 
    public  dialog : MatDialog,
    private sweel  : SweetAlertService, 
    private seguridad : SeguridadService,
    private toast : ToastServiceLocal) { }

  ngOnInit() {
    this.cargarModulosPadres();
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.sub = this.seguridad.refresh$.subscribe(
      res=>{
        this.cargarModulosPadres()
      }
    )
  }

ngOnDestroy() {
    this.sub.unsubscribe()
}

  Module( accion ?: number ){
    if ( accion == 1){
      this.CrearMenu()
    }

    if ( accion == 2 ){
        this.auth.redirecTo(`/ransa/administracion/modulo/${this.dataModulo?.id_modulo}/${this.dataModulo?.modulo}`)
    }
    if ( accion == 3){
   this.EditarModulo()
    }
    if ( accion == 4){ 
this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el módulo de ${this.dataModulo?.modulo}?`, `Eliminación de Módulo`,"question").then(
  res=>{
      if ( res ){
            let url    = '/seguridad/eliminarModulo';
            let params = {
              idModulo : this.dataModulo.id_modulo
            } 
            this.seguridad.eliminarModulo(url, params).subscribe(
              res=>{
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                  this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
              }else{
                this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                this.cargarModulosPadres()
              }
              }
            )
      }else{

      }
  }
)

    }
      this._bottomSheet.dismiss();
  }

  MenuPadre(accion : any){
    if ( accion == 1){
      this.VerMenu()
    }
    if( accion == 2){
      this.VerHijos()
    }
    if( accion == 3){
      this.editarMenuPadre()
    }

    if ( accion == 4){ 
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el menú ${this.dataPadre?.menuPadre}?`, `Eliminación de Menú`,"question").then(
        res=>{
            if ( res ){
                  let url    = '/seguridad/eliminarMenu';
                  let params = {
                    idMenuPadre : this.dataPadre?.id_menuPadre
                  } 
                  this.seguridad.eliminarMenu(url, params).subscribe(
                    res=>{
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarModulosPadres()
                    }
                    }
                  )
            }else{
      
            }
        }
      )
      
  }

    this._bottomSheet.dismiss();
  }

  cargarModulosPadres(){
    let url = 'seguridad/modulosPadre';
    let params = {};

    this.administracion.modulosPadre(url , params).subscribe(
      (data : modulosPadre | any ) =>{
          this.modulosPadre = data.data.menu;
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
  

  menuModulos(template, modulo, idModulo, dataModulo) {
    this.modulo = modulo;
    this.dataModulo = dataModulo;
    this.opcionesModules = [
      {
        icono     : 'note_add',
        titulo    : `Agregar menú sobre ${this.dataModulo?.modulo}`,
        subtitulo : 'Agregar nuevo menu superior',
        url       : `ransa/administracion/usuarios`,
        accion    : 1
      },
      {
        icono   : 'remove_red_eye',
        titulo  : 'Ver Permisos',
        subtitulo : 'Ver permisos sobre el módulo',
        url       :  `ransa/administracion/usuarios/${idModulo}`,
        accion    : 2
      },
      {
        icono   : 'edit',
        titulo  : 'Editar Módulo',
        subtitulo : 'Editar datos del Módulo',
        url       : `ransa/administracion/usuarios/${idModulo}`,
        accion    : 3

      },
      {
        icono   : 'delete_sweep',
        titulo  : 'Eliminar Módulo',
        subtitulo : 'Eliminar módulo seleccionado',
        url       : `ransa/administracion/usuarios/${idModulo}`,
        accion    : 4

      },
    ]
    this._bottomSheet.open(template);
  }

  menuPadres(template, menuPadre, idMenuPadre, dataPadre, dataModulo) {
 
    if ( this.auth.Actualizacion() ){
      this.padre = menuPadre;
      this.dataPadre = dataPadre
      this.dataModulo = dataModulo
      this.opcionesPadres = [
       
        {
          icono     : 'remove_red_eye',
          titulo    : 'Ver menú ',
          subtitulo : 'Ver datos del menú',
          url       :  `ransa/administracion/usuarios/${idMenuPadre}`,
          accion    : 1
        },
        {
          icono     : 'remove_red_eye',
          titulo    : 'Ver menús hijos',
          subtitulo : `Ver hijos del menu ${menuPadre}`,
          url       :  `ransa/administracion/usuarios/${idMenuPadre}`,
          accion    : 2
        },
        {
          icono     : 'edit',
          titulo    : 'Editar menú ',
          subtitulo : 'Editar datos del menú padre',
          url       : `ransa/administracion/usuarios/${idMenuPadre}`,
          accion    : 3
        },
        {
          icono     : 'delete_sweep',
          titulo    : 'Eliminar menú ',
          subtitulo : 'Eliminar menú padre',
          url       : `ransa/administracion/usuarios/${idMenuPadre}`,
          accion    : 4
        },
      ]
      this._bottomSheet.open(template);
    }
  }

  CrearModulo(  ){
    const dialogReg = this.dialog.open( CrearModuloComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '200vw',
      data: this.dataModulo,
      disableClose : true
    })
  }

  EditarModulo(  ){
    const dialogReg = this.dialog.open( EditarModuloComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '200vw',
      data: this.dataModulo,
      disableClose : true
    })
  }

  VerMenu(  ){
    const dialogReg = this.dialog.open( VerMenuPComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '200vw',
      data: {
        modulo : this.dataModulo,
        padre  : this.dataPadre
      },
      disableClose : true
    })
  }

  VerHijos(  ){
    const dialogReg = this.dialog.open( VerMenusHijosComponent,{
      width :   '500px',
      height:   'auto',
      maxWidth: 'auto',
      data:  {
        padre   : this.dataPadre,
        modulo  : this.dataModulo
      },
      disableClose : true
    })
  }

  editarMenuPadre(  ){
    const dialogReg = this.dialog.open( EditarMenuPComponent,{
      width :   '500px',
      height:   'auto',
      maxWidth: 'auto',
      data:  {
        padre   : this.dataPadre,
        modulo  : this.dataModulo
      },
      disableClose : true
    })
  }

  CrearMenu(  ){
    const dialogReg = this.dialog.open( CrearMenuPComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '200vw',
      data: this.dataModulo,
      disableClose : true
    })
  }


}
