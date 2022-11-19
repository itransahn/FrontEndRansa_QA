import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaiComponent } from './facturacion/cai/cai.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { IntemedioComponent } from './facturacion/intemedio/intemedio.component';
import { ParametrosComponent } from './parametros/parametros.component';


const routes: Routes = [
 {
  path      : 'facturacion/:cliente/:documento',
  component : FacturacionComponent
 },
 {
  path      : 'facturacion',
  component : IntemedioComponent
 },
 {
  path      : 'parametros',
  component : ParametrosComponent
 },
 {
  path      : 'cai',
  component : CaiComponent
 }
//  /finanzas/facturacion/0/0

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class finanzasRoutingModule { }
