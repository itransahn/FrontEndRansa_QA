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



@NgModule({
  declarations: [
    FacturacionComponent,
    ParametrosComponent,
    ModalComponent,
    IntemedioComponent,
    CaiComponent,
    ModalCaiComponent,
    FacturaAHComponent
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
