import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroDolarComponent } from './registro-dolar/registro-dolar.component';
import { rrhhRoutingModule } from './rrhh-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { PermisosDolarComponent } from './permisos-dolar/permisos-dolar.component';
import { ModalPermisosComponent } from './permisos-dolar/modal-permisos/modal-permisos.component';
import { MantenimientoCanjeoComponent } from './mantenimiento-canjeo/mantenimiento-canjeo.component';
import { FormMantenimientoDolarComponent } from './mantenimiento-canjeo/form-mantenimiento-dolar/form-mantenimiento-dolar.component';
import { ControlDolarCCOComponent } from './reportes/control-dolar-cco/control-dolar-cco.component';
import { ControlDolarAgrupadoComponent } from './reportes/control-dolar-agrupado/control-dolar-agrupado.component';
import { ControlDolarDetalladoComponent } from './reportes/control-dolar-detallado/control-dolar-detallado.component';
import { ControlDolarEmpleadoComponent } from './reportes/control-dolar-empleado/control-dolar-empleado.component';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { CreditoComponent } from './credito/credito/credito.component';
import { MantenimientocreditoComponent } from './credito/mantenimientocredito/mantenimientocredito.component';
import { FormMantenimientoCreComponent } from './credito/mantenimientocredito/form-mantenimiento-cre/form-mantenimiento-cre.component';
import { AcumuladoComponent } from './credito/Reportes/acumulado/acumulado.component';
import { AcumuladoEmpComponent } from './credito/Reportes/acumulado-emp/acumulado-emp.component';
import { AcumuladoEmpEspComponent } from './credito/Reportes/acumulado-emp-esp/acumulado-emp-esp.component';

import { EmpleadoAcumuladoComponent } from './reportes/empleado-acumulado/empleado-acumulado.component';
import { CreditoSpsComponent } from './credito-sps/credito-sps.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    RegistroDolarComponent,
    PermisosDolarComponent,
    ModalPermisosComponent,
    MantenimientoCanjeoComponent,
    FormMantenimientoDolarComponent,
    ControlDolarCCOComponent,
    ControlDolarAgrupadoComponent,
    ControlDolarDetalladoComponent,
    ControlDolarEmpleadoComponent,
    CreditoComponent,
    MantenimientocreditoComponent,
    FormMantenimientoCreComponent,
    AcumuladoComponent,
    AcumuladoEmpComponent,
    AcumuladoEmpEspComponent,
    EmpleadoAcumuladoComponent,
    CreditoSpsComponent
  ],
  imports: [
    CommonModule,
    rrhhRoutingModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    SharedModule,
    MatFormFieldModule
  ],
  exports :[   ]
})
export class rrhhModule { }
