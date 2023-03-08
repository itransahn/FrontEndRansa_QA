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
import { PasesSalidaComponent } from './pases-salida/pases-salida.component';
import { CrearPaseSalidaComponent } from './pases-salida/crear-pase-salida/crear-pase-salida.component';
import { VistaPaseSalidaComponent } from './pases-salida/vista-pase-salida/vista-pase-salida.component';
import { PasesSalidaHComponent } from './pases-salida/pases-salida-h/pases-salida-h.component';
import { DocumentosComponent } from './motoristas/documentos/documentos.component';
import { MotivoSalidaComponent } from './pases-salida/motivo-salida/motivo-salida.component';
import { PasesEstandarComponent } from './pases-estandar/pases-estandar.component';
import { CrearpaseEstandarComponent } from './pases-estandar/crearpase-estandar/crearpase-estandar.component';
import { RecibosComponent } from './recibos/recibos/recibos.component';
import { ModalRecibosComponent } from './recibos/recibos/modal-recibos/modal-recibos.component';
import { CancelarrecibosComponent } from './recibos/cancelarrecibos/cancelarrecibos.component';
import { PasesfComponent } from './pasesf/pasesf.component';
import { ModalpasefComponent } from './pasesf/modalpasef/modalpasef.component';
import { AprobacionPaseComponent } from './pasesf/aprobacion-pase/aprobacion-pase.component';
import { HistorialPasesComponent } from './pasesf/historial-pases/historial-pases.component';
import { DeducciontComponent } from './deducciont/deducciont.component';


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
PasesSalidaComponent,
CrearPaseSalidaComponent,
VistaPaseSalidaComponent,
PasesSalidaHComponent,
DocumentosComponent,
MotivoSalidaComponent,
PasesEstandarComponent,
CrearpaseEstandarComponent,
RecibosComponent,
ModalRecibosComponent,
CancelarrecibosComponent,
PasesfComponent,
ModalpasefComponent,
AprobacionPaseComponent,
HistorialPasesComponent,
DeducciontComponent
  ],
  imports: [
    CommonModule,
    transporteRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TransporteModule { }
