import {NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es';
// import { registerLocaleData } from '@angular/common';
// registerLocaleData(localeEs, 'es')
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { NoPageFoundComponent } from './modules/seguridad/no-page-found/no-page-found.component';
import { CambioContraComponent } from './modules/seguridad/cambio-contra/cambio-contra.component';
// import { LayoutModule } from '@angular/cdk/layout';

import { LayoutsModule } from './layouts/layouts.module';
import { ToastrModule } from 'ngx-toastr';
import { FullComponentComponent } from './layouts/full-component/full-component.component';
import { rrhhModule } from './modules/rrhh/rrhh.module';
import { ExcelenciaModule } from './modules/excelencia/excelencia.module';
import { OperatoriaModule } from './modules/operatoria/operatoria.module';
import { FinanzasModule } from './modules/finanzas/finanzas.module';
import { TransporteModule } from './modules/transporte/transporte.module';
import { ssomaModule } from './modules/SSOMA/ssoma.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { SharedModule } from './modules/shared/shared.module';
import { RegistroDolarSpsComponent } from './modules/rrhh/registro-dolar-sps/registro-dolar-sps.component';
import { AccessGuard } from './Guard/access.guard';
// import { Loading2Component } from './shared/loading2/loading2.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    NoPageFoundComponent,
    FullComponentComponent,
    CambioContraComponent,
    RegistroDolarSpsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutsModule,
    ToastrModule.forRoot(),
    SharedModule
  ],
  exports :[
    FormsModule,
    ReactiveFormsModule,
    NoPageFoundComponent,
  ],
  providers: [AccessGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
