import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finanzasRoutingModule } from './finanzas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { ModalComponent } from './facturacion/modal/modal.component';
import { IntemedioComponent } from './facturacion/intemedio/intemedio.component';
import { CaiComponent } from './facturacion/cai/cai.component';
import { ModalCaiComponent } from './facturacion/cai/modal-cai/modal-cai.component';
import { FacturaAHComponent } from './facturacion/factura-ah/factura-ah.component';
import { FacturasClienteComponent } from './facturacion/facturas-cliente/facturas-cliente.component';
import { NdComponent } from './notas/nd/nd.component';
import { NcComponent } from './notas/nc/nc.component';
import { IntermediarioNComponent } from './notas/intermediario-n/intermediario-n.component';
import { ModalNComponent } from './notas/intermediarioN/modal-n/modal-n.component';
import { CargarDocumentoComponent } from './retenciones/cargar-documento/cargar-documento.component';
import { ProveedoresFComponent } from './retenciones/proveedores-f/proveedores-f.component';
import { ModalproveedorfComponent } from './retenciones/proveedores-f/modalproveedorf/modalproveedorf.component';
import { RetencionComponent } from './retenciones/retencion/retencion.component';
import { IntermedioRetComponent } from './retenciones/intermedio-ret/intermedio-ret.component';
import { ModalRComponent } from './retenciones/modal-r/modal-r.component';
import { RetencionesGComponent } from './retenciones-g/retenciones-g.component';
import { IntermediorgComponent } from './retenciones-g/intermediorg/intermediorg.component';
import { ModalrgComponent } from './retenciones-g/modalrg/modalrg.component';
import { RetencionesHComponent } from './retenciones/retenciones-h/retenciones-h.component';



@NgModule({
  declarations: [
    FacturacionComponent,
    ParametrosComponent,
    ModalComponent,
    IntemedioComponent,
    CaiComponent,
    ModalCaiComponent,
    FacturaAHComponent,
    FacturasClienteComponent,
    NdComponent,
    NcComponent,
    IntermediarioNComponent,
    ModalNComponent,
    CargarDocumentoComponent,
    ProveedoresFComponent,
    ModalproveedorfComponent,
    RetencionComponent,
    IntermedioRetComponent,
    ModalRComponent,
    RetencionesGComponent,
    IntermediorgComponent,
    ModalrgComponent,
    RetencionesHComponent
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
