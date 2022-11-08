import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignacionMaquinaComponent } from './asignacion-maquina/asignacion-maquina.component';
import { HasignacionMaquinasComponent } from './asignacion-maquina/hasignacion-maquinas/hasignacion-maquinas.component';
import { FlejeComponent } from './fleje/fleje.component';

const routes: Routes = [  
    {
      path      : 'asignacionMaquina',
      component : AsignacionMaquinaComponent
    },
    {
      path      : 'hasignaciones',
      component : HasignacionMaquinasComponent
    },
    {
      path      : 'eFleje',
      component : FlejeComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class operatoriaRoutingModule { }
