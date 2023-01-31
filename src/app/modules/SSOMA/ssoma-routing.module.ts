import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalidaPortonComponent } from './salida-porton/salida-porton.component';


const routes: Routes = [
   {
    path         : 'paseSalida',
    component    : SalidaPortonComponent
   }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ssomaRoutingModule { }