import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalidaPortonComponent } from './salida-porton/salida-porton.component';
import { VerExtintoresComponent } from './Extintores/ver-extintores/ver-extintores.component';
import { AgenteComponent } from './Extintores/Mantenimientos/agente/agente.component';
import { TipoextintorComponent } from './Extintores/Mantenimientos/tipoextintor/tipoextintor.component';
import { CapacidadesComponent } from './Extintores/Mantenimientos/capacidades/capacidades.component';
import { UbicacionesComponent } from './Extintores/Mantenimientos/ubicaciones/ubicaciones.component';
import { AuditoriasComponent } from './Extintores/auditorias/auditorias.component';
import { AuditoriasRealizadasComponent } from './Extintores/auditorias-realizadas/auditorias-realizadas.component';
import { IncidenciasGeneradasComponent } from './Extintores/incidencias-generadas/incidencias-generadas.component';
import { CorrecionesGeneradasComponent } from './Extintores/correciones-generadas/correciones-generadas.component';
import { VerImagenesCargadasComponent } from './Extintores/ver-imagenes-cargadas/ver-imagenes-cargadas.component';


const routes: Routes = [
   {
    path         : 'paseSalida',
    component    : SalidaPortonComponent
   },
   {
    path         : 'extintores',
    component    : VerExtintoresComponent
   },
   {
    path         : 'tipoagente',
    component    : AgenteComponent
   },
   {
    path         : 'tipoExtintor',
    component    : TipoextintorComponent
   },
   {
    path         : 'capacidades',
    component    : CapacidadesComponent
   },
   {
    path         : 'ubicaciones',
    component    : UbicacionesComponent
   },
   {
    path         : 'auditorias',
    component    : AuditoriasComponent
   },
   {
    path         : 'auditoriasG',
    component    : AuditoriasRealizadasComponent
   },
   {
    path         : 'incidenciasG',
    component    : IncidenciasGeneradasComponent
   },
   {
    path         : 'correcionesG',
    component    : CorrecionesGeneradasComponent
   },
   {
    path         : 'imagenesCargadas',
    component    : VerImagenesCargadasComponent
   }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ssomaRoutingModule { }