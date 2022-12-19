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
import { TransProveedorComponent } from './trans-proveedor/trans-proveedor.component';
import { TransClienteComponent } from './trans-cliente/trans-cliente.component';
import { RolClienteComponent } from './rol-cliente/rol-cliente.component';
import { RolProveedorComponent } from './rol-proveedor/rol-proveedor.component';
import { ModalComponent } from './trans-cliente/modal/modal.component';
import { ModalProComponent } from './trans-proveedor/modal-pro/modal-pro.component';
import { ModalRCComponent } from './rol-cliente/modal-rc/modal-rc.component';
import { ModalRPComponent } from './rol-proveedor/modal-rp/modal-rp.component';
import { ModalTransporteComponent } from './transportes/modal-transporte/modal-transporte.component';
import { ModalCaComponent } from './camiones/modal-ca/modal-ca.component';
import { ModalMotComponent } from './motoristas/modal-mot/modal-mot.component';
import { ModalClientesTComponent } from './clientes-t/modal-clientes-t/modal-clientes-t.component';
import { ModalProveedoresTComponent } from './proveedores-t/modal-proveedores-t/modal-proveedores-t.component';
import { MotoristaCamionComponent } from './motorista-camion/motorista-camion.component';
import { ModalMotCamComponent } from './motorista-camion/modal-mot-cam/modal-mot-cam.component';


@NgModule({
  declarations: [
    TransportesComponent,
CamionesComponent,
MotoristasComponent,
ClientesTComponent,
ProveedoresTComponent,
TransProveedorComponent,
TransClienteComponent,
RolClienteComponent,
RolProveedorComponent,
ModalComponent,
ModalProComponent,
ModalRCComponent,
ModalRPComponent,
ModalTransporteComponent,
ModalCaComponent,
ModalMotComponent,
ModalClientesTComponent,
ModalProveedoresTComponent,
MotoristaCamionComponent,
ModalMotCamComponent,
  ],
  imports: [
    CommonModule,
    transporteRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TransporteModule { }
