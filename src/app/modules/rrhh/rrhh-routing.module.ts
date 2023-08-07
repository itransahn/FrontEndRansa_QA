import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditoComponent } from './credito/credito/credito.component';
import { MantenimientocreditoComponent } from './credito/mantenimientocredito/mantenimientocredito.component';
import { AcumuladoEmpEspComponent } from './credito/Reportes/acumulado-emp-esp/acumulado-emp-esp.component';
import { AcumuladoEmpComponent } from './credito/Reportes/acumulado-emp/acumulado-emp.component';
import { AcumuladoComponent } from './credito/Reportes/acumulado/acumulado.component';
import { MantenimientoCanjeoComponent } from './mantenimiento-canjeo/mantenimiento-canjeo.component';
import { PermisosDolarComponent } from './permisos-dolar/permisos-dolar.component';
import { RegistroDolarComponent } from './registro-dolar/registro-dolar.component';
import { ControlDolarAgrupadoComponent } from './reportes/control-dolar-agrupado/control-dolar-agrupado.component';
import { ControlDolarCCOComponent } from './reportes/control-dolar-cco/control-dolar-cco.component';
import { ControlDolarDetalladoComponent } from './reportes/control-dolar-detallado/control-dolar-detallado.component';
import { ControlDolarEmpleadoComponent } from './reportes/control-dolar-empleado/control-dolar-empleado.component';
import { EmpleadoAcumuladoComponent } from './reportes/empleado-acumulado/empleado-acumulado.component';
import { RegistroDolarSpsComponent } from './registro-dolar-sps/registro-dolar-sps.component';
import { CreditoSpsComponent } from './credito-sps/credito-sps.component';


const routes: Routes = [
    {
        path      : 'dolar',
        component : RegistroDolarComponent
    },
    {
      path      : 'dolarSps',
      component : RegistroDolarSpsComponent
   },
    {
      path        : 'permisos',
      component   : PermisosDolarComponent
    },
      /* Dolar */
    {
      path        : 'canjeos',
      component   : MantenimientoCanjeoComponent
    },
    {
      path        : 'cco',
      component   : ControlDolarCCOComponent
    },
    {
      path        : 'agrupado',
      component   : ControlDolarAgrupadoComponent
    },
    {
      path        : 'detallado',
      component   : ControlDolarDetalladoComponent
    },
    {
      path        : 'empleado',
      component   : ControlDolarEmpleadoComponent
    },
    {
      path        : 'empleadoA',
      component   : EmpleadoAcumuladoComponent
    },
    /* Créditos */
    {
      path        : 'credito',
      component   : CreditoComponent
    },
    {
      path        : 'creditoSps',
      component   : CreditoSpsComponent
    },
    {
      path        : 'creditos',
      component   : MantenimientocreditoComponent
    },
    {
      path        : 'Cacumulado',
      component   : AcumuladoComponent
    },
    {
      path        : 'Eacumulado',
      component   : AcumuladoEmpComponent
    },
    {
      path        : 'Cempleado',
      component   : AcumuladoEmpEspComponent
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rrhhRoutingModule { }
