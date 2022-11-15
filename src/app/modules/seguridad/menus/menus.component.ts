import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { mensajes, menus, MenusP } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { EditarMenuPComponent } from './editar-menu-p/editar-menu-p.component';
import { VerMenuPComponent } from './ver-menu-p/ver-menu-p.component';
import { Subscription } from 'rxjs'
import { CreaMenuHijoComponent } from './crea-menu-hijo/crea-menu-hijo.component';
import { VerMenuHijoComponent } from './ver-menu-hijo/ver-menu-hijo.component';
import { EditarMenusHijosComponent } from './editar-menus-hijos/editar-menus-hijos.component';
import { CrearMenuPComponent } from './crear-menu-p/crear-menu-p.component';
import { CrearMenuModComponent } from './crear-menu-mod/crear-menu-mod.component';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public  opcionesPadres : any[]=[];
  public  opcionesHijos  : any[]= [];
  public menusPadre: menus[]= [];
  public padre  : string;
  public hijo : string;
  public dataPadre : any;
  public dataHijo : any;
  public sub : Subscription = new Subscription();

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
    public parametrosBusqueda = ['menuPadre'];
  /* Complementos */

  constructor(
    private administracion : AdministracionService,
    private _bottomSheet: MatBottomSheet,
    public  auth : AuthService,
    public  dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal,
    private seguridad : SeguridadService ) { }

  ngOnInit(): void {
    this.cargarMenus();
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

   this.sub = this.seguridad.refresh$.subscribe(  res=>  this.cargarMenus() )
  }

  ngOnDestroy() {
      this.sub.unsubscribe()
  }
  Padre( accion ){
    if ( accion == 1){
      this.insertarMenuHijo()
    } 
    if ( accion == 2){
      this.VerMenu()
    }
    if ( accion == 3){
        this.editarMenuPadre()
    }
    if ( accion == 4){ 
      this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el menú ${this.dataPadre?.menuPadre}?`, `Eliminación de Menú`,"question").then(
        res=>{
            if ( res ){
                  let url    = 'seguridad/eliminarMenu';
                  let params = {
                    idMenuPadre : this.dataPadre?.id_menuPadre
                  } 
                  this.seguridad.eliminarMenu(url, params).subscribe(
                    res=>{
                      console.log(res)
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                      this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                      this.cargarMenus()
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

Hijo( accion ){
  if ( accion == 1){
    this.verMenuHijo()
  } 
  if ( accion == 2){
    this.auth.redirecTo(`/ransa/administracion/menu/${this.dataHijo?.id_menuHijo}`)
  }
  if ( accion == 3){
      this.editarMenuHijo()
  }
  if ( accion == 4){ 
    this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el menú ${this.dataHijo?.menuHijo}?`, `Eliminación de Menú`,"question").then(
      res=>{
          if ( res ){
                let url    = '/seguridad/eliminarMenuH';
                let params = {
                  idMenuHijo : this.dataHijo?.id_menuHijo
                } 
                this.seguridad.eliminarMenu(url, params).subscribe(
                  res=>{
                    if ( res?.data.Table0[0]['codigo'] == -1 ){
                      this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                  }else{
                    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                    this.cargarMenus()
                  }
                  }
                )
          }
      }
    )
    
}

  this._bottomSheet.dismiss();
}

cargarMenus(){
  let url = 'seguridad/Padrehijos';
  let params = {};

  this.administracion.menus(url , params).subscribe(
    (data : MenusP | any ) =>{
        this.menusPadre = data.data.menu;
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


menuPadre(template, padre, idmenuPadre, dataPadre) {
  this.padre = padre;
  this.dataPadre = dataPadre;
  this.opcionesPadres = [
    {
      icono     : 'note_add',
      titulo    : 'Agregar Menú Hijo',
      subtitulo : `Agregar nuevo menú a ${padre}`,
      url       : `ransa/administracion/usuarios/${idmenuPadre}`,
      accion    : 1
    },
    {
      icono   : 'remove_red_eye',
      titulo  : 'Ver Menú',
      subtitulo : 'Ver datos del menú',
      url       :  `ransa/administracion/usuarios/${idmenuPadre}`,
      accion    : 2
    },
    {
      icono   : 'edit',
      titulo  : 'Editar Menú',
      subtitulo : 'Editar datos del menú',
      url       : `ransa/administracion/usuarios/${idmenuPadre}`,
      accion    : 3
    },
    {
      icono   : 'delete_sweep',
      titulo  : 'Eliminar Menú',
      subtitulo : 'Eliminar menú seleccionado',
      url       : `ransa/administracion/usuarios/${idmenuPadre}`,
      accion    : 4
    },
  ]
  this._bottomSheet.open(template);
}

/* Complementos para Menú Padre */ 
VerMenu(  ){
  const dialogReg = this.dialog.open( VerMenuPComponent,{
    width :   'auto',
    height:   'auto',
    maxWidth: '200vw',
    data: { 
      modulo : {
          id_modulo : this.dataPadre?.id_modulo,
          modulo    : this.dataPadre?.modulo
      },
      padre  : {
        menuPadre     : this.dataPadre?.menuPadre,
        icon        : this.dataPadre?.icon,
        modulo        : this.dataPadre?.modulo,
        estado        : this.dataPadre?.estado
            }
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
    padre  : {
      id_menuPadre  : this.dataPadre?.id_menuPadre,
      menuPadre     : this.dataPadre?.menuPadre,
      icon          : this.dataPadre?.icon,
      modulo        : this.dataPadre?.modulo,
      estado        : this.dataPadre?.estado,
      id_modulo :     this.dataPadre?.id_modulo,
          }
    },
    disableClose : true
  })
}

insertarMenuHijo(  ){
  const dialogReg = this.dialog.open( CreaMenuHijoComponent,{
    width :   '500px',
    height:   'auto',
    maxWidth: 'auto',
    data:  {
      id_menuPadre  : this.dataPadre?.id_menuPadre,
      menuPadre     : this.dataPadre?.menuPadre,
      icon          : this.dataPadre?.icon,
      modulo        : this.dataPadre?.modulo,
      estado        : this.dataPadre?.estado,
      id_modulo :     this.dataPadre?.id_modulo,
    },
    disableClose : true
  })
}
/* Complementos para Menú Padre */ 

/* ******************************************************************************************* */

/* Complementos para Menú Hijo */ 

verMenuHijo(){
  const dialogReg = this.dialog.open( VerMenuHijoComponent,{
    width :   'auto',
    height:   'auto',
    maxWidth: '200vw',
    data: { 
        idMenuHijo   : this.dataHijo?.id_menuHijo,
        menuHijo     : this.dataHijo?.menuHijo,
        icon         : this.dataHijo?.icon,
        url          : this.dataHijo?.url,
        estado       : this.dataHijo?.estado,
        id_menuPadre : this.dataPadre?.id_menuPadre,
        menuPadre    : this.dataPadre?.menuPadre
    },
    disableClose : true
  })
}

editarMenuHijo(){
  const dialogReg = this.dialog.open( EditarMenusHijosComponent,{
    width :   'auto',
    height:   'auto',
    maxWidth: '200vw',
    data: { 
        idMenuHijo   : this.dataHijo?.id_menuHijo,
        menuHijo     : this.dataHijo?.menuHijo,
        id_menuPadre : this.dataPadre?.id_menuPadre,
        icon         : this.dataHijo?.icon,
        url          : this.dataHijo?.url,
        estado       : this.dataHijo?.estado
    },
    disableClose : true
  })
}

CrearMenu(  ){
  const dialogReg = this.dialog.open( CrearMenuModComponent,{
    width :   'auto',
    height:   'auto',
    maxWidth: '200vw',
    data: [],
    disableClose : true
  })
}
/* Complementos para Menú Hijo */ 

menuHijo(template, menuHijo, hijo, padre) {

    if( this.auth.Actualizacion() ){
      this.hijo = menuHijo;
      this.dataHijo = hijo;
      this.dataPadre = padre;
      this.opcionesHijos = [
        {
          icono     : 'remove_red_eye',
          titulo    : 'Ver menú',
          subtitulo : 'Ver datos del menú',
          accion    : 1
        },
        {
          icono   : 'remove_red_eye',
          titulo  : 'Ver Permisos',
          subtitulo : 'Ver permisos sobre el menú',
          accion    : 2
        },
        {
          icono     : 'edit',
          titulo    : 'Editar menú',
          subtitulo : 'Editar datos del menú',
          accion    : 3
        },
        {
          icono     : 'delete_sweep',
          titulo    : 'Eliminar menú ',
          subtitulo : 'Eliminar menú hijo',
          accion    : 4
        },
      ]
      this._bottomSheet.open(template);
    }
}


}
