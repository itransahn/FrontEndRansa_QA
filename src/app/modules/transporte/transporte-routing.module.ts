import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "../seguridad/dashboard/dashboard.component";
import { CamionesComponent } from './camiones/camiones.component';
import { ClientesTComponent } from './clientes-t/clientes-t.component';
import { MotoristasComponent } from './motoristas/motoristas.component';
import { ProveedoresTComponent } from './proveedores-t/proveedores-t.component';
import { TransportesComponent } from './transportes/transportes.component';



const routes: Routes = [
    {
      path : '',
      component : DashboardComponent
    },
    {
        path : 'transportes',
        component : TransportesComponent
    },
    {
        path : 'camiones',
        component : CamionesComponent
    },    
    {
        path : 'motoristas',
        component : MotoristasComponent
    },  
    {
        path : 'clientes',
        component : ClientesTComponent
    },  
    {
        path : 'proveedores',
        component : ProveedoresTComponent
    },  
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class transporteRoutingModule { }