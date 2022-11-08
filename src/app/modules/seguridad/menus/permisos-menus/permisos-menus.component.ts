import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { mensajes } from 'src/app/interfaces/generales';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AgregarPermisosMenuComponent } from './agregar-permisos-menu/agregar-permisos-menu.component';

@Component({
  selector: 'app-permisos-menus',
  templateUrl: './permisos-menus.component.html',
  styleUrls: ['./permisos-menus.component.scss']
})
export class PermisosMenusComponent implements OnInit, OnDestroy {
  
  public  Permisos: any;
  private subs : Subscription = new Subscription()

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
    public parametrosBusqueda = ['rol'];
    public dataPermisos : any
  /* Complementos */
  constructor(
    private seguridad : SeguridadService, public dialog : MatDialog,
    private ruta: ActivatedRoute, public sweet : SweetAlertService,
    private toast : ToastServiceLocal 
  ) { }

  ngOnInit() {
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'', disabled: false})
    });
    this.cargarPermisos()
    this.subs = this.seguridad.refresh$.subscribe( ()=> this.cargarPermisos())
  }
  ngOnDestroy() {
    this.subs.unsubscribe()
}

cargarPermisos(){
  let url    =  `seguridad/verPmenuEsp`;
  let params =  {
    idMenu : String(this.ruta?.snapshot.params['id'])
  };
  this.seguridad.verPermisosModulosEsp( url, params ).subscribe(
    res=>{
      this.dataPermisos = res
    }
  )
}

eliminarPermiso( idrol,idMenu,rol, menu ){
  this.sweet.mensajeConConfirmacion("Baja de Permiso",`¿Seguro de dar de baja al ${ rol } sobre el menú ${menu}? `,"warning").then(
    res=>{
        if (res){
          let url = 'seguridad/eliminarPmenu';
          let params = {
            idRol    : idrol,
            idMenu : idMenu
          }
          this.seguridad.eliminarPermisosModulos(url, params).subscribe(
            res=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
                    this.cargarPermisos()
                }
            }else{
              this.toast.mensajeError(String(res?.errors),"Error")
            }
            }
          )
        }else{
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

  nuevoPermiso( ){
    const dialogReg = this.dialog.open( AgregarPermisosMenuComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '300vw',
      data: { 
        idMenuHijo : this.ruta.snapshot.params['id'],
        menuHijo   : this.ruta.snapshot.params['menu'],
        tipo       : 1
      },
      disableClose : true
    })
  }

  editarPermiso( data ?: any  ){
    const dialogReg = this.dialog.open( AgregarPermisosMenuComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '300vw',
      data: { 
        idMenuHijo : this.ruta.snapshot.params['id'],
        tipo       : 2,
        dataMenu   : data
      },
      disableClose : true
    })
  }
}
