import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { seguridadRoutingModule } from './seguridad-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RolesComponent } from './roles/roles.component';
import { ModulosAdminComponent } from './modulos-admin/modulos-admin.component';
import { MenusComponent } from './menus/menus.component';
import { CrearModuloComponent } from './modulos-admin/crear-modulo/crear-modulo.component';
import { PermisosModuloComponent } from './modulos-admin/permisos-modulo/permisos-modulo.component';
import { NuevoPermisoComponent } from './modulos-admin/nuevo-permiso/nuevo-permiso.component';
import { EditarModuloComponent } from './modulos-admin/editar-modulo/editar-modulo.component';
import { CrearMenuPComponent } from './menus/crear-menu-p/crear-menu-p.component';
import { VerMenuPComponent } from './menus/ver-menu-p/ver-menu-p.component';
import { VerMenusHijosComponent } from './menus/ver-menus-hijos/ver-menus-hijos.component';
import { EditarMenusHijosComponent } from './menus/editar-menus-hijos/editar-menus-hijos.component';
import { EditarMenuPComponent } from './menus/editar-menu-p/editar-menu-p.component';
import { CreaMenuHijoComponent } from './menus/crea-menu-hijo/crea-menu-hijo.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VerMenuHijoComponent } from './menus/ver-menu-hijo/ver-menu-hijo.component';
import { PermisosMenusComponent } from './menus/permisos-menus/permisos-menus.component';
import { CrearMenuModComponent } from './menus/crear-menu-mod/crear-menu-mod.component';
import { AgregarPermisosMenuComponent } from './menus/permisos-menus/agregar-permisos-menu/agregar-permisos-menu.component';
import { ModalRolComponent } from './roles/modal-rol/modal-rol.component';
import { CcoComponent } from './mantenimientos/cco/cco.component';
import { AreasRansaComponent } from './mantenimientos/areas-ransa/areas-ransa.component';
import { SedesComponent } from './mantenimientos/sedes/sedes.component';
import { TipoSangreComponent } from './mantenimientos/tipo-sangre/tipo-sangre.component';
import { ModalCcoComponent } from './mantenimientos/cco/modal-cco/modal-cco.component';
import { ModalAreasComponent } from './mantenimientos/areas-ransa/modal-areas/modal-areas.component';
import { ModalSedesComponent } from './mantenimientos/sedes/modal-sedes/modal-sedes.component';
import { ModalSangreComponent } from './mantenimientos/tipo-sangre/modal-sangre/modal-sangre.component';
import { UsuarioFormComponent } from './usuarios/usuario-form/usuario-form.component';

import { VerUsuarioComponent } from './usuarios/ver-usuario/ver-usuario.component';
import { PuestosComponent } from './mantenimientos/puestos/puestos.component';
import { ModalPuestosComponent } from './mantenimientos/puestos/modal-puestos/modal-puestos.component';
import { SharedModule } from '../shared/shared.module';
import { CambioContraUComponent } from './cambio-contra-u/cambio-contra-u.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { PrimeraVezComponent } from './primera-vez/primera-vez.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    DashboardComponent,
    RolesComponent,
    ModulosAdminComponent,
    MenusComponent,
    CrearModuloComponent,
    PermisosModuloComponent,
    NuevoPermisoComponent,
    EditarModuloComponent,
    CrearMenuPComponent,
    VerMenuPComponent,
    VerMenusHijosComponent,
    EditarMenusHijosComponent,
    EditarMenuPComponent,
    CreaMenuHijoComponent,
    VerMenuHijoComponent,
    PermisosMenusComponent,
    CrearMenuModComponent,
    AgregarPermisosMenuComponent,
    ModalRolComponent,
    CcoComponent,
    AreasRansaComponent,
    SedesComponent,
    TipoSangreComponent,
    ModalCcoComponent,
    ModalAreasComponent,
    ModalSedesComponent,
    ModalSangreComponent,
    UsuarioFormComponent,
    VerUsuarioComponent,
    PuestosComponent,
    ModalPuestosComponent,
    CambioContraUComponent,
    MiPerfilComponent,
    PrimeraVezComponent,
  ],
  imports: [
    CommonModule,
    seguridadRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
})
export class SeguridadModule { }
