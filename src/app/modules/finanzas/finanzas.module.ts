import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finanzasRoutingModule } from './finanzas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FacturacionComponent } from './facturacion/facturacion.component';



@NgModule({
  declarations: [
    FacturacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    finanzasRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class FinanzasModule { }
