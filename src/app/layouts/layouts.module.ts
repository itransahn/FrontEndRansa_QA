import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulosComponent } from './modulos/modulos.component';
import { Navbar1Component } from './navbar1/navbar1.component';
import { MatMenuModule } from '@angular/material/menu';
import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FullComponentComponent } from './full-component/full-component.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    ModulosComponent,
    Navbar1Component,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports : [
      ModulosComponent,
      Navbar1Component,
      SidebarComponent,
      NavbarComponent
  ] 
})
export class LayoutsModule { }
