import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportesComponent } from './transportes/transportes.component';
import { CamionesComponent } from './camiones/camiones.component';
import { MotoristasComponent } from './motoristas/motoristas.component';
import { ClientesTComponent } from './clientes-t/clientes-t.component';
import { ProveedoresTComponent } from './proveedores-t/proveedores-t.component';
import { transporteRoutingModule } from './transporte-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TransportesComponent,
CamionesComponent,
MotoristasComponent,
ClientesTComponent,
ProveedoresTComponent,
  ],
  imports: [
    CommonModule,
    transporteRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TransporteModule { }
