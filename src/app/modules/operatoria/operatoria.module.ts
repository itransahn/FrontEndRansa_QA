import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { operatoriaRoutingModule } from './operatoria-routing.module';
import { AsignacionMaquinaComponent } from './asignacion-maquina/asignacion-maquina.component';
import { MaquinasEnUsoComponent } from './asignacion-maquina/maquinas-en-uso/maquinas-en-uso.component';
import { ModalFinAsignacionComponent } from './asignacion-maquina/modal-fin-asignacion/modal-fin-asignacion.component';
import { HasignacionMaquinasComponent } from './asignacion-maquina/hasignacion-maquinas/hasignacion-maquinas.component';
import { FlejeComponent } from './fleje/fleje.component';
import { StockFlejeComponent } from './fleje/stock-fleje/stock-fleje.component';
import { SalidaFlejeComponent } from './fleje/salida-fleje/salida-fleje.component';


@NgModule({
  declarations: [
    AsignacionMaquinaComponent,
    MaquinasEnUsoComponent,
    ModalFinAsignacionComponent,
    HasignacionMaquinasComponent,
    FlejeComponent,
    StockFlejeComponent,
    SalidaFlejeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    operatoriaRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class OperatoriaModule { }
