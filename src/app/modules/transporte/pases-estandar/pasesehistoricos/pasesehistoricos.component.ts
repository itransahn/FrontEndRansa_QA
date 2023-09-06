import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pasesehistoricos',
  templateUrl: './pasesehistoricos.component.html',
  styleUrls: ['./pasesehistoricos.component.scss']
})
export class PasesehistoricosComponent implements OnInit {
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
public parametrosBusqueda = ['NombreUsuario', 'Solicitante','contenido','identidad','placa'];
public pases : any[] = [];
private sub : Subscription = new Subscription();
 constructor(
   public auth       : AuthService,
   private paginator : MatPaginatorIntl, 
   public dialog : MatDialog, 
   private transporteService : TransporteService, 
   private sweel : SweetAlertService,
   private toast : ToastServiceLocal 
 ) { }


 ngOnInit(){
   this.LimpiarInformacionPase();
   this.paginator.itemsPerPageLabel = 'Pases por hoja.';
   this.paginator.nextPageLabel     = 'Página Siguiente';
   this.paginator.previousPageLabel = 'Página Anterior';

   this.filtro = new FormGroup({
     filtrar: new FormControl({ value:'',disabled: false})
   })

   const newLocal = this;
   newLocal.cargarPases();

   this.sub = this.transporteService.refresh$.subscribe(
     res=>{
        this.cargarPases()
     }
   )
 }

 ngOnDestroy()  {
   this.sub.unsubscribe()
}

cargarPases(){
 let url = 'transporte/paseSalidaEstandar';
 let params = {};
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


 enviarLocalStorage( data){
   localStorage.setItem('PaseSalida', JSON.stringify(data));
   this.auth.redirecTo('ransa/transporte/Pasesalidas')
 }
 LimpiarInformacionPase(){
   localStorage.removeItem('PaseSalida')
 }

 ValidacionHora( hora ){
   // 
   if ( Number(hora.substring(12,13)) >=0 && Number(hora.substring(12,13))<= 12 ){
       return 'AM'
   }else{
     return 'PM'
   }
 }
 

}
