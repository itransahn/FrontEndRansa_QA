import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-aprobacion-pase',
  templateUrl: './aprobacion-pase.component.html',
  styleUrls: ['./aprobacion-pase.component.scss']
})
export class AprobacionPaseComponent implements OnInit {
//Paginacion
public page = 0;
public pageEvent : PageEvent;
public pageIndex : number = 0;
public desde = 0;
public hasta = 50;
nextPageLabel     = 'Página Siguiente';
previousPageLabel = 'Página Anterior';
public pageSize = 50;
public filter :string  = '';
public filtro: FormGroup;
public parametrosBusqueda = ['NombreUsuario', 'Transporte','Nombre','Hacia','camion'];
public pases : any[] = [];
private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public dialog     : MatDialog, 
    private transporteService : TransporteService, 
    private sweel             : SweetAlertService,
    private toast             : ToastServiceLocal 
    
  ) { }

  ngOnInit() {
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarPases();

    this.sub = this.transporteService.refresh$.subscribe(
      res=>{
         this.cargarPases()
      }
    )
  }


  cargarPases(){
    let url = 'transporte/paseSalidafP';
    let params = {
      sede : this.auth.dataUsuario['sede']
    };
    this.transporteService.get(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.pases = data?.data?.Table0;
        }    
      }
  
    )
  }


  aprobacion(idPase ?:number, accionU ?: number ){
    let accion : number;
    let leyenda  : string;
    let leyenda2 : string;
    if ( accionU === 1 ){
        accion = 1;
        leyenda = 'Aprobar';
        leyenda2 = 'Aprobación';
    }else{
      accion = 5;
        leyenda = 'Denegar';
        leyenda2 = 'Denegación';
    }

    this.sweel.mensajeConConfirmacion(`Seguro de ${leyenda} pase de salida`,`${leyenda2} de pase`,'warning' ).then(
      res=>{
          if ( res ){
              let url    = 'transporte/ApaseSalidaf';
              let params = {
                   idPase  : idPase,
                   usuario : this.auth.dataUsuario['id_usuario'], 
                   accion  : accion,
              }

              this.transporteService.put(url,params).subscribe(
                res=>{
                  if(!res.hasError){
                      if ( res?.data.Table0[0]['codigo'] == -1 ){
                          this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                      }else{
                        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
                          this.cargarPases()
                      }
                  }else{
                    this.toast.mensajeError(String(res?.errors),"Error")
                  }
                }
              )
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
