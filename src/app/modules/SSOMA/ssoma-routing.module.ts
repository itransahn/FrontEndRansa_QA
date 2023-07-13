import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalidaPortonComponent } from './salida-porton/salida-porton.component';
import { VerExtintoresComponent } from './Extintores/ver-extintores/ver-extintores.component';


const routes: Routes = [
   {
    path         : 'paseSalida',
    component    : SalidaPortonComponent
   },
   {
    path         : 'extintores',
    component    : VerExtintoresComponent
   }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ssomaRoutingModule { }