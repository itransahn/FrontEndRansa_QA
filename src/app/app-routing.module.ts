import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './Guard/access.guard';
import { AuthGuard } from './Guard/auth.guard';
import { FullComponentComponent } from './layouts/full-component/full-component.component';
import { ModulosComponent } from './layouts/modulos/modulos.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { Navbar1Component } from './layouts/navbar1/navbar1.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { CambioContraComponent } from './modules/seguridad/cambio-contra/cambio-contra.component';
import { DashboardComponent } from './modules/seguridad/dashboard/dashboard.component';
import { MiPerfilComponent } from './modules/seguridad/mi-perfil/mi-perfil.component';
import { NoPageFoundComponent } from './modules/seguridad/no-page-found/no-page-found.component';
import { PrimeraVezComponent } from './modules/seguridad/primera-vez/primera-vez.component';

const routes: Routes = [
  {
    path : 'ransa',
    component: FullComponentComponent,
    canActivate : [AuthGuard],
    children : [
      {
        path: '',
          component : DashboardComponent
      },
      {
        path : 'administracion',
        canActivate : [AccessGuard],
        loadChildren :() => import('./modules/seguridad/seguridad.module').then( m => m.SeguridadModule)
      },
      {
        path : 'rrhh',
        canActivate : [AccessGuard],
        loadChildren : ()  => import('./modules/rrhh/rrhh-routing.module').then( m => m.rrhhRoutingModule)
      },
      {
        path : 'excelencia',
        canActivate : [AccessGuard],
        loadChildren   : ()  => import('./modules/excelencia/excelencia-routing.module').then(m => m.excelenciaRoutingModule )
      },
      {
        path : 'operatoria',
        canActivate : [AccessGuard],
        loadChildren : () => import('./modules/operatoria/operatoria-routing.module').then( m=> m.operatoriaRoutingModule)
      },
      {
        path : 'finanzas',
        canActivate : [AccessGuard],
        loadChildren : () => import('./modules/finanzas/finanzas-routing.module').then( m=> m.finanzasRoutingModule)
      },
      {
        path : 'transporte',
        canActivate : [AccessGuard],
        loadChildren : () => import('./modules/transporte/transporte-routing.module').then(m => m.transporteRoutingModule )
      },
      {
        path : 'ssoma',
        canActivate : [],
        loadChildren : () => import('./modules/SSOMA/ssoma-routing.module').then(m => m.ssomaRoutingModule)
      }
    ]

  },
  {
    path:           '', 
    component:       LoginComponent,
    data: { title:  'Login' },
    
  },
  
  {
    path : 'cambiocontra/:id',
    component : CambioContraComponent,
    data: { title:  'Cambio Contraseña' }
   },

  {
    path:           'login', 
    component:       LoginComponent,
    data: { title:  'Login' }
  },
  {
    path:           'modulos', 
    component:       ModulosComponent,
    data: { title:  'Modulos' }
  },
  {
    path :  'miPerfil/:idUsuario',
    component : MiPerfilComponent 
  },
  {
    path :  'primeraVez/:usuario',
    component : PrimeraVezComponent 
  },
  {
    path:'**',
    component : NoPageFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true,onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
