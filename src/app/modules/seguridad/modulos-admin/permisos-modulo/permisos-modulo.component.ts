import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { NuevoPermisoComponent } from '../nuevo-permiso/nuevo-permiso.component';
import { Subscription } from 'rxjs';
import { mensajes } from 'src/app/interfaces/generales';

@Component({
  selector: 'app-permisos-modulo',
  templateUrl: './permisos-modulo.component.html',
  styleUrls: ['./permisos-modulo.component.scss']
})
export class PermisosModuloComponent implements OnInit, OnDestroy {
  
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
    private toast : ToastServiceLocal ) { }
    
  ngOnInit() {
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'', disabled: false})
    });
    this.cargarPermisos()

    this.subs = this.seguridad.refresh$.subscribe( ()=>{
        this.cargarPermisos()
    } )
  }
  ngOnDestroy() {
      this.subs.unsubscribe()
  }

  // let params = {
  //   usuario :   this.loginForm.value.usuario,
  //   password :  this.loginForm.value.contrasena
  // }

  cargarPermisos(){
    let url    =  `seguridad/verPmoduloEsp`;
    let params =  {
      idModulo : String(this.ruta?.snapshot.params['id'])
    };
    this.seguridad.verPermisosModulosEsp( url, params ).subscribe(
      res=>{
        this.dataPermisos = res
      }
    )
  }



  eliminarPermiso( idrol,idMod,rol, modulo){
    this.sweet.mensajeConConfirmacion("Baja a Permiso",`¿Seguro de dar de baja al ${ rol } sobre ${modulo}? `,"warning").then(
      res=>{
          if (res){
            // this.toast.mensajeSuccess("Correcto","Eliminado Correctamente")
            let url = 'seguridad/bajaPermisosModulo';
            let params = {
              idRol    : idrol,
              idModulo : idMod
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


    CrearPermiso(  ){
      const dialogReg = this.dialog.open( NuevoPermisoComponent,{
        width :   '900px',
        height:   'auto',
        maxWidth: '300vw',
        data: {
          idModulo : String(this.ruta?.snapshot.params['id']),
          modulo   : String(this.ruta?.snapshot.params['modulo'])
        },
        disableClose : true
      })
    }
  
}
