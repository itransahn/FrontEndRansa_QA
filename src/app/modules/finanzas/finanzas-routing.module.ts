import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { ParametrosComponent } from './parametros/parametros.component';


const routes: Routes = [
 {
  path      : 'facturacion',
  component : FacturacionComponent
 },
 {
  path      : 'parametros',
  component : ParametrosComponent
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class finanzasRoutingModule { }
