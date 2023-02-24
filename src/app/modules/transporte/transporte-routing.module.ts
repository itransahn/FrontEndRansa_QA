import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "../seguridad/dashboard/dashboard.component";
import { CamionesComponent } from './camiones/camiones.component';
import { ClientesTComponent } from './clientes-t/clientes-t.component';
import { MotoristaCamionComponent } from './motorista-camion/motorista-camion.component';
import { MotoristasComponent } from './motoristas/motoristas.component';
import { PasesEstandarComponent } from './pases-estandar/pases-estandar.component';
import { CrearPaseSalidaComponent } from './pases-salida/crear-pase-salida/crear-pase-salida.component';
import { PasesSalidaHComponent } from './pases-salida/pases-salida-h/pases-salida-h.component';
import { PasesSalidaComponent } from './pases-salida/pases-salida.component';
import { VistaPaseSalidaComponent } from './pases-salida/vista-pase-salida/vista-pase-salida.component';
import { HistorialPasesComponent } from './pasesf/historial-pases/historial-pases.component';
import { ProveedoresTComponent } from './proveedores-t/proveedores-t.component';
import { CancelarrecibosComponent } from './recibos/cancelarrecibos/cancelarrecibos.component';
import { RecibosComponent } from './recibos/recibos/recibos.component';
import { RolClienteComponent } from './rol-cliente/rol-cliente.component';
import { RolProveedorComponent } from './rol-proveedor/rol-proveedor.component';
import { TransClienteComponent } from './trans-cliente/trans-cliente.component';
import { TransProveedorComponent } from './trans-proveedor/trans-proveedor.component';
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
    {
        path : 'transCliente',
        component : TransClienteComponent
    },  
    {
        path : 'transProveedor',
        component : TransProveedorComponent
    },  
    {
        path : 'rolCliente',
        component : RolClienteComponent
    },  
    {
        path : 'rolProveedor',
        component : RolProveedorComponent
    }, 
    {
        path : 'MotCamion',
        component : MotoristaCamionComponent
    }, 
    {
        path : 'salidas',
        component : PasesSalidaComponent
    },
    {
        path : 'Pasesalidas',
        component : VistaPaseSalidaComponent
    },
    {
        path : 'PasesalidasH',
        component : PasesSalidaHComponent
    },
    {
        path : 'PasesalidasE',
        component : PasesEstandarComponent
    },
    {
        path : 'recibos',
        component : RecibosComponent
    },
    {
        path : 'cancelarRecibo',
        component : CancelarrecibosComponent
    },
{
    path : 'PasesalidasfH',
    component : HistorialPasesComponent
}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class transporteRoutingModule { }