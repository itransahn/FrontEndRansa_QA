import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaiComponent } from './facturacion/cai/cai.component';
import { FacturaAHComponent } from './facturacion/factura-ah/factura-ah.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { FacturasClienteComponent } from './facturacion/facturas-cliente/facturas-cliente.component';
import { IntemedioComponent } from './facturacion/intemedio/intemedio.component';
import { IntermediarioNComponent } from './notas/intermediario-n/intermediario-n.component';
import { NcComponent } from './notas/nc/nc.component';
import { NdComponent } from './notas/nd/nd.component';
import { ParametrosComponent } from './parametros/parametros.component';


const routes: Routes = [
 {
  path      : 'facturacion/:cliente/:documento/:tipo',
  component : FacturacionComponent
 },
 {
  path      : 'facturacionAh/:cliente/:documento',
  component : FacturaAHComponent
 },
 {
  path      : 'facturacion/:sede',
  component : IntemedioComponent
 },
 {
  path      : 'parametros',
  component : ParametrosComponent
 },
 {
  path      : 'cai',
  component : CaiComponent
 },
 {
  path      : 'facturas',
  component : FacturasClienteComponent
 },
 {
  path      : 'notaDebito/:tipo',
  component : IntermediarioNComponent
 },
 {
  path      : 'notaCredito/:tipo',
  component : IntermediarioNComponent
 },
 {
  path      : 'notaDebito/:empresa/:cliente/:documento',
  component : NdComponent
 },
 {
  path      : 'notaCredito/:empresa/:cliente/:documento',
  component : NcComponent
 },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class finanzasRoutingModule { }
