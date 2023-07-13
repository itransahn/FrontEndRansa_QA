import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ssomaRoutingModule } from './ssoma-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SalidaPortonComponent } from './salida-porton/salida-porton.component';
import { VerExtintoresComponent } from './Extintores/ver-extintores/ver-extintores.component';
import { ExtintoresComponent } from './Extintores/extintores/extintores.component';
import { ExtintoresALComponent } from './Extintores/extintores-al/extintores-al.component';
import { ExtintoresARComponent } from './Extintores/extintores-ar/extintores-ar.component';
import { CrearExtintorComponent } from './Extintores/crear-extintor/crear-extintor.component';

@NgModule({
  declarations: [
    SalidaPortonComponent,
    VerExtintoresComponent,
    ExtintoresComponent,
    ExtintoresALComponent,
    ExtintoresARComponent,
    CrearExtintorComponent
  ],
  imports: [
    CommonModule,
    ssomaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule

  ]
})
export class ssomaModule { }
