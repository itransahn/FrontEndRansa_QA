import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjustesLlantasComponent } from './llantas/ajustes-llantas/ajustes-llantas.component';
import { CambioComponent } from './llantas/cambioLlantas/cambio/cambio.component';
import { HcambiosComponent } from './llantas/cambioLlantas/hcambios/hcambios.component';
import { HistorialCambiosComponent } from './llantas/cambioLlantas/historial-cambios/historial-cambios.component';
import { AprobAjustesComponent } from './llantas/coordinacion/aprob-ajustes/aprob-ajustes.component';
import { HistorialAjustesComponent } from './llantas/coordinacion/historial-ajustes/historial-ajustes.component';
import { EntradaLLantasComponent } from './llantas/entrada-llantas/entrada-llantas.component';
import { MovimientoLlantasComponent } from './llantas/movimiento-llantas/movimiento-llantas.component';
import { ModLotesComponent } from './llantas/stock/mod-lotes/mod-lotes.component';
import { StockComponent } from './llantas/stock/stock.component';

const routes: Routes = [  
    {
      path      : 'Ellanta',
      component : EntradaLLantasComponent,
    },
    {
      path      : 'stock',
      component : StockComponent
    },
    {
      path      : 'cambio',
      component : CambioComponent 
    },
    {
      path      : 'Hcambio',
      component :  HistorialCambiosComponent 
    },
    {
      path      : 'Mllantas',
      component :  MovimientoLlantasComponent 
    },
    {
      path      : 'ajustes',
      component :  AjustesLlantasComponent 
    },
    {
      path      : 'aprobAjus',
      component :  AprobAjustesComponent 
    },
    {
      path      : 'hajustes',
      component :  HistorialAjustesComponent 
    },
    {
      path      : 'Modificaciones',
      component :  HcambiosComponent 
    },
    {
      path      : 'verModificaciones',
      component :  ModLotesComponent 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class excelenciaRoutingModule { }
