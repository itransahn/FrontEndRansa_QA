import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { excelenciaRoutingModule } from './excelencia-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EntradaLLantasComponent } from './llantas/entrada-llantas/entrada-llantas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './llantas/stock/stock.component';
import { GeneralComponent } from './llantas/stock/general/general.component';
import { DetalleComponent } from './llantas/stock/detalle/detalle.component';
import { CambioComponent } from './llantas/cambioLlantas/cambio/cambio.component';
import { HistorialCambiosComponent } from './llantas/cambioLlantas/historial-cambios/historial-cambios.component';
import { MovimientoLlantasComponent } from './llantas/movimiento-llantas/movimiento-llantas.component';
import { AjustesLlantasComponent } from './llantas/ajustes-llantas/ajustes-llantas.component';
import { HistorialAprobacionesComponent } from './llantas/ajustes-llantas/historial-aprobaciones/historial-aprobaciones.component';
import { ModalAjustesComponent } from './llantas/ajustes-llantas/historial-aprobaciones/modal-ajustes/modal-ajustes.component';
import { AprobAjustesComponent } from './llantas/coordinacion/aprob-ajustes/aprob-ajustes.component';
import { HistorialAjustesComponent } from './llantas/coordinacion/historial-ajustes/historial-ajustes.component';
import { FormCambioComponent } from './llantas/cambioLlantas/form-cambio/form-cambio.component';
import { HcambiosComponent } from './llantas/cambioLlantas/hcambios/hcambios.component';
import { ModalLotesComponent } from './llantas/stock/modal-lotes/modal-lotes.component';
import { ModLotesComponent } from './llantas/stock/mod-lotes/mod-lotes.component';


@NgModule({
  declarations: [
    EntradaLLantasComponent,
    StockComponent,
    GeneralComponent,
    DetalleComponent,
    CambioComponent,
    HistorialCambiosComponent,
    MovimientoLlantasComponent,
    AjustesLlantasComponent,
    HistorialAprobacionesComponent,
    ModalAjustesComponent,
    AprobAjustesComponent,
    HistorialAjustesComponent,
    FormCambioComponent,
    HcambiosComponent,
    ModalLotesComponent,
    ModLotesComponent
  ],
  imports: [
    CommonModule,
    excelenciaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports :[   ]
})
export class ExcelenciaModule { }
