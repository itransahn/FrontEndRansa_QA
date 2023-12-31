import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AprobacionPaseComponent } from '../transporte/pasesf/aprobacion-pase/aprobacion-pase.component';
import { PasesfComponent } from '../transporte/pasesf/pasesf.component';
import { ModalRCComponent } from '../transporte/rol-cliente/modal-rc/modal-rc.component';
import { CaiComponent } from './facturacion/cai/cai.component';
import { FacturaAHComponent } from './facturacion/factura-ah/factura-ah.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { FacturasClienteComponent } from './facturacion/facturas-cliente/facturas-cliente.component';
import { IntemedioComponent } from './facturacion/intemedio/intemedio.component';
import { IntermediarioNComponent } from './notas/intermediario-n/intermediario-n.component';
import { NcComponent } from './notas/nc/nc.component';
import { NdComponent } from './notas/nd/nd.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { RecibosComponent } from './recibos/recibos.component';
import { IntermediorgComponent } from './retenciones-g/intermediorg/intermediorg.component';
import { RetencionesGComponent } from './retenciones-g/retenciones-g.component';
import { CargarDocumentoComponent } from './retenciones/cargar-documento/cargar-documento.component';
import { IntermedioRetComponent } from './retenciones/intermedio-ret/intermedio-ret.component';
import { ProveedoresFComponent } from './retenciones/proveedores-f/proveedores-f.component';
import { RetencionComponent } from './retenciones/retencion/retencion.component';
import { RetencionesHComponent } from './retenciones/retenciones-h/retenciones-h.component';
import { EmpleadocabComponent } from './CAB/Mantenimientos/empleadocab/empleadocab.component';
import { AprobadorcabComponent } from './CAB/Mantenimientos/aprobadorcab/aprobadorcab.component';
import { CrearviajeComponent } from './CAB/Proceso/crearviaje/crearviaje.component';
import { ViajesaprobadosComponent } from './CAB/Proceso/viajesaprobados/viajesaprobados.component';
import { AprobacionviajesComponent } from './CAB/Proceso/aprobacionviajes/aprobacionviajes.component';
import { CancelarviajesComponent } from './CAB/Proceso/cancelarviajes/cancelarviajes.component';
import { ValeComponent } from './CAB/Proceso/vale/vale.component';


const routes: Routes = [
 {
  path      : 'facturacion/:cliente/:documento/:tipo',
  component : FacturacionComponent
 },
 {
  path      : 'facturacionAh/:cliente/:documento/:tipo',
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
  path      : 'notaDebito/:empresa/:cliente/:documento/:tipo',
  component : NdComponent
 },
 {
  path      : 'notaCredito/:empresa/:cliente/:documento/:tipo',
  component : NcComponent
 },

 {
  path      : 'Cretenciones',
  component : CargarDocumentoComponent
 },

 {
  path      : 'proveedores',
  component : ProveedoresFComponent
 },

 {
  path      : 'retencion',
  component : IntermedioRetComponent
 },

 {
  path      : 'retencion/:periodo/:dia/:anio/:proveedor/:empresa/:retencion',
  component : RetencionComponent
 },
 {
  path      : 'retencion/:correlativo',
  component : RetencionesGComponent
 },
 {
  path      : 'retencionesG',
  component : IntermediorgComponent
 },
 {
  path      : 'retencionesH',
  component : RetencionesHComponent
 },
 {
  path      : 'recibos',
  component : RecibosComponent
 },
 {
  path      : 'paseF',
  component : PasesfComponent
 },
 {
  path      : 'AprobapaseF',
  component : AprobacionPaseComponent
 },
 /* CAB */
 {
  path      : 'empleadoCAB',
  component : EmpleadocabComponent
 },
 {
  path      : 'aprobadorCAB',
  component : AprobadorcabComponent
 },
 {
  path      : 'viajeCAB',
  component : CrearviajeComponent
 },
 {
  path      : 'viajesAprobados',
  component : ViajesaprobadosComponent
 },
 {
  path      : 'aprobarViaje',
  component : AprobacionviajesComponent
 },
 {
  path      : 'cancelarViaje',
  component : CancelarviajesComponent
 },
 {
  path : 'vale/:idViaje',
  component : ValeComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class finanzasRoutingModule { }
