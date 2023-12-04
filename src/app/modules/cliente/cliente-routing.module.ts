import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './pedidos/pedidos.component';
import { OrdenesComponent } from './ordenes/ordenes.component';




const routes: Routes = [  
    {
        path : 'Pedidos',
        component : PedidosComponent
    },
    {
      path : 'Ordenes',
      component : OrdenesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class clienteRoutingModule { }