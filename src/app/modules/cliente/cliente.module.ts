import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { seguridadRoutingModule } from '../seguridad/seguridad-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PedidosComponent } from './pedidos/pedidos.component';
import { OrdenesComponent } from './ordenes/ordenes.component';



@NgModule({
  declarations: [
    PedidosComponent,
    OrdenesComponent
  ],
  imports: [
    CommonModule,
    seguridadRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class ClienteModule { }
