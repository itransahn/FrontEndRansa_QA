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
import { MotivoSalidaComponent } from '../../transporte/pases-salida/motivo-salida/motivo-salida.component';
import { TransporteService } from '../../transporte/transporte.service';

@Component({
  selector: 'app-salida-porton',
  templateUrl: './salida-porton.component.html',
  styleUrls: ['./salida-porton.component.scss']
})
export class SalidaPortonComponent implements OnInit {
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
  public parametrosBusqueda = ['NombreUsuario', 'Transporte','Nombre','Hacia','camion','identidad',];
  public pases : any[] = [];
  private sub : Subscription = new Subscription();

  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public dialog     : MatDialog, 
    private transporteService : TransporteService, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
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
    let url = 'transporte/paseSalidaPorton';
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

    cerrarPase( idPase : number , camion : string, hora : string, fecha : Date, tipo: number ){

      if ( tipo != 3) {
        let horaS = new Date();
        let horaMinutos = horaS.toTimeString();
        let horaMin2 = horaMinutos.substring(0,5);
        let horaMin3 = horaMin2.replace(':','');
        let cambioHora  = hora.substring(0,5);
        let horaFinal   = cambioHora.replace(':','');
        let dia = fecha.toString();
        let dia2 = dia.substring(0,2)
    
    
    if ( Number(dia2) >= Number(horaS.getDate())) {
      // this.aprobarPase(idPase, camion);
      if( Number(horaMin3) > Number(horaFinal)  )  {
        this.ModalPase(idPase, camion, tipo);
      }else{
    
    this.aprobarPase(idPase, camion, tipo);
    }
    
    }else{
      if (  Number(dia2) < Number(horaS.getDate()) ) {
        this.ModalPase(idPase, camion, tipo);
      }
    } 
      }else{
      this.aprobarPase(idPase, camion, tipo);
      }
    
    }

    
    aprobarPase( idPase : number , camion : string, tipo){
      this.sweel.mensajeConConfirmacion('¿Seguro de aprobar pase de salida?', `Placa de Camión ${camion}`,'warning' ).then(
        res=>{
          if( res ){
            let url    = 'transporte/AprobarpaseSalida';
            let params = {
              usuario : this.auth.dataUsuario['id_usuario'],
              idPase  : idPase,
              tipo    : tipo,
              motivo  : 5
            } 
            this.transporteService.put(url,params).subscribe(
              (res)=> {
                if(!res.hasError){
                    if ( res?.data.Table0[0]['codigo'] == -1 ){
                        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                    }else{
                        this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
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

      enviarLocalStorage( data){
        localStorage.setItem('PaseSalida', JSON.stringify(data));
        this.auth.redirecTo('ransa/transporte/Pasesalidas')
      }


        ModalPase (idPase, camion, tipo ){
          const dialogReg = this.dialog.open( MotivoSalidaComponent,{
            width :   '1000px',
            height:   'auto',
            maxWidth: 'auto',
            data: {
              idPase : idPase,
              camion : camion,
              tipo   : tipo
              },
            disableClose : true
          })
        }
}
