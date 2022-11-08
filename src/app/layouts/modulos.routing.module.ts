import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Navbar1Component } from './navbar1/navbar1.component';
import { ModulosComponent } from './modulos/modulos.component';
const routes: Routes = [
  {
  path: '',
  component: ModulosComponent
  },
  {
    path : 'navbar',
    component : Navbar1Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class modulosRoutingModule { }
